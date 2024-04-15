import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ColorsService } from 'src/colors/colors.service';
import { PrismaService } from 'src/db/prisma.service';
import { AppModule } from 'src/app.module';

describe('TagService', () => {
  let service: ColorsService;
  let prisma: PrismaService;
  const testColor = { name: 'Violet', hex: '#A78BFA' };
  let colorId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    service = moduleFixture.get<ColorsService>(ColorsService);
    await prisma.clearDatabase();

    const color = await prisma.color.create({ data: testColor });
    colorId = color.id;
  });

  it('/colors (GET)', async () => {
    const colors = await service.findAll();

    expect(colors).toBeInstanceOf(Array);
    expect(colors).toHaveLength(1);

    expect(colors[0].name).toBe(testColor.name);
    expect(colors[0].hex).toBe(testColor.hex);
  });

  it('/colors/:colorId (GET)', async () => {
    const color = await service.findOne(colorId);

    expect(color.name).toBe(testColor.name);
    expect(color.hex).toBe(testColor.hex);
  });

  it('/colors/0 (GET)', async () => {
    const action = async () => {
      await service.findOne(0);
    };
    await expect(action()).rejects.toThrow(new NotFoundException());
  });
});
