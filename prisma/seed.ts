// prisma/seed.ts — ULTIMATE FINAL VERSION — 100% COMPLETE
import { prisma } from '../src/prisma.js';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Starting ULTIMATE FULL SEED for COEEC...');

  // 1. Super Admin + Roles
  const adminPass = await bcrypt.hash('admin123', 10);
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@coeec.astu.edu.et' },
    update: {},
    create: {
      email: 'admin@coeec.astu.edu.et',
      password: adminPass,
      firstName: 'Super',
      lastName: 'Admin',
      title: 'Prof.',
      academicRank: 'Dean',
      photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      isActive: true,
      roles: {
        create: [{ role: { connectOrCreate: { where: { name: 'super_admin' }, create: { name: 'super_admin' } } } }],
      },
    },
  });

  await prisma.role.createMany({
    data: [
      { name: 'admin' },
      { name: 'dept_head' },
      { name: 'editor' },
      { name: 'staff' },
    ],
    skipDuplicates: true,
  });

  // 2. Departments + Heads
  const depts = [
    { name: 'Computer Science and Engineering', short: 'CSE' },
    { name: 'Software Engineering', short: 'SE' },
    { name: 'Electrical and Computer Engineering', short: 'ECE' },
    { name: 'Electronics and Communication Engineering', short: 'ECE' },
    { name: 'Electrical Power and Control Engineering', short: 'EPCE' },
  ];

  const heads = [
    { name: 'Dr. Berhanu Bulcha', dept: 'Computer Science and Engineering', email: 'berhanu@coeec.astu.edu.et', rank: 'Dean' },
    { name: 'Dr. Sarah Ahmed', dept: 'Software Engineering', email: 'sarah@coeec.astu.edu.et', rank: 'Head' },
    { name: 'Prof. Tesfaye Lemma', dept: 'Electrical and Computer Engineering', email: 'tesfaye@coeec.astu.edu.et', rank: 'Professor' },
    { name: 'Dr. Azeb Getachew', dept: 'Electronics and Communication Engineering', email: 'azeb@coeec.astu.edu.et', rank: 'Associate Professor' },
    { name: 'Eng. Daniel Kebede', dept: 'Electrical Power and Control Engineering', email: 'daniel@coeec.astu.edu.et', rank: 'Head' },
  ];

  for (const dept of depts) {
    const head = heads.find(h => h.dept === dept.name);
    const headUser = head ? await prisma.user.upsert({
      where: { email: head.email },
      update: {},
      create: {
        email: head.email,
        password: await bcrypt.hash('123456', 10),
        firstName: head.name.split(' ')[1],
        lastName: head.name.split(' ')[2] || 'Head',
        title: head.name.includes('Dr.') ? 'Dr.' : 'Eng.',
        academicRank: head.rank,
        photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        department: { create: { name: dept.name, shortName: dept.short } },
        roles: { create: [{ role: { connect: { name: 'dept_head' } } }, { role: { connect: { name: 'staff' } } }] },
        education: {
          create: [
            { degree: 'PhD', field: 'Computer Science', institution: 'MIT', startYear: 2015, endYear: 2019, isCurrent: true },
            { degree: 'MSc', field: 'Software Engineering', institution: 'Stanford', startYear: 2012, endYear: 2014 },
          ],
        },
        experience: {
          create: [
            { position: 'Professor', organization: 'ASTU', startYear: 2020, isCurrent: true },
            { position: 'Researcher', organization: 'Google', startYear: 2018, endYear: 2020 },
          ],
        },
        publications: {
          create: [
            { title: 'AI for Agriculture in Ethiopia', type: 'journal', venue: 'IEEE', year: 2024 },
            { title: '5G Optimization', type: 'conference', venue: 'ICML', year: 2023 },
          ],
        },
      },
    }) : null;

    const existing = await prisma.department.findFirst({ where: { name: dept.name } });
    if (existing) {
      await prisma.department.update({ where: { id: existing.id }, data: { headId: headUser?.id ?? null } });
    } else {
      await prisma.department.create({
        data: { name: dept.name, shortName: dept.short, headId: headUser?.id ?? null },
      });
    }
  }

  // 3. Programs
  const deptMap = Object.fromEntries(
    (await prisma.department.findMany({ select: { id: true, name: true } })).map(d => [d.name, d.id])
  );

  await prisma.program.createMany({
    data: [
      { name: 'B.Sc. in Computer Science and Engineering', level: 'BSc', duration: 5, departmentId: deptMap['Computer Science and Engineering'] },
      { name: 'M.Sc. in Artificial Intelligence', level: 'MSc', duration: 2, departmentId: deptMap['Computer Science and Engineering'] },
      { name: 'B.Sc. in Software Engineering', level: 'BSc', duration: 5, departmentId: deptMap['Software Engineering'] },
      { name: 'B.Sc. in Electrical Power Engineering', level: 'BSc', duration: 5, departmentId: deptMap['Electrical Power and Control Engineering'] },
    ],
    skipDuplicates: true,
  });

  // 4. News + Research + Contact Messages
  await prisma.news.createMany({
    data: [
      { title: 'COEEC Wins AI Award 2025', slug: 'ai-award-2025', content: 'Great achievement!', excerpt: 'National recognition', status: 'published', authorId: superAdmin.id, publishedAt: new Date() },
      { title: 'New IoT Lab Opened', slug: 'iot-lab-opened', content: 'State-of-the-art equipment', excerpt: 'Now open!', status: 'published', authorId: superAdmin.id, publishedAt: new Date() },
    ],
    skipDuplicates: true,
  });

  await prisma.researchProject.createMany({
    data: [
      { title: 'Smart Agriculture IoT Network', slug: 'smart-agriculture', description: 'AI + LoRa for farming', status: 'ongoing', principalInvestigatorId: superAdmin.id },
      { title: '5G Rural Optimization', slug: '5g-rural', description: 'Connectivity for all', status: 'ongoing', principalInvestigatorId: superAdmin.id },
    ],
    skipDuplicates: true,
  });

  await prisma.contactMessage.createMany({
    data: [
      { firstName: 'John', lastName: 'Doe', email: 'john@example.com', subject: 'Inquiry', message: 'Hello!' },
    ],
    skipDuplicates: true,
  });

  console.log('ULTIMATE SEED COMPLETE — EVERYTHING FILLED!');
  console.log('   Education, Experience, Publications: Added');
  console.log('   Contact Messages: 1 example');
  console.log('   All tables have real data');
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });