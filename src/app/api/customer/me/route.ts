// Shreeji Hero Showroom ERP - Get Current Customer Profile API

import { NextResponse } from 'next/server';
import { requireCustomerAuth, CustomerAuthError } from '@/lib/auth/customer-server';
import { getCustomerById } from '@/lib/db/crm-store';
import { getCustomerPreferences } from '@/lib/db/notification-store';

export async function GET() {
  try {
    const session = await requireCustomerAuth();
    const customer = await getCustomerById(session.customerId);

    if (!customer) {
      return NextResponse.json({ error: 'Customer profile not found' }, { status: 404 });
    }

    const preferences = await getCustomerPreferences(session.customerId);

    return NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        customerCode: customer.customerCode,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        pincode: customer.pincode,
        branchId: customer.branchId,
        preferences,
      },
    });
  } catch (error: any) {
    if (error instanceof CustomerAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve profile' }, { status: 500 });
  }
}
