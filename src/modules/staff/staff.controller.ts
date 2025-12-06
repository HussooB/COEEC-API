// src/modules/staff/staff.controller.ts
import type { Request, Response } from 'express';
import { StaffService } from './staff.service.js';
import { uploadPhoto } from '../../middleware/upload.middleware.js';

export class StaffController {
  // Only super_admin
  static async create(req: Request, res: Response) {
    try {
      uploadPhoto(req, res, async () => {
        const result = await StaffService.create(req.body, req.file);
        res.status(201).json({ success: true, data: result });
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // Own profile only
  static async updateMyProfile(req: Request, res: Response) {
    try {
      uploadPhoto(req, res, async () => {
        const userId = req.user!.id;
        const result = await StaffService.updateProfile(userId, req.body, req.file);
        res.json({ success: true, data: result });
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    const staff = await StaffService.getAll();
    res.json({ success: true, data: staff });
  }
}