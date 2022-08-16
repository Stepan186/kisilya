import {
  BaseEntity,
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Tag } from '../tags/entities/tag.entity';
import { UserTag } from '../userTags/entities/userTag.entity';

@Entity()
export class User extends BaseEntity<User, 'uuid'> {
  @PrimaryKey()
  uuid: string = v4();

  @Property()
  email: string;

  @Property({ hidden: true })
  password: string;

  @Property()
  nickname: string;

  @Property({ nullable: true, hidden: true })
  hashedRt: string;

  @OneToMany(() => UserTag, 'user', { orphanRemoval: true })
  tagsPivot = new Collection<UserTag>(this);

  @ManyToMany({
    pivotEntity: () => UserTag,
    entity: () => Tag,
  })
  tags = new Collection<Tag>(this);
}
