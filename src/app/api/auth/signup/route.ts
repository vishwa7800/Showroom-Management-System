// Shreeji Hero Showroom ERP - Admin/Owner Signup API

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { createUser, findUserByEmail } from '@/lib/db/users-store';
import { signSessionToken } from '@/lib/auth/jwt';
import { SESSION_COOKIE_NAME, COOKIE_OPTIONS } from '@/lib/auth/cookies';
import { createAuditLog } from '@/lib/audit';

const SignupSchema = z.object({
  role: z.enum(['ADMIN', 'SHOWROOM_MANAGER']).default('ADMIN'),
  name: z.string().min(2, 'Full name is required').optional(),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = SignupSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { role, email, password, name, phone } = result.data;

    // Check if email already exists
    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email address already exists. Please login.' },
        { status: 409 }
      );
    }

    const fullName = name || email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

    const newUser = await createUser({
      name: fullName,
      email,
      phone: phone || '+91 98765 43210',
      role,
      branchId: null,
      branchName: 'All Branches (HQ)',
      department: 'Executive Management',
      designation: role === 'ADMIN' ? 'Owner / Franchise Principal' : 'Showroom General Manager',
      password,
    });

    const sessionPayload = {
      userId: newUser.id,
      employeeCode: newUser.employeeCode,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      branchId: newUser.branchId,
      branchName: newUser.branchName,
      status: newUser.status,
      department: newUser.department,
      designation: newUser.designation,
    };

    const token = await signSessionToken(sessionPayload);

    await createAuditLog({
      actorId: newUser.id,
      actorName: newUser.name,
      actorRole: newUser.role,
      branchId: newUser.branchId,
      action: 'ADMIN_SIGNUP',
      entity: 'AUTH',
      entityId: newUser.id,
      changeDetails: `New ${role} account registered for ${newUser.name} (${newUser.email}).`,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Account registered successfully.',
      user: sessionPayload,
    });

    response.cookies.set({
      value: token,
      ...COOKIE_OPTIONS,
    });

    try {
      const cookieStore = cookies();
      cookieStore.set(SESSION_COOKIE_NAME, token, COOKIE_OPTIONS);
    } catch (e) {
      // Cookie attached to response
    }

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error during registration' },
      { status: 500 }
    );
  }
}
