import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';

@Injectable()
export class OtpService {
  generateOtp() {
    return speakeasy.totp({
      secret: process.env.OTP_SECRET || 'otp-secret',
      encoding: 'base32',
    });
  }

  verifyOtp(otp: string) {
    return speakeasy.totp.verify({
      secret: process.env.OTP_SECRET || 'otp-secret',
      encoding: 'base32',
      token: otp,
    });
  }
}
