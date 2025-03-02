// interfaces/user.interface.ts
export interface IUser {
  id: number;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  googleId?: string;
  avatar?: string;
  isVerified: boolean;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
