// Shreeji Hero Showroom ERP - Walk-In API Route Handler

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { getWalkIns, registerWalkIn } from '@/lib/db/crm-store';
import { createAuditLog } from '@/lib/audit';

const WalkInSchema = z.object({
  customerName: z.string().min(2, 'Guest name is required'),
  customerPhone: z.string().min(10, 'Valid 10-digit phone number is required'),
  purpose: z.enum(['NEW_PURCHASE', 'TEST_RIDE', 'SERVICE', 'GENERAL_INQUIRY']),
  interestedModel: z.string().optional(),
  assignedToId: z.string().optional(),
  assignedToName: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const session = await requirePermission('leads.read');
    const { searchParams } = new URL(request.url);
    const branchFilter = searchParams.get('branchId');

    const effectiveBranchId = session.role === 'ADMIN' ? branchFilter : session.branchId;
    const walkIns = await getWalkIns(effectiveBranchId);

    return NextResponse.json({ success: true, walkIns });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve walk-ins' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requirePermission('leads.create');
    const body = await request.json();
    const result = WalkInSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || 'Validation failed' },
        { status: 400 }
      );
    }

    const data = result.data;
    const branchId = session.branchId || 'br_halvad';

    const walkIn = await registerWalkIn({
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      purpose: data.purpose,
      interestedModel: data.interestedModel,
      branchId,
      assignedToId: data.assignedToId,
      assignedToName: data.assignedToName,
      notes: data.notes,
    });

    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      branchId: session.branchId,
      action: 'WALK_IN_REGISTER',
      entity: 'WalkIn',
      entityId: walkIn.id,
      changeDetails: {
        guest: data.customerName,
        purpose: data.purpose,
        model: data.interestedModel,
      },
    });

    return NextResponse.json({ success: true, walkIn }, { status: 201 });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message || 'Failed to register walk-in' }, { status: 400 });
  }
}
