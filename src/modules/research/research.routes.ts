// src/modules/research/research.routes.ts
import { Router } from 'express';
import { getAllResearch, createResearch } from './research.controller.js';
import { protect } from '../../middleware/auth.middleware.js';
import { requirePermission } from '../../middleware/rbac.middleware.js';

const router = Router();

/**
 * @swagger
 * /api/research:
 *   get:
 *     summary: Get all research projects
 *     tags: [Research]
 *     responses:
 *       200: { description: List of projects }
 */
router.get('/', getAllResearch);

/**
 * @swagger
 * /api/research:
 *   post:
 *     summary: Create research project (requires manage_research)
 *     tags: [Research]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               status: { type: string }
 *               photo: { type: string, format: binary }
 *     responses:
 *       201: { description: Project created }
 */
router.post('/', protect, requirePermission('manage_research'), createResearch);

export default router;