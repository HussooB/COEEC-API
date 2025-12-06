// src/modules/auth/auth.controller.ts
import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static me(req: Request, res: Response) {
    res.json({ success: true, user: req.user });
  }
}