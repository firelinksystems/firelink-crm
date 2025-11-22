import { Controller, Get, Post, Body, Patch, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DefectsService } from './defects.service';
import { CreateDefectDto } from './dto/create-defect.dto';
import { DefectPhotoDto } from './dto/defect-photo.dto';

@ApiTags('FireLink - Defects')
@ApiBearerAuth()
@Controller('defects')
@UseGuards(JwtAuthGuard)
export class DefectsController {
  constructor(private readonly defectsService: DefectsService) {}

  @Post()
  @ApiOperation({ summary: 'FireLink Systems - Create a new defect' })
  async create(@Body() createDefectDto: CreateDefectDto) {
    // In real implementation, get user ID from JWT
    const userId = 'current-user-id';
    return this.defectsService.create(createDefectDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'FireLink Systems - Get all defects' })
  async findAll() {
    return this.defectsService.findAll();
  }

  @Get('open')
  @ApiOperation({ summary: 'FireLink Systems - Get open defects' })
  async getOpenDefects() {
    return this.defectsService.getOpenDefects();
  }

  @Get('job/:jobId')
  @ApiOperation({ summary: 'FireLink Systems - Get defects by job' })
  async getDefectsByJob(@Param('jobId', ParseUUIDPipe) jobId: string) {
    return this.defectsService.getDefectsByJob(jobId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'FireLink Systems - Get defect by ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.defectsService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'FireLink Systems - Update defect status' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: string,
  ) {
    return this.defectsService.updateStatus(id, status);
  }

  @Post(':id/photos')
  @ApiOperation({ summary: 'FireLink Systems - Add photo to defect' })
  async addPhoto(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() photoData: DefectPhotoDto,
  ) {
    // In real implementation, get user ID from JWT
    const userId = 'current-user-id';
    return this.defectsService.addPhoto(id, photoData, userId);
  }
}
