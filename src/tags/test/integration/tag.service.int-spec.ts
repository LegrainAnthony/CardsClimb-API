import { Test, TestingModule } from '@nestjs/testing';
import { TagsService } from 'src/tags/tags.service';
import { PrismaService } from 'src/db/prisma.service';
import { AppModule } from 'src/app.module';

describe('TagService', () => {
  let service: TagsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    service = moduleFixture.get<TagsService>(TagsService);
  });

  it('/tags (GET)', () => {
    const testTags = [
      {
        id: 1,
        name: 'test',
        color_id: 1,
        user_id: 1,
      },
    ];
    prisma.tag.findMany = jest.fn().mockResolvedValue(testTags);
    void expect(service.findAll(1)).resolves.toEqual(testTags);
  });

  it('/tags/1 (GET)', () => {
    const testTags = {
      id: 1,
      name: 'test',
      color_id: 1,
      user_id: 1,
    };
    prisma.tag.findUnique = jest.fn().mockResolvedValue(testTags);
    void expect(service.findOne(1, 1)).resolves.toEqual(testTags);
  });

  it('/tags (Post)', () => {
    const testTags = {
      id: 1,
      name: 'test',
      color_id: 1,
      user_id: 1,
    };
    prisma.tag.create = jest.fn().mockResolvedValue(testTags);
    void expect(
      service.create({ name: 'test', color_id: 1, user_id: 1 }),
    ).resolves.toEqual(testTags);
  });

  it('/tags/1 (Put)', () => {
    const testTags = {
      id: 1,
      name: 'test',
      color_id: 1,
      user_id: 1,
    };
    prisma.tag.findUnique = jest.fn().mockResolvedValue(testTags);
    prisma.tag.update = jest.fn().mockResolvedValue(testTags);
    void expect(service.findOne(1, 1)).resolves.toEqual(testTags);
    void expect(
      service.update(1, { name: 'test', user_id: 1 }),
    ).resolves.toEqual(testTags);
  });

  it('/tags/1 (delete)', () => {
    const testTags = {
      id: 1,
      name: 'test',
      color_id: 1,
      user_id: 1,
    };
    prisma.tag.findUnique = jest.fn().mockResolvedValue(testTags);
    prisma.tag.delete = jest.fn().mockResolvedValue(testTags);
    void expect(service.findOne(1, 1)).resolves.toEqual(testTags);
    void expect(service.delete(1, 1)).resolves.toEqual(testTags);
  });
});
