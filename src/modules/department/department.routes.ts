// src/modules/department/department.routes.ts
import { Router } from 'express';
import { getAllDepartments, getOneDepartment } from './department.controller.js';

const router = Router();

/**
 * @swagger
 * /api/departments:
 *   get:
 *     summary: Get all departments
 *     tags: [Department]
 *     responses:
 *       200: { description: List of departments }
 */
router.get('/', getAllDepartments);

/**
 * @swagger
 * /api/departments/{id}:
 *   get:
 *     summary: Get one department
 *     tags: [Department]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Department details }
 *       404: { description: Not found }
 */
router.get('/:id', getOneDepartment);

export default router;