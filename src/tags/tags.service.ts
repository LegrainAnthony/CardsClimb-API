import { UpdateTagDto } from './dto/update-tag.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TagsRepository } from './tags.repository';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(private readonly tagRepository: TagsRepository) {}

  findAll(userId: number) {
    return this.tagRepository.findAllTags(userId);
  }

  findMany(ids: number[], userId: number) {
    return this.tagRepository.findManyTags(ids, userId);
  }

  async findOne(id: number, userId: number) {
    const tag = await this.tagRepository.findOneTag(id, userId);
    if (!tag) {
      throw new NotFoundException();
    }
    return tag;
  }

  create(userId: number, tag: CreateTagDto) {
    const { colorId, ...rest } = tag;
    return this.tagRepository.createTag(rest, userId, colorId);
  }

  async update(id: number, userId: number, tag: UpdateTagDto) {
    const findTag = await this.findOne(id, userId);
    return this.tagRepository.updateOneTag(
      id,
      tag,
      userId,
      tag.colorId || findTag.color.id,
    );
  }

  async delete(id: number, userId: number) {
    await this.findOne(id, userId);
    return this.tagRepository.deleteOneTag(id);
  }
}
