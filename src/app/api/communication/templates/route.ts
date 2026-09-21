// Shreeji Hero Showroom ERP - Dynamic Communication Templates API

import { NextResponse } from 'next/server';
import { requireAuth, AuthError } from '@/lib/auth/server';
import { getDynamicTemplates } from '@/lib/db/notification-store';

export async function GET(request: Request) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const customerName = searchParams.get('customerName') || undefined;
    const vehicleModel = searchParams.get('vehicleModel') || undefined;
    const bookingCode = searchParams.get('bookingCode') || undefined;
    const jobCardNumber = searchParams.get('jobCardNumber') || undefined;
    const invoiceNumber = searchParams.get('invoiceNumber') || undefined;
    const amount = searchParams.get('amount') ? Number(searchParams.get('amount')) : undefined;

    const templates = getDynamicTemplates({
      customerName,
      vehicleModel,
      bookingCode,
      jobCardNumber,
      invoiceNumber,
      amount,
    });

    return NextResponse.json({ success: true, templates });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to generate message templates' }, { status: 500 });
  }
}
