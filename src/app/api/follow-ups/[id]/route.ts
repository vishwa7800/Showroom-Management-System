// Shreeji Hero Showroom ERP - Complete Follow-Up API Route Handler

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { completeFollowUp } from '@/lib/db/crm-store';
import { createAuditLog } from '@/lib/audit';

const CompleteFollowUpSchema = z.object({
  customerResponse: z.string().min(1, 'Customer response note is required'),
  nextFollowUpDate: z.string().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requirePermission('leads.update');
    const { id } = params;
    const body = await request.json();
    const result = CompleteFollowUpSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || 'Validation failed' },
        { status: 400 }
      );
    }

    const updated = await completeFollowUp(id, {
      customerResponse: result.data.customerResponse,
      nextFollowUpDate: result.data.nextFollowUpDate,
      actorName: session.name,
    });

    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      branchId: session.branchId,
      action: 'FOLLOW_UP_COMPLETE',
      entity: 'FollowUp',
      entityId: id,
      changeDetails: {
        customer: updated.customerName,
        response: result.data.customerResponse,
        nextDate: result.data.nextFollowUpDate,
      },
    });

    return NextResponse.json({ success: true, followUp: updated });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message || 'Failed to complete follow-up' }, { status: 500 });
  }
}
