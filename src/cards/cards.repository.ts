import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class CardsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(card: Prisma.CardCreateInput) {
    return this.prismaService.card.create({
      data: card,
    });
  }

  findOne(CardWhereUniqueInput: Prisma.CardWhereUniqueInput) {
    return this.prismaService.card.findUnique({
      where: CardWhereUniqueInput,
    });
  }

  updateOne(
    CardWhereUniqueInput: Prisma.CardWhereUniqueInput,
    datas: Prisma.CardUpdateInput,
  ) {
    return this.prismaService.card.update({
      where: CardWhereUniqueInput,
      data: datas,
    });
  }

  deleteOne(CardWhereUniqueInput: Prisma.CardWhereUniqueInput) {
    return this.prismaService.card.delete({
      where: CardWhereUniqueInput,
    });
  }

  findMany(cardWhereInput: Prisma.CardWhereInput) {
    return this.prismaService.card.findMany({
      where: cardWhereInput,
    });
  }

  findManyRevisionBetweenTwoDate(userId: number, lte: number, gte: number) {
    return this.findMany({
      AND: [
        {
          user_id: userId,
        },
        {
          future_revision: {
            lte,
            gte,
          },
        },
      ],
    });
  }
}
