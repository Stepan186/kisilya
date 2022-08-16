import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  @MaxLength(100)
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsOptional()
  @MaxLength(100)
  @IsString()
  password: string;

  @ApiProperty()
  @IsOptional()
  @MaxLength(30)
  @IsString()
  nickname: string;
}
