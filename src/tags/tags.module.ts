import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { PrismaModule } from '../db/prisma.module';
import { TagsRepository } from './tags.repository';

@Module({
  imports: [PrismaModule],
  providers: [TagsService, TagsRepository],
  controllers: [TagsController],
})
export class TagsModule {}
