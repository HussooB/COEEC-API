// src/modules/news/news.controller.ts
import type { Request, Response } from 'express';
import { prisma } from '../../prisma.js';
import { uploadPhoto } from '../../middleware/upload.middleware.js';
import cloudinary from '../../config/cloudinary.js';

export class NewsController {
  static async getAll(_req: Request, res: Response) {
    const news = await prisma.news.findMany({
      where: { status: 'published' },
      include: { author: { select: { firstName: true, lastName: true } } },
      orderBy: { publishedAt: 'desc' },
    });
    res.json({ success: true, data: news });
  }

  static async create(req: Request, res: Response) {
    uploadPhoto(req, res, async () => {
      let featuredImage = null;
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'coeec/news',
        });
        featuredImage = result.secure_url;
      }

      const news = await prisma.news.create({
        data: {
          ...req.body,
          slug: req.body.title.toLowerCase().replace(/ /g, '-'),
          authorId: req.user!.id,
          featuredImage,
          status: req.user?.roles.includes('editor') ? 'published' : 'draft',
          publishedAt: req.user?.roles.includes('editor') ? new Date() : null,
        },
      });

      res.status(201).json({ success: true, data: news });
    });
  }
}