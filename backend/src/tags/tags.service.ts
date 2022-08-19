import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { User } from '../users/user.entity';
import { UpdateTagDto } from './dto/update-tag.dto';
import { EntityRepository } from '@mikro-orm/postgresql';
import { GetTagDto } from './dto/get-tag.dto';
import { QueryOrderMap } from '@mikro-orm/core';
import { ApiMetaResponse, UtilityService } from '../utilities/utility.service';
import { UserTag } from '../user-tags/entities/user-tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag) private tagRepository: EntityRepository<Tag>,
    @InjectRepository(UserTag)
    private userTagRepository: EntityRepository<UserTag>,
    private utilityService: UtilityService,
  ) {}

  async createTag(dto: CreateTagDto, user: User) {
    const tag = await this.tagRepository.findOne({ name: dto.name });
    if (tag) {
      throw new HttpException(
        'Тег с таким названием уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newTag = await this.tagRepository.create({
      ...dto,
      creator: user.uuid,
    });
    await this.tagRepository.persistAndFlush(newTag);
    const userTagData = { user: user.uuid, tag: newTag.id };
    const userTag = await this.userTagRepository.create(userTagData);
    await this.userTagRepository.persistAndFlush(userTag);
    return this.utilityService.transformUserTagResponse(newTag.id, dto);
  }

  async getTag(id: number) {
    const tag = await this.tagRepository.findOne(id, { populate: ['creator'] });
    return this.utilityService.transformTagToResponse(tag);
  }

  async getTags(dto: GetTagDto) {
    const orderBy: QueryOrderMap<Tag> = {};

    if (dto.SortByOrder) {
      orderBy.sortOrder = 'ASC';
    }
    if (dto.SortByName) {
      orderBy.name = 'ASC';
    }

    const [tags, quantity] = await this.tagRepository.findAndCount(
      {},
      {
        populate: ['creator'],
        orderBy,
        limit: dto.length,
        offset: dto.offset,
      },
    );
    const tagData = tags.map(this.utilityService.transformTagToResponse);

    return new ApiMetaResponse(tagData, dto.offset, dto.length, quantity);
  }

  async deleteTag(id: number) {
    await this.tagRepository.nativeDelete(id);
  }

  async updateTag(id: number, dto: UpdateTagDto) {
    const tag = await this.tagRepository.findOne(id);
    tag.assign(dto);
    await this.tagRepository.flush();
    return this.utilityService.transformTagToResponse(tag);
  }

  async getMy(userUuid: string) {
    const tags = await this.tagRepository.find({ creator: userUuid });
    return this.utilityService.transformTagDataToResponse(tags);
  }
}
