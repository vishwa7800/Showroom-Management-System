// Shreeji Hero Showroom ERP - Record Financier Disbursal API

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { recordLoanDisbursal } from '@/lib/db/finance-store';
import { createAuditLog } from '@/lib/audit';

const DisburseSchema = z.object({
  disbursedAmount: z.number().min(1, 'Disbursed amount required'),
  disbursalRef: z.string().min(1, 'Disbursal transaction reference required'),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requirePermission('finance.record_payment');
    const { id } = params;
    const body = await request.json();
    const result = DisburseSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Valid disbursal details required' }, { status: 400 });
    }

    const updatedLoan = await recordLoanDisbursal(
      id,
      result.data.disbursedAmount,
      result.data.disbursalRef,
      session.name
    );

    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      branchId: session.branchId,
      action: 'LOAN_DISBURSE_RECORD',
      entity: 'FinanceRecord',
      entityId: id,
      changeDetails: {
        applicationNo: updatedLoan.applicationNo,
        amount: result.data.disbursedAmount,
        financier: updatedLoan.loanProvider,
        ref: result.data.disbursalRef,
      },
    });

    return NextResponse.json({ success: true, loan: updatedLoan });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message || 'Failed to record loan disbursal' }, { status: 400 });
  }
}
