import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class BoxRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(box: Prisma.BoxCreateInput) {
    return this.prismaService.box.create({
      data: box,
    });
  }

  findOne(boxWhereUniqueInput: Prisma.BoxWhereUniqueInput) {
    return this.prismaService.box.findUnique({
      where: boxWhereUniqueInput,
      select: {
        id: true,
        name: true,
        user_id: true,
      },
    });
  }

  findAll(where: Prisma.BoxWhereInput) {
    return this.prismaService.box.findMany({
      where: where,
    });
  }

  update(
    boxWhereUniqueInput: Prisma.BoxWhereUniqueInput,
    data: Prisma.BoxUpdateInput,
  ) {
    return this.prismaService.box.update({
      where: boxWhereUniqueInput,
      data: data,
    });
  }

  delete(boxWhereUniqueInput: Prisma.BoxWhereUniqueInput) {
    return this.prismaService.box.delete({
      where: boxWhereUniqueInput,
    });
  }
}
