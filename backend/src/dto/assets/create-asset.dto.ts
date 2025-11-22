import { IsString, IsOptional, IsUUID, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAssetDto {
  @ApiProperty()
  @IsUUID()
  site_id: string;

  @ApiProperty()
  @IsUUID()
  asset_type_id: string;

  @ApiProperty({ example: 'Main Fire Alarm Panel - Reception' })
  @IsString()
  name: string;

  @ApiProperty({ required: false, example: 'Hochiki' })
  @IsOptional()
  @IsString()
  manufacturer?: string;

  @ApiProperty({ required: false, example: 'XFP-2000' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({ required: false, example: 'SN123456789' })
  @IsOptional()
  @IsString()
  serial_number?: string;

  @ApiProperty({ required: false, example: '2023-01-15' })
  @IsOptional()
  @IsDateString()
  installation_date?: string;

  @ApiProperty({ required: false, example: '2024-01-15' })
  @IsOptional()
  @IsDateString()
  last_inspection_date?: string;

  @ApiProperty({ required: false, example: '2025-01-15' })
  @IsOptional()
  @IsDateString()
  next_inspection_date?: string;

  @ApiProperty({ required: false, example: 'Reception area, next to main entrance' })
  @IsOptional()
  @IsString()
  location_description?: string;

  @ApiProperty({ required: false, example: 'Requires quarterly testing' })
  @IsOptional()
  @IsString()
  notes?: string;
}
