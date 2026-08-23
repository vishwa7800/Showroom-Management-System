// Shreeji Hero Showroom ERP - Server-Side Customer Authentication Guard

import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'shreeji-hero-customer-secret-key-2026-safe-production-key'
);

export const CUSTOMER_COOKIE_NAME = 'customer_session_token';

export interface CustomerSessionPayload {
  customerId: string;
  customerCode: string;
  name: string;
  phone: string;
  branchId: string;
  isCustomer: boolean;
}

export class CustomerAuthError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 401) {
    super(message);
    this.name = 'CustomerAuthError';
    this.statusCode = statusCode;
  }
}

export async function signCustomerToken(payload: CustomerSessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyCustomerToken(token: string): Promise<CustomerSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload.isCustomer) return null;
    return payload as unknown as CustomerSessionPayload;
  } catch (err) {
    return null;
  }
}

export async function getCustomerSession(): Promise<CustomerSessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(CUSTOMER_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyCustomerToken(token);
}

export async function requireCustomerAuth(): Promise<CustomerSessionPayload> {
  const session = await getCustomerSession();
  if (!session) {
    throw new CustomerAuthError('Customer authentication required to access this resource', 401);
  }
  return session;
}
