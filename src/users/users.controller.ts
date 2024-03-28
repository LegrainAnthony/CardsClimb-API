import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

// The @Controller() decorator takes a string argument that defines the route for the controller.
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // The ParseIntPipe pipe is used to transform the id parameter from a string to a number.
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  // The DTO class is used to define the shape of the data that the client should send to the server.
  @Post()
  create(@Body() user: CreateUserDto) {
    return this.usersService.create(user);
  }
}
