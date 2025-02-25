import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { AuthService } from './auth.service';

@Injectable()
export class SessionStrategy extends PassportStrategy(Strategy, 'session') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(req): Promise<any> {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) return null;
    return this.authService.validateRefreshToken(refreshToken);
  }
}
