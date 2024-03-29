import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CardsRepository } from './cards.repository';
import { Prisma } from '@prisma/client';
import { CreateCardDto } from './dto/create-card.dto';
import { UserRepository } from 'src/users/users.repository';
import { error } from 'console';

@Injectable()
export class CardsService {
    constructor(private readonly cardsRepository: CardsRepository, private readonly userRepository: UserRepository){}

    private async getConnectedUser() {
        return await this.userRepository.findOne({ id: 1 })
    }

    async createCard(data: CreateCardDto, cardTypeId: string, userId: number) {
        //! Inclure vérificatioon des card_type
        return this.cardsRepository.create({
            ...data,
            user: { connect: { id: userId } },
            card_type: { connect: { id: Number(cardTypeId) } }
        })
    }

    async findOneCard(id: number, userId: number) {
        console.log(userId);
        const card = await this.cardsRepository.findOne({id});
        // const user = await  this.getConnectedUser();
        if(card.user_id !== userId) {
            throw new ForbiddenException();
        }
        return card;
    }
    
    udpateOneCard(id: number, datas: UpdateCardData) {

    }
}
