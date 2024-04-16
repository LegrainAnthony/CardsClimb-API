import { Test, TestingModule } from '@nestjs/testing';
import { TagsService } from 'src/tags/tags.service';
import { PrismaService } from 'src/db/prisma.service';
import { AppModule } from 'src/app.module';
import { Prisma, Tag } from '@prisma/client';
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
    await prisma.clearDatabase();

    const userData: Prisma.UserCreateInput = {
      email: 'test@gmail.com',
      hashed_password: 'password',
      username: 'testuser',
    };

    const user = await prisma.user.create({
      data: userData,
    });
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
    tagCreated = await service.create(userId, colorId, testTags);

    expect(tagCreated.name).toBe(testTags.name);
    expect(tagCreated.color_id).toBe(colorId);
    expect(tagCreated.user_id).toBe(userId);
  });

  it('/tags (GET)', async () => {
    const tags = await service.findAll(userId);

    expect(tags).toBeInstanceOf(Array);
    expect(tags).toHaveLength(1);

    expect(tags[0].name).toBe(testTags.name);
    expect(tags[0].color_id).toBe(colorId);
    expect(tags[0].user_id).toBe(userId);
  });

  it('/tags/list (GET)', async () => {
    const tags = await service.findMany([tagCreated.id], userId);

    expect(tags).toBeInstanceOf(Array);
    expect(tags).toHaveLength(1);

    expect(tags[0].name).toBe(testTags.name);
    expect(tags[0].color_id).toBe(colorId);
    expect(tags[0].user_id).toBe(userId);
  });

  it('/tags/list (GET) with wrong id', async () => {
    const tags = await service.findMany([tagCreated.id - 1], userId);

    expect(tags).toBeInstanceOf(Array);
    expect(tags).toHaveLength(0);
  });

  it('/tags/1 (GET)', async () => {
    const tag = await service.findOne(tagCreated.id, userId);

    expect(tag.name).toBe(testTags.name);
    expect(tag.color_id).toBe(colorId);
    expect(tag.user_id).toBe(userId);
  });

  it('/tags/1 (PATCH)', async () => {
    const tag = await service.update(tagCreated.id, userId, null, {
      name: 'test2',
    });

    expect(tag.name).toBe('test2');
    expect(tag.color_id).toBe(colorId);
    expect(tag.user_id).toBe(userId);
  });

  it('/tags/1 (DELETE)', async () => {
    const tag = await service.delete(tagCreated.id, userId);

    expect(tag.name).toBe('test2');
    expect(tag.color_id).toBe(colorId);
    expect(tag.user_id).toBe(userId);

    await expect(service.findOne(tag.id, userId)).rejects.toThrow(
      new NotFoundException(),
    );
  });
});
