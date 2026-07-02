import { Controller, Get, Patch, Param, Req, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Roles } from 'src/auth/decorators/role.decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { UserRoleEnum } from 'src/users/enums/user-roles.enum';

@Controller('notifications')
@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRoleEnum.ADMIN, UserRoleEnum.AUTHOR, UserRoleEnum.USER)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(@Req() req) {
    return this.notificationsService.findAll(req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Req() req) {
    return this.notificationsService.update(id, req.user);
  }
}
