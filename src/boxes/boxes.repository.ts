import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Box, Prisma } from '@prisma/client';
import { PrismaService } from 'src/db/prisma.service';
import { CreateBoxDto } from './dto/create-boxes.dto';

@Injectable()
export class BoxesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(box: Prisma.BoxCreateInput) {
    return this.prismaService.box.create({
      data: box,
    });
  }

  findOne(BoxWhereUniqueInput: Prisma.BoxWhereUniqueInput) {
    return this.prismaService.box.findUnique({
      where: BoxWhereUniqueInput,
    });
  }

  updateOne(
    BoxWhereUniqueInput: Prisma.BoxWhereUniqueInput,
    data: Prisma.BoxUpdateInput,
  ) {
    return this.prismaService.box.update({
      where: BoxWhereUniqueInput,
      data: data,
    });
  }

  deleteOne(BoxWhereUniqueInput: Prisma.BoxWhereUniqueInput) {
    return this.prismaService.box.delete({
      where: BoxWhereUniqueInput,
    });
  }

  async findAllBoxes(where: Prisma.BoxWhereInput): Promise<Box[]> {
    return this.prismaService.box.findMany({
      where,
    });
  }
}
