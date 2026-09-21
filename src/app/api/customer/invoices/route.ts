// Shreeji Hero Showroom ERP - Customer Invoices & Receipts API

import { NextResponse } from 'next/server';
import { requireCustomerAuth, CustomerAuthError } from '@/lib/auth/customer-server';
import { getInvoices } from '@/lib/db/finance-store';

export async function GET() {
  try {
    const session = await requireCustomerAuth();
    const invoices = await getInvoices();
    const customerInvoices = invoices.filter((i) => i.customerId === session.customerId);

    return NextResponse.json({ success: true, invoices: customerInvoices });
  } catch (error: any) {
    if (error instanceof CustomerAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve invoices' }, { status: 500 });
  }
}
