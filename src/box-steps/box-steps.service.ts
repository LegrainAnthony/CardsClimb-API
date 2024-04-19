import { Injectable, NotFoundException } from '@nestjs/common';
import { BoxStepsRepository } from './box-steps.repository';
import { CreateBoxStepsDto } from './dto/create-box-steps.dto';
import { UpdateIntervalBoxStepsDto } from './dto/update-box-steps.dto';
import { BoxesService } from 'src/boxes/boxes.service';
import { BoxStep } from '@prisma/client';

@Injectable()
export class BoxStepsService {
  constructor(
    private readonly boxStepRepository: BoxStepsRepository,
    private readonly boxesService: BoxesService,
  ) {}

  async createBoxStep(datas: CreateBoxStepsDto, userId: number) {
    const { boxId, interval } = datas;
    const box = await this.boxesService.findOneBox(boxId, userId);
    const boxSteps = await this.findAllBoxSteps(box.id);
    const order = boxSteps.length + 1;
    const CreateData = {
      boxId: box.id,
      interval,
    };

    return this.boxStepRepository.createBoxStep(CreateData, order);
  }

  async findOneBoxWithBoxStep(id: number, boxId: number, userId: number) {
    const box = await this.boxesService.findOneBox(boxId, userId);
    const boxStep = await this.boxStepRepository.findOneBoxStep({
      id,
      box_id: box.id,
    });

    if (!boxStep) {
      throw new NotFoundException('BoxStep not found');
    }

    return { box, boxStep };
  }

  async findOneBoxStep(id: number, boxId: number, userId: number) {
    return (await this.findOneBoxWithBoxStep(id, boxId, userId)).boxStep;
  }

  async findManyBoxSteps(ids: number[], userId: number) {
    const boxSteps = await this.boxStepRepository.findManyBoxSteps(ids, userId);
    return boxSteps;
  }

  async findManyByIds(ids: number[]) {
    return this.boxStepRepository.findManyBoxStepsByIds(ids);
  }

  async updateIntervalBoxStep(
    id: number,
    data: UpdateIntervalBoxStepsDto,
    boxId: number,
    userId: number,
  ) {
    await this.findOneBoxWithBoxStep(id, boxId, userId);
    const updatedData = {
      interval: data.interval,
    };
    return this.boxStepRepository.updateOneBoxStep({ id }, updatedData);
  }

  private convertBoxStepsToIds(boxSteps: BoxStep[]) {
    return boxSteps.map((step) => step.id);
  }

  private setNewOrderBoxSteps(boxStepIds: number[]) {
    return boxStepIds.map((id, index) => {
      return {
        id,
        order: index + 1,
      };
    });
  }

  findAllBoxSteps(boxId: number) {
    return this.boxStepRepository.findAllBoxStepsForBox({ box_id: boxId });
  }

  async updateOrderBoxSteps(ids: number[], boxId: number, userId: number) {
    const box = await this.boxesService.findOneBox(boxId, userId);
    const existingBoxSteps = await this.findAllBoxSteps(box.id);
    const existingId = this.convertBoxStepsToIds(existingBoxSteps);
    const commonIds = ids.filter((id) => existingId.includes(id));
    const modifiedId = [...new Set([...commonIds, ...existingId])];
    const newOrderArray = this.setNewOrderBoxSteps(modifiedId);

    return this.boxStepRepository.updateOrderOfBoxSteps(newOrderArray);
  }

  private async deleteOneBoxStep(id: number) {
    await this.boxStepRepository.deleteOneBoxStep({ id });
  }

  async deleteOneBoxStepAndSetNewOrder(
    id: number,
    boxId: number,
    userId: number,
  ) {
    const { box, boxStep } = await this.findOneBoxWithBoxStep(
      id,
      boxId,
      userId,
    );
    await this.deleteOneBoxStep(boxStep.id);
    const existingBoxSteps = await this.findAllBoxSteps(box.id);
    const existingId = this.convertBoxStepsToIds(existingBoxSteps);
    const newOrderArray = this.setNewOrderBoxSteps(existingId);

    return this.boxStepRepository.updateOrderOfBoxSteps(newOrderArray);
  }
}
