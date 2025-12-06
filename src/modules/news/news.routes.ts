// src/modules/news/news.routes.ts
import { Router } from 'express';
import { NewsController } from './news.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/', NewsController.getAll);
router.post('/', protect, NewsController.create);

export default router;