import { IsString, IsEmail, IsOptional, IsUUID, IsPostalCode, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSiteDto {
  @ApiProperty()
  @IsUUID()
  customer_id: string;

  @ApiProperty({ example: 'Main Factory Building' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: '123 Industrial Estate, London, UK' })
  @IsString()
  address: string;

  @ApiProperty({ required: false, example: 'SW1A 1AA' })
  @IsOptional()
  @IsPostalCode('GB')
  postcode?: string;

  @ApiProperty({ required: false, example: 'John Smith' })
  @IsOptional()
  @IsString()
  contact_name?: string;

  @ApiProperty({ required: false, example: '+441234567890' })
  @IsOptional()
  @IsString()
  contact_phone?: string;

  @ApiProperty({ required: false, example: 'john@abcmfg.com' })
  @IsOptional()
  @IsEmail()
  contact_email?: string;

  @ApiProperty({ required: false, example: 'Park in visitor bays. Report to reception.' })
  @IsOptional()
  @IsString()
  site_instructions?: string;

  @ApiProperty({ required: false, example: 51.5074 })
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiProperty({ required: false, example: -0.1278 })
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;
}
