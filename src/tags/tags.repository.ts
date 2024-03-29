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

  findOne(tagWhereUniqueInput: Prisma.TagWhereUniqueInput) {
    return this.prismaService.tag.findUnique({
      where: tagWhereUniqueInput,
    });
  }

  create(tag: Prisma.TagCreateInput) {
    return this.prismaService.tag.create({
      data: tag,
    });
  }

  update(
    tagWhereUniqueInput: Prisma.TagWhereUniqueInput,
    tag: Prisma.TagUpdateInput,
  ) {
    return this.prismaService.tag.update({
      where: tagWhereUniqueInput,
      data: tag,
    });
  }

  delete(tagWhereUniqueInput: Prisma.TagWhereUniqueInput) {
    return this.prismaService.tag.delete({
      where: tagWhereUniqueInput,
    });
  }
}
