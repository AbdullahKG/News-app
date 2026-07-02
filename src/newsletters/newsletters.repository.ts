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

@Injectable()
export class NewslettersRepository {
  constructor(
    @InjectRepository(Newsletters)
    private readonly newslettersRepository: Repository<Newsletters>,
  ) {}

  async create(
    createNewsletterDto: CreateNewsletterDto,
    user: any,
  ): Promise<Newsletters> {
    const { title, content, cover_image, categoryId } = createNewsletterDto;

    const newNewsLetter = new Newsletters();
    newNewsLetter.title = title;
    newNewsLetter.body = content;
    newNewsLetter.cover_image = cover_image;
    newNewsLetter.category.id = categoryId;
    newNewsLetter.author.id = user.id;

    try {
      return await this.newslettersRepository.save(newNewsLetter);
    } catch (error) {
      if (error.code === '23503') {
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(
    query: GetNewsletterDto,
  ): Promise<{ newsLetters: Newsletters[]; total: number }> {
    const { search, limit, offset } = query;

    const queryBuilder = this.newslettersRepository
      .createQueryBuilder('newsLetter')
      .leftJoinAndSelect('newsLetter.category', 'category')
      .leftJoinAndSelect('newsLetter.author', 'user');

    if (search) {
      queryBuilder.andWhere('category.name ILIKE :search', {
        search: `%${search}%`,
      });
    }

    const [newsLetters, total] = await queryBuilder
      .skip(offset ?? 0)
      .limit(limit ?? 100)
      .getManyAndCount();

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

    try {
      return await this.newslettersRepository.save(foundNewsLetter);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(id: string): Promise<DeleteResult> {
    const deleted = await this.newslettersRepository.softDelete(id);

    if (deleted.affected === 0) {
      throw new NotFoundException(`Newsletter with ID ${id} not found`);
    }

    return deleted;
  }
}
