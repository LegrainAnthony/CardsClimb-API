import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TagsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findAll(userId: number) {
    return this.prismaService.tag.findMany({
      where: {
        user_id: userId,
      },
    });
  }

  findMany(ids: number[], userId: number) {
    return this.prismaService.tag.findMany({
      where: {
        id: {
          in: ids,
        },
        user_id: userId,
      },
      select: {
        id: true,
        name: true,
        color: true,
        user_id: true,
      },
    });
  }

  findOne(tagWhereUniqueInput: Prisma.TagWhereUniqueInput) {
    return this.prismaService.tag.findUnique({
      where: tagWhereUniqueInput,
      select: {
        id: true,
        name: true,
        color: true,
        user_id: true,
      },
    });
  }

  create(tag: Prisma.TagCreateInput) {
    return this.prismaService.tag.create({
      data: tag,
      select: {
        id: true,
        name: true,
        color: true,
        user_id: true,
      },
    });
  }

  update(
    tagWhereUniqueInput: Prisma.TagWhereUniqueInput,
    tag: Prisma.TagUpdateInput,
  ) {
    return this.prismaService.tag.update({
      where: tagWhereUniqueInput,
      data: tag,
      select: {
        id: true,
        name: true,
        color: true,
        user_id: true,
      },
    });
  }

  delete(tagWhereUniqueInput: Prisma.TagWhereUniqueInput) {
    return this.prismaService.tag.delete({
      where: tagWhereUniqueInput,
      select: {
        id: true,
        name: true,
        color: true,
        user_id: true,
      },
    });
  }
}
