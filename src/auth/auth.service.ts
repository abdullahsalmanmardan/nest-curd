// auth.service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { EmailService } from '../common/email.service';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  // async validateGoogleUser(profile: {
  //   googleId: string;
  //   email: string;
  //   name: string;
  //   avatar: string;
  // }): Promise<User> {
  //   let user = await this.userService.findOneByEmail(profile.email);
  //   if (!user) {
  //     user = await this.userService.create({
  //       email: profile.email,
  //       firstName: profile.name.split(' ')[0] || '',
  //       lastName: profile.name.split(' ')[1] || '',
  //       googleId?: profile.googleId ,
  //     });
  //   }
  //   return user;
  // }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  login(user: User): { access_token: string } {
    const payload = { email: user.email, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async forgotPassword(email: string): Promise<string> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1-hour expiration
    await this.userService.update(user.id, user);

    await this.emailService.sendResetPasswordEmail(email, resetToken);
    return 'Reset email sent';
  }

  // async resetPassword(token: string, newPassword: string): Promise<string> {
  //   const user: User = await this.userService.findOneByToken(token);
  //   if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
  //     throw new UnauthorizedException('Invalid or expired token');
  //   }

  //   user.password = await bcrypt.hash(newPassword, 10);
  //   user.resetToken = null;
  //   user.resetTokenExpiry = null;
  //   await this.userService.update(user.id, user);
  //   return 'Password reset successful';
  // }
}
