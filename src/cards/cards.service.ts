import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as moment from 'moment'
import { CardsRepository } from './cards.repository';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { BoxesService } from 'src/boxes/boxes.service';
import { BoxStep, Prisma } from '@prisma/client';

@Injectable()
export class CardsService {
  constructor(
    private readonly cardsRepository: CardsRepository,
    private readonly boxesService: BoxesService
  ) {}

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

  findAllFromUser(userId: number) {
    return this.cardsRepository.findAll(userId);
  }

  private calculateFutureRevision(interval: number) {
    return moment().add(interval, 'days').format();
  }

  private calculateLastRevision() {
     return moment().format()    
  }

  private calculatePositionStep (currentStepBox: BoxStep, BoxSteps: BoxStep[]) {
      return BoxSteps.find((box) => currentStepBox.order + 1 === box.order);
  }

  private getCurrentBoxStep(currentStepBox: number, BoxSteps: BoxStep[]) {
    return BoxSteps.find((box) => box.id === currentStepBox);
  }



  async validateCard(cardId: number, userId: number) {
    try {
      const card = await this.findOneCard(cardId, userId);
      if(!card.box_id) throw new BadRequestException()
      const box = await this.boxesService.getBoxWithBoxSteps(card.box_id, userId);
      const currentBoxStep = this.getCurrentBoxStep(card.box_step_id, box.box_steps)
      const futureBoxStep = this.calculatePositionStep(currentBoxStep, box.box_steps);
      
      const updatedData: Prisma.CardUpdateInput = {
        box: futureBoxStep ? { connect: { id:  box.id } } : { disconnect: true },
        last_revision:  this.calculateLastRevision(),
        boxStep: futureBoxStep ? { connect: { id:  futureBoxStep.id } } : { disconnect: true },
        future_revision: futureBoxStep ? this.calculateFutureRevision( futureBoxStep.interval) : null
        }
        
        return this.cardsRepository.updateOne(card , updatedData)
      }
    catch (e) {
      console.log(e);
     }
  }



  async StoreCardInBox(cardId: number, boxId: number, boxStepId: number,  userId: number ) {
    try {
      const card = await this.findOneCard(cardId, userId);
      const box = await this.boxesService.getBoxWithBoxSteps(boxId, userId);
      const currentBoxStep = this.getCurrentBoxStep(boxStepId, box.box_steps) || box.box_steps[0];

      const updatedData: Prisma.CardUpdateInput = {
        box: { connect: { id: box.id } },
        boxStep: { connect: { id:  currentBoxStep.id } },
        future_revision: this.calculateFutureRevision(currentBoxStep.interval)
      };
      
      return this.cardsRepository.updateOne(card , updatedData)
      } catch (e) {

    }
  }
}



