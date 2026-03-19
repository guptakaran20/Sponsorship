import { Router } from 'express';
import { register, login, getMe, refreshToken, logout, forgotPassword, resetPassword, googleAuthCallback, completeProfile } from '../controllers/authController';
import passport from 'passport';
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
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), resetPassword);

// Google OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get(
  '/google/callback',
  (req, res, next) => {
    passport.authenticate('google', { session: false }, (err: any, user: any, info: any) => {
      if (err || !user) {
        console.error('Google Auth Error:', err, 'User:', user, 'Info:', info);
        const errMsg = err ? (err.message || String(err)) : (info ? (info.message || String(info)) : 'NoUserFromGoogle');
        return res.redirect(`${env.CORS_ORIGIN}/login?error=GoogleAuthFailed_${encodeURIComponent(errMsg)}`);
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  googleAuthCallback
);
router.post('/complete-profile', authLimiter, completeProfile);

export default router;
