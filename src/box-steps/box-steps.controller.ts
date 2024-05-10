import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  Query,
  ParseArrayPipe,
} from '@nestjs/common';
import { BoxStepsService } from './box-steps.service';
import { CreateBoxStepsDto } from './dto/create-box-steps.dto';
import { UpdateBoxStepsDto } from './dto/update-box-steps.dto';
import { ActiveUser } from 'src/common/decorators';
import { PatchBoxStepsDto } from './dto/patch-box-steps.dto';

@Controller('boxstep')
export class BoxStepsController {
  constructor(private readonly boxStepService: BoxStepsService) {}

  @Post()
  create(@Body() datas: CreateBoxStepsDto, @ActiveUser() userId: number) {
    return this.boxStepService.createBoxStep(datas, userId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('boxId', ParseIntPipe) boxId: number,
    @ActiveUser() userId: number,
  ) {
    return this.boxStepService.findOneBoxStep(id, boxId, userId);
  }

  @Get('listByIds')
  async findManyByIds(
    @Query('ids', new ParseArrayPipe({ separator: ',', items: Number }))
    ids: number[],
  ) {
    await this.boxStepService.findManyByIds(ids);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() datas: UpdateBoxStepsDto,
    @Query('boxId', ParseIntPipe) boxId: number,
    @ActiveUser() userId: number,
  ) {
    return this.boxStepService.updateIntervalBoxStep(id, datas, boxId, userId);
  }

  @Patch(':boxId/order')
  async updateOrderBoxSteps(
    @Body() listIds: PatchBoxStepsDto,
    @Param('boxId', ParseIntPipe) boxId: number,
    @ActiveUser('userId', ParseIntPipe) userId: number,
  ) {
    await this.boxStepService.updateOrderBoxSteps(listIds.ids, boxId, userId);
  }

  @Delete(':id')
  deleteOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('boxId', ParseIntPipe) boxId: number,
    @ActiveUser() userId: number,
  ) {
    return this.boxStepService.deleteOneBoxStepAndSetNewOrder(
      id,
      boxId,
      userId,
    );
  }
}
