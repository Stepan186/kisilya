import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class GetTagDto {
  @ApiProperty()
  @IsOptional()
  @Transform((t) => +t.value)
  length: number;

  @ApiProperty()
  @IsOptional()
  @Transform((t) => +t.value)
  offset: number;

  @ApiProperty()
  @IsOptional()
  SortByOrder?: boolean;

  @ApiProperty()
  @IsOptional()
  SortByName?: boolean;
}
