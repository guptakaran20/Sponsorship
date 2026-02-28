import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { logger } from './logger';

const createTransporter = () => {
    if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
        return null;
    }

    return nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: parseInt(env.SMTP_PORT || '587', 10),
        secure: env.SMTP_PORT === '465',
        auth: {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS,
        },
    });
};

export const sendPasswordResetEmail = async (
    to: string,
    resetToken: string,
): Promise<boolean> => {
    const transporter = createTransporter();

    if (!transporter) {
        logger.warn('SMTP not configured — password reset email not sent. Token: (check logs in dev only)');
        if (env.NODE_ENV === 'development') {
            logger.info(`[DEV] Password reset token for ${to}: ${resetToken}`);
        }
        return false;
    }

    const resetUrl = `${env.CORS_ORIGIN}/reset-password?token=${resetToken}`;
    const fromAddress = env.SMTP_FROM || env.SMTP_USER;

    const mailOptions = {
        from: `"SponsorBridge" <${fromAddress}>`,
        to,
        subject: 'Reset Your Password — SponsorBridge',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
                <h2 style="color: #4f46e5;">Reset Your Password</h2>
                <p>You requested a password reset for your SponsorBridge account.</p>
                <p>Click the button below to set a new password. This link expires in <strong>15 minutes</strong>.</p>
                <a href="${resetUrl}" style="display: inline-block; background: #4f46e5; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0;">
                    Reset Password
                </a>
                <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
                <p style="color: #999; font-size: 12px;">SponsorBridge — Connecting clubs with sponsors</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        logger.error('Failed to send password reset email:', error);
        return false;
    }
};
