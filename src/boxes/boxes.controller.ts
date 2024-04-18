import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { BoxesService } from './boxes.service';
import { CreateBoxDto } from './dto/create-boxes.dto';
import { UpdateBoxDto } from './dto/update-boxes.dto';
import { prismaClientHandler } from 'src/common/interceptor/prisma-client-handler.interceptor';
import { ActiveUser } from 'src/common/decorators/user-id.decorator';

@Controller('boxes')
@UseInterceptors(prismaClientHandler)
export class BoxesController {
  constructor(private readonly boxesService: BoxesService) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @ActiveUser() userId: number) {
    return this.boxesService.findOneBox(id, userId);
  }

  @Post()
  create(@Body() box: CreateBoxDto, @ActiveUser() userId: number) {
    return this.boxesService.createBox(box, userId);
  }

  @Patch(':id')
  updateBox(
    @Body() data: UpdateBoxDto,
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() UserId: number,
  ) {
    return this.boxesService.updateBox(id, UserId, data);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @ActiveUser() UserId: number) {
    return this.boxesService.deleteBox(id, UserId);
  }

  @Get()
  findAllBoxes(@ActiveUser() UserId: number) {
    return this.boxesService.findAllBoxes(UserId);
  }

  @Get('/boxsteps/:id')
  getBoxWithBoxSteps(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() UserId: number,
  ) {
    return this.boxesService.getBoxWithBoxSteps(id, UserId);
  }
}
