import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CardType, Prisma, User } from '@prisma/client';
import { AppModule } from 'src/app.module';
import { CardsService } from 'src/cards/cards.service';
import { CreateCardDto } from 'src/cards/dto/create-card.dto';
import { PrismaService } from 'src/db/prisma.service';

describe('CardService', () => {
  let prisma: PrismaService;
  let CardService: CardsService;
  let user: User | null = null;
  let cardType: CardType

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
    }

    cardType = await prisma.cardType.create(
      {
        data: cardTypeData
      }
    )
  
    user = await prisma.user.create({
      data: userData,
    });

  });

  describe('create', () => {
    const cardData: CreateCardDto = {
      question: 'test',
      answer: 'test',
      reference: 'HA_test1',
    };

    it('/cards (Post)', async () => {
      const card =  await CardService.createCard(cardData, cardType.id, user.id);
      expect(card.id).toBe(1);
      expect(card.question).toBe(cardData.question);
      expect(card.reference).toBe(cardData.reference);
      expect(card.answer).toBe(cardData.answer);
      expect(card.last_revision).toBe(null);
      expect(card.future_revision).toBe(null);
      expect(card.box_id).toBe(null);
      expect(card.card_type_id).toBe(cardType.id);
    });

    it('/cards/1 (GET)', async () => {
      const card = await CardService.findOneCard(1 , user.id)
      expect(card.id).toBe(1);
      expect(card.question).toBe(cardData.question);
      expect(card.reference).toBe(cardData.reference);
      expect(card.answer).toBe(cardData.answer);
      expect(card.last_revision).toBe(null);
      expect(card.future_revision).toBe(null);
      expect(card.box_id).toBe(null);
      expect(card.card_type_id).toBe(cardType.id);
    })

    it('/cards/1 (PATCH)', async () => {
      const cardDataToUpdate = {
        question: 'Modified',
      }
      const card = await CardService.updateOneCard(1, cardType.id, user.id, cardDataToUpdate)
      expect(card.id).toBe(1);
      expect(card.question).toBe(cardDataToUpdate.question);
      expect(card.reference).toBe(cardData.reference);
      expect(card.answer).toBe(cardData.answer);
      expect(card.last_revision).toBe(null);
      expect(card.future_revision).toBe(null);
      expect(card.box_id).toBe(null);
      expect(card.card_type_id).toBe(cardType.id);
    })

    it('/tags/1 (delete)', async () => {
      let card;
      try {
        card = await CardService.deleteOneCard(1, user.id)
        const cardDeleted = await CardService.findOneCard(1 , user.id)
      }
      catch (e) {
        expect(card.answer).toBe(cardData.answer);
        expect(e).toBeInstanceOf(BadRequestException);
      }
      
    });
  
  });
});
