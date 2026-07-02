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
  UseGuards,
} from '@nestjs/common';
import { NewslettersService } from './newsletters.service';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { UpdateNewsletterDto } from './dto/update-newsletter.dto';
import { GetNewsletterDto } from './dto/get-newsletter.dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { UserRoleEnum } from 'src/users/enums/user-roles.enum';

@Controller('newsletters')
@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRoleEnum.ADMIN, UserRoleEnum.AUTHOR)
export class NewslettersController {
  constructor(private readonly newslettersService: NewslettersService) {}

  @Post()
  create(@Body() createNewsletterDto: CreateNewsletterDto, @Req() req: any) {
    return this.newslettersService.create(createNewsletterDto, req.user);
  }

  @Get()
  @Roles(UserRoleEnum.USER)
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
