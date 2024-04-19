import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(user: Prisma.UserCreateInput) {
    return this.prismaService.user.create({
      data: user,
    });
  }

  findOne(where: Prisma.UserWhereInput, select?: Prisma.UserSelect) {
    return this.prismaService.user.findFirst({
      where,
      select,
    });
  }

  findOneWithoutPassword(userWhereUniqueInput: Prisma.UserWhereInput) {
    return this.findOne(userWhereUniqueInput, {
      id: true,
      email: true,
      username: true,
    });
  }
}
