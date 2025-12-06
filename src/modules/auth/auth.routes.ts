// src/modules/auth/auth.routes.ts
import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login staff/admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', AuthController.login);

router.get('/me', protect, AuthController.me);

export default router;