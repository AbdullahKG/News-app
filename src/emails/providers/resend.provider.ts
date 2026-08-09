import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { resetPasswordTemplate } from '../templates/reset-password.template';

@Injectable()
export class ResendProvider {
  private readonly resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendPasswordResetEmail(data: {
    name: string;
    email: string;
    token: string;
  }) {
    const emailData = resetPasswordTemplate({
      name: data.name,
      resetUrl: `${process.env.WEBSITE_URL}/auth/reset-password?token=${data.token}`,
    });

    return this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: data.email,
      subject: emailData.subject,
      html: emailData.html,
    });
  }
}
