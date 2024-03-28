import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { PrismaModule } from 'src/db/prisma.module';
import { TagRepository } from './tags.repository';

@Module({
  imports: [PrismaModule],
  providers: [TagsService, TagRepository],
  controllers: [TagsController]
})
export class TagsModule {}
