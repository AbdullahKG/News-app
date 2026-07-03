import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscriptions } from './entities/subscription.entity';
import { Repository } from 'typeorm';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { GetSubscriptionDto } from './dto/get-subscription.dto';
import { DeleteResult } from 'typeorm/browser';
import { Categories } from 'src/categories/entities/category.entity';
import { Users } from 'src/users/entities/user.entity';

@Injectable()
export class SubscriptionsRepository {
  constructor(
    @InjectRepository(Subscriptions)
    private readonly subscriptionsRepository: Repository<Subscriptions>,
  ) {}

  async create(
    subscription: CreateSubscriptionDto,
    user: any,
  ): Promise<Subscriptions> {
    const { authorId } = subscription;

    const newSubscription = new Subscriptions();
    const subscriber = new Users();
    const author = new Users();

    subscriber.id = user.id;
    author.id = authorId;
    newSubscription.subscriber = subscriber;
    newSubscription.author = author;

    try {
      return await this.subscriptionsRepository.save(newSubscription);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          'Subscription already exists for this user and category',
        );
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(
    query: GetSubscriptionDto,
    user: any,
  ): Promise<{ subscriptions: Subscriptions[]; total: number }> {
    const { search, limit, offset } = query;

    const queryBuilder = this.subscriptionsRepository
      .createQueryBuilder('subscription')
      .leftJoinAndSelect('subscription.author', 'author')
      .where('subscription.subscriber = :subscriberId', {
        subscriberId: user.id,
      });

    if (search) {
      queryBuilder.andWhere('author.username ILIKE :search', {
        search: `%${search}%`,
      });
    }

    const [subscriptions, total] = await queryBuilder
      .skip(offset ?? 0)
      .take(limit ?? 100)
      .getManyAndCount();

    return { subscriptions, total };
  }

  async remove(id: string, user: any): Promise<DeleteResult> {
    return await this.subscriptionsRepository.delete({
      author: { id },
      subscriber: { id: user.id },
    });
  }
}
