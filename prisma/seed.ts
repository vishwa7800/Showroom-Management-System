// Shreeji Hero Showroom ERP - Prisma Database Seed Script
import { PrismaClient, Role, AccountStatus, BranchStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('====================================================');
  console.log('SHREEJI HERO ERP - PRISMA DATABASE SEEDING');
  console.log('====================================================\n');

  // 1. Seed Authorized Branches
  const branches = [
    {
      id: 'br_halvad',
      code: 'SHR-HLV',
      name: 'Shreeji Hero - Halvad Main Branch',
      address: 'Near S.T. Bus Station, Dhrangadhra Highway',
      city: 'Halvad',
      state: 'Gujarat',
      pincode: '363330',
      phone: '+91 98765 43210',
      email: 'halvad@shreejihero.com',
      hasSales: true,
      hasService: true,
      status: BranchStatus.ACTIVE,
    },
    {
      id: 'br_dhangadhra',
      code: 'SHR-DHN',
      name: 'Shreeji Hero - Dhangadhra Branch',
      address: 'Opposite Railway Station, Station Road',
      city: 'Dhangadhra',
      state: 'Gujarat',
      pincode: '363310',
      phone: '+91 98765 43220',
      email: 'dhangadhra@shreejihero.com',
      hasSales: true,
      hasService: true,
      status: BranchStatus.ACTIVE,
    },
    {
      id: 'br_jetpur',
      code: 'SHR-JTP',
      name: 'Shreeji Hero - Jetpur Branch',
      address: 'Kuvadva Road, Near Marketing Yard',
      city: 'Jetpur',
      state: 'Gujarat',
      pincode: '360370',
      phone: '+91 98765 43230',
      email: 'jetpur@shreejihero.com',
      hasSales: true,
      hasService: true,
      status: BranchStatus.ACTIVE,
    },
  ];

  for (const b of branches) {
    await prisma.branch.upsert({
      where: { code: b.code },
      update: b,
      create: b,
    });
    console.log(`[SEED] Branch: ${b.name} (${b.code})`);
  }

  // 2. Seed Initial Admin Account
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'rajesh@shreejihero.com' },
    update: {
      name: 'Rajesh Sharma',
      employeeCode: 'EMP-1001',
      phone: '+91 98765 43210',
      role: Role.ADMIN,
      department: 'Executive',
      designation: 'Managing Director & Dealer Principal',
      status: AccountStatus.ACTIVE,
    },
    create: {
      id: 'usr_admin',
      employeeCode: 'EMP-1001',
      name: 'Rajesh Sharma',
      email: 'rajesh@shreejihero.com',
      passwordHash: adminPasswordHash,
      phone: '+91 98765 43210',
      role: Role.ADMIN,
      department: 'Executive',
      designation: 'Managing Director & Dealer Principal',
      status: AccountStatus.ACTIVE,
    },
  });
  console.log(`[SEED] Initial Admin: ${adminUser.name} (${adminUser.email})`);

  console.log('\n[SUCCESS] Baseline production seed completed successfully.');
}

main()
  .catch((e) => {
    console.error('[ERROR] Prisma seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
