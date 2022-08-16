import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  userUuid: string;

  @ApiProperty()
  @IsString()
  rt: string;
}
