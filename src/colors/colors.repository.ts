import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class ColorsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findAll() {
    return this.prismaService.color.findMany();
  }

  findOne(colorWhereUniqueInput: Prisma.ColorWhereUniqueInput) {
    return this.prismaService.color.findUnique({
      where: colorWhereUniqueInput,
    });
  }
}
