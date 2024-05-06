import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(user: CreateUserDto) {
    return this.prismaService.user.create({
      data: user,
    });
  }

  findOneByEmail(email: string) {
    return this.prismaService.user.findFirst({
      where: {
        email,
      },
    });
  }

  findOneById(id: number) {
    return this.prismaService.user.findFirst({
      where: {
        id,
      },
    });
  }
}
