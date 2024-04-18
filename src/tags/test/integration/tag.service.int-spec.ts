import { Test, TestingModule } from '@nestjs/testing';
import { TagsService } from 'src/tags/tags.service';
import { PrismaService } from 'src/db/prisma.service';
import { AppModule } from 'src/app.module';
import { Tag } from '@prisma/client';
import { CreateTagDto } from 'src/tags/dto/create-tag.dto';
import { NotFoundException } from '@nestjs/common';

describe('TagService', () => {
  let service: TagsService;
  let prisma: PrismaService;
  let userId: number;
  let testTags: CreateTagDto;
  let tagCreated: Tag;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    service = moduleFixture.get<TagsService>(TagsService);

    const user = await prisma.user.findUnique({ where: { id: 1 } });

    userId = user.id;

    const color = await prisma.color.create({
      data: { name: 'Violet', hex: '#A78BFA' },
    });

    testTags = {
      name: 'test',
      color_id: color.id,
      user_id: userId,
    };
  });

  it('/tags (POST)', async () => {
    tagCreated = await service.create(testTags);

    expect(tagCreated.name).toBe(testTags.name);
    expect(tagCreated.color_id).toBe(testTags.color_id);
    expect(tagCreated.user_id).toBe(testTags.user_id);
  });

  it('/tags (GET)', async () => {
    const tags = await service.findAll(userId);

    expect(tags).toBeInstanceOf(Array);

    expect(tags[0].name).toBeDefined();
    expect(tags[0].color_id).toBeDefined();
    expect(tags[0].user_id).toBeDefined();
  });

  it('/tags/1 (GET)', async () => {
    const tag = await service.findOne(tagCreated.id, userId);

    expect(tag.name).toBe(testTags.name);
    expect(tag.color_id).toBe(testTags.color_id);
    expect(tag.user_id).toBe(testTags.user_id);
  });

  it('/tags/1 (PATCH)', async () => {
    const tag = await service.update(tagCreated.id, {
      name: 'test2',
      user_id: userId,
    });

    expect(tag.name).toBe('test2');
    expect(tag.color_id).toBe(testTags.color_id);
    expect(tag.user_id).toBe(testTags.user_id);
  });

  it('/tags/1 (DELETE)', async () => {
    const tag = await service.delete(tagCreated.id, userId);

    expect(tag.name).toBe('test2');
    expect(tag.color_id).toBe(testTags.color_id);
    expect(tag.user_id).toBe(testTags.user_id);

    await expect(service.findOne(tag.id, userId)).rejects.toThrow(
      new NotFoundException(),
    );
  });
});
