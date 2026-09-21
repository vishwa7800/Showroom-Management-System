// Shreeji Hero Showroom ERP - Sales Invoices API Handler

import { NextResponse } from 'next/server';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { getSalesInvoices } from '@/lib/db/sales-store';

export async function GET(request: Request) {
  try {
    const session = await requirePermission('sales.read');
    const { searchParams } = new URL(request.url);
    const branchFilter = searchParams.get('branchId');

    const effectiveBranchId = session.role === 'ADMIN' ? branchFilter : session.branchId;
    const invoices = await getSalesInvoices(effectiveBranchId);

    return NextResponse.json({ success: true, invoices });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve sales invoices' }, { status: 500 });
  }
}
