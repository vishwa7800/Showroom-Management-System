// Shreeji Hero Showroom ERP - Follow-Ups API Route Handler

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { getFollowUps } from '@/lib/db/crm-store';

export async function GET(request: Request) {
  try {
    const session = await requirePermission('leads.read');
    const { searchParams } = new URL(request.url);
    const branchFilter = searchParams.get('branchId');
    const scope = searchParams.get('scope') as any;

    let effectiveBranchId = branchFilter;
    if (session.role !== 'ADMIN') {
      effectiveBranchId = session.branchId;
    }

    let effectiveAssignedId = undefined;
    if (session.role === 'SALES_EXECUTIVE') {
      effectiveAssignedId = session.userId;
    }

    const followUps = await getFollowUps({
      branchId: effectiveBranchId || undefined,
      assignedToId: effectiveAssignedId,
      scope: scope || undefined,
    });

    return NextResponse.json({ success: true, followUps });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve follow-ups' }, { status: 500 });
  }
}
