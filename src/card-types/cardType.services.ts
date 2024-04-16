import { Injectable, NotFoundException } from '@nestjs/common';
import { CardTypesRepository } from './cardType.repository';

@Injectable()
export class CardTypesService {
    constructor(private readonly cardTypesRepository: CardTypesRepository) {}

    async findOneCard(id: number) {

            const cardType = await this.cardTypesRepository.findOne({ id });
            if(!cardType) {
                throw new NotFoundException();
            }
            return cardType;
  
    }

    async findAll() {
        const cardTypes = await this.cardTypesRepository.findMany();
        return cardTypes;
    }
}
