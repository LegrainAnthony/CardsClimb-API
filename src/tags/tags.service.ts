import { UpdateTagDto } from './dto/update-tag.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TagsRepository } from './tags.repository';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(private readonly tagRepository: TagsRepository) {}

  findAll(userId: number) {
    return this.tagRepository.findAll(userId);
  }

  async findOne(id: number, userId: number) {
    const tag = await this.tagRepository.findOne({ id, user_id: userId });
    if (tag === null) {
      throw new NotFoundException();
    }
    return tag;
  }

  create(data: CreateTagDto) {
    return this.tagRepository.create({
      ...(dataToSend(data) as CreateTagDto),
      color: {
        connect: {
          id: data.color_id,
        },
      },
      user: {
        connect: {
          id: data.user_id,
        },
      },
    });
  }

  async update(id: number, data: UpdateTagDto) {
    try {
      const tag = await this.findOne(id, data.user_id);
      return this.tagRepository.update(
        { id },
        {
          ...(dataToSend(data) as UpdateTagDto),
          color: {
            connect: {
              id: data.color_id || tag.color_id,
            },
          },
          user: {
            connect: {
              id: tag.user_id,
            },
          },
        },
      );
    } catch (e) {
      throw e;
    }
  }

  async delete(id: number, userId: number) {
    try {
      await this.findOne(id, userId);
      return this.tagRepository.delete({ id });
    } catch (e) {
      throw e;
    }
  }
}

/**
 * Map un objet pour qu'il corresponde au format demandé par Prisma pour les Tags
 * @param data Objet à mapper
 * @returns
 */
function dataToSend(data: object) {
  return Object.keys(data)
    .filter((key) => key !== 'color_id' && key !== 'user_id')
    .reduce((obj, key) => {
      obj[key] = data[key];
      return obj;
    }, {});
}
