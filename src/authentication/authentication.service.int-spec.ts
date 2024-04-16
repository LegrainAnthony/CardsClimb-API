import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/db/prisma.service';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto';
import { hashSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

const signUpData: SignUpDto = {
  email: 'test@gmail.com',
  username: 'test',
  password: 'password',
};
const salt = 10;

describe('AuthenticationService', () => {
  let prisma: PrismaService;
  let authenticationService: AuthenticationService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleRef.get<PrismaService>(PrismaService);
    authenticationService = moduleRef.get<AuthenticationService>(
      AuthenticationService,
    );
    jwtService = moduleRef.get<JwtService>(JwtService);
    await prisma.clearDatabase();

    await prisma.user.create({
      data: {
        email: signUpData.email,
        username: signUpData.username,
        hashed_password: hashSync(signUpData.password, salt),
      },
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const user = await authenticationService.signIn({
        email: signUpData.email,
        password: signUpData.password,
      });

      expect(user.accessToken).toBeDefined();
      expect(user.refreshToken).toBeDefined();
    });

    it('should refresh token', async () => {
      const user = await authenticationService.signIn({
        email: signUpData.email,
        password: signUpData.password,
      });

      const { sub } = jwtService.decode(user.accessToken) as { sub: number };

      const refreshedTokens = await authenticationService.refreshTokens(
        {
          refreshToken: user.refreshToken,
        },
        sub,
      );

      expect(refreshedTokens.accessToken).toBeDefined();
      expect(refreshedTokens.refreshToken).toBeDefined();
    });

    it('should throw if the refreshToken is tampered with', async () => {
      const user = await authenticationService.signIn({
        email: signUpData.email,
        password: signUpData.password,
      });

      const { sub } = jwtService.decode(user.accessToken) as { sub: number };

      try {
        await authenticationService.refreshTokens(
          {
            refreshToken: user.refreshToken + 'a',
          },
          sub,
        );
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
        if (e instanceof UnauthorizedException) {
          const unauthorizedStatus = 401;
          expect(e.getStatus()).toBe(unauthorizedStatus);
        }
      }
    });

    it('should throw if the refreshToken is used more two times', async () => {
      const user = await authenticationService.signIn({
        email: signUpData.email,
        password: signUpData.password,
      });

      const { sub } = jwtService.decode(user.accessToken) as { sub: number };

      await authenticationService.refreshTokens(
        {
          refreshToken: user.refreshToken,
        },
        sub,
      );

      try {
        await authenticationService.refreshTokens(
          {
            refreshToken: user.refreshToken,
          },
          sub,
        );
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
        if (e instanceof UnauthorizedException) {
          const unauthorizedStatus = 401;
          expect(e.getStatus()).toBe(unauthorizedStatus);
        }
      }
    });
  });
});
