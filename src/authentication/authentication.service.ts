import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignUp, signIn } from './interfaces/auth.interface';
import { hash, compare } from 'bcrypt';
import { UsersRepository } from 'src/users/users.repository';
import appConfig from 'src/config/app.config';
import { ConfigType } from '@nestjs/config';
import { User } from '@prisma/client';
import { randomUUID } from 'crypto';
import { RefreshTokenIdsStorageService } from 'src/redis/refresh-token-ids-storage.service';

const SALT = 10;

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,

    private readonly userRepository: UsersRepository,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorageService,
    @Inject(appConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof appConfig>,
  ) {}

  async signUp(user: SignUp) {
    const isUserExist = await this.userRepository.findOneByEmail(user.email);

    if (isUserExist) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await hash(user.password, SALT);

    const userCreated = await this.userRepository.create({
      username: user.username,
      email: user.email,
      hashed_password: hashedPassword,
    });

    return this.generateTokens(userCreated);
  }

  async signIn(user: signIn) {
    const userFound = await this.userRepository.findOneByEmail(user.email);

    if (!userFound) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await compare(
      user.password,
      userFound.hashed_password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException({
        message: 'Invalid password',
      });
    }

    return this.generateTokens(userFound);
  }

  async me(userId: number) {
    const user = await this.userRepository.findOneWithoutPassword({
      id: userId,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async generateTokens(user: User) {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(user.id, this.jwtConfiguration.accessTokenTtl),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, {
        refreshTokenId,
      }),
    ]);
    await this.refreshTokenIdsStorage.insert(
      user.id,
      refreshTokenId,
      this.jwtConfiguration.refreshTokenTtl,
    );

    await this.userRepository.insertRefreshToken(refreshToken, user.id);

    return {
      accessToken,
    };
  }

  async refreshTokens(userId: number) {
    try {
      const user = await this.userRepository.findOneById(userId);

      if (!user) throw new NotFoundException('User not found');

      if (!user.refresh_token) {
        throw new UnauthorizedException();
      }

      const { sub, refreshTokenId } = await this.jwtService.verifyAsync<{
        sub: number;
        refreshTokenId: string;
      }>(user.refresh_token, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });

      if (user.id !== sub) {
        throw new UnauthorizedException();
      }

      // Vérfier si l'id du refresh token est valide, si ce n'est pas le cas
      // il est fort possible que le payload du token ait été modifié
      const isValid = await this.refreshTokenIdsStorage.validate(
        user.id,
        refreshTokenId,
      );
      if (isValid) {
        await this.refreshTokenIdsStorage.invalidate(user.id);
      } else {
        throw new Error('Refresh token is invalid');
      }
      return this.generateTokens(user);
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  private signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }

  async getCurrentUser(userId: number) {
    const user = await this.userRepository.findOneWithoutPassword({
      id: userId,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
