import { Module } from '@nestjs/common';
import { BoxesService } from './boxes.service';
import { BoxesController } from './boxes.controller';
import { PrismaModule } from 'src/db/prisma.module';
import { BoxesRepository } from './boxes.repository';

@Module({
  imports: [PrismaModule],
  controllers: [BoxesController],
  providers: [BoxesService, BoxesRepository],
  exports: [BoxesService],
})
export class BoxesModule {}
