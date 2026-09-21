// Shreeji Hero Showroom ERP - Authentication Login Route Handler

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { findUserByIdentifier, updateLastLogin } from '@/lib/db/users-store';
import { signSessionToken } from '@/lib/auth/jwt';
import { SESSION_COOKIE_NAME, COOKIE_OPTIONS } from '@/lib/auth/cookies';
import { createAuditLog } from '@/lib/audit';

const LoginSchema = z.object({
  email: z.string().min(1, 'Email or username is required').optional(),
  name: z.string().min(1).optional(),
  identifier: z.string().min(1).optional(),
  password: z.string().min(1, 'Password is required'),
  role: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = LoginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { email, name, identifier, password, role } = result.data;
    const loginIdentifier = (email || name || identifier || '').trim();

    if (!loginIdentifier) {
      return NextResponse.json({ error: 'Please enter your email or employee code.' }, { status: 400 });
    }

    const user = await findUserByIdentifier(loginIdentifier);

    // Constant-time check mitigation
    if (!user) {
      await createAuditLog({
        actorId: 'anonymous',
        actorName: loginIdentifier,
        actorRole: 'UNKNOWN',
        action: 'AUTH_FAILED_LOGIN',
        entity: 'Authentication',
        changeDetails: { reason: 'User not found' },
      });
      return NextResponse.json(
        { error: 'Invalid email/code or password.' },
        { status: 401 }
      );
    }

    // Verify Password Hash
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      await createAuditLog({
        actorId: user.id,
        actorName: user.name,
        actorRole: user.role,
        branchId: user.branchId,
        action: 'AUTH_FAILED_LOGIN',
        entity: 'Authentication',
        entityId: user.id,
        changeDetails: { reason: 'Incorrect password' },
      });
      return NextResponse.json(
        { error: 'Invalid email/code or password.' },
        { status: 401 }
      );
    }

    // Role Verification & Mismatch Protection
    // If the client provided a selected role, verify it strictly against database user.role
    if (role && role.trim().toUpperCase() !== user.role.toUpperCase()) {
      await createAuditLog({
        actorId: user.id,
        actorName: user.name,
        actorRole: user.role,
        branchId: user.branchId,
        action: 'AUTH_FAILED_LOGIN',
        entity: 'Authentication',
        entityId: user.id,
        changeDetails: { reason: 'Role mismatch', requestedRole: role, actualRole: user.role },
      });
      return NextResponse.json(
        { error: 'The selected role does not match this employee account. Please select the correct role.' },
        { status: 401 }
      );
    }

    // Check Account Status
    if (user.status !== 'ACTIVE') {
      await createAuditLog({
        actorId: user.id,
        actorName: user.name,
        actorRole: user.role,
        branchId: user.branchId,
        action: 'AUTH_LOGIN_BLOCKED',
        entity: 'Authentication',
        entityId: user.id,
        changeDetails: { status: user.status },
      });
      return NextResponse.json(
        {
          error:
            user.status === 'DISABLED'
              ? 'Your account has been deactivated. Please contact your Showroom Administrator.'
              : 'Your account is currently suspended or locked.',
        },
        { status: 403 }
      );
    }

    // Update last login
    await updateLastLogin(user.id);

    // Sign Session JWT using the authoritative database employee role
    const sessionPayload = {
      userId: user.id,
      employeeCode: user.employeeCode,
      name: user.name,
      email: user.email,
      role: user.role,
      branchId: user.branchId,
      branchName: user.branchName,
      status: user.status,
      department: user.department,
      designation: user.designation,
    };

    const token = await signSessionToken(sessionPayload);

    // Log Successful Login Audit Event
    await createAuditLog({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      branchId: user.branchId,
      action: 'AUTH_LOGIN_SUCCESS',
      entity: 'Authentication',
      entityId: user.id,
      changeDetails: { email: user.email, role: user.role },
    });

    const { passwordHash: _, ...safeUser } = user;
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: safeUser,
    });

    // Set secure HTTP-only session cookie on response
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours
    });

    return response;
  } catch (error: any) {
    console.error('[AUTH LOGIN ERROR]', error);
    return NextResponse.json(
      { error: 'An unexpected authentication error occurred.' },
      { status: 500 }
    );
  }
}
