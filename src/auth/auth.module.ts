import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/user.entity';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { Bcrypt } from 'src/common/classes/bcrypt.class';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRATION') as any },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, Bcrypt],
})
export class AuthModule {}
