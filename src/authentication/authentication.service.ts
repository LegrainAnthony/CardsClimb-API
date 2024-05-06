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
import { RefreshTokenDto } from './dto/refresh-token.dto';
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

    const payload = { username: userCreated.username, sub: userCreated.id };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
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
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto, userId: number) {
    try {
      const { sub, refreshTokenId } = await this.jwtService.verifyAsync<{
        sub: number;
        refreshTokenId: string;
      }>(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });

      if (userId !== sub) {
        throw new UnauthorizedException();
      }

      const user = await this.userRepository.findOneById(sub);

      if (!user) throw new NotFoundException('User not found');

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
    const user = await this.userRepository.findOneById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hashed_password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }
}
