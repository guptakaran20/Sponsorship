import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../lib/prisma';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { env } from '../config/env';
import { ApiResponse } from '../utils/ApiResponse';
import { sendPasswordResetEmail } from '../config/mailer';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, name, role, adminSecret } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json(ApiResponse.error('Please provide email, password and name'));
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json(ApiResponse.error('User already exists'));
        }

        if (role === 'ADMIN') {
            if (adminSecret !== env.ADMIN_SECRET) {
                return res.status(401).json(ApiResponse.error('Invalid admin secret'));
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userRole = role === 'COMPANY' || role === 'ADMIN' ? role : 'CLUB';

        const user = await prisma.user.create({
            data: { email, password: hashedPassword, name, role: userRole },
        });

        const accessToken = generateAccessToken(user.id, user.role);
        const refreshToken = generateRefreshToken(user.id);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000,
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json(ApiResponse.ok('User registered successfully', {
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
        }));
    } catch (error) {
        res.status(500).json(ApiResponse.error('Server error during registration'));
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json(ApiResponse.error('Please provide email and password'));
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json(ApiResponse.error('Invalid credentials'));
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json(ApiResponse.error('Invalid credentials'));
        }

        const accessToken = generateAccessToken(user.id, user.role);
        const refreshToken = generateRefreshToken(user.id);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000,
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json(ApiResponse.ok('Logged in successfully', {
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
        }));
    } catch (error) {
        res.status(500).json(ApiResponse.error('Server error during login'));
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const token = req.cookies?.refreshToken;
        if (!token) {
            return res.status(401).json(ApiResponse.error('No refresh token provided'));
        }

        const decoded = verifyRefreshToken(token) as { id: string };
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) {
            return res.status(401).json(ApiResponse.error('User not found'));
        }

        const newAccessToken = generateAccessToken(user.id, user.role);
        const newRefreshToken = generateRefreshToken(user.id);

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000,
        });

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json(ApiResponse.ok('Token refreshed'));
    } catch (error) {
        res.status(401).json(ApiResponse.error('Invalid refresh token'));
    }
};

export const logout = (req: Request, res: Response) => {
    const cookieOptions = { httpOnly: true, secure: env.NODE_ENV === 'production', sameSite: 'strict' as const };
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    res.status(200).json(ApiResponse.ok('Logged out successfully'));
};

export const getMe = async (req: Request | any, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, email: true, name: true, role: true, isVerified: true },
        });

        if (!user) {
            return res.status(404).json(ApiResponse.error('User not found'));
        }

        res.status(200).json(ApiResponse.ok('User fetched', user));
    } catch (error) {
        res.status(500).json(ApiResponse.error('Server error getting user profile'));
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json(ApiResponse.error('Please provide an email address'));
        }

        // Always return success to prevent user enumeration
        const successMsg = 'If an account with that email exists, a password reset link has been sent.';

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(200).json(ApiResponse.ok(successMsg));
        }

        // Generate a secure random token
        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

        // Store hashed token with 15 min expiry; invalidates any previous token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken: hashedToken,
                resetTokenExpiry: new Date(Date.now() + 15 * 60 * 1000),
            },
        });

        // Send email (non-blocking — still return success even if mail fails)
        sendPasswordResetEmail(user.email, rawToken).catch((err) => {
            console.error('Failed to send password reset email:', err);
        });

        res.status(200).json(ApiResponse.ok(successMsg));
    } catch (error) {
        res.status(500).json(ApiResponse.error('Server error during password reset request'));
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json(ApiResponse.error('Token and new password are required'));
        }

        if (password.length < 8) {
            return res.status(400).json(ApiResponse.error('Password must be at least 8 characters'));
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await prisma.user.findFirst({
            where: {
                resetToken: hashedToken,
                resetTokenExpiry: { gt: new Date() },
            },
        });

        if (!user) {
            return res.status(400).json(ApiResponse.error('Invalid or expired reset token'));
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        res.status(200).json(ApiResponse.ok('Password has been reset successfully'));
    } catch (error) {
        res.status(500).json(ApiResponse.error('Server error during password reset'));
    }
};

export const googleCallback = async (req: Request | any, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.redirect(`${env.CORS_ORIGIN}/login?error=auth_failed`);
        }

        const accessToken = generateAccessToken(user.id, user.role);
        const refreshToken = generateRefreshToken(user.id);

        const cookieOptions = {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'strict' as const,
        };

        res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
        res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

        const redirectPath = user.role === 'CLUB' ? '/club/dashboard' : '/company/dashboard';
        res.redirect(`${env.CORS_ORIGIN}${redirectPath}`);
    } catch (error) {
        res.redirect(`${env.CORS_ORIGIN}/login?error=server_error`);
    }
};
