import { Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guard/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('login')
  @UseGuards(LocalGuard)
  async login(@Req() req) {
    return await this.authService.login(req.user);
  }
}
