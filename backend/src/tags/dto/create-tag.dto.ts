import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty()
  @IsString()
  @MaxLength(40)
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  sortOrder: number;
}
