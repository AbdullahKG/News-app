import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersDto } from './dto/get-user.dto';
import { UsersRepository } from './user.repository';
import { Users } from './entities/user.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

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

  findMe(user): Promise<Users> {
    return this.usersRepository.findMe(user);
  }

  getUserByEmail(email: string): Promise<Users | null> {
    return this.usersRepository.getUserByEmail(email);
  }

  findUserByEmail(email: string): Promise<Users | null> {
    return this.usersRepository.findUserByEmail(email);
  }

  findUserByResetToken(token: string): Promise<Users | null> {
    return this.usersRepository.findUserByResetToken(token);
  }

  update(id: string, updateUserDto: UpdateUserDto): Promise<Users> {
    return this.usersRepository.update(id, updateUserDto);
  }

  updateAuthFields(
    id: string,
    fields: Partial<
      Pick<Users, 'password' | 'resetToken' | 'resetTokenExpiry'>
    >,
  ): Promise<UpdateResult> {
    return this.usersRepository.updateAuthFields(id, fields);
  }

  remove(id: string): Promise<DeleteResult> {
    return this.usersRepository.remove(id);
  }
}
