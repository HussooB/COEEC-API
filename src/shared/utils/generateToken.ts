// src/shared/utils/generateToken.ts
import jwt from 'jsonwebtoken';

export const generateToken = (userId: string): string => {
  const payload = { sub: userId };
  const secret = process.env.JWT_SECRET as jwt.Secret;

  return jwt.sign(payload, secret, {
    expiresIn: '7d', // or '1d', '3h' — your choice
    algorithm: 'HS256',
  });
};