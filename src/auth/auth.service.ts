import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { EmailService } from './email.service';
import { OtpService } from './otp.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly otpService: OtpService,
  ) {}

  async register(email: string, password: string) {
    const existingUser = await this.userService.findOne(email);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userService.create(email, hashedPassword);

    await this.emailService.sendVerificationEmail(user.email);

    return {
      message: 'User registered successfully. Please verify your email.',
    };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findOne(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async generateRefreshToken(user: User) {
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '7d' },
    );
    await this.userService.saveRefreshToken(user.id, refreshToken);
    return refreshToken;
  }

  async validateOAuthLogin(email: string) {
    let user = await this.userService.findOne(email);
    if (!user) {
      user = await this.userService.create(email, null); // No password for OAuth users
    }
    return this.login(user);
  }
}
