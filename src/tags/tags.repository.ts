import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TagRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findAll() {
    return this.prismaService.tag.findMany();
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
