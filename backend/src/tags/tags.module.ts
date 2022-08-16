import { forwardRef, Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Tag } from './entities/tag.entity';
import { AuthModule } from '../auth/auth.module';
import { UserTag } from '../userTags/entities/userTag.entity';
import { UtilityModule } from '../utilities/utility.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Tag, UserTag]),
    forwardRef(() => AuthModule),
    UtilityModule,
  ],
  exports: [TagsService],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}
