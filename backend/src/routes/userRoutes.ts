import { Router } from 'express';
import { getProfile } from '../controllers/userController';
import authMiddleware from '../middleware/authMiddleware'; // Ensure path is correct

const router = Router();

// This route will be mounted under /api/profile, so GET / means GET /api/profile
router.get('/', authMiddleware, getProfile);

export default router;
