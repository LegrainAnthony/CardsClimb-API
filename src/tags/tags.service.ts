import { Injectable } from '@nestjs/common';
import { TagRepository } from './tags.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class TagsService {
  constructor(private readonly tagRepository: TagRepository) {}

  findAll() {
    return this.tagRepository.findAll();
  }

  findOne(id: number) {
    return this.tagRepository.findOne({ id });
  }

  create(data: Prisma.TagCreateInput) {
    return this.tagRepository.create(data);
  }

  update(id: number, data: Prisma.TagUpdateInput) {
    return this.tagRepository.update({ id }, data);
  }

  delete(id: number) {
    return this.tagRepository.delete({ id });
  }
}
