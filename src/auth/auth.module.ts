import { RolesGuard } from './guards/roles.guard';
// auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { GoogleStrategy } from './ google.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailService } from './email.service';
import { JwtStrategy } from './jwt.strategy';
import { OtpService } from './otp.service';
import { SessionStrategy } from './session.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    JwtStrategy,
    RolesGuard,
    SessionStrategy,
    EmailService,
    OtpService,
    GoogleStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}

// Explanation:
// - `AuthService` handles authentication logic (register, login, etc.)
// - `AuthController` defines routes for authentication
// - `JwtStrategy` is used for JWT authentication
// - `RolesGuard` is used for role-based access control (RBAC)
// - `SessionStrategy` manages refresh tokens & session management
// - `EmailService` handles email verification & password reset
// - `OtpService` is used for Two-Factor Authentication (2FA)
