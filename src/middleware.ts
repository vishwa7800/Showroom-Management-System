import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken } from '@/lib/auth/jwt';
import { SESSION_COOKIE_NAME } from '@/lib/auth/cookies';
import { Role } from '@/types';

// Route RBAC Requirements
const ROUTE_PERMISSIONS: { pathPrefix: string; allowedRoles: Role[] }[] = [
  {
    pathPrefix: '/employees',
    allowedRoles: ['ADMIN', 'SHOWROOM_MANAGER'],
  },
  {
    pathPrefix: '/settings',
    allowedRoles: ['ADMIN'],
  },
  {
    pathPrefix: '/finance',
    allowedRoles: ['ADMIN', 'SHOWROOM_MANAGER', 'ACCOUNTANT'],
  },
  {
    pathPrefix: '/reports',
    allowedRoles: ['ADMIN', 'SHOWROOM_MANAGER', 'ACCOUNTANT'],
  },
  {
    pathPrefix: '/service',
    allowedRoles: ['ADMIN', 'SHOWROOM_MANAGER', 'SERVICE_MANAGER', 'SERVICE_ADVISOR', 'FRONT_DESK'],
  },
  {
    pathPrefix: '/inventory',
    allowedRoles: ['ADMIN', 'SHOWROOM_MANAGER', 'INVENTORY_MANAGER', 'SALES_EXECUTIVE', 'SERVICE_MANAGER'],
  },
  {
    pathPrefix: '/sales',
    allowedRoles: ['ADMIN', 'SHOWROOM_MANAGER', 'SALES_EXECUTIVE', 'ACCOUNTANT'],
  },
  {
    pathPrefix: '/leads',
    allowedRoles: ['ADMIN', 'SHOWROOM_MANAGER', 'SALES_EXECUTIVE', 'FRONT_DESK'],
  },
  {
    pathPrefix: '/customers',
    allowedRoles: ['ADMIN', 'SHOWROOM_MANAGER', 'SALES_EXECUTIVE', 'FRONT_DESK', 'SERVICE_ADVISOR', 'ACCOUNTANT'],
  },
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow public routes, static assets, customer portal, and unauthorized error page
  if (
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/unauthorized' ||
    pathname.startsWith('/portal') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/customer') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Check for session cookie
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Verify JWT token signature and expiration
  const session = await verifySessionToken(sessionCookie);

  if (!session || session.status !== 'ACTIVE') {
    if (pathname.startsWith('/api/')) {
      const response = NextResponse.json({ error: 'Session invalid or deactivated' }, { status: 401 });
      response.cookies.delete(SESSION_COOKIE_NAME);
      return response;
    }
    const response = NextResponse.redirect(new URL('/login?error=session_invalid', request.url));
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  }

  // 4. Enforce Route-Level RBAC
  for (const rule of ROUTE_PERMISSIONS) {
    if (pathname === rule.pathPrefix || pathname.startsWith(`${rule.pathPrefix}/`)) {
      if (!rule.allowedRoles.includes(session.role)) {
        const unauthorizedUrl = new URL('/unauthorized', request.url);
        unauthorizedUrl.searchParams.set('from', pathname);
        unauthorizedUrl.searchParams.set('role', session.role);
        return NextResponse.redirect(unauthorizedUrl);
      }
    }
  }

  // 5. User is authenticated and authorized -> Pass through
  const response = NextResponse.next();
  // Pass user headers to server components if needed
  response.headers.set('x-user-id', session.userId);
  response.headers.set('x-user-role', session.role);
  response.headers.set('x-user-branch', session.branchId || 'ALL');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
