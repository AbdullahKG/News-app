import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { OffsetLimitDto } from 'src/common/dto/offset-limit.dto';

export class GetUsersDto extends OffsetLimitDto {
  @IsOptional()
  @IsString()
  @Type(() => String)
  search?: string;
}
