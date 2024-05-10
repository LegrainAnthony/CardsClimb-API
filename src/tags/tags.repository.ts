import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findAllTags(userId: number) {
    return this.prismaService.tag.findMany({
      where: {
        user_id: userId,
      },
      include: {
        color: true,
      },
    });
  }

  findManyTags(ids: number[], userId: number) {
    return this.prismaService.tag.findMany({
      where: {
        id: {
          in: ids,
        },
        user_id: userId,
      },
      include: {
        color: true,
      },
    });
  }

  findOneTag(id: number, userId: number) {
    return this.prismaService.tag.findUnique({
      where: {
        id,
        user_id: userId,
      },
      include: {
        color: true,
      },
    });
  }

  createTag(
    tag: Omit<CreateTagDto, 'colorId'>,
    userId: number,
    colorId: number,
  ) {
    return this.prismaService.tag.create({
      data: {
        ...tag,
        user: {
          connect: {
            id: userId,
          },
        },
        color: { connect: { id: colorId } },
      },
      include: {
        color: true,
      },
    });
  }

  updateOneTag(id: number, tag: UpdateTagDto, userId: number) {
    const { colorId, ...rest } = tag;
    return this.prismaService.tag.update({
      where: {
        id,
      },
      data: {
        ...rest,
        user: {
          connect: {
            id: userId,
          },
        },
        color: colorId ? { connect: { id: colorId } } : undefined,
      },
      include: {
        color: true,
      },
    });
  }

  deleteOneTag(id: number) {
    return this.prismaService.tag.delete({
      where: { id },
      include: {
        color: true,
      },
    });
  }
}
