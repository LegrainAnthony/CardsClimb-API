import { UpdateTagDto } from './dto/update-tag.dto';
import { Injectable } from '@nestjs/common';
import { TagRepository } from './tags.repository';
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
      ...(dataToSend(data) as CreateTagDto),
      color: {
        connect: {
          id: data.color_id,
        },
      },
    });
  }

  update(id: number, data: UpdateTagDto) {
    return this.tagRepository.update(
      { id },
      {
        ...(dataToSend(data) as UpdateTagDto),
        color: {
          connect: {
            id: data.color_id,
          },
        },
      },
    );
  }

  delete(id: number) {
    return this.tagRepository.delete({ id });
  }
}

/**
 * Map un objet pour qu'il corresponde au format demandé par Prisma pour les Tags
 * @param data Objet à mapper
 * @returns
 */
function dataToSend(data: Object) {
  return Object.keys(data)
    .filter((key) => key != 'color_id')
    .reduce((obj, key) => {
      obj[key] = data[key];
      return obj;
    }, {});
}
