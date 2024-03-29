import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Response } from 'express';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagService: TagsService) {}

  @Get()
  findAll(@Query('userId', ParseIntPipe) userId: number) {
    return this.tagService.findAll(userId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('userId', ParseIntPipe) userId: number,
  ) {
    return this.tagService.findOne(id, userId);
  }

  @Post()
  create(@Body() tag: CreateTagDto) {
    return this.tagService.create(tag);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() tag: UpdateTagDto) {
    return this.tagService.update(id, tag);
  }

  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Query('userId', ParseIntPipe) userId: number,
    @Res() response: Response,
  ) {
    await this.tagService.delete(id, userId);
    return response
      .status(HttpStatus.OK)
      .json({ status: HttpStatus.OK, message: 'Tag deleted successfully' });
  }
}
