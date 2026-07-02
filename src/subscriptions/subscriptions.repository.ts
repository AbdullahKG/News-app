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
    const { categoryId } = subscription;

    const newSubscription = new Subscriptions();
    const category = new Categories();
    const userEntity = new Users();

    category.id = categoryId;
    userEntity.id = user.id;
    newSubscription.category = category;
    newSubscription.user = userEntity;

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
      .leftJoinAndSelect('subscription.category', 'category')
      .leftJoinAndSelect('subscription.user', 'user')
      .where('subscription.user = :userId', { userId: user.id });

    if (search) {
      queryBuilder.andWhere('category.name ILIKE :search', {
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
      category: { id },
      user: { id: user.id },
    });
  }
}
