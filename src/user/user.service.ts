import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from '../auth/email.service';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Registers a new user with hashed password and sends an email verification.
   */
  async register(email: string, password: string) {
    const existingUser = await this.userRepo.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();

    const user = this.userRepo.create({
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
    });

    await this.userRepo.save(user);

    // Send verification email
    await this.emailService.sendVerificationEmail(email, verificationToken);

    return {
      message: 'User registered successfully. Please verify your email.',
    };
  }

  /**
   * Verifies a user's email with a token.
   */
  async verifyEmail(token: string) {
    const user = await this.userRepo.findOne({
      where: { verificationToken: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    user.isVerified = true;
    user.verificationToken = null;
    await this.userRepo.save(user);

    return { message: 'Email verified successfully' };
  }

  /**
   * Finds a user by email.
   */
  async findOne(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  /**
   * Finds a user by ID.
   */
  async findById(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /**
   * Updates a user's password.
   */
  async updatePassword(email: string, newPassword: string) {
    const user = await this.findOne(email);
    if (!user) throw new NotFoundException('User not found');

    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepo.save(user);

    return { message: 'Password updated successfully' };
  }

  /**
   * Deletes a user by ID.
   */
  async delete(id: number): Promise<{ success: boolean; message: string }> {
    const result = await this.userRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }

    return { success: true, message: 'User deleted successfully' };
  }

  /**
   * Assigns a role to a user (Admin, Driver, Passenger, etc.)
   */
  async assignRole(userId: number, role: string) {
    const user = await this.findById(userId);
    user.role = role;
    await this.userRepo.save(user);
    return { message: `Role ${role} assigned to user ${user.email}` };
  }
}
