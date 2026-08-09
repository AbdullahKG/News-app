import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class EmailsService {
  constructor(
    @InjectQueue('emails')
    private readonly emailQueue: Queue,
  ) {}

  async sendPasswordResetEmail(name: string, email: string, token: string) {
    await this.emailQueue.add('reset-password', {
      name,
      email,
      token,
    });
  }
}
