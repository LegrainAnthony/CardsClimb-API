import { Module } from '@nestjs/common';
import { FilterService } from './filter.service';
import { FilterRepository } from './filter.repository';
import { FilterController } from './filter.controller';
import { PrismaModule } from 'src/db/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FilterController],
  providers: [FilterService, FilterRepository],
  exports: [FilterService],
})
export class FilterModule {}
