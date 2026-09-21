// Shreeji Hero Showroom ERP - Test Rides API Route Handler

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { getTestRides, scheduleTestRide, findCustomerById } from '@/lib/db/crm-store';
import { createAuditLog } from '@/lib/audit';

const TestRideScheduleSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
  vehicleModel: z.string().min(1, 'Target vehicle model is required'),
  scheduledAt: z.string().min(1, 'Date and time required'),
  leadId: z.string().optional(),
  executiveId: z.string().optional(),
  executiveName: z.string().optional(),
  remarks: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const session = await requirePermission('test_rides.read');
    const { searchParams } = new URL(request.url);
    const branchFilter = searchParams.get('branchId');

    const effectiveBranchId = session.role === 'ADMIN' ? branchFilter : session.branchId;
    const testRides = await getTestRides(effectiveBranchId);

    return NextResponse.json({ success: true, testRides });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve test rides' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requirePermission('test_rides.create');
    const body = await request.json();
    const result = TestRideScheduleSchema.safeParse(body);

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
    const executiveId = data.executiveId || session.userId;
    const executiveName = data.executiveName || session.name;

    const testRide = await scheduleTestRide({
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      leadId: data.leadId,
      branchId,
      vehicleModel: data.vehicleModel,
      executiveId,
      executiveName,
      scheduledAt: data.scheduledAt,
      remarks: data.remarks,
      actorName: session.name,
    });

    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      branchId: session.branchId,
      action: 'TEST_RIDE_SCHEDULE',
      entity: 'TestRide',
      entityId: testRide.id,
      changeDetails: {
        customer: customer.name,
        model: data.vehicleModel,
        scheduledAt: data.scheduledAt,
      },
    });

    return NextResponse.json({ success: true, testRide }, { status: 201 });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message || 'Failed to schedule test ride' }, { status: 400 });
  }
}
