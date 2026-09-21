// Shreeji Hero Showroom ERP - Customer Profile & Preferences API

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireCustomerAuth, CustomerAuthError } from '@/lib/auth/customer-server';
import { getCustomerById, updateCustomer } from '@/lib/db/crm-store';
import { getCustomerPreferences, updateCustomerPreferences } from '@/lib/db/notification-store';

const UpdateProfileSchema = z.object({
  email: z.string().email().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  allowWhatsapp: z.boolean().optional(),
  allowSms: z.boolean().optional(),
  allowEmail: z.boolean().optional(),
});

export async function GET() {
  try {
    const session = await requireCustomerAuth();
    const customer = await getCustomerById(session.customerId);
    const preferences = await getCustomerPreferences(session.customerId);

    return NextResponse.json({ success: true, customer, preferences });
  } catch (error: any) {
    if (error instanceof CustomerAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve profile' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireCustomerAuth();
    const body = await request.json();
    const result = UpdateProfileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Valid profile details required' }, { status: 400 });
    }

    const data = result.data;
    if (data.email || data.address || data.city) {
      await updateCustomer(session.customerId, {
        email: data.email,
        address: data.address,
        city: data.city,
      });
    }

    const updatedPrefs = await updateCustomerPreferences(session.customerId, {
      allowWhatsapp: data.allowWhatsapp,
      allowSms: data.allowSms,
      allowEmail: data.allowEmail,
    });

    return NextResponse.json({ success: true, preferences: updatedPrefs });
  } catch (error: any) {
    if (error instanceof CustomerAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
