// prisma/seed.ts — FINAL VERSION — 100% WORKING
import { prisma } from '../src/prisma.js';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Starting full realistic seed for COEEC...');

  // 1. Create Super Admin
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
        create: [{
          role: {
            connectOrCreate: {
              where: { name: 'super_admin' },
              create: { name: 'super_admin', description: 'Full system access' },
            },
          },
        }],
      },
    },
  });

  // 2. Create Roles
  await prisma.role.createMany({
    data: [
      { name: 'admin' },
      { name: 'dept_head' },
      { name: 'editor' },
      { name: 'staff' },
    ],
    skipDuplicates: true,
  });

  // 3. Create Departments + Heads (CORRECT WAY)
  const departments = [
    { name: 'Computer Science and Engineering', shortName: 'CSE', description: 'Focus on AI, software, and systems.' },
    { name: 'Software Engineering', shortName: 'SE', description: 'Building scalable and reliable software.' },
    { name: 'Electrical and Computer Engineering', shortName: 'ECE', description: 'Power systems, electronics, IoT.' },
    { name: 'Electronics and Communication Engineering', shortName: 'ECE', description: '5G, networks, signal processing.' },
    { name: 'Electrical Power and Control Engineering', shortName: 'EPCE', description: 'Renewable energy, smart grids.' },
  ];

  const deptHeads = [
    { name: 'Dr. Berhanu Bulcha', dept: 'Computer Science and Engineering', rank: 'Dean / Associate Professor', email: 'berhanu@coeec.astu.edu.et' },
    { name: 'Dr. Sarah Ahmed', dept: 'Software Engineering', rank: 'Head of Department', email: 'sarah@coeec.astu.edu.et' },
    { name: 'Prof. Tesfaye Lemma', dept: 'Electrical and Computer Engineering', rank: 'Professor', email: 'tesfaye@coeec.astu.edu.et' },
    { name: 'Dr. Azeb Getachew', dept: 'Electronics and Communication Engineering', rank: 'Associate Professor', email: 'azeb@coeec.astu.edu.et' },
    { name: 'Eng. Daniel Kebede', dept: 'Electrical Power and Control Engineering', rank: 'Head of Department', email: 'daniel@coeec.astu.edu.et' },
  ];

  for (const dept of departments) {
    const headInfo = deptHeads.find(h => h.dept === dept.name);

    let headUser = null;
    if (headInfo) {
      headUser = await prisma.user.upsert({
        where: { email: headInfo.email },
        update: {},
        create: {
          email: headInfo.email,
          password: await bcrypt.hash('123456', 10),
          firstName: headInfo.name.split(' ')[1],
          lastName: headInfo.name.split(' ')[2] || 'Head',
          title: headInfo.name.includes('Dr.') ? 'Dr.' : 'Prof.',
          academicRank: headInfo.rank,
          photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
          department: { create: dept },
          roles: {
            create: [
              { role: { connect: { name: 'dept_head' } } },
              { role: { connect: { name: 'staff' } } },
            ],
          },
        },
      });
    }

    // Use findFirst + create/update instead of upsert with name
    const existingDept = await prisma.department.findFirst({
      where: { name: dept.name },
    });

    if (existingDept) {
      await prisma.department.update({
        where: { id: existingDept.id },
        data: { headId: headUser?.id ?? null },
      });
    } else {
      await prisma.department.create({
        data: {
          name: dept.name,
          shortName: dept.shortName,
          description: dept.description,
          headId: headUser?.id ?? null,
        },
      });
    }
  }

  // 4. Programs
  const deptMap = await prisma.department.findMany({ select: { id: true, name: true } });
  const getDeptId = (name: string) => deptMap.find(d => d.name === name)?.id;

  await prisma.program.createMany({
    data: [
      { name: 'B.Sc. in Computer Science and Engineering', level: 'BSc', duration: 5, departmentId: getDeptId('Computer Science and Engineering')! },
      { name: 'M.Sc. in Artificial Intelligence', level: 'MSc', duration: 2, departmentId: getDeptId('Computer Science and Engineering')! },
      { name: 'B.Sc. in Software Engineering', level: 'BSc', duration: 5, departmentId: getDeptId('Software Engineering')! },
      { name: 'B.Sc. in Electrical Power Engineering', level: 'BSc', duration: 5, departmentId: getDeptId('Electrical Power and Control Engineering')! },
    ],
    skipDuplicates: true,
  });

  // 5. News
  await prisma.news.createMany({
    data: [
      {
        title: 'COEEC Wins National AI Award 2025',
        slug: 'coeec-wins-national-ai-award-2025',
        content: 'Outstanding achievement!',
        excerpt: 'Our students brought honor to Ethiopia.',
        status: 'published',
        authorId: superAdmin.id,
        publishedAt: new Date(),
      },
      {
        title: 'New IoT Lab Launched',
        slug: 'new-iot-lab-launched',
        content: 'State-of-the-art equipment now available.',
        excerpt: 'Open for research!',
        status: 'published',
        authorId: superAdmin.id,
        publishedAt: new Date(),
      },
    ],
    skipDuplicates: true,
  });

  // 6. Research
  await prisma.researchProject.createMany({
    data: [
      {
        title: 'Smart Agriculture IoT Network',
        slug: 'smart-agriculture-iot-network',
        description: 'Using LoRa and AI for precision farming',
        status: 'ongoing',
        principalInvestigatorId: superAdmin.id,
        featuredImage: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
      },
      {
        title: '5G Network Optimization for Rural Areas',
        slug: '5g-rural-optimization',
        description: 'Bringing connectivity to remote Ethiopia',
        status: 'ongoing',
        principalInvestigatorId: superAdmin.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log('FULL REALISTIC SEED COMPLETED SUCCESSFULLY!');
  console.log('   5 Departments + Heads');
  console.log('   4 Programs');
  console.log('   2 News + 2 Research Projects');
  console.log('   Login: admin@coeec.astu.edu.et / admin123');
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error('Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });