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
  UseInterceptors,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ActiveUser } from 'src/common/decorators';
import { Response } from 'express';
import { prismaClientHandler } from 'src/common/interceptor';

@Controller('tags')
@UseInterceptors(prismaClientHandler)
export class TagsController {
  constructor(private readonly tagService: TagsService) {}

  @Get()
  findAll(@ActiveUser() userId: number) {
    return this.tagService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @ActiveUser() userId: number) {
    return this.tagService.findOne(id, userId);
  }

  @Post()
  create(
    @ActiveUser() userId: number,
    @Query('colorId', ParseIntPipe) colorId: number,
    @Body() tag: CreateTagDto,
  ) {
    return this.tagService.create(userId, colorId, tag);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() userId: number,
    @Query('colorId', ParseIntPipe) colorId: number,
    @Body() tag: UpdateTagDto,
  ) {
    return this.tagService.update(id, userId, colorId, tag);
  }

  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() userId: number,
    @Res() response: Response,
  ) {
    await this.tagService.delete(id, userId);
    return response
      .status(HttpStatus.OK)
      .json({ status: HttpStatus.OK, message: 'Tag deleted successfully' });
  }
}
