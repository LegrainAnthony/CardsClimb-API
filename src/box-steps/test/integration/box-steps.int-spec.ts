import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Box, BoxStep, User } from '@prisma/client';
import { AppModule } from 'src/app.module';
import { BoxStepsService } from 'src/box-steps/box-steps.service';
import { CreateBoxStepsDto } from 'src/box-steps/dto/create-box-steps.dto';
import { UpdateBoxStepsDto } from 'src/box-steps/dto/update-box-steps.dto';
import { PrismaService } from 'src/db/prisma.service';
import { BoxesService } from 'src/boxes/boxes.service';

describe('BoxStepsService', () => {
  let prisma: PrismaService;
  let boxStepsService: BoxStepsService;
  let boxService: BoxesService
  let user
  let box: Box;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleRef.get<PrismaService>(PrismaService);
    boxStepsService = moduleRef.get<BoxStepsService>(BoxStepsService);
    boxService = moduleRef.get<BoxesService>(BoxesService);
     user = await prisma.user.findUnique({ where: { id: 1 } });

    box = await boxService.findOneBox(1, user ? user.id : 1);
  });

  describe('createBoxStep', () => {
    let createdBoxStep: BoxStep;
    const createBoxData: CreateBoxStepsDto = {
      interval: 10,
      boxId: 1,
    };

    it('should create a box step', async () => {
      createdBoxStep = await boxStepsService.createBoxStep(
        createBoxData,
        user.id,
      );
      expect(createdBoxStep).toBeDefined();
      expect(createdBoxStep.interval).toBe(createBoxData.interval);
    });

    it('should retrieve a box step', async () => {
      const foundBoxStep = await boxStepsService.findOneBoxStep(
        createdBoxStep.id,
        box.id,
        user.id,
      );
      expect(foundBoxStep).toBeDefined();
      expect(foundBoxStep.id).toBe(createdBoxStep.id);
    });

    it('should retrieve multiple box steps by IDs', async () => {
      const foundBoxSteps = await boxStepsService.findManyByIds([
        createdBoxStep.id,
      ]);
      expect(foundBoxSteps).toContainEqual(createdBoxStep);
    });

    it('should update the order of box steps', async () => {
      const updatedBoxSteps = await boxStepsService.updateOrderBoxSteps(
        [createdBoxStep.id],
        box.id,
        user.id,
      );
      expect(updatedBoxSteps.length).toBeGreaterThan(0);
    });

    it('should update a box step', async () => {
      const updateIntervalBoxStepDto: UpdateBoxStepsDto = {
        interval: 15,
        ids: [1],
      };
      const updatedIntervalBoxStep =
        await boxStepsService.updateIntervalBoxStep(
          createdBoxStep.id,
          updateIntervalBoxStepDto,
          box.id,
          user.id,
        );
      expect(updatedIntervalBoxStep).toBeDefined();
      expect(updatedIntervalBoxStep.interval).toBe(
        updatedIntervalBoxStep.interval,
      );
    });

    it('should delete a box step', async () => {
      await boxStepsService.deleteOneBoxStepAndSetNewOrder(
        createdBoxStep.id,
        box.id,
        user.id,
      );
      await expect(
        boxStepsService.findOneBoxWithBoxStep(
          createdBoxStep.id,
          box.id,
          user.id,
        ),
      ).rejects.toThrow(new BadRequestException('BoxStep not found'));
    });
  });
});
