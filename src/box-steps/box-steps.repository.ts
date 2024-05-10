import { Injectable } from '@nestjs/common';
import { BoxStep, Prisma } from '@prisma/client';
import { CreateBoxStepsDto } from './dto/create-box-steps.dto';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class BoxStepsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  createBoxStep(data: CreateBoxStepsDto, order: number) {
    const { boxId, ...rest } = data;
    return this.prismaService.boxStep.create({
      data: {
        ...rest,
        box: {
          connect: { id: boxId },
        },
        order,
      },
    });
  }
  findOneBoxStep(BoxStepWhereUniqueInput: Prisma.BoxStepWhereUniqueInput) {
    return this.prismaService.boxStep.findFirst({
      where: {
        AND: [
          { id: BoxStepWhereUniqueInput.id },
          { box_id: BoxStepWhereUniqueInput.box_id },
        ],
      },
    });
  }

  findManyBoxSteps(ids: number[], userId: number) {
    return this.prismaService.boxStep.findMany({
      where: {
        id: {
          in: ids,
        },
        box: {
          user_id: userId,
        },
      },
    });
  }

  async findManyBoxStepsByIds(ids: number[]) {
    return this.prismaService.boxStep.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  updateOneBoxStep(
    where: Prisma.BoxStepWhereUniqueInput,
    data: Prisma.BoxStepUpdateInput,
  ) {
    return this.prismaService.boxStep.update({
      where,
      data: {
        ...data,
      },
    });
  }

  async updateOrderOfBoxSteps(data: { id: number; order: number }[]) {
    const updates = this.prismaService.$transaction(
      data.map((item) =>
        this.prismaService.boxStep.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );
    return updates;
  }

  deleteOneBoxStep(BoxStepWhereUniqueInput: Prisma.BoxStepWhereUniqueInput) {
    return this.prismaService.boxStep.delete({
      where: BoxStepWhereUniqueInput,
    });
  }

  findAllBoxStepsForBox(
    BoxStepWhereInput: Prisma.BoxStepWhereInput,
  ): Promise<BoxStep[]> {
    return this.prismaService.boxStep.findMany({
      where: BoxStepWhereInput,
    });
  }
}
