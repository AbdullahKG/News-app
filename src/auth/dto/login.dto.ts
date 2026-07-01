import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  email: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  password: string;
}
