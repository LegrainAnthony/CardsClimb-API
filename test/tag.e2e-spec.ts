import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../src/db/prisma.module';
import { TagsModule } from '../src/tags/tags.module';
import { TagsService } from '../src/tags/tags.service';
import { TagRepository } from '../src/tags/tags.repository';
import { PrismaService } from '../src/db/prisma.service';

describe('TagController (e2e)', () => {
  let service: TagsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, TagsModule],
      providers: [TagsService, TagRepository],
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
      },
    ];
    prisma.tag.findMany = jest.fn().mockResolvedValue(testTags);
    expect(service.findAll()).resolves.toEqual(testTags);
  });

  it('/tags/1 (GET)', () => {
    const testTags = {
      id: 1,
      name: 'test',
      color_id: 1,
    };
    prisma.tag.findUnique = jest.fn().mockResolvedValue(testTags);
    expect(service.findOne(1)).resolves.toEqual(testTags);
  });

  it('/tags/1 (Post)', () => {
    const testTags = {
      id: 1,
      name: 'test',
      color_id: 1,
    };
    prisma.tag.create = jest.fn().mockResolvedValue(testTags);
    expect(service.create({ name: 'test', color_id: 1 })).resolves.toEqual(
      testTags,
    );
  });

  it('/tags/1 (Put)', () => {
    const testTags = {
      id: 1,
      name: 'test',
      color_id: 1,
    };
    prisma.tag.update = jest.fn().mockResolvedValue(testTags);
    expect(service.update(1, { name: 'test' })).resolves.toEqual(testTags);
  });

  it('/tags/1 (delete)', () => {
    const testTags = {
      id: 1,
      name: 'test',
      color_id: 1,
    };
    prisma.tag.delete = jest.fn().mockResolvedValue(testTags);
    expect(service.delete(1)).resolves.toEqual(testTags);
  });
});
