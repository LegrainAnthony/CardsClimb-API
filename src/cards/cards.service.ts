import { Injectable } from '@nestjs/common';
import { CardsRepository } from './cards.repository';
import { Prisma } from '@prisma/client';
import { CreateCardDto } from './dto/create-card.dto';

@Injectable()
export class CardsService {
    // Injection du cardrepository dans l'instance du service.
    constructor(private readonly cardsRepository: CardsRepository){}
    // methode d'objet.
    // validation des champs par les valeurs générer par prisma.
    createCard(data: Prisma.CardCreateInput) {
        // logique ici
        return this.cardsRepository.create(data)
    }

    findOneCard(id: number) {
        return this.cardsRepository.findOne({id})
    }
}
