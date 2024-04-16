import { Injectable, NotFoundException } from '@nestjs/common';
import { ColorsRepository } from './colors.repository';

@Injectable()
export class ColorsService {
  constructor(private readonly colorsRepository: ColorsRepository) {}

  findAll() {
    return this.colorsRepository.findAll();
  }

  async findOne(id: number) {
    const color = await this.colorsRepository.findOne({ id });
    if (color === null) {
      throw new NotFoundException();
    }
    return color;
  }
}
