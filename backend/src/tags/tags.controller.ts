import {
  Body,
  CacheInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagPermissionGuard } from '../auth/guards/tag-permission.guard';
import { GetTagDto } from './dto/get-tag.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('tag')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @UseInterceptors(CacheInterceptor)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('my')
  async getMyTag(@Req() req) {
    return await this.tagsService.getMy(req.user.uuid);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post()
  async create(@Body() dto: CreateTagDto, @Req() req) {
    return this.tagsService.createTag(dto, req.user);
  }

  @UseInterceptors(CacheInterceptor)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: number) {
    return await this.tagsService.getTag(id);
  }

  @UseInterceptors(CacheInterceptor)
  @Get()
  async getAll(@Query() dto: GetTagDto) {
    return await this.tagsService.getTags(dto);
  }

  @UseGuards(TagPermissionGuard)
  @ApiBearerAuth()
  @Put(':id')
  async update(@Param() id: number, @Body() dto: UpdateTagDto) {
    return await this.tagsService.updateTag(id, dto);
  }

  @UseGuards(TagPermissionGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.tagsService.deleteTag(id);
  }
}
