import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ActiveUser } from 'src/common/decorators';

// The @Controller() decorator takes a string argument that defines the route for the controller.
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // The ParseIntPipe pipe is used to transform the id parameter from a string to a number.
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @ActiveUser() userId: number) {
    return this.usersService.findOne(id, userId);
  }

  @Patch(':id')
  updateOne(
    @Body() datas: UpdateUserDto,
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() userId: number,
  ) {
    return this.usersService.updateOneUser(id, userId, datas);
  }
}
