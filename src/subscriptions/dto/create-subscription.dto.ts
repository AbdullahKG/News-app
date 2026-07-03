import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateSubscriptionDto {
  @IsUUID()
  @IsNotEmpty()
  authorId: string;
}
