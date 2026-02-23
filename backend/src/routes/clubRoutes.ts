import { Router } from 'express';
import { createOrUpdateProfile, getProfile } from '../controllers/clubController';
import { authenticateRequest, authorizeRole } from '../middlewares/auth';

const router = Router();

router.post('/profile', authenticateRequest, authorizeRole(['CLUB']), createOrUpdateProfile);
router.get('/profile', authenticateRequest, authorizeRole(['CLUB']), getProfile);

export default router;
