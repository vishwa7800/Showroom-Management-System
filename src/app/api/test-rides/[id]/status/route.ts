// Shreeji Hero Showroom ERP - Test Ride Status API Handler

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { completeTestRide } from '@/lib/db/crm-store';
import { createAuditLog } from '@/lib/audit';

const CompleteTestRideSchema = z.object({
  status: z.enum(['COMPLETED', 'CANCELLED', 'NO_SHOW']),
  feedback: z.string().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requirePermission('test_rides.update');
    const { id } = params;
    const body = await request.json();
    const result = CompleteTestRideSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Valid status required' }, { status: 400 });
    }

    const updated = await completeTestRide(id, {
      status: result.data.status,
      feedback: result.data.feedback,
      actorName: session.name,
    });

    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      branchId: session.branchId,
      action: 'TEST_RIDE_STATUS_CHANGE',
      entity: 'TestRide',
      entityId: id,
      changeDetails: {
        status: result.data.status,
        feedback: result.data.feedback,
      },
    });

    return NextResponse.json({ success: true, testRide: updated });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message || 'Failed to update test ride' }, { status: 500 });
  }
}
