import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';

@Injectable()
export class PasswordService {
  constructor() {}

  async hashData(data: string) {
    return bcrypt.hash(data, String(process.env.SALT));
  }

  async verifyPassword(password: string, user: User, email: string) {
    const check = await bcrypt.compare(password, user.password);
    if (!check || user.email != email) {
      throw new ForbiddenException('Неверный логин или пароль');
    }
    return check;
  }

  async checkPassword(password: string) {
    const reg = [/[A-Z]|[А-Я]/, /[a-z]|[а-я]/, /\d/];
    let res = true;
    for (const i of reg) {
      if (!Boolean(password.match(i))) {
        res = false;
      }
    }

    if (!res) {
      throw new HttpException(
        'Пароль должен содержать как минимум одну цифру, одну заглавную и одну строчную букву',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
