// Shreeji Hero Showroom ERP - Auto Loans API Handler

import { NextResponse } from 'next/server';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { getAutoLoans } from '@/lib/db/finance-store';

export async function GET(request: Request) {
  try {
    const session = await requirePermission('finance.read');
    const { searchParams } = new URL(request.url);
    const branchFilter = searchParams.get('branchId');

    const effectiveBranchId = session.role === 'ADMIN' ? branchFilter : session.branchId;
    const loans = await getAutoLoans(effectiveBranchId);

    return NextResponse.json({ success: true, loans });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve auto loans' }, { status: 500 });
  }
}
