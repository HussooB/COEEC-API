// src/modules/auth/auth.service.ts
import bcrypt from 'bcryptjs';
import { prisma } from '../../prisma.js';
import { generateToken } from '../../shared/utils/generateToken.js';

export class AuthService {
  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          select: {
            role: { select: { name: true } },
          },
        },
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid email or password');
    }

    return {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      roles: user.roles.map((r) => r.role.name),
      token: generateToken(user.id),
    };
  }
}