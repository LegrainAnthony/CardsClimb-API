import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(user: Prisma.UserCreateInput) {
    return this.prismaService.user.create({
      data: user,
    });
  }

  findOne(
    userWhereUniqueInput: Prisma.UserWhereInput,
    withPassword: boolean = false,
  ) {
    return this.prismaService.user.findFirst({
      where: userWhereUniqueInput,
      select: {
        id: true,
        email: true,
        username: true,
        hashed_password: withPassword,
      },
    });
  }
}
