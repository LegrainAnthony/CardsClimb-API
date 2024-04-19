import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/db/prisma.service';

type WhereInputTypes = {
  User: Prisma.UserWhereInput;
  Card: Prisma.CardWhereInput;
  Box: Prisma.BoxWhereInput;
  BoxStep: Prisma.BoxStepWhereInput;
  Tag: Prisma.TagWhereInput;
  CardType: Prisma.CardTypeWhereInput;
  Color: Prisma.ColorWhereInput;
};

type IncludeInputTypes = {
  User: Prisma.UserInclude;
  Card: Prisma.CardInclude;
  Box: Prisma.BoxInclude;
  BoxStep: Prisma.BoxStepInclude;
  Tag: Prisma.TagInclude;
  CardType: Prisma.CardTypeInclude;
  Color: Prisma.ColorInclude;
};

@Injectable()
export class FilterRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async filterBy<Model extends Prisma.ModelName>(
    model: Model,
    {
      where,
      include,
    }: {
      where: WhereInputTypes[Model];
      include?: IncludeInputTypes[Model];
    },
  ) {
    const modelClient = this.prismaService[
      model as keyof typeof PrismaClient.prototype
    ] as any;

    return modelClient.findMany({ where, include });
  }
}
