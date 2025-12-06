// src/modules/staff/staff.routes.ts
import { Router } from 'express';
import { StaffController } from './staff.controller.js';
import { protect } from '../../middleware/auth.middleware.js';
import { requirePermission } from '../../middleware/rbac.middleware.js';

const router = Router();

/**
 * @swagger
 * /api/staff:
 *   post:
 *     summary: Create new staff (super_admin only)
 *     tags: [Staff]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               photo: { type: string, format: binary }
 *     responses:
 *       201: { description: Staff created }
 */
router.post('/', protect, requirePermission('manage_all_staff'), StaffController.create);

/**
 * @swagger
 * /api/staff/profile:
 *   put:
 *     summary: Update own profile
 *     tags: [Staff]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName: { type: string }
 *               photo: { type: string, format: binary }
 *     responses:
 *       200: { description: Profile updated }
 */
router.put('/profile', protect, StaffController.updateMyProfile);

/**
 * @swagger
 * /api/staff:
 *   get:
 *     summary: Get all staff (public)
 *     tags: [Staff]
 *     responses:
 *       200: { description: List of staff }
 */
router.get('/', StaffController.getAll);

export default router;