// Shreeji Hero Showroom ERP - Service Quality Check API Handler

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { completeQualityCheck } from '@/lib/db/service-store';
import { createAuditLog } from '@/lib/audit';

const QcSchema = z.object({
  passed: z.boolean(),
  notes: z.string().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requirePermission('service.update_job_card');
    const { id } = params;
    const body = await request.json();
    const result = QcSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Valid QC status required' }, { status: 400 });
    }

    const updated = await completeQualityCheck(
      id,
      result.data.passed,
      session.name,
      result.data.notes
    );

    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      branchId: session.branchId,
      action: result.data.passed ? 'QC_PASSED' : 'QC_FAILED',
      entity: 'JobCard',
      entityId: id,
      changeDetails: {
        jobCardNumber: updated.jobCardNumber,
        passed: result.data.passed,
        inspector: session.name,
      },
    });

    return NextResponse.json({ success: true, jobCard: updated });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message || 'Failed to record QC status' }, { status: 500 });
  }
}
