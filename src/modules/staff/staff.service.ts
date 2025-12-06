// src/modules/staff/staff.service.ts
import bcrypt from 'bcryptjs';
import { prisma } from '../../prisma.js';
import cloudinary from '../../config/cloudinary.js';
import type { CreateStaffDto } from './dto/create-staff.dto.js';

export class StaffService {
  static async create(dto: CreateStaffDto, photo?: Express.Multer.File) {
    const existing = await prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new Error('Email already exists');

    let photoUrl = null;
    if (photo) {
      const result = await cloudinary.uploader.upload(photo.path, {
        folder: 'coeec/staff',
        width: 400,
        height: 400,
        crop: 'fill',
      });
      photoUrl = result.secure_url;
    }

    const password = await bcrypt.hash(dto.password, 10);

    return prisma.user.create({
      data: {
        ...dto,
        password,
        photoUrl,
        isActive: true,
        roles: {
          create: {
            role: { connect: { name: 'staff' } },
          },
        },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        photoUrl: true,
        roles: { select: { role: { select: { name: true } } } },
      },
    });
  }

  static async updateProfile(userId: string, data: Partial<CreateStaffDto>, photo?: Express.Multer.File) {
    let photoUrl = undefined;
    if (photo) {
      const result = await cloudinary.uploader.upload(photo.path, {
        folder: 'coeec/staff',
        width: 400,
        height: 400,
        crop: 'fill',
      });
      photoUrl = result.secure_url;
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    } else {
      delete (data as any).password;
    }

    return prisma.user.update({
        where: { id: userId },
        data: { ...data, photoUrl } as any, // <-- bypass strict type checks
        select: { id: true, email: true, firstName: true, lastName: true, photoUrl: true },
        });
  }

  static async getAll() {
    return prisma.user.findMany({
      where: { roles: { some: { role: { name: { in: ['staff', 'dept_head', 'editor'] } } } } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        title: true,
        academicRank: true,
        photoUrl: true,
        department: { select: { name: true } },
      },
      orderBy: { firstName: 'asc' },
    });
  }
}