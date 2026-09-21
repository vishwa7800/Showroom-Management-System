// Shreeji Hero Showroom ERP - Mark All Notifications Read API

import { NextResponse } from 'next/server';
import { requireAuth, AuthError } from '@/lib/auth/server';
import { markAllNotificationsAsRead } from '@/lib/db/notification-store';

export async function POST() {
  try {
    const session = await requireAuth();
    const count = await markAllNotificationsAsRead(session.userId);
    return NextResponse.json({ success: true, count });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to mark all as read' }, { status: 500 });
  }
}
