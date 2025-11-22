import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Query,
  UseGuards,
  ParseUUIDPipe 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobStatusDto } from './dto/job-status.dto';
import { JobFilterDto } from './dto/job-filter.dto';

@ApiTags('FireLink - Jobs')
@ApiBearerAuth()
@Controller('jobs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'FireLink Systems - Create a new job' })
  async create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
  }

  @Get()
  @ApiOperation({ summary: 'FireLink Systems - Get all jobs with filtering' })
  async findAll(@Query() filters: JobFilterDto) {
    return this.jobsService.findAll(filters);
  }

  @Get('technician/:technicianId')
  @ApiOperation({ summary: 'FireLink Systems - Get jobs assigned to a technician' })
  async getTechnicianJobs(
    @Param('technicianId', ParseUUIDPipe) technicianId: string,
    @Query('date') date?: string,
  ) {
    const targetDate = date ? new Date(date) : new Date();
    return this.jobsService.getTechnicianJobs(technicianId, targetDate);
  }

  @Get('my-jobs')
  @Roles(UserRole.TECHNICIAN)
  @ApiOperation({ summary: 'FireLink Systems - Get current user assigned jobs' })
  async getMyJobs(@Query('date') date?: string) {
    // In real implementation, get technician ID from JWT token
    const technicianId = 'current-user-id'; // From JWT
    const targetDate = date ? new Date(date) : new Date();
    return this.jobsService.getTechnicianJobs(technicianId, targetDate);
  }

  @Get(':id')
  @ApiOperation({ summary: 'FireLink Systems - Get job by ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.jobsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'FireLink Systems - Update job' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateJobDto: UpdateJobDto,
  ) {
    return this.jobsService.update(id, updateJobDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'FireLink Systems - Update job status' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: JobStatusDto,
  ) {
    return this.jobsService.updateStatus(id, statusDto);
  }

  @Post(':id/assign/:technicianId')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'FireLink Systems - Assign job to technician' })
  async assignToTechnician(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('technicianId', ParseUUIDPipe) technicianId: string,
  ) {
    return this.jobsService.update(id, {
      assigned_technician_id: technicianId,
      status: 'assigned',
    } as any);
  }

  @Get(':id/forms')
  @ApiOperation({ summary: 'FireLink Systems - Get job form submissions' })
  async getJobForms(@Param('id', ParseUUIDPipe) id: string) {
    const job = await this.jobsService.findOne(id);
    return job.job_forms;
  }
}
