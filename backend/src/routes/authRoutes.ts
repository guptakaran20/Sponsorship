import { Router } from 'express';
import { register, login, getMe, refreshToken, logout, forgotPassword, resetPassword, googleAuthCallback, completeProfile } from '../controllers/authController';
import passport from 'passport';
import { authenticateRequest } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/authValidator';
import { authLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.get('/me', authenticateRequest, getMe);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), resetPassword);

// Google OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.CORS_ORIGIN || 'http://localhost:3000'}/login?error=GoogleAuthFailed` }),
  googleAuthCallback
);
router.post('/complete-profile', authLimiter, completeProfile);

export default router;
