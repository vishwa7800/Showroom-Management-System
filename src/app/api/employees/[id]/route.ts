// Shreeji Hero Showroom ERP - Employee Detail & Status Update API

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { updateUserStatus, findUserById } from '@/lib/db/users-store';
import { createAuditLog } from '@/lib/audit';
import { AccountStatus } from '@/types';

const UpdateEmployeeStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'DISABLED']),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requirePermission('employees.manage');
    const employeeId = params.id;
    const body = await request.json();
    const result = UpdateEmployeeStatusSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || 'Invalid status' },
        { status: 400 }
      );
    }

    const existingUser = await findUserById(employeeId);
    if (!existingUser) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    // Prevent deactivating own account
    if (employeeId === session.userId && result.data.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Cannot deactivate your own active session.' },
        { status: 400 }
      );
    }

    const updatedUser = await updateUserStatus(employeeId, result.data.status as AccountStatus);

    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      branchId: session.branchId,
      action: result.data.status === 'ACTIVE' ? 'EMPLOYEE_ENABLE' : 'EMPLOYEE_DISABLE',
      entity: 'Employee',
      entityId: employeeId,
      changeDetails: {
        employeeCode: updatedUser.employeeCode,
        name: updatedUser.name,
        previousStatus: existingUser.status,
        newStatus: result.data.status,
      },
    });

    return NextResponse.json({
      success: true,
      employee: updatedUser,
      message: `Employee status updated to ${result.data.status}`,
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json(
      { error: error.message || 'Failed to update employee status' },
      { status: 500 }
    );
  }
}
