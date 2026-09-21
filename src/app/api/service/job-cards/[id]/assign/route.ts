// Shreeji Hero Showroom ERP - Assign Bay and Technician API Handler

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { assignBayAndTechnician } from '@/lib/db/service-store';
import { createAuditLog } from '@/lib/audit';

const AssignSchema = z.object({
  bayId: z.string().min(1, 'Bay ID is required'),
  technicianId: z.string().min(1, 'Technician ID is required'),
  technicianName: z.string().min(1, 'Technician Name is required'),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requirePermission('service.assign_tech');
    const { id } = params;
    const body = await request.json();
    const result = AssignSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || 'Validation failed' },
        { status: 400 }
      );
    }

    const updated = await assignBayAndTechnician(
      id,
      result.data.bayId,
      result.data.technicianId,
      result.data.technicianName,
      session.name
    );

    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      branchId: session.branchId,
      action: 'BAY_TECH_ASSIGN',
      entity: 'JobCard',
      entityId: id,
      changeDetails: {
        jobCardNumber: updated.jobCardNumber,
        bayCode: updated.bayCode,
        technician: result.data.technicianName,
      },
    });

    return NextResponse.json({ success: true, jobCard: updated });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message || 'Failed to assign bay and technician' }, { status: 400 });
  }
}
