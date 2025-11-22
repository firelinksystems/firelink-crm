import { Controller, Post, Get, Body, Param, UseGuards, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FormsService } from './forms.service';
import { SubmitFormDto } from './dto/submit-form.dto';

@ApiTags('FireLink - Forms')
@ApiBearerAuth()
@Controller('forms')
@UseGuards(JwtAuthGuard)
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Post('submit')
  @ApiOperation({ summary: 'FireLink Systems - Submit a job form' })
  async submitForm(@Body() submitFormDto: SubmitFormDto) {
    // In real implementation, get user ID from JWT
    const userId = 'current-user-id';
    return this.formsService.submitForm(submitFormDto, userId);
  }

  @Get('templates')
  @ApiOperation({ summary: 'FireLink Systems - Get all active form templates' })
  async getFormTemplates(@Query('standard') complianceStandard?: string) {
    return this.formsService.getFormTemplates(complianceStandard);
  }

  @Get('job/:jobId')
  @ApiOperation({ summary: 'FireLink Systems - Get form submissions for a job' })
  async getJobForms(@Param('jobId', ParseUUIDPipe) jobId: string) {
    return this.formsService.getFormSubmissions(jobId);
  }

  @Get('templates/:id')
  @ApiOperation({ summary: 'FireLink Systems - Get form template by ID' })
  async getFormTemplate(@Param('id', ParseUUIDPipe) id: string) {
    return this.formsService.getFormTemplate(id);
  }
}
