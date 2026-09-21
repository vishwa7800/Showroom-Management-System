// Shreeji Hero Showroom ERP - Customer Portal Notifications API Handler

import { NextResponse } from 'next/server';
import { requireCustomerAuth, CustomerAuthError } from '@/lib/auth/customer-server';
import { getCustomerNotifications } from '@/lib/db/notification-store';

export async function GET() {
  try {
    const session = await requireCustomerAuth();
    const notifications = await getCustomerNotifications(session.customerId);
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return NextResponse.json({ success: true, notifications, unreadCount });
  } catch (error: any) {
    if (error instanceof CustomerAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve notifications' }, { status: 500 });
  }
}
