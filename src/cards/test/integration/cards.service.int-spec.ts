import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Card, CardType, Prisma, User } from '@prisma/client';
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
    await prisma.clearDatabase();

    const userData: Prisma.UserCreateInput = {
      email: 'test@gmail.com',
      hashed_password: 'password',
      username: 'testuser',
    };

    const cardTypeData: Prisma.CardTypeCreateInput = {
      name: 'flash',
    };

    cardType = await prisma.cardType.create({
      data: cardTypeData,
    });

    user = await prisma.user.create({
      data: userData,
    });
  });

  describe('create', () => {
    let cardCreated: Card;

    const cardData: CreateCardDto = {
      question: 'test',
      answer: 'test',
      reference: 'HA_test1',
    };

    it('/cards (Post)', async () => {
      cardCreated = await CardService.createCard(
        cardData,
        cardType.id,
        user.id,
      );
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
      };
      const card = await CardService.updateOneCard(
        cardCreated.id,
        cardType.id,
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
