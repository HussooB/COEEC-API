// src/config/env.ts
import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: Number(process.env.PORT) || 5000,
  DATABASE_URL: process.env.DATABASE_URL!,    // ← ADD THIS
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
} as const;