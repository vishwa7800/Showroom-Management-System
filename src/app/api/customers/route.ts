// Shreeji Hero Showroom ERP - Customers API Route Handler

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { getCustomers, createCustomer } from '@/lib/db/crm-store';
import { createAuditLog } from '@/lib/audit';

const CustomerCreateSchema = z.object({
  name: z.string().min(2, 'Customer name is required'),
  phone: z.string().min(10, 'Valid 10-digit mobile number is required'),
  altPhone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().min(3, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  pincode: z.string().min(6, 'Valid 6-digit pincode is required'),
  branchId: z.string().optional(),
  preferredContact: z.enum(['PHONE', 'WHATSAPP', 'EMAIL']).optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const session = await requirePermission('customers.read');
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const branchFilter = searchParams.get('branchId');

    let effectiveBranchId = branchFilter;
    if (session.role !== 'ADMIN') {
      effectiveBranchId = session.branchId;
    }

    const customers = await getCustomers({
      branchId: effectiveBranchId || undefined,
      search,
    });

    return NextResponse.json({ success: true, customers });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve customers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requirePermission('customers.create');
    const body = await request.json();
    const result = CustomerCreateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || 'Validation failed' },
        { status: 400 }
      );
    }

    const data = result.data;
    const branchId = session.role === 'ADMIN' ? (data.branchId || 'br_halvad') : (session.branchId || 'br_halvad');

    const customer = await createCustomer({
      name: data.name,
      phone: data.phone,
      altPhone: data.altPhone,
      email: data.email || undefined,
      address: data.address,
      city: data.city,
      pincode: data.pincode,
      branchId,
      preferredContact: data.preferredContact,
      source: data.source,
      notes: data.notes,
      actorName: session.name,
    });

    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      branchId: session.branchId,
      action: 'CUSTOMER_CREATE',
      entity: 'Customer',
      entityId: customer.id,
      changeDetails: {
        customerCode: customer.customerCode,
        name: customer.name,
        phone: customer.phone,
      },
    });

    return NextResponse.json({ success: true, customer }, { status: 201 });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message || 'Failed to create customer' }, { status: 400 });
  }
}
