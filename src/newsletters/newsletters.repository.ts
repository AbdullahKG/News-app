import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Newsletters } from './entities/newsletter.entity';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { GetNewsletterDto } from './dto/get-newsletter.dto';
import { UpdateNewsletterDto } from './dto/update-newsletter.dto';
import { RedisService } from 'src/redis/redis.service';
import { Categories } from 'src/categories/entities/category.entity';
import { Users } from 'src/users/entities/user.entity';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class NewslettersRepository {
  constructor(
    @InjectRepository(Newsletters)
    private readonly newslettersRepository: Repository<Newsletters>,
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
    private readonly redisService: RedisService,
  ) {}

  async create(
    createNewsletterDto: CreateNewsletterDto,
    user: any,
  ): Promise<Newsletters> {
    const { title, content, cover_image, categoryId } = createNewsletterDto;

    const newNewsLetter = new Newsletters();
    const category = new Categories();
    const userEntity = new Users();

    category.id = categoryId;
    userEntity.id = user.id;
    newNewsLetter.title = title;
    newNewsLetter.body = content;
    newNewsLetter.cover_image = cover_image;
    newNewsLetter.category = category;
    newNewsLetter.author = userEntity;

    let savedNewsletter: Newsletters;
    try {
      savedNewsletter = await this.newslettersRepository.save(newNewsLetter);
    } catch (error) {
      if (error.code === '23503') {
      }
      throw new InternalServerErrorException(error.message);
    }

    await this.invalidateNewslettersCache();
    await this.notificationsQueue.add('newsletter-published', {
      newsletterId: savedNewsletter.id,
      authorId: user.id,
    });
    return savedNewsletter;
  }

  async findAll(
    query: GetNewsletterDto,
  ): Promise<{ newsLetters: Newsletters[]; total: number }> {
    const redis = this.redisService.getClient();
    const { search, limit, offset } = query;

    const cacheKey = `newsletters:${search || 'all'}:${limit || 100}:${offset || 0}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const queryBuilder = this.newslettersRepository
      .createQueryBuilder('newsLetter')
      .leftJoinAndSelect('newsLetter.category', 'category')
      .leftJoinAndSelect('newsLetter.author', 'user');

    if (search) {
      queryBuilder.andWhere('newsLetter.title ILIKE :search', {
        search: `%${search}%`,
      });
    }

    const [newsLetters, total] = await queryBuilder
      .skip(offset ?? 0)
      .limit(limit ?? 100)
      .getManyAndCount();

    await redis.set(
      cacheKey,
      JSON.stringify({ newsLetters, total }),
      'EX',
      300,
    ); // 5 minutes cache expiration
    await redis.sadd('newsletters:cache-keys', cacheKey);

    return { newsLetters, total };
  }

  async findById(id: string): Promise<Newsletters> {
    const foundNewsLetter = await this.newslettersRepository.findOne({
      where: { id },
    });

    if (!foundNewsLetter) {
      throw new NotFoundException(`Newsletter with ID ${id} not found`);
    }

    return foundNewsLetter;
  }

  async update(
    id: string,
    updateNewsletter: UpdateNewsletterDto,
  ): Promise<Newsletters> {
    const foundNewsLetter = await this.findById(id);

    const { title, content, cover_image, categoryId } = updateNewsletter;

    foundNewsLetter.title = title ?? foundNewsLetter.title;
    foundNewsLetter.body = content ?? foundNewsLetter.body;
    foundNewsLetter.cover_image = cover_image ?? foundNewsLetter.cover_image;
    foundNewsLetter.category.id = categoryId ?? foundNewsLetter.category.id;

    let updatedNewsletter: Newsletters;
    try {
      updatedNewsletter =
        await this.newslettersRepository.save(foundNewsLetter);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
    await this.invalidateNewslettersCache();
    return updatedNewsletter;
  }

  async delete(id: string): Promise<DeleteResult> {
    const deleted = await this.newslettersRepository.softDelete(id);

    if (deleted.affected === 0) {
      throw new NotFoundException(`Newsletter with ID ${id} not found`);
    }
    await this.invalidateNewslettersCache();
    return deleted;
  }

  private async invalidateNewslettersCache() {
    const redis = this.redisService.getClient();
    const keys = await redis.smembers('newsletters:cache-keys');
    if (keys.length) {
      await redis.del(...keys);
    }
    await redis.del('newsletters:cache-keys');
  }
}
