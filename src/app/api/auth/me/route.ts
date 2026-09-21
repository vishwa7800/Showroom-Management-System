// Shreeji Hero Showroom ERP - Current Session API Route Handler

import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/server';

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: session,
  });
}
