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
exports.resetPassword = exports.forgotPassword = exports.getMe = exports.logout = exports.refreshToken = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = require("../lib/prisma");
const jwt_1 = require("../utils/jwt");
const env_1 = require("../config/env");
const email_1 = require("../utils/email");
const ApiResponse_1 = require("../utils/ApiResponse");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name, role, adminSecret } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json(ApiResponse_1.ApiResponse.error('Please provide email, password and name'));
        }
        const existingUser = yield prisma_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json(ApiResponse_1.ApiResponse.error('User already exists'));
        }
        if (role === 'ADMIN') {
            if (adminSecret !== env_1.env.ADMIN_SECRET) {
                return res.status(401).json(ApiResponse_1.ApiResponse.error('Invalid admin secret'));
            }
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const userRole = role === 'COMPANY' || role === 'ADMIN' ? role : 'CLUB';
        const user = yield prisma_1.prisma.user.create({
            data: { email, password: hashedPassword, name, role: userRole },
        });
        const accessToken = (0, jwt_1.generateAccessToken)(user.id, user.role);
        const refreshToken = (0, jwt_1.generateRefreshToken)(user.id);
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: env_1.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000,
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: env_1.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(201).json(ApiResponse_1.ApiResponse.ok('User registered successfully', {
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
        }));
    }
    catch (error) {
        res.status(500).json(ApiResponse_1.ApiResponse.error('Server error during registration'));
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json(ApiResponse_1.ApiResponse.error('Please provide email and password'));
        }
        const user = yield prisma_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json(ApiResponse_1.ApiResponse.error('Invalid credentials'));
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json(ApiResponse_1.ApiResponse.error('Invalid credentials'));
        }
        const accessToken = (0, jwt_1.generateAccessToken)(user.id, user.role);
        const refreshToken = (0, jwt_1.generateRefreshToken)(user.id);
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: env_1.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000,
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: env_1.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json(ApiResponse_1.ApiResponse.ok('Logged in successfully', {
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
        }));
    }
    catch (error) {
        res.status(500).json(ApiResponse_1.ApiResponse.error('Server error during login'));
    }
});
exports.login = login;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
        if (!token) {
            return res.status(401).json(ApiResponse_1.ApiResponse.error('No refresh token provided'));
        }
        const decoded = (0, jwt_1.verifyRefreshToken)(token);
        const user = yield prisma_1.prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) {
            return res.status(401).json(ApiResponse_1.ApiResponse.error('User not found'));
        }
        const newAccessToken = (0, jwt_1.generateAccessToken)(user.id, user.role);
        const newRefreshToken = (0, jwt_1.generateRefreshToken)(user.id);
        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: env_1.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000,
        });
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: env_1.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json(ApiResponse_1.ApiResponse.ok('Token refreshed'));
    }
    catch (error) {
        res.status(401).json(ApiResponse_1.ApiResponse.error('Invalid refresh token'));
    }
});
exports.refreshToken = refreshToken;
const logout = (req, res) => {
    const cookieOptions = { httpOnly: true, secure: env_1.env.NODE_ENV === 'production', sameSite: 'strict' };
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    res.status(200).json(ApiResponse_1.ApiResponse.ok('Logged out successfully'));
};
exports.logout = logout;
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma_1.prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, email: true, name: true, role: true, isVerified: true },
        });
        if (!user) {
            return res.status(404).json(ApiResponse_1.ApiResponse.error('User not found'));
        }
        res.status(200).json(ApiResponse_1.ApiResponse.ok('User fetched', user));
    }
    catch (error) {
        res.status(500).json(ApiResponse_1.ApiResponse.error('Server error getting user profile'));
    }
});
exports.getMe = getMe;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        // Always return success to prevent user enumeration
        const successMessage = 'If an account with that email exists, a password reset link has been sent.';
        const user = yield prisma_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(200).json(ApiResponse_1.ApiResponse.ok(successMessage));
        }
        // Generate a random token and hash it with SHA-256 for storage
        const rawToken = crypto_1.default.randomBytes(32).toString('hex');
        const hashedToken = crypto_1.default.createHash('sha256').update(rawToken).digest('hex');
        // Set 15-minute expiry
        const expiry = new Date(Date.now() + 15 * 60 * 1000);
        yield prisma_1.prisma.user.update({
            where: { id: user.id },
            data: { resetToken: hashedToken, resetTokenExpiry: expiry },
        });
        // Send email with the raw (unhashed) token
        yield (0, email_1.sendPasswordResetEmail)(email, rawToken);
        res.status(200).json(ApiResponse_1.ApiResponse.ok(successMessage));
    }
    catch (error) {
        res.status(500).json(ApiResponse_1.ApiResponse.error('Server error processing password reset'));
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, password } = req.body;
        // Hash the incoming token to compare with stored hash
        const hashedToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
        const user = yield prisma_1.prisma.user.findFirst({
            where: {
                resetToken: hashedToken,
                resetTokenExpiry: { gt: new Date() },
            },
        });
        if (!user) {
            return res.status(400).json(ApiResponse_1.ApiResponse.error('Invalid or expired reset token'));
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        // Update password and invalidate the token
        yield prisma_1.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });
        res.status(200).json(ApiResponse_1.ApiResponse.ok('Password has been reset successfully'));
    }
    catch (error) {
        res.status(500).json(ApiResponse_1.ApiResponse.error('Server error resetting password'));
    }
});
exports.resetPassword = resetPassword;
