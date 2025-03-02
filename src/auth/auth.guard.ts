import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    // Check if the Authorization header is present
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    // Extract the token from the Authorization header
    const [bearer, token] = authHeader.split(' ');

    // Check if the token is in the correct format
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid token format');
    }

    try {
      const decoded: object = this.jwtService.verify(token);
      request.user = decoded;
      return true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new UnauthorizedException(
          'Invalid or expired token',
          error.message,
        );
      } else {
        throw new UnauthorizedException('Invalid or expired token');
      }
    }
  }
}
