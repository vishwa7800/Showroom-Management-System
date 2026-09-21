// Shreeji Hero Showroom ERP - Service Operations Analytics API Handler

import { NextResponse } from 'next/server';
import { requireAuth, AuthError } from '@/lib/auth/server';
import { getServiceAnalytics } from '@/lib/db/analytics-store';

export async function GET(request: Request) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);
    const branchFilter = searchParams.get('branchId');

    const effectiveBranchId = session.role === 'ADMIN' ? branchFilter : session.branchId;
    const analytics = await getServiceAnalytics(effectiveBranchId);

    return NextResponse.json({ success: true, analytics });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve service analytics' }, { status: 500 });
  }
}
