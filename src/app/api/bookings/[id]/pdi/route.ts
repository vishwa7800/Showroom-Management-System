// Shreeji Hero Showroom ERP - Pre-Delivery Inspection API Handler

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { performPdiInspection } from '@/lib/db/sales-store';
import { createAuditLog } from '@/lib/audit';

const PdiSchema = z.object({
  cleanlinessPassed: z.boolean(),
  bodyPassed: z.boolean(),
  tyresPassed: z.boolean(),
  batteryPassed: z.boolean(),
  lightsPassed: z.boolean(),
  hornPassed: z.boolean(),
  fuelLevel: z.string(),
  odometerReading: z.number(),
  keysCount: z.number(),
  toolkitPresent: z.boolean(),
  ownerManualPresent: z.boolean(),
  notes: z.string().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requirePermission('sales.update');
    const { id } = params;
    const body = await request.json();
    const result = PdiSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Valid PDI checklist required' }, { status: 400 });
    }

    const updatedBooking = await performPdiInspection(
      id,
      result.data,
      session.name
    );

    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      branchId: session.branchId,
      action: 'PDI_COMPLETE',
      entity: 'Booking',
      entityId: id,
      changeDetails: {
        bookingCode: updatedBooking.bookingCode,
        pdiStatus: updatedBooking.pdiStatus,
        odometer: result.data.odometerReading,
      },
    });

    return NextResponse.json({ success: true, booking: updatedBooking });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message || 'Failed to record PDI checklist' }, { status: 400 });
  }
}
