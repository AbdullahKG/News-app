import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersDto } from './dto/get-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  DeleteResult,
  ILike,
  MoreThan,
  Repository,
  UpdateResult,
} from 'typeorm';
import { Bcrypt } from 'src/common/classes/bcrypt.class';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
    private readonly bcrypt: Bcrypt,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Users> {
    const { username, password, role, email } = createUserDto;

    const newUser = new Users();

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

  async findAll(
    query: GetUsersDto,
  ): Promise<{ users: Users[]; total: number }> {
    const { limit, offset, search } = query;

    const [users, total] = await this.userRepository.findAndCount({
      take: limit ?? 100,
      skip: offset ?? 0,
      where: [{ email: search ? ILike(`%${search}%`) : undefined }],
    });

    return { users, total };
  }

  async findOne(id: string, query: GetUsersDto): Promise<Users> {
    const foundUser = await this.userRepository.findOne({ where: { id } });

    if (!foundUser) throw new NotFoundException('no user found');

    return foundUser;
  }

  async getUserByEmail(email: string): Promise<Users | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findUserByEmail(email: string): Promise<Users | null> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async findUserByResetToken(token: string): Promise<Users | null> {
    return await this.userRepository.findOne({
      where: {
        resetToken: token,
        resetTokenExpiry: MoreThan(new Date()),
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<Users> {
    const foundUser = await this.findOne(id, {});

    const { username, role, email } = updateUserDto;

    foundUser.username = username ?? foundUser.username;
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

  async updateAuthFields(
    id: string,
    fields: Partial<
      Pick<Users, 'password' | 'resetToken' | 'resetTokenExpiry'>
    >,
  ): Promise<UpdateResult> {
    return await this.userRepository.update(id, fields);
  }

  async remove(id: string): Promise<DeleteResult> {
    const deleted = await this.userRepository.softDelete(id);

    if (deleted.affected === 0) {
      throw new NotFoundException('no user found to delete');
    }

    return deleted;
  }
}
