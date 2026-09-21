// Shreeji Hero Showroom ERP - Jose Edge & Node Pure JWT Implementation
import { SignJWT, jwtVerify } from 'jose';
import { Role, AccountStatus } from '@/types';

export interface SessionPayload {
  userId: string;
  employeeCode: string;
  name: string;
  email: string;
  role: Role;
  branchId: string | null;
  branchName?: string;
  status: AccountStatus;
  department?: string;
  designation?: string;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET ||
    process.env.JWT_SECRET ||
    'shreeji-hero-development-auth-secret-key-32-chars'
);

export async function signSessionToken(payload: SessionPayload): Promise<string> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(SECRET_KEY);

  return token;
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    if (!token || typeof token !== 'string') return null;
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}
