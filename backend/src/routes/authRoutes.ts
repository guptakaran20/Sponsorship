import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { authenticateRequest } from '../middlewares/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateRequest, getMe);

export default router;
