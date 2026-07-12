import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsRepository } from './notifications.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notifications } from './entities/notification.entity';
import { Users } from 'src/users/entities/user.entity';
import { Newsletters } from 'src/newsletters/entities/newsletter.entity';
import { BullModule } from '@nestjs/bullmq';
import { NotificationsProcessor } from './notifications.worker';
import { Subscriptions } from 'src/subscriptions/entities/subscription.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Notifications,
      Users,
      Newsletters,
      Subscriptions,
    ]),
    BullModule.registerQueue({ name: 'notifications' }),
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    NotificationsRepository,
    NotificationsProcessor,
  ],
})
export class NotificationsModule {}
