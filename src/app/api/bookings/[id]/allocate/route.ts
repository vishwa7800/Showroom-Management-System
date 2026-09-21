// Shreeji Hero Showroom ERP - Vehicle Allocation API Handler

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { allocateVehicleUnit } from '@/lib/db/sales-store';
import { createAuditLog } from '@/lib/audit';

const AllocateSchema = z.object({
  vehicleUnitId: z.string().min(1, 'Target vehicle unit ID is required'),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requirePermission('sales.update');
    const { id } = params;
    const body = await request.json();
    const result = AllocateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Valid vehicle unit ID required' }, { status: 400 });
    }

    const updatedBooking = await allocateVehicleUnit(
      id,
      result.data.vehicleUnitId,
      session.name
    );

    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      branchId: session.branchId,
      action: 'VEHICLE_ALLOCATE',
      entity: 'Booking',
      entityId: id,
      changeDetails: {
        bookingCode: updatedBooking.bookingCode,
        allocatedVin: updatedBooking.allocatedVin,
        allocatedEngine: updatedBooking.allocatedEngine,
      },
    });

    return NextResponse.json({ success: true, booking: updatedBooking });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message || 'Failed to allocate vehicle' }, { status: 400 });
  }
}
