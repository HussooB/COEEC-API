// src/modules/admin/admin.routes.ts
import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import { requirePermission } from '../../middleware/rbac.middleware.js';
import { getContactMessages } from './admin.controller.js';

const router = Router();

/**
 * @swagger
 * /api/admin/contact-messages:
 *   get:
 *     summary: Get all contact messages (admin only)
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of messages }
 */
router.get(
  '/contact-messages',
  protect,
  requirePermission('view_contact_messages'), // or just use super_admin check
  getContactMessages
);

export default router;