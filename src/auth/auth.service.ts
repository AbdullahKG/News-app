import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Bcrypt } from 'src/common/classes/bcrypt.class';
import { EmailsService } from 'src/emails/emails.service';
import { randomBytes, createHash } from 'crypto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly bcrypt: Bcrypt,
    private readonly emailService: EmailsService,
    private readonly userService: UsersService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getUserByEmail(email);

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

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.userService.findUserByEmail(email);

    if (user) {
      const rawToken = randomBytes(32).toString('hex');
      const hashedToken = createHash('sha256').update(rawToken).digest('hex');
      const expiry = new Date(Date.now() + 1000 * 60 * 15);

      await this.userService.updateAuthFields(user.id, {
        resetToken: hashedToken,
        resetTokenExpiry: expiry,
      });

      await this.emailService.sendPasswordResetEmail(
        user.username,
        user.email,
        rawToken,
      );
    }

    return {
      message:
        'Password reset link has been sent to your email. Please check your inbox and follow the instructions to reset your password. The link will expire in 15 minutes.',
    };
  }

  async resetPassword(
    rawToken: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const hashedToken = createHash('sha256').update(rawToken).digest('hex');

    const user = await this.userService.findUserByResetToken(hashedToken);

    if (!user) {
      throw new BadRequestException('Invalid or expired token');
    }

    const hashedPassword = await this.bcrypt.hashUserPassword(newPassword);

    await this.userService.updateAuthFields(user.id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    });

    return {
      message: 'Password reset successful. You can now log in.',
    };
  }
}
