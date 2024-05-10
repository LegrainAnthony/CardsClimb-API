import { Module, forwardRef } from '@nestjs/common';
import { FilterService } from './filter.service';
import { FilterRepository } from './filter.repository';
import { FilterController } from './filter.controller';
import { PrismaModule } from 'src/db/prisma.module';
import { CardsModule } from 'src/cards/cards.module';

@Module({
  imports: [PrismaModule, forwardRef(() => CardsModule)],
  controllers: [FilterController],
  providers: [FilterService, FilterRepository],
  exports: [FilterService],
})
export class FilterModule {}
