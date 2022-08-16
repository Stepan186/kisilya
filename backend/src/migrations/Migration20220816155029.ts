import { Migration } from '@mikro-orm/migrations';

export class Migration20220816155029 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("uuid" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "nickname" varchar(255) not null, "hashed_rt" varchar(255) null, constraint "user_pkey" primary key ("uuid"));');

    this.addSql('create table "tag" ("id" serial primary key, "creator_uuid" varchar(255) not null, "name" varchar(255) not null, "sort_order" int not null default 0);');

    this.addSql('create table "user_tag" ("id" serial primary key, "user_uuid" varchar(255) not null, "tag_id" int not null);');

    this.addSql('alter table "tag" add constraint "tag_creator_uuid_foreign" foreign key ("creator_uuid") references "user" ("uuid") on update cascade on delete cascade;');

    this.addSql('alter table "user_tag" add constraint "user_tag_user_uuid_foreign" foreign key ("user_uuid") references "user" ("uuid") on update cascade on delete cascade;');
    this.addSql('alter table "user_tag" add constraint "user_tag_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade on delete cascade;');
  }

}
