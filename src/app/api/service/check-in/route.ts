// Shreeji Hero Showroom ERP - Vehicle Check-In & Job Card Creation API

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { checkInVehicle } from '@/lib/db/service-store';
import { findCustomerById } from '@/lib/db/crm-store';
import { createAuditLog } from '@/lib/audit';

const CheckInSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
  vehicleId: z.string().min(1, 'Vehicle ID is required'),
  registrationNumber: z.string().min(1, 'Registration number required'),
  modelName: z.string().min(1, 'Model name required'),
  vinNumber: z.string().optional(),
  engineNumber: z.string().optional(),
  serviceType: z.string().min(1, 'Service type is required'),
  customerComplaints: z.string().min(1, 'Customer complaints required'),
  fuelLevel: z.string().min(1, 'Fuel gauge level required'),
  kmReading: z.number().min(0, 'Current odometer reading required'),
  estDeliveryHours: z.number().optional(),
  serviceBookingId: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const session = await requirePermission('service.create_job_card');
    const body = await request.json();
    const result = CheckInSchema.safeParse(body);

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

    const jobCard = await checkInVehicle({
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      vehicleId: data.vehicleId,
      registrationNumber: data.registrationNumber,
      modelName: data.modelName,
      vinNumber: data.vinNumber,
      engineNumber: data.engineNumber,
      branchId,
      advisorId: session.userId,
      advisorName: session.name,
      serviceType: data.serviceType,
      customerComplaints: data.customerComplaints,
      fuelLevel: data.fuelLevel,
      kmReading: data.kmReading,
      estDeliveryHours: data.estDeliveryHours,
      serviceBookingId: data.serviceBookingId,
    });

    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      branchId: session.branchId,
      action: 'VEHICLE_CHECK_IN',
      entity: 'JobCard',
      entityId: jobCard.id,
      changeDetails: {
        jobCardNumber: jobCard.jobCardNumber,
        registration: jobCard.registrationNumber,
        odometer: jobCard.kmReading,
        advisor: session.name,
      },
    });

    return NextResponse.json({ success: true, jobCard }, { status: 201 });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message || 'Failed to check in vehicle' }, { status: 400 });
  }
}
