import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DefectPhotoDto {
  @ApiProperty({ example: 'https://firelink-s3-bucket.com/defects/photo123.jpg' })
  @IsString()
  photo_url: string;

  @ApiProperty({ required: false, example: 'Faulty detector close-up' })
  @IsOptional()
  @IsString()
  caption?: string;
}
