import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ResendProvider } from './providers/resend.provider';

@Processor('emails')
export class EmailProcessor extends WorkerHost {
  constructor(private readonly resendProvider: ResendProvider) {
    super();
  }

  async process(job: Job) {
    switch (job.name) {
      case 'reset-password':
        return this.resendProvider.sendPasswordResetEmail(job.data);

      default:
        throw new Error(`Unknown email job: ${job.name}`);
    }
  }
}
