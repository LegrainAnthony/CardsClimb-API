import { Module } from '@nestjs/common';
import { BoxStepsService } from './box-steps.service';
import { BoxStepsController } from './box-steps.controller';
import { PrismaModule } from 'src/db/prisma.module';
import { BoxStepsRepository } from './box-steps.repository';
import { BoxesModule } from 'src/boxes/boxes.module';

@Module({
  imports: [PrismaModule, BoxesModule],
  providers: [BoxStepsService, BoxStepsRepository],
  controllers: [BoxStepsController],
})
export class BoxStepsModule {}
