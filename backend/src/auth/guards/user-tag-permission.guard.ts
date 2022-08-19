import { AuthService } from '../auth.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserTag } from '../../user-tags/entities/user-tag.entity';

export class UserTagPermissionGuard {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(UserTag)
    private readonly userTagRepository: EntityRepository<UserTag>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userTagId = request.params.id;
    const header = request.headers?.authorization;
    const at = header?.split(' ')[1];

    const userTag = await this.userTagRepository.findOne(userTagId);
    const user = await this.authService.decodeJwt(at);

    if (userTag.user.uuid != user.uuid) {
      throw new ForbiddenException('Вы не владелец этого тега');
    } else {
      return true;
    }
  }
}
