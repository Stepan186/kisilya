import { IsArray, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserTagDto {
  @ApiProperty()
  @IsArray()
  @IsInt({ each: true })
  tags: number[];
}
