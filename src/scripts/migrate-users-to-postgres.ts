// Shreeji Hero Showroom ERP - User Migration Script (JSON -> PostgreSQL)

import fs from 'fs';
import path from 'path';
import prisma from '../lib/prisma';

export async function migrateUsersToPostgres() {
  console.log('====================================================');
  console.log('SHREEJI HERO ERP - POSTGRESQL USER MIGRATION SCRIPT');
  console.log('====================================================\n');

  const usersJsonPath = path.join(process.cwd(), 'src/lib/db/data/users.json');
  if (!fs.existsSync(usersJsonPath)) {
    console.error(`[ERROR] JSON user storage file not found at: ${usersJsonPath}`);
    return { success: false, error: 'users.json not found' };
  }

  let jsonUsers: any[] = [];
  try {
    const fileData = fs.readFileSync(usersJsonPath, 'utf-8');
    jsonUsers = JSON.parse(fileData);
  } catch (err: any) {
    console.error(`[ERROR] Failed to parse users.json: ${err.message}`);
    return { success: false, error: err.message };
  }

  console.log(`[INFO] Found ${jsonUsers.length} user records in disk storage.`);
  let migratedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (const user of jsonUsers) {
    try {
      const normalizedEmail = (user.email || '').trim().toLowerCase();
      const normalizedCode = (user.employeeCode || '').trim();

      if (!normalizedEmail || !normalizedCode) {
        console.warn(`[WARN] Skipping invalid record without email/code: ${JSON.stringify(user)}`);
        skippedCount++;
        continue;
      }

      // Upsert user into PostgreSQL via Prisma
      await prisma.user.upsert({
        where: { email: normalizedEmail },
        update: {
          name: user.name,
          employeeCode: normalizedCode,
          phone: user.phone || '+91 98765 43210',
          role: user.role,
          branchId: user.branchId || null,
          department: user.department || null,
          designation: user.designation || null,
          status: user.status || 'ACTIVE',
          passwordHash: user.passwordHash,
          updatedAt: new Date(),
        },
        create: {
          id: user.id,
          employeeCode: normalizedCode,
          name: user.name,
          email: normalizedEmail,
          passwordHash: user.passwordHash,
          phone: user.phone || '+91 98765 43210',
          role: user.role,
          branchId: user.branchId || null,
          department: user.department || null,
          designation: user.designation || null,
          status: user.status || 'ACTIVE',
          createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
          updatedAt: new Date(),
        },
      });

      migratedCount++;
      console.log(`[MIGRATED] ${normalizedCode} | ${user.name} (${user.role}) -> PostgreSQL`);
    } catch (err: any) {
      console.error(`[FAIL] Could not migrate user ${user.email}: ${err.message}`);
      failedCount++;
    }
  }

  console.log('\n----------------------------------------------------');
  console.log(`MIGRATION SUMMARY: ${migratedCount} Migrated, ${skippedCount} Skipped, ${failedCount} Failed`);
  console.log('----------------------------------------------------\n');

  return {
    success: failedCount === 0,
    total: jsonUsers.length,
    migrated: migratedCount,
    skipped: skippedCount,
    failed: failedCount,
  };
}

// Execute if run directly via tsx / ts-node
if (require.main === module) {
  migrateUsersToPostgres()
    .then((res) => {
      if (!res.success) process.exit(1);
      process.exit(0);
    })
    .catch((err) => {
      console.error('[FATAL] Migration error:', err);
      process.exit(1);
    });
}
