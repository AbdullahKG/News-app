export interface ResetPasswordEmailData {
  name: string;
  resetUrl: string;
}

export function resetPasswordTemplate({
  name,
  resetUrl,
}: ResetPasswordEmailData) {
  return {
    subject: 'Reset your password',

    html: `
            
            <h2>Password Reset Request</h2>
            <p>Hello ${name},</p>
            <p>Click the link below to reset your password. This link expires in 15 minutes.</p>
            <a href="${resetUrl}">Reset Password</a>
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
            `,
  };
}
