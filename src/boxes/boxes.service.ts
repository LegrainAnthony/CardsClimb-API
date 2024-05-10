import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BoxesRepository } from './boxes.repository';
import { CreateBoxDto } from './dto/create-boxes.dto';
import { UpdateBoxDto } from './dto/update-boxes.dto';

@Injectable()
export class BoxesService {
  constructor(private readonly boxRepository: BoxesRepository) {}

  createBox(data: CreateBoxDto, userId: number) {
    return this.boxRepository.create(data, userId);
  }

  async findOneBox(id: number, userId: number) {
    const box = await this.boxRepository.findOne(id);

    if (!box) {
      throw new NotFoundException();
    }
    if (box.user_id !== userId) {
      throw new ForbiddenException();
    }
    return box;
  }

  async updateBox(id: number, userId: number, data: UpdateBoxDto) {
    await this.findOneBox(id, userId);

    return this.boxRepository.updateOne(id, data);
  }

  async deleteBox(id: number, userId: number) {
    await this.findOneBox(id, userId);
    return this.boxRepository.deleteOne(id);
  }

  async findAllBoxes(userId: number) {
    return this.boxRepository.findAllUserBoxes(userId);
  }

  // TODO à revoir en optimisant en mettant le get des steps sur boxstep et limité le nombre de fois ou on appel la box
  async getBoxWithBoxSteps(boxId: number, userId: number) {
    const box = await this.findOneBox(boxId, userId);
    const boxWithSteps = await this.boxRepository.getBoxWithBoxSteps(box.id);
    if (!boxWithSteps) {
      throw new NotFoundException('Box with step not found');
    }
    return boxWithSteps;
  }
}
