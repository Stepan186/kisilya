import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTagDto {
  @ApiProperty()
  @IsOptional()
  @MaxLength(40)
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  sortOrder: number;
}
