import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

const LIMIT_TOKEN_EXPIRATION = 1000 * 60 * 60 * 24; // 24 hours

export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const extractedToken = this.extractTokenFromRequest(request);

    if (!extractedToken) {
      return false;
    }
    const verfiedToken = await this.jwtService.verifyAsync(extractedToken, {
      ignoreExpiration: true,
    });

    this.checkTokenExpiration(verfiedToken);

    return true;
  }

  extractTokenFromRequest(request: Request) {
    const authHeader = request.headers.authorization;

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      return null;
    }

    return token;
  }

  async checkTokenExpiration(token: string) {
    const nowInSec = Date.now() / 1000;
    if (nowInSec < token['exp']) {
      return token;
    }

    if (
      nowInSec > token['exp'] &&
      nowInSec - token['exp'] < LIMIT_TOKEN_EXPIRATION
    ) {
      const refreshedToken = await this.jwtService.signAsync({
        id: token['sub'],
      });

      return refreshedToken;
    }

    return null;
  }
}
