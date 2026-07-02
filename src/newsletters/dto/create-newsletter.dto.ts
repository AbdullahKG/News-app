import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateNewsletterDto {
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  title: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  content: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  cover_image: string;

  @IsUUID()
  @IsNotEmpty()
  @Type(() => String)
  categoryId: string;
}
