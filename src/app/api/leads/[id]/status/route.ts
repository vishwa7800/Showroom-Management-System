// Shreeji Hero Showroom ERP - Lead Status Transition API

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { updateLeadStatus } from '@/lib/db/crm-store';
import { createAuditLog } from '@/lib/audit';

const StatusSchema = z.object({
  status: z.enum([
    'NEW',
    'CONTACTED',
    'INTERESTED',
    'TEST_RIDE',
    'QUOTATION',
    'NEGOTIATION',
    'BOOKED',
    'CONVERTED',
    'LOST',
  ]),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requirePermission('leads.update');
    const { id } = params;
    const body = await request.json();
    const result = StatusSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid lead status' }, { status: 400 });
    }

    const updated = await updateLeadStatus(id, result.data.status, session.name);

    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      branchId: session.branchId,
      action: 'LEAD_STATUS_CHANGE',
      entity: 'Lead',
      entityId: id,
      changeDetails: { newStatus: result.data.status },
    });

    return NextResponse.json({ success: true, lead: updated });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message || 'Failed to update lead status' }, { status: 500 });
  }
}
