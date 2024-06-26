/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const jwt:string = request.cookies['jwt']

    try {
      const data = await this.authService.checkToken(jwt);

      request.tokenPayload = data;
      request.user = await this.userService.show(data.user.id);

      return true;
    } catch (e) {
      return false;
    }
  }
}
