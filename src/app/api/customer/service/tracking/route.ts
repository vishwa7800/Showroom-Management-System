// Shreeji Hero Showroom ERP - Live Service Tracking API

import { NextResponse } from 'next/server';
import { requireCustomerAuth, CustomerAuthError } from '@/lib/auth/customer-server';
import { getJobCards } from '@/lib/db/service-store';

export async function GET() {
  try {
    const session = await requireCustomerAuth();
    const jobCards = await getJobCards();
    const activeCards = jobCards.filter((j) => j.customerId === session.customerId);

    return NextResponse.json({ success: true, activeServices: activeCards });
  } catch (error: any) {
    if (error instanceof CustomerAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve active services' }, { status: 500 });
  }
}
