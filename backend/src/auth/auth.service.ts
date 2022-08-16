import {
  ForbiddenException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { PasswordService } from './password.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LogInDto } from './dto/log-in.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from '../users/user.entity';
import { EntityRepository } from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';
import { UtilityService } from '../utilities/utility.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    @InjectRepository(User) private userRepository: EntityRepository<User>,
    private readonly userService: UsersService,
    private readonly utilityService: UtilityService,
  ) {}

  async logIn(dto: LogInDto) {
    const user = await this.userService.getUserByEmail(dto.email);
    if (!user) {
      throw new ForbiddenException('Неверный логин или пароль');
    }
    await this.passwordService.verifyPassword(dto.password, user, dto.email);
    const tokens = await this.getTokens(user.email, user.nickname, user.uuid);
    await this.updateRtHash(user.uuid, tokens.refresh_token);
    return { token: tokens.access_token, expire: '1800' };
  }

  async registration(dto: CreateUserDto) {
    await this.passwordService.checkPassword(dto.password);
    const password = await this.passwordService.hashData(dto.password);
    const user = await this.userService.getOrCreate(dto, password);
    const tokens = await this.getTokens(user.email, user.nickname, user.uuid);
    await this.updateRtHash(user.uuid, tokens.refresh_token);
    return { token: tokens.access_token, expire: '1800' };
  }

  async exit(uuid: string) {
    await this.userRepository.nativeUpdate({ uuid: uuid }, { hashedRt: null });
    await this.userRepository.flush();
  }

  async getTokens(email: string, nickname: string, uuid: string) {
    const payload = {
      email: email,
      nickname: nickname,
      uuid: uuid,
    };
    const at = this.jwtService.sign(payload, {
      expiresIn: 60 * 30,
    });
    const rt = this.jwtService.sign(payload, {
      expiresIn: 60 * 60 * 24 * 7,
    });
    return this.utilityService.transformTokensResponse(at, rt);
  }

  async updateRtHash(userUuid: string, rt: string) {
    const hashToken = await this.passwordService.hashData(rt);
    await this.userRepository.nativeUpdate(
      { uuid: userUuid },
      { hashedRt: hashToken },
    );
  }

  async refreshToken(userUuid: string, rt: string) {
    const user = await this.userRepository.findOne(userUuid);
    if (!user || !user.hashedRt) {
      throw new ForbiddenException('В доступе отказано');
    }
    const rtMatches = await bcrypt.compare(rt, user.hashedRt);
    if (!rtMatches) {
      throw new ForbiddenException('В доступе отказано');
    }
    const tokens = await this.getTokens(user.email, user.nickname, user.uuid);
    await this.updateRtHash(userUuid, rt);
    return tokens;
  }

  async decodeJwt(token: string) {
    const data = await this.jwtService.verify(token);
    return await this.userRepository.findOne({ uuid: data.uuid });
  }
}
