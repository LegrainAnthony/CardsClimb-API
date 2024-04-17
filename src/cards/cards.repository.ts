import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/db/prisma.service';
// import { TagsService } from 'src/tags/tags.service';

@Injectable()
export class CardsRepository {
  constructor(
    private readonly prismaService: PrismaService ,
    // private readonly tagsService: TagsService
  ) {}

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

  findAll(userId: number) {
    return this.prismaService.card.findMany({
      where: { user_id: userId },
    });
  }


}
