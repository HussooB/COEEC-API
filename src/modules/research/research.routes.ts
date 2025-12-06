// src/modules/research/research.routes.ts
import { Router } from 'express';
import { ResearchController } from './research.controller.js';
import { protect } from '../../middleware/auth.middleware.js';
import { requirePermission } from '../../middleware/rbac.middleware.js';

const router = Router();

router.get('/', ResearchController.getAll);
router.post('/', protect, requirePermission('manage_research'), ResearchController.create);

export default router;