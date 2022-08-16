import { Injectable } from '@nestjs/common';
import { Tag } from '../tags/entities/tag.entity';
import { TagResource } from './interfaces/tag-resource';
import { TagDataResource } from './interfaces/tag-data-resource';
import { CreateTagDto } from '../tags/dto/create-tag.dto';
import { UserTagDataResource } from './interfaces/user-tag-data-resource';
import { TokensData } from './interfaces/tokens-data';

@Injectable()
export class UtilityService {
  constructor() {}

  transformTagToResponse(tag: Tag): TagResource {
    return {
      creator: {
        uuid: tag.creator.uuid,
        nickname: tag.creator.nickname,
      },
      name: tag.name,
      sortOrder: tag.sortOrder,
    };
  }

  transformTagDataToResponse(tags: Tag[]): TagDataResource {
    const tagsData = tags.map((t) => {
      return { id: t.id, name: t.name, sortOrder: t.sortOrder };
    });
    return { tags: tagsData };
  }

  transformUserTagResponse(
    tagId: number,
    dto: CreateTagDto,
  ): UserTagDataResource {
    return {
      id: tagId,
      name: dto.name,
      sortOrder: dto.sortOrder,
    };
  }

  transformTokensResponse(at: string, rt: string): TokensData {
    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}

export class ApiMetaResponse<T> {
  public data: T;
  public meta: { offset: number; length: number; quantity: number };

  constructor(data: T, offset: number, length: number, quantity: number) {
    this.data = data;
    this.meta = { offset, length, quantity };
  }
}
