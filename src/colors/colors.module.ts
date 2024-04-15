import { Module } from '@nestjs/common';
import { ColorsService } from './colors.service';
import { ColorsController } from './colors.controller';
import { PrismaModule } from 'src/db/prisma.module';
import { ColorsRepository } from './colors.repository';

@Module({
  imports: [PrismaModule],
  providers: [ColorsService, ColorsRepository],
  controllers: [ColorsController],
})
export class ColorsModule {}
