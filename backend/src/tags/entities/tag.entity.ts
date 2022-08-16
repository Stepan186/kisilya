import {
  BaseEntity,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { User } from '../../users/user.entity';

@Entity()
export class Tag extends BaseEntity<Tag, 'id'> {
  @PrimaryKey()
  id: number;

  @ManyToOne(() => User, { onDelete: 'cascade' })
  creator: User;

  @Property()
  name: string;

  @Property({ default: 0 })
  sortOrder: number;
}
