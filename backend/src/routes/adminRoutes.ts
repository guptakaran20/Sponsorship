import express from 'express';
import { authenticateRequest, authorizeRole } from '../middlewares/auth';
import { getStats, getAllUsers, getAllEvents, getAllDeals } from '../controllers/adminController';

const router = express.Router();

// All routes require authentication and ADMIN role
router.use(authenticateRequest);
router.use(authorizeRole(['ADMIN']));

// Admin endpoints
router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.get('/events', getAllEvents);
router.get('/deals', getAllDeals);

export default router;
