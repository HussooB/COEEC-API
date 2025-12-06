// src/modules/public/public.controller.ts
import type { Request, Response } from 'express';
import { prisma } from '../../prisma.js';

export const submitContact = async (req: Request, res: Response) => {
  const { firstName, lastName, email, subject, message } = req.body;

  if (!firstName || !email || !message) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  await prisma.contactMessage.create({
    data: { firstName, lastName, email, subject, message },
  });

  return res.json({ success: true, message: 'Thank you! Your message has been sent.' });
};

export const subscribeNewsletter = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Valid email required' });
  }

  // You can add a Newsletter table later
  return res.json({ success: true, message: `Subscribed ${email} to newsletter!` });
};