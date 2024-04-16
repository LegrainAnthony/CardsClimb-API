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

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest() as Request;

    const extractedToken = this.extractTokenFromRequest(request);

    if (!extractedToken) {
      throw new UnauthorizedException();
    }

    try {
      const decodedToken = await this.jwtService.verifyAsync(extractedToken, {
        secret: this.jwtConfiguration.secret,
      });
      request[REQUEST_USER_KEY] = decodedToken;

      return true;
    } catch {
      throw new UnauthorizedException();
    }


    request.user = decodedToken;

    return true;

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
}
