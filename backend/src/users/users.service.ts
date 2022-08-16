import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from './user.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EntityRepository } from '@mikro-orm/postgresql';
import { PasswordService } from '../auth/password.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: EntityRepository<User>,
    private readonly passwordService: PasswordService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = this.userRepository.create(dto);
    await this.userRepository.persistAndFlush(user);
    return user;
  }

  async getUser(userUuid: string) {
    const user = await this.userRepository.findOne(userUuid, {
      fields: ['email', 'nickname'],
      populate: ['tags'],
    });

    const tags = user.tags.getItems().map((i) => {
      return { id: i.id, name: i.name, sortOrder: i.sortOrder };
    });
    return { email: user.email, nickname: user.nickname, tags: tags };
  }

  async deleteUser(uuid: string) {
    const user = await this.userRepository.findOne(uuid);
    await this.userRepository.remove(user);
    await this.userRepository.flush();
    // await this.userRepository.removeAndFlush(user);
  }

  async updateUser(dto: UpdateUserDto, user: User) {
    const dUser = await this.userRepository
      .createQueryBuilder('u')
      .select('*')
      .where({
        $and: [
          {
            $or: [
              {
                email: dto.email,
              },
              {
                nickname: dto.nickname,
              },
            ],
          },
          {
            uuid: {
              $ne: user.uuid,
            },
          },
        ],
      });

    if (dUser.length > 0) {
      throw new HttpException(
        'Такая почта или никнейм уже используется',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (dto.password) {
      await this.passwordService.checkPassword(dto.password);
      const hashPas = await this.passwordService.hashData(dto.password);
      dto.password = hashPas;
    }
    const updUser = await this.userRepository.findOne({ email: user.email });
    updUser.assign(dto);
    await this.userRepository.flush();
    return { email: updUser.email, nickname: updUser.nickname };
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({ email: email });
  }

  async getOrCreate(dto: CreateUserDto, hashPassword: string) {
    const users = await this.userRepository
      .createQueryBuilder('u')
      .select('*')
      .where({
        $and: [
          {
            $or: [
              {
                email: dto.email,
              },
              {
                nickname: dto.nickname,
              },
            ],
          },
        ],
      });
    if (users.length == 0) {
      const user = this.userRepository.create({
        password: hashPassword,
        email: dto.email,
        nickname: dto.nickname,
      });
      await this.userRepository.persistAndFlush(user);
      return user;
    } else {
      throw new HttpException(
        'Пользователь с таким email или nickname уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
