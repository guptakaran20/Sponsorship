import { Router } from 'express';
import { createOrUpdateProfile, getProfile } from '../controllers/companyController';
import { authenticateRequest, authorizeRole } from '../middlewares/auth';

const router = Router();

router.post('/profile', authenticateRequest, authorizeRole(['COMPANY']), createOrUpdateProfile);
router.get('/profile', authenticateRequest, authorizeRole(['COMPANY']), getProfile);

export default router;
