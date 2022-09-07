import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @MaxLength(100)
  @IsEmail()
  email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @MaxLength(100)
  @IsString()
  password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @MaxLength(30)
  @IsString()
  nickname: string;
}
