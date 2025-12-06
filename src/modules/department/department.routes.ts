// src/modules/department/department.routes.ts
import { Router } from 'express';
import { DepartmentController } from './department.controller.js';

const router = Router();

router.get('/', DepartmentController.getAll);
router.get('/:id', DepartmentController.getOne);

export default router;