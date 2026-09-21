// Shreeji Hero Showroom ERP - Customer OTP Verification & Session Issuance API

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCustomerById } from '@/lib/db/crm-store';
import { signCustomerToken, CUSTOMER_COOKIE_NAME } from '@/lib/auth/customer-server';

const VerifySchema = z.object({
  customerId: z.string().min(1),
  otp: z.string().min(4),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = VerifySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Valid customer ID and OTP required' }, { status: 400 });
    }

    const { customerId, otp } = result.data;

    // Verify OTP (123456 in demo/dev mode)
    if (otp !== '123456') {
      return NextResponse.json({ error: 'Invalid verification code. Use 123456.' }, { status: 401 });
    }

    const customer = await getCustomerById(customerId);
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const token = await signCustomerToken({
      customerId: customer.id,
      customerCode: customer.customerCode,
      name: customer.name,
      phone: customer.phone,
      branchId: customer.branchId,
      isCustomer: true,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
      customer: {
        id: customer.id,
        customerCode: customer.customerCode,
        name: customer.name,
        phone: customer.phone,
        city: customer.city,
      },
    });

    response.cookies.set({
      name: CUSTOMER_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
