import { Router } from 'express';
import { sendMessage, getMessages } from '../controllers/messageController';
import { authenticateRequest } from '../middlewares/auth';

const router = Router();

router.post('/', authenticateRequest, sendMessage);
router.get('/:otherUserId', authenticateRequest, getMessages);

export default router;
