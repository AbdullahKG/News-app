import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { Bcrypt } from 'src/common/classes/bcrypt.class';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly bcrypt: Bcrypt,
  ) {}

  async login(loginDto: LoginDto): Promise<any> {
    const user = await this.authRepository.getUserByEmail(loginDto.email);

    if (!user) {
      throw new NotFoundException();
    }

    if (
      !(await this.bcrypt.isValidPassword(loginDto.password, user.password))
    ) {
      throw new UnauthorizedException('email or password is incorrect');
    }

    const { id, role, email } = user;

    const payload: any = {
      sub: id,
      role,
      email,
    };

    const token = await this.jwtService.signAsync(payload);

    return { user, token };
  }
}
