import {
  Body,
  CacheInterceptor,
  Controller,
  Delete,
  Get,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseInterceptors(CacheInterceptor)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get()
  async getOne(@Req() req) {
    return await this.userService.getUser(req.user.uuid);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Delete()
  async delete(@Req() req) {
    return this.userService.deleteUser(req.user.uuid);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Put()
  async update(@Body() dto: UpdateUserDto, @Req() req) {
    return this.userService.updateUser(dto, req.user);
  }
}
