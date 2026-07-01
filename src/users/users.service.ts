import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersDto } from './dto/get-user.dto';
import { UsersRepository } from './user.repository';
import { Users } from './entities/user.entity';
import { DeleteResult } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  create(createUserDto: CreateUserDto): Promise<Users> {
    return this.usersRepository.create(createUserDto);
  }

  findAll(query: GetUsersDto): Promise<{ users: Users[]; total: number }> {
    return this.usersRepository.findAll(query);
  }

  findOne(id: string, query: GetUsersDto): Promise<Users> {
    return this.usersRepository.findOne(id, query);
  }

  update(id: string, updateUserDto: UpdateUserDto): Promise<Users> {
    return this.usersRepository.update(id, updateUserDto);
  }

  remove(id: string): Promise<DeleteResult> {
    return this.usersRepository.remove(id);
  }
}
