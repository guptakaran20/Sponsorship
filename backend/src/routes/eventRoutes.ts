import { Router } from 'express';
import { createEvent, getEvents, getEventById } from '../controllers/eventController';
import { authenticateRequest, authorizeRole } from '../middlewares/auth';

const router = Router();

// Publicly visible / authenticated for all
router.get('/', getEvents);
router.get('/:id', getEventById);

// Protected routes for clubs
router.post('/', authenticateRequest, authorizeRole(['CLUB']), createEvent);

export default router;
