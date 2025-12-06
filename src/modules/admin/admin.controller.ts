// src/modules/admin/admin.controller.ts
import type { Request, Response } from 'express';
import { prisma } from '../../prisma.js';

export const getContactMessages = async (_req: Request, res: Response) => {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return res.json({ success: true, data: messages });
};