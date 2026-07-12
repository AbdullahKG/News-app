import { Processor, WorkerHost } from '@nestjs/bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bullmq';
import { Subscriptions } from 'src/subscriptions/entities/subscription.entity';
import { Repository } from 'typeorm';
import { Notifications } from './entities/notification.entity';

@Processor('notifications', { concurrency: 3 })
export class NotificationsProcessor extends WorkerHost {
  constructor(
    @InjectRepository(Subscriptions)
    private readonly subscriptionsRepository: Repository<Subscriptions>,
    @InjectRepository(Notifications)
    private readonly notificationsRepository: Repository<Notifications>,
  ) {
    super();
  }
  async process(job: Job) {
    const { newsletterId, authorId } = job.data;

    const followers = await this.subscriptionsRepository
      .createQueryBuilder('subscription')
      .leftJoinAndSelect('subscription.subscriber', 'subscriber')
      .where('subscription.author_id = :authorId', { authorId })
      .getMany();

    if (!followers) return;

    const values = followers.map((follower) => ({
      user: {
        id: follower.subscriber.id,
      },
      newsletter: {
        id: newsletterId,
      },
    }));

    await this.notificationsRepository
      .createQueryBuilder()
      .insert()
      .into(Notifications)
      .values(values)
      .execute();
  }
}
