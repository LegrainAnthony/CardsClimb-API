import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const extractedToken = this.extractTokenFromRequest(request);

    if (!extractedToken) {
      return false;
    }
    const token = await this.jwtService.verifyAsync(extractedToken, {
      ignoreExpiration: true,
    });

    request.user = token;

    return true;
  }

  extractTokenFromRequest(request: Request) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new NotFoundException('Authorization header is missing');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      return null;
    }

    return token;
  }
}
