import { Injectable } from '@nestjs/common';
import { TagRepository } from './tags.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class TagsService {
  constructor(private readonly tagRepository: TagRepository) {}

  findAll() {
    return this.tagRepository.findAll();
  }

  create(data: Prisma.TagCreateInput) {
    return this.tagRepository.create(data);
  }
}
