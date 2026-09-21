// Shreeji Hero Showroom ERP - Sales Targets API Handler

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth, requirePermission, AuthError } from '@/lib/auth/server';
import { getEmployeeTargets, updateSalesTarget } from '@/lib/db/analytics-store';
import { createAuditLog } from '@/lib/audit';

const TargetSchema = z.object({
  month: z.string().min(4),
  branchId: z.string().min(1),
  branchName: z.string().min(1),
  employeeId: z.string().optional(),
  employeeName: z.string().optional(),
  targetType: z.enum(['VEHICLE_SALES_COUNT', 'SALES_REVENUE', 'SERVICE_REVENUE']),
  targetValue: z.number().min(1),
});

export async function GET(request: Request) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);
    const branchFilter = searchParams.get('branchId');

    const effectiveBranchId = session.role === 'ADMIN' ? branchFilter : session.branchId;
    const targets = await getEmployeeTargets(effectiveBranchId);

    return NextResponse.json({ success: true, targets });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve sales targets' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requirePermission('dashboard.view_all');
    const body = await request.json();
    const result = TargetSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Valid target details required' }, { status: 400 });
    }

    const data = result.data;
    const target = await updateSalesTarget(data);

    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      branchId: session.branchId,
      action: 'TARGET_UPDATE',
      entity: 'SalesTargetRecord',
      entityId: target.id,
      changeDetails: {
        month: target.month,
        employee: target.employeeName || 'Branch Target',
        targetValue: target.targetValue,
      },
    });

    return NextResponse.json({ success: true, target });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message || 'Failed to update target' }, { status: 400 });
  }
}
