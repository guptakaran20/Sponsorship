import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { env } from '../config/env';
import { ApiResponse } from '../utils/ApiResponse';

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
