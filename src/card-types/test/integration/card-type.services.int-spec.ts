import { Test } from '@nestjs/testing';
import { CardType } from '@prisma/client';
import { AppModule } from 'src/app.module';
import { CardTypesService } from 'src/card-types/card-type.services';
import { PrismaService } from 'src/db/prisma.service';

describe('CardService', () => {
  let prisma: PrismaService;
  let cardTypesService: CardTypesService;
  let cardType: CardType;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleRef.get<PrismaService>(PrismaService);
    cardTypesService = moduleRef.get<CardTypesService>(CardTypesService);

    cardType = (await prisma.cardType.findUnique({ where: { id: 1 } }))!;
  });

  describe('create', () => {
    it('/cardTypes/2 (GET)', async () => {
      const cardTypeFind = await cardTypesService.findOneCardsTypes(
        cardType.id,
      );
      expect(cardTypeFind.id).toBe(cardType.id);
      expect(cardTypeFind.name).toBe(cardType.name);
    });

    it('/cardTypes (GET)', async () => {
      const allCardTypes = await cardTypesService.findAll();
      expect(allCardTypes[0].id).toBe(cardType.id);
      expect(allCardTypes[0].name).toBe(cardType.name);
    });
  });
});
