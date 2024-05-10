import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PUBLIC_KEY } from '../decorators/public.decorator';
import { ConfigType } from '@nestjs/config';
import appConfig from 'src/config/app.config';
import { REQUEST_USER_KEY } from 'src/authentication/constant/user.constant';
import { REFRESH_TOKEN_KEY } from '../decorators/refresh-token.decorator';
import { RefreshTokenIdsStorageService } from 'src/redis/refresh-token-ids-storage.service';
import { InvalidTokenException } from '../exception-filter/invalid-token-exception';

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorageService,
    @Inject(appConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof appConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.getMetadata(PUBLIC_KEY, context);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest() as Request;

    const extracted = this.extractTokensFromRequest(request);

    if (!extracted?.token) {
      throw new InvalidTokenException();
    }

    try {
      let decodedToken: {
        sub: string;
        iat: number;
        exp: number;
        aud: string;
        iss: string;
      };

      const needRefreshToken = this.getMetadata(REFRESH_TOKEN_KEY, context);

      if (needRefreshToken) {
        decodedToken = this.jwtService.decode(extracted.token);
      } else {
        decodedToken = await this.jwtService.verifyAsync(extracted.token, {
          secret: this.jwtConfiguration.secret,
        });
      }

      const { refreshTokenId } = this.jwtService.decode(extracted.refreshToken);

      const isRefreshTokenValid = await this.refreshTokenIdsStorage.validate(
        parseInt(decodedToken.sub, 10),
        refreshTokenId,
      );

      if (!isRefreshTokenValid) {
        throw new InvalidTokenException('Invalid refresh token');
      }

      request[REQUEST_USER_KEY] = decodedToken;
      request[REFRESH_TOKEN_KEY] = extracted.refreshToken;

      return true;
    } catch {
      throw new InvalidTokenException();
    }
  }

  extractTokensFromRequest(request: Request) {
    const tokenInHeader = request.headers.authorization;
    const refreshTokenHeader = request.headers.refreshtoken as string;

    if (!tokenInHeader) {
      throw new BadRequestException('Authorization header is missing');
    }

    if (!refreshTokenHeader) {
      throw new BadRequestException('RefreshToken header is missing');
    }

    const [bearer, token] = tokenInHeader.split(' ');

    const [bearerRefresh, refreshToken] = refreshTokenHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      return null;
    }

    if (bearerRefresh !== 'Bearer' || !refreshToken) {
      return null;
    }

    return { token, refreshToken };
  }

  getMetadata(key: string, context: ExecutionContext) {
    return this.reflector.getAllAndOverride<boolean>(key, [
      context.getHandler(),
      context.getClass(),
    ]);
  }
}
