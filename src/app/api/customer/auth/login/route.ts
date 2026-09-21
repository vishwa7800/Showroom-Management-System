// Shreeji Hero Showroom ERP - Customer Login API Route

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCustomers } from '@/lib/db/crm-store';

const LoginSchema = z.object({
  identifier: z.string().min(3), // phone number e.g. "+91 98765 43210" or customer code e.g. "SHR-1001"
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = LoginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Valid phone number or Customer Code required' }, { status: 400 });
    }

    const { identifier } = result.data;
    const cleanPhone = identifier.replace(/[\s-+]/g, '');
    const customers = await getCustomers();

    const customer = customers.find((c) => {
      const cPhone = c.phone.replace(/[\s-+]/g, '');
      return (
        cPhone === cleanPhone ||
        c.customerCode.toLowerCase() === identifier.toLowerCase() ||
        cPhone.includes(cleanPhone) ||
        cleanPhone.includes(cPhone)
      );
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'No customer account found with this phone number or customer code' },
        { status: 404 }
      );
    }

    // In production, an SMS gateway dispatches a 6-digit OTP. For local demo/testing, OTP is 123456.
    return NextResponse.json({
      success: true,
      message: `OTP dispatched to registered mobile number ${customer.phone.slice(-4).padStart(customer.phone.length, '*')}`,
      demoOtp: '123456',
      customerId: customer.id,
      customerName: customer.name,
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Customer login failed' }, { status: 500 });
  }
}
