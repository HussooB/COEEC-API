// src/modules/staff/staff.service.ts
import bcrypt from 'bcryptjs';
import { prisma } from '../../prisma.js';
import cloudinary from '../../config/cloudinary.js';

export type CreateStaffInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  title?: string;
  academicRank?: string;
  departmentId?: number;
  officeLocation?: string;
  phone?: string;
};

export const createStaff = async (dto: CreateStaffInput, photo?: Express.Multer.File) => {
  const existing = await prisma.user.findUnique({ where: { email: dto.email } });
  if (existing) throw new Error('Email already exists');

  let photoUrl: string | null = null;
  if (photo) {
    const result = await cloudinary.uploader.upload(photo.path, {
      folder: 'coeec/staff',
      width: 400,
      height: 400,
      crop: 'fill',
      gravity: 'face',
    });
    photoUrl = result.secure_url;
  }

  const password = await bcrypt.hash(dto.password, 10);

  return prisma.user.create({
    data: {
      email: dto.email,
      password,
      firstName: dto.firstName,
      lastName: dto.lastName,
      title: dto.title ?? null,
      academicRank: dto.academicRank ?? null,
      departmentId: dto.departmentId ?? null,
      officeLocation: dto.officeLocation ?? null,
      phone: dto.phone ?? null,
      photoUrl,
      isActive: true,
      roles: {
        create: { role: { connect: { name: 'staff' } } },
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
};

export const updateProfile = async (
  userId: string,
  data: Partial<CreateStaffInput>,
  photo?: Express.Multer.File
) => {
  let photoUrl: string | undefined;
  if (photo) {
    const result = await cloudinary.uploader.upload(photo.path, {
      folder: 'coeec/staff',
      width: 400,
      height: 400,
      crop: 'fill',
      gravity: 'face',
    });
    photoUrl = result.secure_url;
  }

  const updateData: any = {};
  if (data.firstName !== undefined) updateData.firstName = data.firstName;
  if (data.lastName !== undefined) updateData.lastName = data.lastName;
  if (data.title !== undefined) updateData.title = data.title ?? null;
  if (data.academicRank !== undefined) updateData.academicRank = data.academicRank ?? null;
  if (data.officeLocation !== undefined) updateData.officeLocation = data.officeLocation ?? null;
  if (data.phone !== undefined) updateData.phone = data.phone ?? null;
  if (data.departmentId !== undefined) updateData.departmentId = data.departmentId ?? null;
  if (photoUrl) updateData.photoUrl = photoUrl;

  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  return prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      photoUrl: true,
      title: true,
      academicRank: true,
    },
  });
};

export const getAllStaff = async () => {
  return prisma.user.findMany({
    where: {
      roles: { some: { role: { name: { in: ['staff', 'dept_head', 'editor', 'admin'] } } } },
    },
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
};

export const getOneStaff = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    include: {
      education: { orderBy: { startYear: 'desc' } },
      experience: { orderBy: { startYear: 'desc' } },
      publications: true,
      department: { select: { name: true } },
    },
  });
};

export const searchStaff = async (query: string) => {
  return prisma.user.findMany({
    where: {
      OR: [
        { firstName: { contains: query, mode: 'insensitive' } },
        { lastName: { contains: query, mode: 'insensitive' } },
        { academicRank: { contains: query, mode: 'insensitive' } },
        { title: { contains: query, mode: 'insensitive' } },
      ],
      roles: { some: { role: { name: { in: ['staff', 'dept_head', 'editor', 'admin'] } } } },
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      title: true,
      photoUrl: true,
    },
    take: 20,
  });
};