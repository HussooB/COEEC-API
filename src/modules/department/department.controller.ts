// src/modules/department/department.controller.ts
import type { Request, Response } from 'express';
import { prisma } from '../../prisma.js';

export const getAllDepartments = async (_req: Request, res: Response) => {
  const departments = await prisma.department.findMany({
    include: {
      head: { select: { firstName: true, lastName: true, photoUrl: true } },
      programs: true,
      _count: { select: { staff: true } },
    },
    orderBy: { name: 'asc' },
  });
  return res.json({ success: true, data: departments });
};

export const getOneDepartment = async (req: Request, res: Response) => {
  const idParam = req.params.id;

  if (!idParam || isNaN(Number(idParam))) {
    return res.status(400).json({ message: 'Valid department ID is required' });
  }

  const id = Number(idParam);

  const dept = await prisma.department.findUnique({
    where: { id },
    include: {
      head: true,
      programs: true,
      staff: {
        select: { id: true, firstName: true, lastName: true, title: true, photoUrl: true },
      },
    },
  });

  if (!dept) {
    return res.status(404).json({ message: 'Department not found' });
  }

  return res.json({ success: true, data: dept });
};