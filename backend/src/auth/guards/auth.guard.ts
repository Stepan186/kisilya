import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { AuthService } from '../auth.service';

export class AuthGuard implements CanActivate {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const header = request.headers?.authorization;
    const at = header?.split(' ')[1];

    try {
      const user = await this.authService.decodeJwt(at);
      request.user = user;
      return !!user;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
