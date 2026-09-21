// Shreeji Hero Showroom ERP - Vehicle Delivery Handover API Handler

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { completeVehicleDelivery } from '@/lib/db/sales-store';
import { createAuditLog } from '@/lib/audit';

const DeliverySchema = z.object({
  odometerReading: z.number().min(0, 'Odometer reading required'),
  customerNotes: z.string().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requirePermission('sales.update');
    const { id } = params;
    const body = await request.json();
    const result = DeliverySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Valid delivery info required' }, { status: 400 });
    }

    const { booking, invoice } = await completeVehicleDelivery(id, {
      odometerReading: result.data.odometerReading,
      deliveryExecutiveName: session.name,
      customerNotes: result.data.customerNotes,
    });

    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      branchId: session.branchId,
      action: 'DELIVERY_COMPLETE',
      entity: 'Booking',
      entityId: id,
      changeDetails: {
        bookingCode: booking.bookingCode,
        invoiceNumber: invoice.invoiceNumber,
        vin: booking.allocatedVin,
        deliveredBy: session.name,
      },
    });

    return NextResponse.json({ success: true, booking, invoice });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message || 'Failed to complete delivery' }, { status: 400 });
  }
}
