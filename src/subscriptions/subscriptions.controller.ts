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

@Controller('subscriptions')
@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRoleEnum.ADMIN, UserRoleEnum.AUTHOR, UserRoleEnum.USER)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  create(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
    @Req() req: any,
  ) {
    return this.subscriptionsService.create(createSubscriptionDto, req.user);
  }

  @Get()
  findAll(@Query('') query: GetSubscriptionDto, @Req() req: any) {
    return this.subscriptionsService.findAll(query, req.user);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: any) {
    return this.subscriptionsService.remove(id, req.user);
  }
}
