import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
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
}
