import { Controller, Post, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { SchedulingService } from './scheduling.service';

@ApiTags('FireLink - Scheduling')
@ApiBearerAuth()
@Controller('scheduling')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) {}

  @Post('generate-recurring-jobs')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'FireLink Systems - Manually trigger recurring job generation' })
  async generateRecurringJobs() {
    await this.schedulingService.generateRecurringJobs();
    return { message: 'Recurring job generation completed' };
  }

  @Post('generate-inspection-jobs')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'FireLink Systems - Generate inspection jobs for due assets' })
  async generateInspectionJobs() {
    await this.schedulingService.generateInspectionJobsForAssets();
    return { message: 'Inspection job generation completed' };
  }
}
