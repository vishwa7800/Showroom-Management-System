// Shreeji Hero Showroom ERP - Payments API Route Handler

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { getPayments, recordPayment } from '@/lib/db/finance-store';
import { createAuditLog } from '@/lib/audit';

const PaymentSchema = z.object({
  invoiceId: z.string().min(1, 'Invoice reference is required'),
  amount: z.number().min(1, 'Amount must be at least ₹1'),
  paymentMethod: z.enum(['CASH', 'UPI', 'CARD', 'BANK_TRANSFER', 'CHEQUE', 'FINANCIER']),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const session = await requirePermission('finance.read');
    const { searchParams } = new URL(request.url);
    const branchFilter = searchParams.get('branchId');
    const invoiceId = searchParams.get('invoiceId') || undefined;

    const effectiveBranchId = session.role === 'ADMIN' ? branchFilter : session.branchId;
    const payments = await getPayments({
      branchId: effectiveBranchId || undefined,
      invoiceId,
    });

    return NextResponse.json({ success: true, payments });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve payments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requirePermission('finance.record_payment');
    const body = await request.json();
    const result = PaymentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || 'Validation failed' },
        { status: 400 }
      );
    }

    const data = result.data;
    const payment = await recordPayment({
      invoiceId: data.invoiceId,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      referenceNumber: data.referenceNumber,
      notes: data.notes,
      recordedById: session.userId,
      recordedByName: session.name,
    });

    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      branchId: session.branchId,
      action: 'PAYMENT_RECORD',
      entity: 'Payment',
      entityId: payment.id,
      changeDetails: {
        paymentCode: payment.paymentCode,
        invoiceNumber: payment.invoiceNumber,
        amount: payment.amount,
        method: payment.paymentMethod,
      },
    });

    return NextResponse.json({ success: true, payment }, { status: 201 });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message || 'Failed to record payment' }, { status: 400 });
  }
}
