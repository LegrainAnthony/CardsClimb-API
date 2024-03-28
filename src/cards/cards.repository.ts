import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class CardsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(card: Prisma.CardCreateInput){
    return this.prismaService.card.create({
        data: card,
    })
  }

  findOne(cardWHereUniqueInput: Prisma.CardWhereUniqueInput) {
    return this.prismaService.card.findUnique({
        where: cardWHereUniqueInput,
    })
  }

  udpateOne(cardWhereUniqueInput: Prisma.CardWhereUniqueInput, datas: UpdateCardData  ) {
    return this.prismaService.card.update({
      where: cardWhereUniqueInput,
      data: datas
    })
  }
}
