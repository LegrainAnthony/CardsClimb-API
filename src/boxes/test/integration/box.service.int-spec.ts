import { Test, TestingModule } from '@nestjs/testing';
import { BoxesService } from 'src/boxes/boxes.service';
import { PrismaService } from 'src/db/prisma.service';
import { AppModule } from 'src/app.module';
import { CreateBoxDto } from 'src/boxes/dto/create-boxes.dto';
import { UpdateBoxDto } from 'src/boxes/dto/update-boxes.dto';
import { randomUUID } from 'crypto';

describe('BoxService', () => {
  let service: BoxesService;
  let prisma: PrismaService;
  let userId: number;
  let boxId: number;
  let expectedBoxesCount: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    service = moduleFixture.get<BoxesService>(BoxesService);

    // Création d'un utilisateur pour les tests
    const user = await prisma.user.create({
      data: {
        email: `test-${randomUUID()}@gmail.com`,
        hashed_password: 'password',
        username: 'testuser',
      },
    });
    userId = user.id;
    expectedBoxesCount = 0;

    const testBox: CreateBoxDto = {
      name: 'test',
    };
    const box = await service.createBox(testBox, userId);
    boxId = box.id;
    expectedBoxesCount++;
  });

  it('/boxes (POST)', async () => {
    const createBoxDto: CreateBoxDto = {
      name: 'Another Test Box',
    };

    const box = await service.createBox(createBoxDto, userId);
    expectedBoxesCount++;

    expect(box.name).toBe(createBoxDto.name);
    expect(box.user_id).toBe(userId);
  });

  it('/boxes (GET)', async () => {
    const boxes = await service.findAllBoxes(userId);

    expect(boxes).toBeInstanceOf(Array);
    expect(boxes).toHaveLength(expectedBoxesCount);
    expect(boxes[0].name).toBe('test');
    expect(boxes[0].user_id).toBe(userId);
  });

  it('/boxes/{boxId} (GET)', async () => {
    const box = await service.findOneBox(boxId, userId);

    expect(box.name).toBe('test');
    expect(box.user_id).toBe(userId);
  });

  it('/boxes/{boxId} (PUT)', async () => {
    const updateBoxDto: UpdateBoxDto = { name: 'Updated Box' };
    const updatedBox = await service.updateBox(boxId, userId, updateBoxDto);

    expect(updatedBox.name).toBe(updateBoxDto.name);
  });

  it('/boxes/{boxId} (DELETE)', async () => {
    await service.deleteBox(boxId, userId);
    expectedBoxesCount--;
    await expect(service.findOneBox(boxId, userId)).rejects.toThrow();
  });
});
