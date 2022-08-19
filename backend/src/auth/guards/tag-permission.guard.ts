import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Tag } from '../../tags/entities/tag.entity';

export class TagPermissionGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Tag)
    private readonly tagRepository: EntityRepository<Tag>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tagId = request.params.id;
    const header = request.headers?.authorization;
    const at = header?.split(' ')[1];

    const tag = await this.tagRepository.findOne(tagId, {
      populate: ['creator'],
    });
    const user = await this.authService.decodeJwt(at);

    if (tag.creator.uuid != user.uuid) {
      throw new ForbiddenException('Вы не владелец этого тега');
    } else {
      return true;
    }
  }
}
