import { Router } from 'express';
import { createDeal, getDeals, updateDealStatus } from '../controllers/dealController';
import { authenticateRequest, authorizeRole } from '../middlewares/auth';

const router = Router();

router.post('/', authenticateRequest, authorizeRole(['COMPANY']), createDeal);
router.get('/', authenticateRequest, getDeals);
router.put('/:id', authenticateRequest, authorizeRole(['CLUB']), updateDealStatus);

export default router;
