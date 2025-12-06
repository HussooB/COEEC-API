// auth.controller.ts
import type { Request, Response } from 'express';
import { login } from './auth.service.js';

export const loginHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await login(email, password);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const me = (req: Request, res: Response) => {
  res.json({ success: true, user: req.user });
};