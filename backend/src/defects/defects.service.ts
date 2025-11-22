import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Defect } from '../entities/defect.entity';
import { DefectPhoto } from '../entities/defect-photo.entity';
import { CreateDefectDto } from './dto/create-defect.dto';
import { DefectPhotoDto } from './dto/defect-photo.dto';

@Injectable()
export class DefectsService {
  constructor(
    @InjectRepository(Defect)
    private defectsRepository: Repository<Defect>,
    @InjectRepository(DefectPhoto)
    private defectPhotosRepository: Repository<DefectPhoto>,
  ) {}

  async create(createDefectDto: CreateDefectDto, reportedById: string): Promise<Defect> {
    const defect = this.defectsRepository.create({
      ...createDefectDto,
      reported_by: { id: reportedById },
    });

    return await this.defectsRepository.save(defect);
  }

  async findAll(): Promise<Defect[]> {
    return await this.defectsRepository.find({
      relations: ['job', 'asset', 'reported_by', 'photos'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Defect> {
    const defect = await this.defectsRepository.findOne({
      where: { id },
      relations: ['job', 'asset', 'reported_by', 'photos'],
    });

    if (!defect) {
      throw new NotFoundException(`Defect with ID ${id} not found`);
    }

    return defect;
  }

  async updateStatus(id: string, status: string): Promise<Defect> {
    const defect = await this.findOne(id);
    defect.status = status;
    return await this.defectsRepository.save(defect);
  }

  async addPhoto(defectId: string, photoData: DefectPhotoDto, userId: string): Promise<DefectPhoto> {
    const defect = await this.findOne(defectId);
    const photo = this.defectPhotosRepository.create({
      ...photoData,
      defect,
      uploaded_by: { id: userId },
    });

    return await this.defectPhotosRepository.save(photo);
  }

  async getOpenDefects(): Promise<Defect[]> {
    return await this.defectsRepository.find({
      where: { status: 'open' },
      relations: ['job', 'asset', 'reported_by'],
      order: { created_at: 'DESC' },
    });
  }

  async getDefectsByJob(jobId: string): Promise<Defect[]> {
    return await this.defectsRepository.find({
      where: { job: { id: jobId } },
      relations: ['asset', 'reported_by', 'photos'],
      order: { created_at: 'DESC' },
    });
  }
}
