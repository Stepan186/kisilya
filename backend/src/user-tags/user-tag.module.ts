import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserTagService } from './user-tag.service';
import { UserTagController } from './user-tag.controller';
import { UserTag } from './entities/user-tag.entity';

@Module({
  imports: [MikroOrmModule.forFeature([UserTag])],
  exports: [],
  providers: [UserTagService],
  controllers: [UserTagController],
})
export class UserTagModule {}
