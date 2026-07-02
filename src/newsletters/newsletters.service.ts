import { Injectable } from '@nestjs/common';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { UpdateNewsletterDto } from './dto/update-newsletter.dto';
import { NewslettersRepository } from './newsletters.repository';
import { GetNewsletterDto } from './dto/get-newsletter.dto';

@Injectable()
export class NewslettersService {
  constructor(private readonly newsLettersRepository: NewslettersRepository) {}
  create(createNewsletterDto: CreateNewsletterDto, user: any) {
    return this.newsLettersRepository.create(createNewsletterDto, user);
  }

  findAll(query: GetNewsletterDto) {
    return this.newsLettersRepository.findAll(query);
  }

  findOne(id: string) {
    return this.newsLettersRepository.findById(id);
  }

  update(id: string, updateNewsletterDto: UpdateNewsletterDto) {
    return this.newsLettersRepository.update(id, updateNewsletterDto);
  }

  remove(id: string) {
    return this.newsLettersRepository.delete(id);
  }
}
