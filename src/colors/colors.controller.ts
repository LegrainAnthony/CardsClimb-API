import { Public } from 'src/common/decorators/public.decorator';
import { ColorsService } from './colors.service';
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

@Public()
@Controller('colors')
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @Get()
  findAll() {
    return this.colorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.colorsService.findOne(id);
  }
}
