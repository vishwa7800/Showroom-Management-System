// Shreeji Hero Showroom ERP - Convert Quotation to Booking API

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { convertQuotationToBooking } from '@/lib/db/sales-store';
import { createAuditLog } from '@/lib/audit';

const ConvertSchema = z.object({
  bookingAmount: z.number().min(1000, 'Minimum booking token is ₹1,000'),
  paymentMode: z.enum(['CASH', 'UPI', 'CARD', 'BANK_TRANSFER', 'FINANCIER']),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requirePermission('sales.create');
    const { id } = params;
    const body = await request.json();
    const result = ConvertSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || 'Validation failed' },
        { status: 400 }
      );
    }

    const booking = await convertQuotationToBooking(
      id,
      result.data.bookingAmount,
      result.data.paymentMode,
      session.name
    );

    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      branchId: session.branchId,
      action: 'QUOTATION_CONVERT_BOOKING',
      entity: 'Booking',
      entityId: booking.id,
      changeDetails: {
        bookingCode: booking.bookingCode,
        quotationId: id,
        tokenPaid: result.data.bookingAmount,
      },
    });

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message || 'Failed to convert quotation' }, { status: 400 });
  }
}
