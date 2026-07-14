import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { Bcrypt } from 'src/common/classes/bcrypt.class';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly bcrypt: Bcrypt,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.authRepository.getUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!(await this.bcrypt.isValidPassword(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  async login(user: any): Promise<any> {
    const { id, role, email } = user;

    const payload: any = {
      sub: id,
      role,
      email,
    };

    const token = await this.jwtService.signAsync(payload);
    user.password = '';
    return { user, token };
  }
}
