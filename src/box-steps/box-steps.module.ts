import { Module } from '@nestjs/common';
import { BoxStepsService } from './box-steps.service';
import { BoxStepsController } from './box-steps.controller';

@Module({
  providers: [BoxStepsService],
  controllers: [BoxStepsController],
})
export class BoxStepsModule {}
