import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validationMiddleware'; // Import validation middleware
import { generateCoverLetterContentSchema } from '../validators/aiValidators'; // Import AI schema
import { generateCoverLetterContent } from '../controllers/aiController';

const router = Router();

// POST /api/cover-letter/generate - Generate cover letter content using AI
router.post(
  '/generate',
  authMiddleware,
  validateBody(generateCoverLetterContentSchema),
  generateCoverLetterContent
);

export default router;
