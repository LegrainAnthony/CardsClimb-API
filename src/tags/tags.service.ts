import { Injectable } from '@nestjs/common';
import { TagRepository } from './tags.repository';
import { Prisma } from '@prisma/client';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(private readonly tagRepository: TagRepository) {}

  findAll() {
    return this.tagRepository.findAll();
  }

  findOne(id: number) {
    return this.tagRepository.findOne({ id });
  }

  create(data: CreateTagDto) {
    return this.tagRepository.create({
      name: data.name,
      color: {
        connect: {
          id: data.color_id,
        },
      },
    });
  }

  update(id: number, data: Prisma.TagUpdateInput) {
    return this.tagRepository.update({ id }, data);
  }

  delete(id: number) {
    return this.tagRepository.delete({ id });
  }
}
