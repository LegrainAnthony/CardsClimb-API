import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { BoxesService } from './boxes.service';
import { CreateBoxDto } from './dto/create-boxes.dto';
import { UpdateBoxDto } from './dto/update-boxes.dto';
import { prismaClientHandler } from 'src/common/interceptor/prisma-client-handler.interceptor';
import { UserId } from 'src/common/decorators/user-id.decorator';

@Controller('boxes')
@UseInterceptors(prismaClientHandler)
export class BoxesController {
  constructor(private readonly boxesService: BoxesService) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @UserId() userId: number) {
    return this.boxesService.findOneBox(id, userId);
  }

  @Post()
  create(@Body() box: CreateBoxDto, @UserId() userId: number) {
    return this.boxesService.createBox(box, userId);
  }

  @Patch(':id')
  updateBox(
    @Body() data: UpdateBoxDto,
    @Param('id', ParseIntPipe) id: number,
    @UserId() UserId: number,
  ) {
    return this.boxesService.updateBox(id, UserId, data);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @UserId() UserId: number) {
    return this.boxesService.deleteBox(id, UserId);
  }

  @Get()
  findAllBoxes(@UserId() UserId: number) {
    return this.boxesService.findAllBoxes(UserId);
  }
}
