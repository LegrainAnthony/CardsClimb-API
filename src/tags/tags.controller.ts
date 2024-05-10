import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseArrayPipe,
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
import { ParamsDto } from './dto/params-tag.dto';

@Controller('tags')
@UseInterceptors(prismaClientHandler)
export class TagsController {
  constructor(private readonly tagService: TagsService) {}

  @Get()
  findAll(@ActiveUser() userId: number) {
    return this.tagService.findAll(userId);
  }

  @Get('list')
  findMany(
    @ActiveUser() userId: number,
    @Query('ids', new ParseArrayPipe({ separator: ',', items: Number }))
    ids: number[],
  ) {
    return this.tagService.findMany(ids, userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @ActiveUser() userId: number) {
    return this.tagService.findOne(id, userId);
  }

  @Post()
  create(@ActiveUser() userId: number, @Body() tag: CreateTagDto) {
    return this.tagService.create(userId, tag);
  }

  @Patch(':id')
  update(
    @Param() { id }: ParamsDto,
    @ActiveUser() userId: number,
    @Body() tag: UpdateTagDto,
  ) {
    return this.tagService.update(id, userId, tag);
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
