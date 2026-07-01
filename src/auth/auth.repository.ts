import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getUserByUserName(username: string): Promise<User> {
    const foundUser = await this.userRepository.findOne({
      where: { username },
    });

    if (!foundUser)
      throw new UnauthorizedException('username or password is incorrect');

    return foundUser;
  }

  async getUserByEmail(email: string): Promise<User> {
    const foundUser = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();

    if (!foundUser)
      throw new UnauthorizedException('email or password is incorrect');

    return foundUser;
  }

  async getUserById(id: string): Promise<User> {
    const foundUser = await this.userRepository.findOne({
      where: { id },
    });

    if (!foundUser)
      throw new UnauthorizedException('username or password is incorrect');

    return foundUser;
  }
}
