import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CardsRepository } from './cards.repository';
import { Prisma } from '@prisma/client';
import { CreateCardDto } from './dto/create-card.dto';
import { UserRepository } from 'src/users/users.repository';
import { error } from 'console';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardsService {
  constructor(private readonly cardsRepository: CardsRepository) {}

  createCard(data: CreateCardDto, cardTypeId: number, userId: number) {
    return this.cardsRepository.create({
      ...data,
      user: { connect: { id: userId } },
      card_type: { connect: { id: cardTypeId } },
    });
  }

  async findOneCard(id: number, userId: number) {
    const card = await this.cardsRepository.findOne({ id });

    if (!card) {
      throw new BadRequestException();
    }
    if (card.user_id !== userId) {
      throw new ForbiddenException();
    }
    return card;
  }

  async updateOneCard(
    id: number,
    cardTypeId: number,
    userId: number,
    datas: UpdateCardDto,
  ) {
    try {
      await this.findOneCard(id, userId);
      const updatedData = {
        ...datas,
        card_type: { connect: { id: cardTypeId } },
      };
      return this.cardsRepository.updateOne({ id }, updatedData);
    } catch (err) {
      throw err;
    }
  }

  async deleteOneCard(id: number, userId: number) {
    try {
      await this.findOneCard(id, userId);
      return this.cardsRepository.deleteOne({ id });
    } catch (err) {
      throw err;
    }
  }

  findManyCards(userId: number) {
    return this.cardsRepository.findMany(userId);
  }
}
