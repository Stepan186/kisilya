import { BaseEntity, Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { User } from '../../users/user.entity';
import { Tag } from '../../tags/entities/tag.entity';

@Entity()
export class UserTag extends BaseEntity<UserTag, 'id'> {
  @PrimaryKey()
  id: number;

  @ManyToOne(() => User, { onDelete: 'cascade' })
  user: User;

  @ManyToOne(() => Tag, { onDelete: 'cascade' })
  tag: Tag;

  // createdAt:Date
}
