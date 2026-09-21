// Shreeji Hero Showroom ERP - GST & Tax Summary API Route Handler

import { NextResponse } from 'next/server';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { getGstSummary } from '@/lib/db/finance-store';

export async function GET(request: Request) {
  try {
    const session = await requirePermission('finance.read');
    const { searchParams } = new URL(request.url);
    const branchFilter = searchParams.get('branchId');

    const effectiveBranchId = session.role === 'ADMIN' ? branchFilter : session.branchId;
    const gstSummary = await getGstSummary(effectiveBranchId);

    return NextResponse.json({ success: true, ...gstSummary });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to calculate GST summary' }, { status: 500 });
  }
}
