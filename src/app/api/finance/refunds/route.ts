// Shreeji Hero Showroom ERP - Refunds API Route Handler

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { getRefunds, requestRefund, approveRefund } from '@/lib/db/finance-store';
import { createAuditLog } from '@/lib/audit';

const RequestRefundSchema = z.object({
  invoiceNumber: z.string().optional(),
  customerId: z.string().min(1, 'Customer is required'),
  customerName: z.string().min(1, 'Customer name is required'),
  amount: z.number().min(1, 'Refund amount must be > 0'),
  reason: z.string().min(1, 'Reason for refund is required'),
  refundMethod: z.enum(['CASH', 'UPI', 'BANK_TRANSFER']),
});

export async function GET(request: Request) {
  try {
    const session = await requirePermission('finance.read');
    const { searchParams } = new URL(request.url);
    const branchFilter = searchParams.get('branchId');

    const effectiveBranchId = session.role === 'ADMIN' ? branchFilter : session.branchId;
    const refunds = await getRefunds(effectiveBranchId);

    return NextResponse.json({ success: true, refunds });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve refunds' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requirePermission('finance.create_invoice');
    const body = await request.json();
    const result = RequestRefundSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || 'Validation failed' },
        { status: 400 }
      );
    }

    const data = result.data;
    const branchId = session.branchId || 'br_halvad';

    const refund = await requestRefund({
      invoiceNumber: data.invoiceNumber,
      customerId: data.customerId,
      customerName: data.customerName,
      branchId,
      amount: data.amount,
      reason: data.reason,
      refundMethod: data.refundMethod,
      actorName: session.name,
    });

    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      branchId: session.branchId,
      action: 'REFUND_REQUEST',
      entity: 'RefundRecord',
      entityId: refund.id,
      changeDetails: {
        refundCode: refund.refundCode,
        customer: refund.customerName,
        amount: refund.amount,
        reason: refund.reason,
      },
    });

    return NextResponse.json({ success: true, refund }, { status: 201 });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message || 'Failed to request refund' }, { status: 400 });
  }
}
