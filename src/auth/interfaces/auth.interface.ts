// auth.interface.ts
export interface AuthPayload {
  email: string;
  sub: number;
}

export interface GoogleAuthUser {
  googleId: string;
  email: string;
  name: string;
  avatar: string;
}
