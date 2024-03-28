import { Injectable } from '@nestjs/common';
import { BoxRepository } from './boxes.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class BoxesService {
  constructor(private readonly boxRepository: BoxRepository) {}

  create(data: Prisma.BoxCreateInput) {
    return this.boxRepository.create(data);
  }

  findOne(id: number) {
    return this.boxRepository.findOne({ id });
  }

  findAll() {
    return this.boxRepository.findAll({});
  }

  update(id: number, data: Prisma.BoxUpdateInput) {
    return this.boxRepository.update({ id }, data);
  }

  delete(id: number) {
    return this.boxRepository.delete({ id });
  }
}
