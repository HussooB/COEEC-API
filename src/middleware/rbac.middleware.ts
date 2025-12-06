// src/middleware/rbac.middleware.ts
import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma.js';

export const requirePermission = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
      },
    });

    const hasPermission = user?.roles.some((ur) =>
      ur.role.permissions.some((p) => p.permission.name === permission)
    );

    if (!hasPermission) {
      return res.status(403).json({ message: `Forbidden: Missing '${permission}'` });
    }

    next();
  };
};