import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validationMiddleware'; // Import validation middleware
import { saveResumeSchema } from '../validators/resumeValidators'; // Import resume schemas
import { generateResumeContentSchema, reviewResumeContentSchema } from '../validators/aiValidators'; // Import AI schemas
import { saveResume, getResumeById } from '../controllers/resumeController';
import { generateResumeContent, reviewResumeContent } from '../controllers/aiController';

const router = Router();

// --- Existing Resume CRUD ---
// POST /api/resume/save - Create a new resume
router.post(
  '/save',
  authMiddleware,
  validateBody(saveResumeSchema),
  saveResume
);

// GET /api/resume/:id - Get a specific resume by its ID
// Note: Param validation could be added here if desired using a different validator (e.g., validateParams)
router.get('/:id', authMiddleware, getResumeById);

// --- AI-Powered Resume Features ---
// POST /api/resume/generate - Generate resume content using AI
router.post(
  '/generate',
  authMiddleware,
  validateBody(generateResumeContentSchema),
  generateResumeContent
);

// POST /api/resume/review - Review resume content using AI
router.post(
  '/review',
  authMiddleware,
  validateBody(reviewResumeContentSchema),
  reviewResumeContent
);

export default router;
