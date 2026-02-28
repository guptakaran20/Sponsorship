import { Router } from 'express';
import passport from 'passport';
import { register, login, getMe, refreshToken, logout, forgotPassword, resetPassword, googleCallback } from '../controllers/authController';
import { authenticateRequest } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/authValidator';
import { authLimiter } from '../middlewares/rateLimiter';
import { env } from '../config/env';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.get('/me', authenticateRequest, getMe);

// Password reset
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), resetPassword);

// Google OAuth
if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
  router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: `${env.CORS_ORIGIN}/login?error=auth_failed` }), googleCallback);
}

export default router;
