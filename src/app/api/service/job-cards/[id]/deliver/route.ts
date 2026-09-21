// Shreeji Hero Showroom ERP - Service Delivery & Gate Pass API Handler

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { completeServiceDelivery } from '@/lib/db/service-store';
import { createAuditLog } from '@/lib/audit';

const DeliverSchema = z.object({
  finalKmReading: z.number().min(0, 'Final odometer reading required'),
  paymentMode: z.string().min(1, 'Payment mode is required'),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requirePermission('service.complete_job');
    const { id } = params;
    const body = await request.json();
    const result = DeliverSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Valid delivery information required' }, { status: 400 });
    }

    const updated = await completeServiceDelivery(id, {
      finalKmReading: result.data.finalKmReading,
      paymentMode: result.data.paymentMode,
      advisorName: session.name,
    });

    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      branchId: session.branchId,
      action: 'SERVICE_GATE_PASS_RELEASE',
      entity: 'JobCard',
      entityId: id,
      changeDetails: {
        jobCardNumber: updated.jobCardNumber,
        invoiceNumber: updated.invoiceNumber,
        totalAmount: updated.totalAmount,
        deliveredBy: session.name,
      },
    });

    return NextResponse.json({ success: true, jobCard: updated });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message || 'Failed to complete service delivery' }, { status: 400 });
  }
}
