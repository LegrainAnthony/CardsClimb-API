import { Test } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/db/prisma.service';
import { UsersService } from 'src/users/users.service';

describe('UserService', () => {
  let prisma: PrismaService;
  let UserService: UsersService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleRef.get<PrismaService>(PrismaService);
    UserService = moduleRef.get<UsersService>(UsersService);
    await prisma.clearDatabase();
  });

  describe('create', () => {
    let userId: number = 1;
    const userData: Prisma.UserCreateInput = {
      email: 'test@gmail.com',
      hashed_password: 'password',
      username: 'testuser',
    };

    it('should create a user', async () => {
      const user = await prisma.user.create({
        data: userData,
      });
      userId = user.id;

      expect(user.email).toBe(userData.email);
      expect(user.username).toBe(userData.username);
      expect(user.hashed_password).toBe(userData.hashed_password);
    });

    it('should get a user', async () => {
      const user = await UserService.findOne(userId);

      expect(user.email).toBe(userData.email);
      expect(user.username).toBe(userData.username);
      expect(user.hashed_password).toBe(userData.hashed_password);
    });
  });
});
