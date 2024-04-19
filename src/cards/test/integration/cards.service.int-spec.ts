import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Card, CardType, User } from '@prisma/client';
import * as moment from 'moment-timezone';
import { AppModule } from 'src/app.module';
import { CardsRepository } from 'src/cards/cards.repository';
import { CardsService } from 'src/cards/cards.service';
import { CreateCardDto } from 'src/cards/dto/create-card.dto';
import { PrismaService } from 'src/db/prisma.service';

describe('CardService', () => {
  let prisma: PrismaService;
  let cardsService: CardsService;
  let cardsRepository: CardsRepository;
  let user: User | null = null;
  let cardType: CardType | null = null;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleRef.get<PrismaService>(PrismaService);
    cardsService = moduleRef.get<CardsService>(CardsService);
    cardsRepository = moduleRef.get<CardsRepository>(CardsRepository);

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
      if (!user) throw new BadRequestException('User not found');
      if (!cardType) throw new BadRequestException('CardType not found');

      cardCreated = await cardsService.createCard(cardData, user.id);
      expect(cardCreated.id).toBeDefined();
      expect(cardCreated.question).toBe(cardData.question);
      expect(cardCreated.reference).toBe(cardData.reference);
      expect(cardCreated.answer).toBe(cardData.answer);
      expect(cardCreated.card_type_id).toBe(cardType.id);
    });

    it('/cards/1 (GET)', async () => {
      if (!user) throw new BadRequestException('User not found');
      if (!cardType) throw new BadRequestException('CardType not found');

      const card = await cardsService.findOneCard(cardCreated.id, user.id);
      expect(card.id).toBeDefined();
      expect(card.question).toBe(cardData.question);
      expect(card.reference).toBe(cardData.reference);
      expect(card.answer).toBe(cardData.answer);
      expect(card.card_type_id).toBe(cardType.id);
    });

    it('/cards/1 (PATCH)', async () => {
      if (!user) throw new BadRequestException('User not found');
      if (!cardType) throw new BadRequestException('CardType not found');
      const cardDataToUpdate = {
        question: 'Modified',
        tagIds: [1],
        cardTypeId: 1,
      };
      const card = await cardsService.updateOneCard(
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

    it('/cards/1 (delete)', async () => {
      if (!user) throw new BadRequestException('User not found');
      if (!cardType) throw new BadRequestException('CardType not found');
      let card;
      try {
        card = await cardsService.deleteOneCard(cardCreated.id, user.id);
        await cardsService.findOneCard(1, user.id);
      } catch (e) {
        expect(card.answer).toBe(cardData.answer);
        expect(e).toBeInstanceOf(BadRequestException);
      }
    });

    it('should list all revision cards for today', async () => {
      if (!user) throw new BadRequestException('User not found');
      if (!cardType) throw new BadRequestException('CardType not found');

      const generateData = (date: number) => ({
        question: 'test',
        answer: 'test',
        reference: 'HA_test1',
        card_type: { connect: { id: 1 } },
        user: { connect: { id: user!.id } },
        tags: {
          connect: [{ id: 1 }],
        },
        future_revision: date,
      });

      const addThreeDays = 3;

      await Promise.all([
        cardsRepository.create(generateData(Number(moment().format('x')))),
        cardsRepository.create(
          generateData(Number(moment().add(addThreeDays, 'days').format('x'))),
        ),
      ]);

      const cards = await cardsService.listCardRevisions(user.id);

      expect(cards.length).toBe(1);
    });
  });
});
