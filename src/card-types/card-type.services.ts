import { Injectable, NotFoundException } from '@nestjs/common';
import { CardTypesRepository } from './card-type.repository';

@Injectable()
export class CardTypesService {
  constructor(private readonly cardTypesRepository: CardTypesRepository) {}

  async findOneCardsTypes(id: number) {
    const cardType = await this.cardTypesRepository.findOneById(id);
    if (!cardType) {
      throw new NotFoundException();
    }
    return cardType;
  }

  findAll() {
    return this.cardTypesRepository.findMany();
  }
}
