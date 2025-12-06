// prisma/seed.ts
import { prisma } from '../prisma.js';
import bcrypt from 'bcryptjs';

async function main() {
  const password = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@coeec.astu.edu.et' },
    update: {},
    create: {
      email: 'admin@coeec.astu.edu.et',
      password,
      firstName: 'Super',
      lastName: 'Admin',
      title: 'Prof.',
      academicRank: 'Dean',
      isActive: true,
      roles: {
        create: [
          {
            role: {
              connectOrCreate: {
                where: { name: 'super_admin' },
                create: { name: 'super_admin', description: 'Full system access' },
              },
            },
          },
        ],
      },
    },
  });

  console.log('Super Admin Created!');
  console.log('Email: admin@coeec.astu.edu.et');
  console.log('Password: admin123');
  await prisma.role.createMany({
  data: [
    { name: 'admin', description: 'College administrator' },
    { name: 'dept_head', description: 'Department head' },
    { name: 'editor', description: 'Can publish news' },
    { name: 'staff', description: 'Regular faculty' },
  ],
  skipDuplicates: true,
});
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });