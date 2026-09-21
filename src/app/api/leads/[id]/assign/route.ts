// Shreeji Hero Showroom ERP - Lead Assignment API Handler

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { assignLead } from '@/lib/db/crm-store';
import { findUserById } from '@/lib/db/users-store';
import { createAuditLog } from '@/lib/audit';

const AssignSchema = z.object({
  assignedToId: z.string().min(1, 'Target executive is required'),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requirePermission('leads.assign');
    const { id } = params;
    const body = await request.json();
    const result = AssignSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Valid assigned executive ID required' }, { status: 400 });
    }

    const executive = await findUserById(result.data.assignedToId);
    if (!executive) {
      return NextResponse.json({ error: 'Sales executive not found' }, { status: 404 });
    }

    const updatedLead = await assignLead(
      id,
      executive.id,
      executive.name,
      session.name
    );

    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      branchId: session.branchId,
      action: 'LEAD_ASSIGN',
      entity: 'Lead',
      entityId: id,
      changeDetails: {
        assignedTo: executive.name,
        assignedToId: executive.id,
      },
    });

    return NextResponse.json({ success: true, lead: updatedLead });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message || 'Failed to assign lead' }, { status: 500 });
  }
}
