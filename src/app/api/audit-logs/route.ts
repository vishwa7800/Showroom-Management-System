// Shreeji Hero Showroom ERP - Audit Logs API

import { NextResponse } from 'next/server';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { getAuditLogs } from '@/lib/audit';

export async function GET(request: Request) {
  try {
    const session = await requirePermission('audit.read');
    const { searchParams } = new URL(request.url);
    const branchFilter = searchParams.get('branchId');

    let effectiveBranchId = branchFilter;
    if (session.role === 'SHOWROOM_MANAGER') {
      effectiveBranchId = session.branchId;
    }

    const logs = getAuditLogs({
      branchId: effectiveBranchId || undefined,
      limit: 100,
    });

    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve audit logs' }, { status: 500 });
  }
}
