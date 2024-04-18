import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as moment from 'moment-timezone';
import { CardsRepository } from './cards.repository';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { BoxesService } from 'src/boxes/boxes.service';
import { BoxStep, Prisma } from '@prisma/client';
import { StoreInBoxParamDto } from './dto/param.dto';

@Injectable()
export class CardsService {
  constructor(
    private readonly cardsRepository: CardsRepository,
    private readonly boxesService: BoxesService,
  ) {}

  createCard(data: CreateCardDto, userId: number) {
    const { tagIds, cardTypeId, ...rest } = data;

    return this.cardsRepository.create({
      ...rest,
      user: { connect: { id: userId } },
      card_type: { connect: { id: cardTypeId } },
      tags: {
        connect: tagIds.map((id) => {
          return { id };
        }),
      },
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

  async updateOneCard(id: number, userId: number, datas: UpdateCardDto) {
    const { tagIds, cardTypeId, ...rest } = datas;
    await this.findOneCard(id, userId);

    const updatedData: Prisma.CardUpdateInput = {
      ...rest,
      card_type: { connect: { id: cardTypeId } },
      tags: {
        set: [],
        connect: tagIds.map((tagId) => ({ id: tagId })),
      },
    };
    return this.cardsRepository.updateOne({ id }, updatedData);
  }

  async deleteOneCard(id: number, userId: number) {
    await this.findOneCard(id, userId);
    return this.cardsRepository.deleteOne({ id });
  }

  findAllFromUser(userId: number) {
    return this.cardsRepository.findMany({ user_id: userId });
  }

  private calculateFutureRevision(interval: number) {
    return Number(moment().tz('Asia/Tokyo').add(interval, 'days').format('x'));
  }

  private calculateLastRevision() {
    return Number(moment().format('x'));
  }

  private calculatePositionStep(currentStepBox: BoxStep, BoxSteps: BoxStep[]) {
    return BoxSteps.find((box) => currentStepBox.order + 1 === box.order);
  }

  private getCurrentBoxStep(currentStepBox: number, BoxSteps: BoxStep[]) {
    return BoxSteps.find((box) => box.id === currentStepBox);
  }

  private passedCard(boxId: number, futureBoxStep: BoxStep) {
    return {
      box: futureBoxStep ? { connect: { id: boxId } } : { disconnect: true },
      last_revision: this.calculateLastRevision(),
      boxStep: futureBoxStep
        ? { connect: { id: futureBoxStep.id } }
        : { disconnect: true },
      future_revision: futureBoxStep
        ? this.calculateFutureRevision(futureBoxStep.interval)
        : null,
    };
  }

  private failledCard(boxId: number, futureBoxStep: BoxStep) {
    return {
      box: { connect: { id: boxId } },
      last_revision: this.calculateLastRevision(),
      boxStep: { connect: { id: futureBoxStep.id } },
      future_revision: this.calculateFutureRevision(futureBoxStep.interval),
    };
  }

  async validateCard(
    cardId: number,
    userId: number,
    status: 'failled' | 'passed',
  ) {
    const card = await this.findOneCard(cardId, userId);

    if (!card.box_id) throw new BadRequestException();

    const box = await this.boxesService.getBoxWithBoxSteps(card.box_id, userId);
    const currentBoxStep = this.getCurrentBoxStep(
      card.box_step_id,
      box.box_steps,
    );
    const futureBoxStep = this.calculatePositionStep(
      currentBoxStep,
      box.box_steps,
    );

    let updatedData: Prisma.CardUpdateInput;

    switch (status) {
      case 'failled': {
        updatedData = this.failledCard(box.id, box.box_steps[0]);
        break;
      }
      case 'passed': {
        updatedData = this.passedCard(box.id, futureBoxStep);
        break;
      }
      default:
        throw new Error("Une erreur c'est produite");
    }

    return this.cardsRepository.updateOne(card, updatedData);
  }

  async StoreCardInBox(
    cardId: number,
    datas: StoreInBoxParamDto,
    userId: number,
  ) {
    const { boxId, boxStepId } = datas
    const card = await this.findOneCard(cardId, userId);
    const box = await this.boxesService.getBoxWithBoxSteps(boxId, userId);
    const currentBoxStep =
      this.getCurrentBoxStep(boxStepId, box.box_steps) || box.box_steps[0];

    const updatedData: Prisma.CardUpdateInput = {
      box: { connect: { id: box.id } },
      boxStep: { connect: { id: currentBoxStep.id } },
      future_revision: this.calculateFutureRevision(currentBoxStep.interval),
    };

    return this.cardsRepository.updateOne(card, updatedData);
  }

  listCardRevisions(userId: number) {
    const addOneDay = 1;
    const subtractOneDay = 1;
    return this.cardsRepository.findMany({
      AND: [
        {
          user_id: userId,
        },
        {
          future_revision: {
            lte: Number(
              moment().add(addOneDay, 'day').startOf('day').format('x'),
            ),
            gte: Number(
              moment()
                .subtract(subtractOneDay, 'days')
                .startOf('day')
                .format('x'),
            ),
          },
        },
      ],
    });
  }

  listCardLateRevisions(userId: number) {
    const subtractTwoDay = 2;
    return this.cardsRepository.findMany({
      AND: [
        {
          user_id: userId,
        },
        {
          future_revision: {
            lte: Number(
              moment()
                .subtract(subtractTwoDay, 'days')
                .startOf('day')
                .format('x'),
            ),
          },
        },
      ]
    })
  }

}


