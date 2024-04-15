import { Test, TestingModule } from '@nestjs/testing';
import { TagsService } from 'src/tags/tags.service';
import { PrismaService } from 'src/db/prisma.service';
import { AppModule } from 'src/app.module';
import { Prisma } from '@prisma/client';
import { CreateTagDto } from 'src/tags/dto/create-tag.dto';
import { NotFoundException } from '@nestjs/common';

describe('TagService', () => {
  let service: TagsService;
  let prisma: PrismaService;
  let userId: number;
  let testTags: CreateTagDto;

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

    testTags = {
      name: 'test',
      color_id: 1,
      user_id: userId,
    };

    await prisma.color.create({ data: { name: 'Violet', hex: '#A78BFA' } });
  });

  it('/tags (POST)', async () => {
    const tag = await service.create(testTags);

    expect(tag.name).toBe(testTags.name);
    expect(tag.color_id).toBe(testTags.color_id);
    expect(tag.user_id).toBe(testTags.user_id);
  });

  it('/tags (GET)', async () => {
    const tags = await service.findAll(userId);

    expect(tags).toBeInstanceOf(Array);
    expect(tags).toHaveLength(1);

    expect(tags[0].name).toBe(testTags.name);
    expect(tags[0].color_id).toBe(testTags.color_id);
    expect(tags[0].user_id).toBe(testTags.user_id);
  });

  it('/tags/1 (GET)', async () => {
    const tag = await service.findOne(1, userId);

    expect(tag.name).toBe(testTags.name);
    expect(tag.color_id).toBe(testTags.color_id);
    expect(tag.user_id).toBe(testTags.user_id);
  });

  it('/tags/1 (PATCH)', async () => {
    const tag = await service.update(1, { name: 'test2', user_id: userId });

    expect(tag.name).toBe('test2');
    expect(tag.color_id).toBe(testTags.color_id);
    expect(tag.user_id).toBe(testTags.user_id);
  });

  it('/tags/1 (DELETE)', async () => {
    const tag = await service.delete(1, userId);

    expect(tag.name).toBe('test2');
    expect(tag.color_id).toBe(testTags.color_id);
    expect(tag.user_id).toBe(testTags.user_id);

    await expect(service.findOne(tag.id, userId)).rejects.toThrow(
      new NotFoundException(),
    );
  });
});
