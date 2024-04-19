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
      select: {
        id: true,
        name: true,
        color: true,
        user_id: true,
      },
    });
  }

  findOneTag(id: number, userId: number) {
    return this.prismaService.tag.findUnique({
      where: {
        id,
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
      select: {
        id: true,
        name: true,
        color: true,
        user_id: true,
      },
    });
  }

  updateOneTag(
    id: number,
    tag: UpdateTagDto,
    userId: number,
    colorId?: number,
  ) {
    return this.prismaService.tag.update({
      where: {
        id,
      },
      data: {
        ...tag,
        user: {
          connect: {
            id: userId,
          },
        },
        color: colorId ? { connect: { id: colorId } } : undefined,
      },
      select: {
        id: true,
        name: true,
        color: true,
        user_id: true,
      },
    });
  }

  deleteOneTag(id: number) {
    return this.prismaService.tag.delete({
      where: { id },
      select: {
        id: true,
        name: true,
        color: true,
        user_id: true,
      },
    });
  }
}
