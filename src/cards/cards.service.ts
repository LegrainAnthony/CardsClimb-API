import { Injectable } from '@nestjs/common';
import { CardsRepository } from './cards.repository';
import { Prisma } from '@prisma/client';
import { CreateCardDto } from './dto/create-card.dto';
import { UserRepository } from 'src/users/users.repository';

@Injectable()
export class CardsService {
    // Injection du cardrepository dans l'instance du service.
    constructor(private readonly cardsRepository: CardsRepository, private readonly userRepository: UserRepository){}
    // methode d'objet.
    // validation des champs par les valeurs générer par prisma.
    async createCard(data: CreateCardDto) {
        // logique ici
        const user = await this.userRepository.findOne({ id: 1 })
        return this.cardsRepository.create({
            ...data,
            user: { connect: {id: user.id} },
        })
    }

    findOneCard(id: number) {
        return this.cardsRepository.findOne({id})
    }
    
    udpateOneCard(id: number, datas: UpdateCardData) {

    }
}
