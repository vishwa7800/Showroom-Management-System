// Shreeji Hero Showroom ERP - Finance Invoices API Route Handler

import { NextResponse } from 'next/server';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { getInvoices } from '@/lib/db/finance-store';

export async function GET(request: Request) {
  try {
    const session = await requirePermission('finance.read');
    const { searchParams } = new URL(request.url);
    const branchFilter = searchParams.get('branchId');
    const paymentStatus = searchParams.get('paymentStatus') || undefined;
    const invoiceType = searchParams.get('invoiceType') || undefined;

    const effectiveBranchId = session.role === 'ADMIN' ? branchFilter : session.branchId;
    const invoices = await getInvoices({
      branchId: effectiveBranchId || undefined,
      paymentStatus,
      invoiceType,
    });

    return NextResponse.json({ success: true, invoices });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve invoices' }, { status: 500 });
  }
}
