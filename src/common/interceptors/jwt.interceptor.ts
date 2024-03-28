import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable, switchMap } from 'rxjs';
import { PUBLIC_KEY } from '../decorators/public.decorator';
import { Response } from 'express';

const MINUTES = 60;
const LIMIT_TOKEN_EXPIRATION = 1 * MINUTES; // 1 minute
const TO_SECONDS = 1000;

@Injectable()
export class JwtInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const response = context.switchToHttp().getResponse<Response>();

    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    return next.handle().pipe(
      switchMap(async (data) => {
        const token = await this.checkTokenExpiration(request.user);

        if (typeof token === 'string') {
          response.setHeader('X-Refresh-Token', token);
        }

        return data;
      }),
    );
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
