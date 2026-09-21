// Shreeji Hero Showroom ERP - Employee Account Status Toggle API

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { updateUserStatus, findUserById } from '@/lib/db/users-store';
import { createAuditLog } from '@/lib/audit';

const StatusSchema = z.object({
  status: z.enum(['ACTIVE', 'DISABLED', 'SUSPENDED']),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requirePermission('employees.manage');
    const { id } = params;

    // Prevent self-deactivation by admin to prevent lockout
    if (session.userId === id) {
      return NextResponse.json(
        { error: 'You cannot change your own account status.' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const result = StatusSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid status provided' }, { status: 400 });
    }

    const targetUser = await findUserById(id);
    if (!targetUser) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    // Showroom Manager can only manage their branch staff
    if (session.role === 'SHOWROOM_MANAGER' && targetUser.branchId !== session.branchId) {
      return NextResponse.json(
        { error: 'You are not authorized to modify staff from other branches.' },
        { status: 403 }
      );
    }

    const oldStatus = targetUser.status;
    const updated = await updateUserStatus(id, result.data.status);

    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      branchId: session.branchId,
      action: 'EMPLOYEE_STATUS_CHANGE',
      entity: 'Employee',
      entityId: id,
      changeDetails: {
        employeeName: updated.name,
        fromStatus: oldStatus,
        toStatus: updated.status,
      },
    });

    return NextResponse.json({ success: true, employee: updated });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message || 'Failed to update employee status' }, { status: 500 });
  }
}
