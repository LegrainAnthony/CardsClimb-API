import { Injectable } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  create(data: Prisma.UserCreateInput) {
    return this.userRepository.create(data);
  }

  findOne(id: number) {
    return this.userRepository.findOne({ id });
  }
}