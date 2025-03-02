// dto/reset-password.dto.ts
import { IsNotEmpty } from 'class-validator';
export class ResetPasswordDto {
  @IsNotEmpty()
  token: string;
  @IsNotEmpty()
  newPassword: string;
}
