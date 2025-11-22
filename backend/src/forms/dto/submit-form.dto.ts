import { IsUUID, IsObject, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitFormDto {
  @ApiProperty()
  @IsUUID()
  job_id: string;

  @ApiProperty()
  @IsUUID()
  form_template_id: string;

  @ApiProperty({ type: Object })
  @IsObject()
  form_data: Record<string, any>;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  defect_ids?: string[];
}
