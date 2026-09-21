// Shreeji Hero Showroom ERP - Server-Side Authentication & Authorization Guards

import { cookies } from 'next/headers';
import { verifySessionToken, SessionPayload } from './jwt';
import { SESSION_COOKIE_NAME } from './cookies';
import { hasPermission, hasBranchAccess, PermissionKey } from '@/lib/permissions';

export class AuthError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number = 401, code: string = 'UNAUTHORIZED') {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export async function getServerSession(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return null;
  }

  const payload = await verifySessionToken(sessionCookie);
  if (!payload) {
    return null;
  }

  // Ensure account is not disabled or suspended
  if (payload.status !== 'ACTIVE') {
    return null;
  }

  return payload;
}

export async function requireAuth(): Promise<SessionPayload> {
  const session = await getServerSession();
  if (!session) {
    throw new AuthError('Authentication required. Please sign in.', 401, 'UNAUTHENTICATED');
  }
  return session;
}

export async function requirePermission(permission: PermissionKey): Promise<SessionPayload> {
  const session = await requireAuth();

  if (!hasPermission(session.role, permission)) {
    throw new AuthError(
      `Access denied: Your role (${session.role}) lacks permission: ${permission}`,
      403,
      'FORBIDDEN'
    );
  }

  return session;
}

export async function requireBranchAccess(targetBranchId: string | null): Promise<SessionPayload> {
  const session = await requireAuth();

  if (!hasBranchAccess(session.role, session.branchId, targetBranchId)) {
    throw new AuthError(
      `Access denied: You are not authorized to view or modify records for branch ${targetBranchId}`,
      403,
      'BRANCH_ACCESS_DENIED'
    );
  }

  return session;
}
