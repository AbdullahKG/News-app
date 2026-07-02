import { Controller, Get, Patch, Param, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
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
