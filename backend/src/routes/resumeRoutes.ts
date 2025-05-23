import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import { validate } from '../middleware/validationMiddleware'; // Import new validate middleware
import { saveResumeSchema } from '../validators/resumeValidators'; 
import { generateResumeContentSchema, reviewResumeContentSchema } from '../validators/aiValidators';
import { idParamSchema } from '../validators/commonValidators'; // Import ID schema
import { saveResume, getResumeById } from '../controllers/resumeController';
import { generateResumeContent, reviewResumeContent } from '../controllers/aiController';

const router = Router();

// --- Existing Resume CRUD ---
// POST /api/resume/save - Create a new resume
router.post(
  '/save',
  authMiddleware,
  validate({ body: saveResumeSchema }), // Use new validate middleware
  saveResume
);

// GET /api/resume/:id - Get a specific resume by its ID
router.get(
  '/:id',
  authMiddleware,
  validate({ params: idParamSchema }), // Add params validation
  getResumeById
);

// --- AI-Powered Resume Features ---
// POST /api/resume/generate - Generate resume content using AI
router.post(
  '/generate',
  authMiddleware,
  validate({ body: generateResumeContentSchema }), // Use new validate middleware
  generateResumeContent
);

// POST /api/resume/review - Review resume content using AI
router.post(
  '/review',
  authMiddleware,
  validate({ body: reviewResumeContentSchema }), // Use new validate middleware
  reviewResumeContent
);

export default router;
