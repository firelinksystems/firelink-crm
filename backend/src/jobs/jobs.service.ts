import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Between } from 'typeorm';
import { Job } from '../entities/job.entity';
import { JobAsset } from '../entities/job-asset.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobStatusDto } from './dto/job-status.dto';
import { JobFilterDto } from './dto/job-filter.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
    @InjectRepository(JobAsset)
    private jobAssetsRepository: Repository<JobAsset>,
  ) {}

  async create(createJobDto: CreateJobDto): Promise<Job> {
    const job = this.jobsRepository.create(createJobDto);
    const savedJob = await this.jobsRepository.save(job);

    // Link assets if provided
    if (createJobDto.asset_ids && createJobDto.asset_ids.length > 0) {
      await this.linkAssetsToJob(savedJob.id, createJobDto.asset_ids);
    }

    return this.findOne(savedJob.id);
  }

  async findAll(filters: JobFilterDto): Promise<{ data: Job[]; total: number }> {
    const { page = 1, limit = 10, sort_by = 'created_at', sort_order = 'DESC', ...filterParams } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filterParams.technician_id) {
      where.assigned_technician = { id: filterParams.technician_id };
    }

    if (filterParams.customer_id) {
      where.site = { customer: { id: filterParams.customer_id } };
    }

    if (filterParams.site_id) {
      where.site = { id: filterParams.site_id };
    }

    if (filterParams.status) {
      where.status = filterParams.status;
    }

    if (filterParams.from_date && filterParams.to_date) {
      where.scheduled_date = Between(
        new Date(filterParams.from_date),
        new Date(filterParams.to_date),
      );
    }

    const [data, total] = await this.jobsRepository.findAndCount({
      where,
      relations: [
        'site',
        'site.customer',
        'contract',
        'job_type',
        'assigned_technician',
        'job_assets',
        'job_assets.asset',
      ],
      skip,
      take: limit,
      order: { [sort_by]: sort_order },
    });

    return { data, total };
  }

  async findOne(id: string): Promise<Job> {
    const job = await this.jobsRepository.findOne({
      where: { id },
      relations: [
        'site',
        'site.customer',
        'contract',
        'job_type',
        'assigned_technician',
        'job_assets',
        'job_assets.asset',
        'job_forms',
        'defects',
      ],
    });

    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    return job;
  }

  async update(id: string, updateJobDto: UpdateJobDto): Promise<Job> {
    const job = await this.findOne(id);
    Object.assign(job, updateJobDto);

    if (updateJobDto.asset_ids) {
      await this.updateJobAssets(id, updateJobDto.asset_ids);
    }

    return await this.jobsRepository.save(job);
  }

  async updateStatus(id: string, statusDto: JobStatusDto): Promise<Job> {
    const job = await this.findOne(id);
    Object.assign(job, statusDto);
    return await this.jobsRepository.save(job);
  }

  async getTechnicianJobs(technicianId: string, date?: Date) {
    const where: any = { assigned_technician: { id: technicianId } };

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      where.scheduled_date = Between(startDate, endDate);
    }

    return await this.jobsRepository.find({
      where,
      relations: ['site', 'site.customer', 'job_type', 'job_assets', 'job_assets.asset'],
      order: { scheduled_date: 'ASC' },
    });
  }

  private async linkAssetsToJob(jobId: string, assetIds: string[]) {
    const jobAssets = assetIds.map(assetId => ({
      job_id: jobId,
      asset_id: assetId,
    }));

    await this.jobAssetsRepository.save(jobAssets);
  }

  private async updateJobAssets(jobId: string, assetIds: string[]) {
    // Remove existing assets
    await this.jobAssetsRepository.delete({ job_id: jobId });
    
    // Add new assets
    await this.linkAssetsToJob(jobId, assetIds);
  }

  async findLastMaintenanceJob(contractId: string, siteId: string): Promise<Job | null> {
    return await this.jobsRepository.findOne({
      where: {
        contract: { id: contractId },
        site: { id: siteId },
        status: 'completed',
      },
      order: { actual_end_time: 'DESC' },
    });
  }
}
