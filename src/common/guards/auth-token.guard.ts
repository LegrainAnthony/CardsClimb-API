import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PUBLIC_KEY } from '../decorators/public.decorator';
import { ConfigType } from '@nestjs/config';
import jwtConfig from 'src/config/jwt.config';
import { REQUEST_USER_KEY } from 'src/authentication/constant/user.constant';
import { REFRESH_TOKEN_KEY } from '../decorators/refresh-token.decorator';

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.getMetadata(PUBLIC_KEY, context);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest() as Request;

    const extractedToken = this.extractTokenFromRequest(request);

    if (!extractedToken) {
      throw new UnauthorizedException();
    }

    try {
      let decodedToken;

      const isRefreshToken = this.getMetadata(REFRESH_TOKEN_KEY, context);

      if (isRefreshToken) {
        decodedToken = await this.jwtService.decode(extractedToken);
      } else {
        decodedToken = await this.jwtService.verifyAsync(extractedToken, {
          secret: this.jwtConfiguration.secret,
        });
      }

      request[REQUEST_USER_KEY] = decodedToken;

      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  extractTokenFromRequest(request: Request) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new BadRequestException('Authorization header is missing');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      return null;
    }

    return token;
  }

  getMetadata(key: string, context: ExecutionContext) {
    return this.reflector.getAllAndOverride<boolean>(key, [
      context.getHandler(),
      context.getClass(),
    ]);
  }
}
