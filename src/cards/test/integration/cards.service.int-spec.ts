import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Card, CardType, User } from '@prisma/client';
import { AppModule } from 'src/app.module';
import { CardsService } from 'src/cards/cards.service';
import { CreateCardDto } from 'src/cards/dto/create-card.dto';
import { PrismaService } from 'src/db/prisma.service';

describe('CardService', () => {
  let prisma: PrismaService;
  let CardService: CardsService;
  let user: User | null = null;
  let cardType: CardType;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleRef.get<PrismaService>(PrismaService);
    CardService = moduleRef.get<CardsService>(CardsService);

    cardType = await prisma.cardType.findUnique({
      where: { id: 1 },
    });

    user = await prisma.user.findFirst({
      where: { id: 1 },
    });
  });

  describe('create', () => {
    let cardCreated: Card;

    const cardData: CreateCardDto = {
      question: 'test',
      answer: 'test',
      reference: 'HA_test1',
      tagIds: [1],
      cardTypeId: 1,
    };

    it('/cards (Post)', async () => {
      cardCreated = await CardService.createCard(cardData, user.id);
      expect(cardCreated.id).toBeDefined();
      expect(cardCreated.question).toBe(cardData.question);
      expect(cardCreated.reference).toBe(cardData.reference);
      expect(cardCreated.answer).toBe(cardData.answer);
      expect(cardCreated.card_type_id).toBe(cardType.id);
    });

    it('/cards/1 (GET)', async () => {
      const card = await CardService.findOneCard(cardCreated.id, user.id);
      expect(card.id).toBeDefined();
      expect(card.question).toBe(cardData.question);
      expect(card.reference).toBe(cardData.reference);
      expect(card.answer).toBe(cardData.answer);
      expect(card.card_type_id).toBe(cardType.id);
    });

    it('/cards/1 (PATCH)', async () => {
      const cardDataToUpdate = {
        question: 'Modified',
        tagIds: [1],
        cardTypeId: 1,
      };
      const card = await CardService.updateOneCard(
        cardCreated.id,
        user.id,
        cardDataToUpdate,
      );
      expect(card.id).toBeDefined();
      expect(card.question).toBe(cardDataToUpdate.question);
      expect(card.reference).toBe(cardData.reference);
      expect(card.answer).toBe(cardData.answer);
      expect(card.card_type_id).toBe(cardType.id);
    });

    it('/tags/1 (delete)', async () => {
      let card;
      try {
        card = await CardService.deleteOneCard(cardCreated.id, user.id);
        await CardService.findOneCard(1, user.id);
      } catch (e) {
        expect(card.answer).toBe(cardData.answer);
        expect(e).toBeInstanceOf(BadRequestException);
      }
    });
  });
});
