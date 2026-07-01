import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRoleEnum } from '../enums/user-roles.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  username: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  email: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  password: string;

  @IsEnum(UserRoleEnum)
  role: UserRoleEnum;
}
