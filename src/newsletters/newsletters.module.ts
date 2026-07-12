import { Module } from '@nestjs/common';
import { NewslettersService } from './newsletters.service';
import { NewslettersController } from './newsletters.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Newsletters } from './entities/newsletter.entity';
import { Users } from 'src/users/entities/user.entity';
import { Categories } from 'src/categories/entities/category.entity';
import { NewslettersRepository } from './newsletters.repository';
import { RedisModule } from 'src/redis/redis.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    TypeOrmModule.forFeature([Newsletters, Users, Categories]),
    BullModule.registerQueue({ name: 'notifications' }),
    RedisModule,
  ],
  controllers: [NewslettersController],
  providers: [NewslettersService, NewslettersRepository],
})
export class NewslettersModule {}
