import { forwardRef, Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordService } from './password.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '../users/user.entity';
import { TagsModule } from '../tags/tags.module';
import { UtilityModule } from '../utilities/utility.module';

@Global()
@Module({
  imports: [
    JwtModule.register({ secret: String(process.env.SECRET_KEY) }),
    MikroOrmModule.forFeature([User]),
    forwardRef(() => TagsModule),
    UsersModule,
    UtilityModule,
  ],
  exports: [JwtModule, AuthService, PasswordService],
  providers: [AuthService, PasswordService],
  controllers: [AuthController],
})
export class AuthModule {}
