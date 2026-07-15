import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { GetSubscriptionDto } from './dto/get-subscription.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { UserRoleEnum } from 'src/users/enums/user-roles.enum';
import { Roles } from 'src/auth/decorators/role.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('subscriptions')
@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRoleEnum.ADMIN, UserRoleEnum.AUTHOR, UserRoleEnum.USER)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  create(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
    @CurrentUser() user: any,
  ) {
    return this.subscriptionsService.create(createSubscriptionDto, user);
  }

  @Get()
  findAll(@Query('') query: GetSubscriptionDto, @CurrentUser() user: any) {
    return this.subscriptionsService.findAll(query, user);
  }

  @Delete(':id')
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: any,
  ) {
    return this.subscriptionsService.remove(id, user);
  }
}
