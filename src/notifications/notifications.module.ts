import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsRepository } from './notifications.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notifications } from './entities/notification.entity';
import { Users } from 'src/users/entities/user.entity';
import { Newsletters } from 'src/newsletters/entities/newsletter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notifications, Users, Newsletters])],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsRepository],
})
export class NotificationsModule {}
