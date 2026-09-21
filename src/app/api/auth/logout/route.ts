// Shreeji Hero Showroom ERP - Logout API Route Handler

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getServerSession } from '@/lib/auth/server';
import { SESSION_COOKIE_NAME } from '@/lib/auth/cookies';
import { createAuditLog } from '@/lib/audit';

export async function POST() {
  try {
    const session = await getServerSession();

    if (session) {
      await createAuditLog({
        actorId: session.userId,
        actorName: session.name,
        actorRole: session.role,
        branchId: session.branchId,
        action: 'AUTH_LOGOUT',
        entity: 'Authentication',
        entityId: session.userId,
      });
    }

    try {
      const cookieStore = cookies();
      cookieStore.delete(SESSION_COOKIE_NAME);
    } catch (e) {}

    const response = NextResponse.json({ success: true, message: 'Logged out successfully.' });
    response.cookies.delete(SESSION_COOKIE_NAME);

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Failed to logout cleanly.' }, { status: 500 });
  }
}
