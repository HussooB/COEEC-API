// src/modules/research/research.controller.ts
import type { Request, Response } from 'express';
import { prisma } from '../../../prisma.js';
import { uploadPhoto } from '../../middleware/upload.middleware.js';
import cloudinary from '../../config/cloudinary.js';

export class ResearchController {
  static async getAll(_: Request, res: Response) {
    const projects = await prisma.researchProject.findMany({
      include: {
        principalInvestigator: {
          select: { firstName: true, lastName: true, photoUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: projects });
  }

  static async create(req: Request, res: Response) {
    uploadPhoto(req, res, async () => {
      let featuredImage = null;
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'coeec/research',
        });
        featuredImage = result.secure_url;
      }

      const project = await prisma.researchProject.create({
        data: {
          ...req.body,
          slug: req.body.title.toLowerCase().replace(/ /g, '-'),
          principalInvestigatorId: req.user!.id,
          featuredImage,
        },
      });

      res.status(201).json({ success: true, data: project });
    });
  }
}