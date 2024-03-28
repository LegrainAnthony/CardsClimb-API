import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagService: TagsService) {}

  @Get()
  findAll() {
    return this.tagService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.findOne(id);
  }

  @Post()
  create(@Body() tag: CreateTagDto) {
    return this.tagService.create(tag);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() tag: UpdateTagDto) {
    return this.tagService.update(id, tag);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.delete(id);
  }
}
