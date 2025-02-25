import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  /**
   * Handles authentication failures.
   */
  handleRequest(err, user, info) {
    if (err || !user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return user;
  }
}
