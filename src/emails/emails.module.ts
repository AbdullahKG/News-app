import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { BullModule } from '@nestjs/bullmq';
import { EmailProcessor } from './emails.worker';
import { ResendProvider } from './providers/resend.provider';

@Module({
  imports: [BullModule.registerQueue({ name: 'emails' })],
  providers: [EmailsService, EmailProcessor, ResendProvider],
  exports: [EmailsService],
})
export class EmailsModule {}
