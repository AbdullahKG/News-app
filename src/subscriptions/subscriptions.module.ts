import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscriptions } from './entities/subscription.entity';
import { Users } from 'src/users/entities/user.entity';
import { Categories } from 'src/categories/entities/category.entity';
import { SubscriptionsRepository } from './subscriptions.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Subscriptions, Users, Categories])],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, SubscriptionsRepository],
})
export class SubscriptionsModule {}
