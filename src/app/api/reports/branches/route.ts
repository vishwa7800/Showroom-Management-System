// Shreeji Hero Showroom ERP - Cross-Branch Comparison API Handler

import { NextResponse } from 'next/server';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { getBranchComparisons } from '@/lib/db/analytics-store';

export async function GET(request: Request) {
  try {
    await requirePermission('dashboard.view_all');
    const branches = await getBranchComparisons();
    return NextResponse.json({ success: true, branches });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve cross-branch comparison' }, { status: 500 });
  }
}
