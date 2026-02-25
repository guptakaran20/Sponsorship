import { Router } from 'express';
import { createEvent, getEvents, getEventById, updateEvent, deleteEvent } from '../controllers/eventController';
import { authenticateRequest, authorizeRole } from '../middlewares/auth';

const router = Router();

// Publicly visible / authenticated for all
router.get('/', getEvents);
router.get('/:id', getEventById);

// Protected routes for clubs
router.post('/', authenticateRequest, authorizeRole(['CLUB']), createEvent);
router.put('/:id', authenticateRequest, authorizeRole(['CLUB']), updateEvent);
router.delete('/:id', authenticateRequest, authorizeRole(['CLUB']), deleteEvent);

export default router;
