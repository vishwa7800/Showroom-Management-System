// Shreeji Hero Showroom ERP - Customer Service Bookings API

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireCustomerAuth, CustomerAuthError } from '@/lib/auth/customer-server';
import { getServiceBookings, createServiceBooking } from '@/lib/db/service-store';
import { appendCustomerTimeline } from '@/lib/db/crm-store';
import { createInternalNotification } from '@/lib/db/notification-store';

const CreateBookingSchema = z.object({
  vehicleId: z.string().min(1),
  vehicleReg: z.string().min(1),
  modelName: z.string().min(1),
  serviceType: z.string().min(1),
  scheduledDate: z.string().min(4),
  remarks: z.string().optional(),
});

export async function GET() {
  try {
    const session = await requireCustomerAuth();
    const bookings = await getServiceBookings();
    const customerBookings = bookings.filter((b) => b.customerId === session.customerId);

    return NextResponse.json({ success: true, bookings: customerBookings });
  } catch (error: any) {
    if (error instanceof CustomerAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve bookings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireCustomerAuth();
    const body = await request.json();
    const result = CreateBookingSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Valid booking information required' }, { status: 400 });
    }

    const data = result.data;
    const booking = await createServiceBooking({
      customerId: session.customerId,
      customerName: session.name,
      customerPhone: session.phone,
      vehicleId: data.vehicleId,
      registrationNumber: data.vehicleReg,
      modelName: data.modelName,
      branchId: session.branchId,
      serviceType: data.serviceType as any,
      scheduledDate: data.scheduledDate,
      customerComplaint: data.remarks || 'Periodic Maintenance',
    });

    await appendCustomerTimeline({
      customerId: session.customerId,
      type: 'SERVICE',
      title: `Online Service Appointment: ${booking.bookingCode}`,
      description: `Customer booked ${data.serviceType} for ${data.modelName} (${data.vehicleReg}) on ${data.scheduledDate}.`,
      actorName: session.name,
    });

    await createInternalNotification({
      title: `New Online Service Appointment: ${booking.bookingCode}`,
      message: `${session.name} booked ${data.serviceType} for ${data.modelName} on ${data.scheduledDate}.`,
      priority: 'NORMAL',
      module: 'SERVICE',
      recordId: booking.id,
      targetRole: 'SERVICE_ADVISOR',
      branchId: session.branchId,
      linkUrl: '/service',
    });

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error: any) {
    if (error instanceof CustomerAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message || 'Failed to create booking' }, { status: 400 });
  }
}
