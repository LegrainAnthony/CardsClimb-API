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

    it('should create a card', async () => {
      const card =  await CardService.createCard(cardData, cardType.id, user.id);
      expect(card.question).toBe(cardData.question);
    });
  });
});
