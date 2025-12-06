// src/modules/department/department.controller.ts
import type { Request, Response } from 'express';
import { prisma } from '../../prisma.js';

export class DepartmentController {
  static async getAll(_: Request, res: Response) {
    const departments = await prisma.department.findMany({
      include: {
        head: { select: { firstName: true, lastName: true, photoUrl: true } },
        programs: true,
        _count: { select: { staff: true } },
      },
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, data: departments });
  }

  static async getOne(req: Request, res: Response) {
    const { id } = req.params;
    const dept = await prisma.department.findUnique({
      where: { id: Number(id) },
      include: {
        head: true,
        programs: true,
        staff: {
          select: { id: true, firstName: true, lastName: true, title: true, photoUrl: true },
        },
      },
    });
    if (!dept) return res.status(404).json({ message: 'Department not found' });
    res.json({ success: true, data: dept });
  }
}