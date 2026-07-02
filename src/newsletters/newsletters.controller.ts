import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { NewslettersService } from './newsletters.service';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { UpdateNewsletterDto } from './dto/update-newsletter.dto';
import { GetNewsletterDto } from './dto/get-newsletter.dto';

@Controller('newsletters')
export class NewslettersController {
  constructor(private readonly newslettersService: NewslettersService) {}

  @Post()
  create(@Body() createNewsletterDto: CreateNewsletterDto, @Req() req: any) {
    return this.newslettersService.create(createNewsletterDto, req.user);
  }

  @Get()
  findAll(@Query() query: GetNewsletterDto) {
    return this.newslettersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newslettersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNewsletterDto: UpdateNewsletterDto,
  ) {
    return this.newslettersService.update(id, updateNewsletterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newslettersService.remove(id);
  }
}
