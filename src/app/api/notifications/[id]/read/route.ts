// Shreeji Hero Showroom ERP - Mark Notification Read API

import { NextResponse } from 'next/server';
import { requireAuth, AuthError } from '@/lib/auth/server';
import { markNotificationAsRead } from '@/lib/db/notification-store';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();
    const { id } = params;
    const success = await markNotificationAsRead(id);
    return NextResponse.json({ success });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}
