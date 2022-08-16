import { CacheInterceptor, CacheModule, Module, Scope } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from './mikro-orm.config';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TagsModule } from './tags/tags.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      ...mikroOrmConfig,
      scope: Scope.REQUEST,
    }),
    CacheModule.register({ ttl: 100, max: 100, isGlobal: true }),
    ConfigModule.forRoot(),
    UsersModule,
    AuthModule,
    TagsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
