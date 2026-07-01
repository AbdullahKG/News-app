import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class OffsetLimitDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset?: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 100;
}
