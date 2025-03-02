// dto/twofa.dto.ts
import { IsNotEmpty } from 'class-validator';
export class TwoFADto {
  @IsNotEmpty()
  token: string;
}
