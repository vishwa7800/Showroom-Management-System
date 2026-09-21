// Shreeji Hero Showroom ERP - Financial Reports & Analytics API Handler

import { NextResponse } from 'next/server';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { getInvoices, getPayments, getOutstandingReceivables, getGstSummary } from '@/lib/db/finance-store';

export async function GET(request: Request) {
  try {
    const session = await requirePermission('finance.view_reports');
    const { searchParams } = new URL(request.url);
    const branchFilter = searchParams.get('branchId');

    const effectiveBranchId = session.role === 'ADMIN' ? branchFilter : session.branchId;

    const [invoices, payments, receivables, gst] = await Promise.all([
      getInvoices({ branchId: effectiveBranchId }),
      getPayments({ branchId: effectiveBranchId }),
      getOutstandingReceivables(effectiveBranchId),
      getGstSummary(effectiveBranchId),
    ]);

    const totalRevenue = invoices.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const totalCollected = payments.reduce((acc, curr) => acc + curr.amount, 0);
    const totalOutstanding = receivables.reduce((acc, curr) => acc + curr.remainingBalance, 0);

    const paymentMethodsSummary = {
      UPI: payments.filter((p) => p.paymentMethod === 'UPI').reduce((a, c) => a + c.amount, 0),
      CASH: payments.filter((p) => p.paymentMethod === 'CASH').reduce((a, c) => a + c.amount, 0),
      BANK_TRANSFER: payments
        .filter((p) => p.paymentMethod === 'BANK_TRANSFER')
        .reduce((a, c) => a + c.amount, 0),
      FINANCIER: payments
        .filter((p) => p.paymentMethod === 'FINANCIER')
        .reduce((a, c) => a + c.amount, 0),
      CARD: payments.filter((p) => p.paymentMethod === 'CARD').reduce((a, c) => a + c.amount, 0),
    };

    const branchComparison = [
      {
        branch: 'Halvad Branch',
        code: 'SHR-HLV',
        salesRevenue: 4850000,
        serviceRevenue: 420000,
        totalCollected: 5120000,
        outstanding: 150000,
      },
      {
        branch: 'Dhangadhra Branch',
        code: 'SHR-DHN',
        salesRevenue: 3420000,
        serviceRevenue: 290000,
        totalCollected: 3580000,
        outstanding: 130000,
      },
      {
        branch: 'Jetpur Branch',
        code: 'SHR-JTP',
        salesRevenue: 2890000,
        serviceRevenue: 245000,
        totalCollected: 3045000,
        outstanding: 90000,
      },
    ];

    return NextResponse.json({
      success: true,
      summary: {
        totalRevenue,
        totalCollected,
        totalOutstanding,
        ...gst,
      },
      paymentMethodsSummary,
      branchComparison,
      recentPayments: payments.slice(0, 10),
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to generate financial reports' }, { status: 500 });
  }
}
