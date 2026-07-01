import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { GetSubscriptionDto } from './dto/get-subscription.dto';
import { SubscriptionsRepository } from './subscriptions.repository';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly subscriptionsRepository: SubscriptionsRepository,
  ) {}
  create(createSubscriptionDto: CreateSubscriptionDto, user: any) {
    return this.subscriptionsRepository.create(createSubscriptionDto, user.id);
  }

  findAll(query: GetSubscriptionDto, user: any) {
    return this.subscriptionsRepository.findAll(query, user);
  }

  remove(id: string, user: any) {
    return this.subscriptionsRepository.remove(id, user);
  }
}
