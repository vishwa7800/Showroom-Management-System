// Shreeji Hero Showroom ERP - Outstanding Receivables API Handler

import { NextResponse } from 'next/server';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { getOutstandingReceivables } from '@/lib/db/finance-store';

export async function GET(request: Request) {
  try {
    const session = await requirePermission('finance.read');
    const { searchParams } = new URL(request.url);
    const branchFilter = searchParams.get('branchId');

    const effectiveBranchId = session.role === 'ADMIN' ? branchFilter : session.branchId;
    const receivables = await getOutstandingReceivables(effectiveBranchId);

    return NextResponse.json({ success: true, receivables });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve outstanding receivables' }, { status: 500 });
  }
}
