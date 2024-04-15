import { Injectable, NotFoundException } from '@nestjs/common';
import { CardTypesRepository } from './cardType.repository';

@Injectable()
export class CardTypesService {
    constructor(private readonly cardTypesRepository: CardTypesRepository) {}

    async findOneCardType(id: number) {
        try {
            const cardType = await this.cardTypesRepository.findOne({ id });
            return cardType;
        } catch {
            throw new NotFoundException();
        }
    }

    async findAll() {
        const cardTypes = await this.cardTypesRepository.findMany();
        return cardTypes;
    }
}
