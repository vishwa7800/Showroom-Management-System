// Shreeji Hero Showroom ERP - Dev-Only Session Simulator

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAllUsers } from '@/lib/db/users-store';
import { signSessionToken } from '@/lib/auth/jwt';
import { SESSION_COOKIE_NAME, COOKIE_OPTIONS } from '@/lib/auth/cookies';
import { Role } from '@/types';
import { createAuditLog } from '@/lib/audit';

export async function POST(request: Request) {
  // Disallow in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  try {
    const { role } = await request.json();
    const users = await getAllUsers();
    const targetUser = users.find((u) => u.role === role && u.status === 'ACTIVE');

    if (!targetUser) {
      return NextResponse.json({ error: `No active user found for role ${role}` }, { status: 404 });
    }

    const sessionPayload = {
      userId: targetUser.id,
      employeeCode: targetUser.employeeCode,
      name: targetUser.name,
      email: targetUser.email,
      role: targetUser.role,
      branchId: targetUser.branchId,
      branchName: targetUser.branchName,
      status: targetUser.status,
      department: targetUser.department,
      designation: targetUser.designation,
    };

    const token = await signSessionToken(sessionPayload);

    const cookieStore = cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, COOKIE_OPTIONS);

    await createAuditLog({
      actorId: targetUser.id,
      actorName: targetUser.name,
      actorRole: targetUser.role,
      branchId: targetUser.branchId,
      action: 'DEV_ROLE_SWITCH',
      entity: 'Session',
      changeDetails: { switchedToRole: targetUser.role },
    });

    return NextResponse.json({
      success: true,
      user: targetUser,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to switch dev session' }, { status: 500 });
  }
}
