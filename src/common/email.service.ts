// email.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {
    try {
      const emailUser = this.configService.get<string>('EMAIL_USER');
      const emailPass = this.configService.get<string>('EMAIL_PASS');

      if (!emailUser || !emailPass) {
        throw new Error('Missing email credentials in environment variables');
      }

      const transporter: Transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailUser, // Ensure emailUser is of type string
          pass: emailPass, // Ensure emailPass is of type string
        },
      });

      if (!transporter) {
        throw new Error('Failed to initialize email transporter');
      }

      this.transporter = transporter;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(`Failed to create email transporter: ${errorMessage}`);
      throw new Error('Email service initialization failed');
    }
  }

  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    if (!to || !subject || !text) {
      this.logger.warn('Email, subject, or text is missing');
      throw new Error('Missing email parameters');
    }

    const mailOptions = {
      from: this.configService.get<string>('EMAIL_USER') || '',
      to,
      subject,
      text,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent to ${to}`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(`Failed to send email to ${to}: ${errorMessage}`);
      throw new Error('Email sending failed');
    }
  }

  async sendResetPasswordEmail(email: string, token: string): Promise<void> {
    const resetLink = `https://yourapp.com/reset-password?token=${token}`;
    await this.sendEmail(
      email,
      'Reset Your Password',
      `Click the link to reset your password: ${resetLink}`,
    );
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verifyLink = `https://yourapp.com/verify-email?token=${token}`;
    await this.sendEmail(
      email,
      'Verify Your Email',
      `Click the link to verify your email: ${verifyLink}`,
    );
  }
}
