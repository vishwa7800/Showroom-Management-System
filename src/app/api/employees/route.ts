// Shreeji Hero Showroom ERP - Employee Management API

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { getAllUsers, createUser } from '@/lib/db/users-store';
import { createAuditLog } from '@/lib/audit';
import { Role } from '@/types';

const CreateEmployeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid 10-digit phone number is required'),
  role: z.enum([
    'ADMIN',
    'SHOWROOM_MANAGER',
    'SALES_EXECUTIVE',
    'FRONT_DESK',
    'SERVICE_MANAGER',
    'SERVICE_ADVISOR',
    'ACCOUNTANT',
    'INVENTORY_MANAGER',
  ]),
  branchId: z.string().nullable().optional(),
  department: z.string().optional(),
  designation: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
});

export async function GET(request: Request) {
  try {
    const session = await requirePermission('employees.read');
    const { searchParams } = new URL(request.url);
    const branchFilter = searchParams.get('branchId');

    // Showroom Manager can only view their own branch
    let effectiveBranchId = branchFilter;
    if (session.role === 'SHOWROOM_MANAGER') {
      effectiveBranchId = session.branchId;
    }

    const employees = await getAllUsers({
      branchId: effectiveBranchId || undefined,
    });

    return NextResponse.json({ success: true, employees });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requirePermission('employees.manage');
    const body = await request.json();
    const result = CreateEmployeeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || 'Validation failed' },
        { status: 400 }
      );
    }

    const data = result.data;

    // Showroom manager can only create employees in their branch
    if (session.role === 'SHOWROOM_MANAGER' && data.branchId !== session.branchId) {
      return NextResponse.json(
        { error: 'Showroom Managers can only onboard staff to their assigned branch.' },
        { status: 403 }
      );
    }

    const newEmployee = await createUser({
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role as Role,
      branchId: data.branchId || null,
      department: data.department,
      designation: data.designation,
      password: data.password,
    });

    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      branchId: session.branchId,
      action: 'EMPLOYEE_CREATE',
      entity: 'Employee',
      entityId: newEmployee.id,
      changeDetails: {
        employeeCode: newEmployee.employeeCode,
        name: newEmployee.name,
        role: newEmployee.role,
        branchId: newEmployee.branchId,
      },
    });

    return NextResponse.json({ success: true, employee: newEmployee }, { status: 201 });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message || 'Failed to create employee' }, { status: 400 });
  }
}
