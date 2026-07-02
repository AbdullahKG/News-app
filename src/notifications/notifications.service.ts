import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationsRepository } from './notifications.repository';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  create(createNotificationDto: CreateNotificationDto) {
    return this.notificationsRepository.create(createNotificationDto);
  }

  findAll(user: any) {
    return this.notificationsRepository.findAll(user);
  }

  update(id: string, user: any) {
    return this.notificationsRepository.update(id, user);
  }
}
