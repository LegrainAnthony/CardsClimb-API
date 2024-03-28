import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PUBLIC_KEY } from '../decorators/public.decorator';

const MINUTES = 60;
const LIMIT_TOKEN_EXPIRATION = 1 * MINUTES; // 1 minute
const TO_SECONDS = 1000;

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
    const response = context.switchToHttp().getResponse();

    const extractedToken = this.extractTokenFromRequest(request);

    if (!extractedToken) {
      return false;
    }

    const decodedToken = await this.jwtService.verifyAsync(extractedToken, {
      ignoreExpiration: true,
    });

    const token = await this.checkTokenExpiration(decodedToken);

    if (typeof token === 'string') {
      response.setHeader('X-Refresh-Token', token);
    }

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

  async checkTokenExpiration(token: { sub: number; exp: number }) {
    const nowInSec = Math.floor(Date.now() / TO_SECONDS);
    if (nowInSec <= token.exp) {
      return token;
    }

    if (nowInSec > token.exp && nowInSec - token.exp < LIMIT_TOKEN_EXPIRATION) {
      const refreshedToken = await this.jwtService.signAsync({
        sub: token.sub,
      });
      return refreshedToken;
    }

    throw new UnauthorizedException('Token expired');
  }
}
