import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(user: CreateUserDto) {
    return this.prismaService.user.create({
      data: user,
    });
  }

  findOneByEmail(email: string) {
    return this.findOne({ email });
  }

  findOneById(id: number) {
    return this.findOne({ id });
  }

  findOne(where: Prisma.UserWhereInput, select?: Prisma.UserSelect) {
    {
      return this.prismaService.user.findFirst({
        where,
        select,
      });
    }
  }

  findOneWithoutPassword(userWhereUniqueInput: Prisma.UserWhereInput) {
    return this.findOne(userWhereUniqueInput, {
      id: true,
      email: true,
      username: true,
    });
  }
}
