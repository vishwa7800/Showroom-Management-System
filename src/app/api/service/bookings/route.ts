// Shreeji Hero Showroom ERP - Service Bookings API Route Handler

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { getServiceBookings, createServiceBooking } from '@/lib/db/service-store';
import { findCustomerById } from '@/lib/db/crm-store';
import { createAuditLog } from '@/lib/audit';

const BookingSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  vehicleId: z.string().min(1, 'Vehicle ID is required'),
  registrationNumber: z.string().min(1, 'Registration number is required'),
  modelName: z.string().min(1, 'Model name is required'),
  serviceType: z.string().min(1, 'Service type is required'),
  scheduledDate: z.string().min(1, 'Date is required'),
  preferredTime: z.string().optional(),
  customerComplaint: z.string().min(1, 'Customer complaint is required'),
  notes: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const session = await requirePermission('service.read');
    const { searchParams } = new URL(request.url);
    const branchFilter = searchParams.get('branchId');
    const status = searchParams.get('status') || undefined;

    const effectiveBranchId = session.role === 'ADMIN' ? branchFilter : session.branchId;
    const bookings = await getServiceBookings({
      branchId: effectiveBranchId || undefined,
      status,
    });

    return NextResponse.json({ success: true, bookings });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve service bookings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requirePermission('service.create_booking');
    const body = await request.json();
    const result = BookingSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || 'Validation failed' },
        { status: 400 }
      );
    }

    const data = result.data;
    const customer = await findCustomerById(data.customerId);
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const branchId = session.branchId || customer.branchId || 'br_halvad';

    const booking = await createServiceBooking({
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      vehicleId: data.vehicleId,
      registrationNumber: data.registrationNumber,
      modelName: data.modelName,
      serviceType: data.serviceType,
      scheduledDate: data.scheduledDate,
      preferredTime: data.preferredTime,
      branchId,
      customerComplaint: data.customerComplaint,
      notes: data.notes,
      actorName: session.name,
    });

    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      branchId: session.branchId,
      action: 'SERVICE_BOOKING_CREATE',
      entity: 'ServiceBooking',
      entityId: booking.id,
      changeDetails: {
        bookingCode: booking.bookingCode,
        registration: booking.registrationNumber,
        serviceType: booking.serviceType,
      },
    });

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message || 'Failed to create service booking' }, { status: 400 });
  }
}
