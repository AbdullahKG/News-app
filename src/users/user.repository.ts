import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersDto } from './dto/get-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteResult, ILike, Repository } from 'typeorm';
import { Bcrypt } from 'src/common/classes/bcrypt.class';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly bcrypt: Bcrypt,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, role, email } = createUserDto;

    const newUser = new User();

    newUser.username = username;
    newUser.password = await this.bcrypt.hashUserPassword(password);
    newUser.role = role;
    newUser.email = email;

    try {
      return await this.userRepository.save(newUser);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('User with this email already exists');
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(query: GetUsersDto): Promise<{ users: User[]; total: number }> {
    const { limit, offset, search } = query;

    const [users, total] = await this.userRepository.findAndCount({
      take: limit ?? 100,
      skip: offset ?? 0,
      where: [{ email: search ? ILike(`%${search}%`) : undefined }],
    });

    return { users, total };
  }

  async findOne(id: string, query: GetUsersDto): Promise<User> {
    const foundUser = await this.userRepository.findOne({ where: { id } });

    if (!foundUser) throw new NotFoundException('no user found');

    return foundUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const foundUser = await this.findOne(id, {});

    const { username, password, role, email } = updateUserDto;

    foundUser.username = username ?? foundUser.username;
    foundUser.password = password ?? foundUser.password;
    foundUser.role = role ?? foundUser.role;
    foundUser.email = email ?? foundUser.email;

    try {
      return await this.userRepository.save(foundUser);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('User with this email already exists');
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: string): Promise<DeleteResult> {
    const deleted = await this.userRepository.softDelete(id);

    if (deleted.affected === 0) {
      throw new NotFoundException('no user found to delete');
    }

    return deleted;
  }
}
