// Shreeji Hero Showroom ERP - CRM & Customer Analytics API Handler

import { NextResponse } from 'next/server';
import { requireAuth, AuthError } from '@/lib/auth/server';
import { getCustomerAnalytics } from '@/lib/db/analytics-store';

export async function GET(request: Request) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);
    const branchFilter = searchParams.get('branchId');

    const effectiveBranchId = session.role === 'ADMIN' ? branchFilter : session.branchId;
    const analytics = await getCustomerAnalytics(effectiveBranchId);

    return NextResponse.json({ success: true, analytics });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve customer analytics' }, { status: 500 });
  }
}
