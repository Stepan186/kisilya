import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDto } from './dto/log-in.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthGuard } from './guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LogInDto) {
    return this.authService.logIn(dto);
  }

  @Post('signin')
  async signin(@Body() dto: CreateUserDto) {
    return this.authService.registration(dto);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  async logout(@Req() req) {
    return this.authService.exit(req.user.uuid);
  }

  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.userUuid, dto.rt);
  }
}
