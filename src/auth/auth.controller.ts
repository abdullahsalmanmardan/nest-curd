import { AuthGuard } from '@nestjs/passport';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    return this.authService.register(body.email, body.password);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @UseGuards(GoogleAuthGuard)
  @Post('google')
  async googleLogin(@Req() req: Request) {
    return this.authService.validateOAuthLogin(req.user.email);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {
    return { message: 'Redirecting to Google OAuth' };
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleAuthCallback(@Req() req) {
    return req.user;
  }
}
