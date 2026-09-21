// Shreeji Hero Showroom ERP - Customer 360 API Handler

import { NextResponse } from 'next/server';
import { requirePermission, AuthError } from '@/lib/auth/server';
import {
  findCustomerById,
  updateCustomer,
  getCustomerTimeline,
  getLeads,
  getFollowUps,
  getTestRides,
} from '@/lib/db/crm-store';
import { createAuditLog } from '@/lib/audit';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requirePermission('customers.read');
    const { id } = params;

    const customer = await findCustomerById(id);
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Branch Access Check
    if (session.role !== 'ADMIN' && customer.branchId !== session.branchId) {
      return NextResponse.json(
        { error: 'You are not authorized to view customer records from other branches.' },
        { status: 403 }
      );
    }

    const timeline = await getCustomerTimeline(id);
    const leads = (await getLeads({ branchId: customer.branchId })).filter((l) => l.customerId === id);
    const followUps = (await getFollowUps({ branchId: customer.branchId })).filter((f) => f.customerId === id);
    const testRides = (await getTestRides(customer.branchId)).filter((t) => t.customerId === id);

    // Mock Customer Owned Vehicles & Service Bills
    const vehicles = [
      {
        id: 'cv_01',
        registrationNumber: 'GJ-36-AB-1234',
        modelName: 'Hero Splendor Plus',
        variantName: 'Drum Self Cast',
        color: 'Black Nexus Blue',
        vinNumber: 'MBLHAW14XN9001234',
        engineNumber: 'HA10EHN9001234',
        purchaseDate: '15 April 2023',
        warrantyUntil: '14 April 2028',
        status: 'ACTIVE',
      },
    ];

    const serviceHistory = [
      {
        id: 'sh_01',
        jobCardNumber: 'JC-8899',
        serviceType: 'Free Service #3',
        date: '10 Feb 2024',
        advisorName: 'Kiran Solanki',
        status: 'COMPLETED',
        amount: 0,
      },
      {
        id: 'sh_02',
        jobCardNumber: 'JC-8420',
        serviceType: 'Free Service #2',
        date: '15 Oct 2023',
        advisorName: 'Kiran Solanki',
        status: 'COMPLETED',
        amount: 320,
      },
    ];

    return NextResponse.json({
      success: true,
      customer,
      timeline,
      vehicles,
      leads,
      followUps,
      testRides,
      serviceHistory,
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve customer 360 profile' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requirePermission('customers.update');
    const { id } = params;
    const body = await request.json();

    const targetCustomer = await findCustomerById(id);
    if (!targetCustomer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    if (session.role !== 'ADMIN' && targetCustomer.branchId !== session.branchId) {
      return NextResponse.json({ error: 'Unauthorized branch operation' }, { status: 403 });
    }

    const updated = await updateCustomer(id, body, session.name);

    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      branchId: session.branchId,
      action: 'CUSTOMER_UPDATE',
      entity: 'Customer',
      entityId: id,
      changeDetails: body,
    });

    return NextResponse.json({ success: true, customer: updated });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message || 'Failed to update customer' }, { status: 400 });
  }
}
