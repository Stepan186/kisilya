import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class GetTagDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform((t) => +t.value)
  length: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform((t) => +t.value)
  offset: number;

  @ApiProperty({ required: false })
  @IsOptional()
  SortByOrder?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  SortByName?: boolean;
}
