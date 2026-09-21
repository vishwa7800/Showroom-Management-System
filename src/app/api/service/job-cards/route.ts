// Shreeji Hero Showroom ERP - Job Cards API Route Handler

import { NextResponse } from 'next/server';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { getJobCards } from '@/lib/db/service-store';

export async function GET(request: Request) {
  try {
    const session = await requirePermission('service.read');
    const { searchParams } = new URL(request.url);
    const branchFilter = searchParams.get('branchId');
    const status = searchParams.get('status') || undefined;
    const isDelayedParam = searchParams.get('isDelayed');

    const effectiveBranchId = session.role === 'ADMIN' ? branchFilter : session.branchId;
    const jobCards = await getJobCards({
      branchId: effectiveBranchId || undefined,
      status,
      isDelayed: isDelayedParam === 'true' ? true : undefined,
    });

    return NextResponse.json({ success: true, jobCards });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve job cards' }, { status: 500 });
  }
}
