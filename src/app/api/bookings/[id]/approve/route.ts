// Shreeji Hero Showroom ERP - Booking Approval API Handler

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { approveBooking } from '@/lib/db/sales-store';
import { createAuditLog } from '@/lib/audit';

const ApproveSchema = z.object({
  approved: z.boolean(),
  rejectionReason: z.string().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requirePermission('sales.approve');
    const { id } = params;
    const body = await request.json();
    const result = ApproveSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Valid approval status required' }, { status: 400 });
    }

    const updated = await approveBooking(
      id,
      session.name,
      result.data.approved,
      result.data.rejectionReason
    );

    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      branchId: session.branchId,
      action: result.data.approved ? 'BOOKING_APPROVE' : 'BOOKING_REJECT',
      entity: 'Booking',
      entityId: id,
      changeDetails: {
        bookingCode: updated.bookingCode,
        approved: result.data.approved,
        rejectionReason: result.data.rejectionReason,
      },
    });

    return NextResponse.json({ success: true, booking: updated });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message || 'Failed to process booking approval' }, { status: 500 });
  }
}
