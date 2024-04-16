import { UpdateTagDto } from './dto/update-tag.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TagsRepository } from './tags.repository';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(private readonly tagRepository: TagsRepository) {}

  findAll(userId: number) {
    return this.tagRepository.findAll(userId);
  }

  async findMany(ids: number[], userId: number) {
    const tags = await this.tagRepository.findMany(ids, userId);
    if (tags.includes(null)) {
      throw new BadRequestException();
    }
    return tags;
  }

  async findOne(id: number, userId: number) {
    const tag = await this.tagRepository.findOne({ id, user_id: userId });
    if (tag === null) {
      throw new NotFoundException();
    }
    return tag;
  }

  create(userId: number, colorId: number, data: CreateTagDto) {
    return this.tagRepository.create({
      ...data,
      color: {
        connect: {
          id: colorId,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
    });
  }

  async update(
    id: number,
    userId: number,
    colorId: number,
    data: UpdateTagDto,
  ) {
    try {
      const tag = await this.findOne(id, userId);
      return this.tagRepository.update(
        { id },
        {
          ...data,
          color: {
            connect: {
              id: colorId || tag.color.id,
            },
          },
          user: {
            connect: {
              id: userId,
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
