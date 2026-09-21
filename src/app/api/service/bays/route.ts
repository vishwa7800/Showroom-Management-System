// Shreeji Hero Showroom ERP - Service Bays API Handler

import { NextResponse } from 'next/server';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { getServiceBays } from '@/lib/db/service-store';

export async function GET(request: Request) {
  try {
    const session = await requirePermission('service.read');
    const { searchParams } = new URL(request.url);
    const branchFilter = searchParams.get('branchId');

    const effectiveBranchId = session.role === 'ADMIN' ? branchFilter : session.branchId;
    const bays = await getServiceBays(effectiveBranchId);

    return NextResponse.json({ success: true, bays });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve service bays' }, { status: 500 });
  }
}
