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
  let colorId: number;
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
    colorId = color.id;
    testTags = {
      name: 'test',
    };
  });

  it('/tags (POST)', async () => {
    const tag = await service.create(userId, colorId, testTags);
    tagCreated = { ...tag, color_id: tag.color.id, user_id: null };

    expect(tagCreated.name).toBe(testTags.name);
    expect(tagCreated.color_id).toBe(colorId);
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
    expect(tag.color.id).toBe(colorId);
  });

  it('/tags/1 (PATCH)', async () => {
    const tag = await service.update(tagCreated.id, userId, null, {
      name: 'test2',
    });

    expect(tag.name).toBe('test2');
    expect(tag.color.id).toBe(colorId);
  });

  it('/tags/1 (DELETE)', async () => {
    const tag = await service.delete(tagCreated.id, userId);

    expect(tag.name).toBe('test2');
    expect(tag.color.id).toBe(colorId);

    await expect(service.findOne(tag.id, userId)).rejects.toThrow(
      new NotFoundException(),
    );
  });
});
