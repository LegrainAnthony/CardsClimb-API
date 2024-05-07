import { Module, forwardRef } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { PrismaModule } from 'src/db/prisma.module';
import { CardsRepository } from './cards.repository';
import { UsersRepository } from 'src/users/users.repository';
import { BoxesModule } from 'src/boxes/boxes.module';
import { FilterModule } from 'src/filter/filter.module';

@Module({
  imports: [PrismaModule, BoxesModule, forwardRef(() => FilterModule)],
  providers: [CardsService, CardsRepository, UsersRepository],
  controllers: [CardsController],
  exports: [CardsService],
})
export class CardsModule {}
