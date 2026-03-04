"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const logger_1 = require("./logger");
const createTransporter = () => {
    if (!env_1.env.SMTP_HOST || !env_1.env.SMTP_USER || !env_1.env.SMTP_PASS) {
        return null;
    }
    return nodemailer_1.default.createTransport({
        host: env_1.env.SMTP_HOST,
        port: parseInt(env_1.env.SMTP_PORT || '587', 10),
        secure: env_1.env.SMTP_PORT === '465',
        auth: {
            user: env_1.env.SMTP_USER,
            pass: env_1.env.SMTP_PASS,
        },
    });
};
const sendPasswordResetEmail = (to, resetToken) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = createTransporter();
    if (!transporter) {
        logger_1.logger.warn('SMTP not configured — password reset email not sent. Token: (check logs in dev only)');
        if (env_1.env.NODE_ENV === 'development') {
            logger_1.logger.info(`[DEV] Password reset token for ${to}: ${resetToken}`);
        }
        return false;
    }
    const resetUrl = `${env_1.env.CORS_ORIGIN}/reset-password?token=${resetToken}`;
    const fromAddress = env_1.env.SMTP_FROM || env_1.env.SMTP_USER;
    const mailOptions = {
        from: `"SponsorGrid" <${fromAddress}>`,
        to,
        subject: 'Reset Your Password — SponsorGrid',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
                <h2 style="color: #4f46e5;">Reset Your Password</h2>
                <p>You requested a password reset for your SponsorGrid account.</p>
                <p>Click the button below to set a new password. This link expires in <strong>15 minutes</strong>.</p>
                <a href="${resetUrl}" style="display: inline-block; background: #4f46e5; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0;">
                    Reset Password
                </a>
                <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
                <p style="color: #999; font-size: 12px;">SponsorGrid — Connecting clubs with sponsors</p>
            </div>
        `,
    };
    try {
        yield transporter.sendMail(mailOptions);
        return true;
    }
    catch (error) {
        logger_1.logger.error('Failed to send password reset email:', error);
        return false;
    }
});
exports.sendPasswordResetEmail = sendPasswordResetEmail;
