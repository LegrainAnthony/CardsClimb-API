import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  async findOne(id: number, userId: number) {
    const user = await this.userRepository.findOneById(id);

    if (!user) {
      throw new NotFoundException();
    }

    if (user.id !== userId) {
      throw new ForbiddenException('You do not have permission to access this user');
    }

    return user;
  }

  async updateOneUser(id: number, userId: number, user: UpdateUserDto) {
    await this.findOne(id, userId);
    return this.userRepository.updateOneUser(id, user);
  }
}
