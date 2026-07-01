import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  categoryName: string;
}
