import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  // Prisma met a disposition un type lié à chaque modèle de la base de données.
  create(user: Prisma.UserCreateInput) {
    return this.prismaService.user.create({
      data: user,
    });
  }

  findOne(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.findUnique({
      where: userWhereUniqueInput,
      select: {
        id: true,
        email: true,
        username: true,
      },
    });
  }
}