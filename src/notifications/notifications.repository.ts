import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notifications } from './entities/notification.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Newsletters } from 'src/newsletters/entities/newsletter.entity';
import { Users } from 'src/users/entities/user.entity';

@Injectable()
export class NotificationsRepository {
  constructor(
    @InjectRepository(Notifications)
    private readonly notificationsRepository: Repository<Notifications>,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notifications> {
    const { userId, newsletterId } = createNotificationDto;

    const newNotification = new Notifications();
    const newsLetter = new Newsletters();
    const user = new Users();

    user.id = userId;
    newsLetter.id = newsletterId;

    newNotification.user = user;
    newNotification.newsletter = newsLetter;

    try {
      return await this.notificationsRepository.save(newNotification);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(user: any): Promise<Notifications[]> {
    try {
      return await this.notificationsRepository.find({
        relations: ['user', 'newsletter'],
        where: { user: { id: user.id } },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, user: any): Promise<Partial<UpdateResult>> {
    try {
      const updatedNotification = await this.notificationsRepository.update(
        { id, user: { id: user.id } },
        {
          isRead: true,
          readAt: new Date(),
        },
      );

      if (updatedNotification.affected === 0) {
        throw new NotFoundException(`Notification with ID ${id} not found`);
      }

      return updatedNotification;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
