import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { UserTag } from './entities/userTag.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { CreateUserTagDto } from '../tags/dto/create-user-tag.dto';
import { Tag } from '../tags/entities/tag.entity';
import { User } from '../users/user.entity';

@Injectable()
export class UserTagService {
  constructor(
    @InjectRepository(UserTag)
    private userTagRepository: EntityRepository<UserTag>,
    @InjectRepository(Tag) private tagRepository: EntityRepository<Tag>,
  ) {}

  async createUserTag(dto: CreateUserTagDto, user: User) {
    const userTags = [];
    const tags = await this.tagRepository.find({ id: { $in: dto.tags } });
    if (dto.tags.length != tags.length) {
      throw new HttpException('Неверные теги', HttpStatus.BAD_REQUEST);
    }

    tags.forEach((t) => {
      const userTag = this.userTagRepository.create({
        user: user.uuid,
        tag: t.id,
      });
      userTags.push(userTag);
    });
    await this.userTagRepository.persistAndFlush(userTags);
    const tagsData = tags.map((t) => {
      return { id: t.id, name: t.name, sortOrder: t.sortOrder };
    });
    return { tags: tagsData };
  }

  async deleteUserTag(userUuid: string, userTagId: number) {
    const userTag = await this.userTagRepository.nativeDelete({
      id: userTagId,
    });
  }
}
