// src/modules/staff/staff.controller.ts
import type { Request, Response } from 'express';
import {
  createStaff,
  updateProfile,
  getAllStaff,
  getOneStaff,
  searchStaff,
} from './staff.service.js';
import { uploadPhoto } from '../../middleware/upload.middleware.js';

export const createStaffHandler = (req: Request, res: Response) => {
  uploadPhoto(req, res, async () => {
    try {
      const result = await createStaff(req.body, req.file);
      res.status(201).json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  });
};

export const updateMyProfileHandler = (req: Request, res: Response) => {
  uploadPhoto(req, res, async () => {
    try {
      const userId = req.user!.id;
      const result = await updateProfile(userId, req.body, req.file);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  });
};

export const getAllStaffHandler = async (_req: Request, res: Response) => {
  const staff = await getAllStaff();
  res.json({ success: true, data: staff });
};

export const getOneStaffHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({ message: 'Staff ID is required' });
  }

  const staff = await getOneStaff(id);
  if (!staff) {
    return res.status(404).json({ message: 'Staff not found' });
  }

  return res.json({ success: true, data: staff });
};

export const searchStaffHandler = async (req: Request, res: Response) => {
  const q = req.query.q as string | undefined;

  if (!q || q.trim() === '') {
    return res.json({ success: true, data: [] });
  }

  const staff = await searchStaff(q);
  return res.json({ success: true, data: staff });
};