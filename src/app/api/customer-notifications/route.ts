// Shreeji Hero Showroom ERP - Customer Portal Notifications API

import { NextResponse } from 'next/server';
import { getCustomerNotifications } from '@/lib/db/notification-store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId') || 'c_02';

    const notifications = await getCustomerNotifications(customerId);
    return NextResponse.json({ success: true, notifications });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to retrieve customer notifications' }, { status: 500 });
  }
}
