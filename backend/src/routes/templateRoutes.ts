import { Router } from 'express';
import { getTemplates } from '../controllers/templateController'; // Ensure path is correct

const router = Router();

// This route will be mounted under /api/templates, so GET / means GET /api/templates
router.get('/', getTemplates);

export default router;
