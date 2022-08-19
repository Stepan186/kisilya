import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateUserTagDto } from '../tags/dto/create-user-tag.dto';
import { UserTagService } from './user-tag.service';
import { UserTagPermissionGuard } from '../auth/guards/user-tag-permission.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('user/tag')
export class UserTagController {
  constructor(private readonly userTagService: UserTagService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Body() dto: CreateUserTagDto, @Req() req) {
    return this.userTagService.createUserTag(dto, req.user);
  }

  @UseGuards(UserTagPermissionGuard)
  @ApiBearerAuth()
  @Delete()
  delete(@Req() req, @Param('id') id: number) {
    return this.userTagService.deleteUserTag(req.user.uuid, id);
  }
}
