import { Router } from 'express';
import { register, login, getMe, refreshToken, logout } from '../controllers/authController';
import { authenticateRequest } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { registerSchema, loginSchema } from '../validators/authValidator';
import { authLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.get('/me', authenticateRequest, getMe);

export default router;
