import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { CreateBoxDto } from './dto/create-boxes.dto';
import { UpdateBoxDto } from './dto/update-boxes.dto';

@Injectable()
export class BoxesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(box: CreateBoxDto, userId: number) {
    return this.prismaService.box.create({
      data: {
        ...box,
        user: { connect: { id: userId } },
      },
    });
  }

  findOne(id: number) {
    return this.prismaService.box.findUnique({
      where: {
        id,
      },
    });
  }

  updateOne(id: number, box: UpdateBoxDto) {
    return this.prismaService.box.update({
      where: { id },
      data: {
        name: box.name,
      },
    });
  }

  deleteOne(id: number) {
    return this.prismaService.box.delete({
      where: { id },
    });
  }

  async findAllUserBoxes(userId: number) {
    return this.prismaService.box.findMany({
      where: { user_id: userId },
    });
  }

  async getBoxWithBoxSteps(id: number) {
    return this.prismaService.box.findUnique({
      where: { id },
      include: {
        box_steps: true,
      },
    });
  }
}
