import nodemailer from 'nodemailer';
import { env } from './env';

const createTransporter = () => {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: parseInt(env.SMTP_PORT || '587'),
    secure: parseInt(env.SMTP_PORT || '587') === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
};

export const sendPasswordResetEmail = async (
  to: string,
  resetToken: string
): Promise<void> => {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn('SMTP not configured — password reset email not sent. Token:', resetToken);
    return;
  }

  const resetUrl = `${env.CORS_ORIGIN}/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: env.SMTP_FROM || env.SMTP_USER,
    to,
    subject: 'SponsorBridge — Password Reset',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto; padding: 24px;">
        <h2 style="color: #4f46e5;">Reset Your Password</h2>
        <p>You requested a password reset for your SponsorBridge account.</p>
        <p>Click the button below to reset your password. This link expires in 15 minutes.</p>
        <a href="${resetUrl}" style="display: inline-block; background: #4f46e5; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">Reset Password</a>
        <p style="color: #888; font-size: 13px; margin-top: 24px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
};
