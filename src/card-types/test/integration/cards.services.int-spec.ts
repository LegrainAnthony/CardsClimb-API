import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CardType, Prisma, User } from '@prisma/client';
import { AppModule } from 'src/app.module';
import { CardTypesService } from 'src/card-types/cardType.services';
import { CreateCardDto } from 'src/cards/dto/create-card.dto';
import { PrismaService } from 'src/db/prisma.service';

describe('CardService', () => {
  let prisma: PrismaService;
  let cardTypesService: CardTypesService;
  let cardType: CardType

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleRef.get<PrismaService>(PrismaService);
    cardTypesService = moduleRef.get<CardTypesService>(CardTypesService);
    await prisma.clearDatabase();

    const cardTypeData: Prisma.CardTypeCreateInput = {name: 'flash'}
    cardType = await prisma.cardType.create({ data: cardTypeData })

  });

  describe('create', () => {
    it('/cardTypes/2 (GET)', async () => {
        const cardTypeFind = await cardTypesService.findOneCardType(cardType.id);
        const all = await cardTypesService.findAll();
        console.log(all);
        
        expect(cardTypeFind.id).toBe(cardType.id)
        expect(cardTypeFind.name).toBe('flash')
    });

    it('/cardTypes (GET)', async () => {

    })

  });
});
