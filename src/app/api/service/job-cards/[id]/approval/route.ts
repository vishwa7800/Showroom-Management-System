// Shreeji Hero Showroom ERP - Customer Extra Work Approval API

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { recordCustomerApproval } from '@/lib/db/service-store';
import { createAuditLog } from '@/lib/audit';

const ApprovalSchema = z.object({
  approvalId: z.string().min(1, 'Approval ID is required'),
  approved: z.boolean(),
  customerNotes: z.string().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requirePermission('service.update_job_card');
    const { id } = params;
    const body = await request.json();
    const result = ApprovalSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Valid approval status required' }, { status: 400 });
    }

    const updated = await recordCustomerApproval(
      id,
      result.data.approvalId,
      result.data.approved,
      result.data.customerNotes,
      session.name
    );

    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      branchId: session.branchId,
      action: result.data.approved ? 'CUSTOMER_APPROVAL_ACCEPT' : 'CUSTOMER_APPROVAL_REJECT',
      entity: 'JobCard',
      entityId: id,
      changeDetails: {
        jobCardNumber: updated.jobCardNumber,
        approved: result.data.approved,
        notes: result.data.customerNotes,
      },
    });

    return NextResponse.json({ success: true, jobCard: updated });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message || 'Failed to record customer approval' }, { status: 500 });
  }
}
