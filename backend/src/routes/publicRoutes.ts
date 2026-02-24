import express from 'express';
import { getClubProfileView, getCompanyProfileView, getLeaderboard } from '../controllers/publicController';
import { authenticateRequest } from '../middlewares/auth';

const router = express.Router();

router.get('/leaderboard', getLeaderboard);

// The view routes use authenticateRequest because they apply privacy rules based on the logged-in viewer
router.get('/club/:id', authenticateRequest, getClubProfileView);
router.get('/company/:id', authenticateRequest, getCompanyProfileView);

export default router;
