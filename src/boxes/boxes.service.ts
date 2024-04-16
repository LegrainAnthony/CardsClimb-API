import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { BoxesRepository } from './boxes.repository';
import { CreateBoxDto } from './dto/create-boxes.dto';
import { UpdateBoxDto } from './dto/update-boxes.dto';

@Injectable()
export class BoxesService {
  constructor(private readonly boxRepository: BoxesRepository) {}

  createBox(data: CreateBoxDto, userId: number) {
    return this.boxRepository.create({
      ...data,
      user: { connect: { id: userId } },
    });
  }

  async findOneBox(id: number, userId: number) {
    const box = await this.boxRepository.findOne({ id });

    if (!box) {
      throw new BadRequestException();
    }
    if (box.user_id !== userId) {
      throw new ForbiddenException();
    }
    return box;
  }

  async updateBox(id: number, userId: number, data: UpdateBoxDto) {
    try {
      await this.findOneBox(id, userId);

      return this.boxRepository.updateOne({ id }, { name: data.name });
    } catch (err) {
      throw err;
    }
  }

  async deleteBox(id: number, userId: number) {
    try {
      await this.findOneBox(id, userId);
      return this.boxRepository.deleteOne({ id });
    } catch (err) {
      throw err;
    }
  }

  async findAllBoxes(userId: number) {
    return this.boxRepository.findAllBoxes({
      user_id: userId,
    });
  }
}
