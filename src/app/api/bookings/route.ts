// Shreeji Hero Showroom ERP - Bookings API Route Handler

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { getBookings } from '@/lib/db/sales-store';

export async function GET(request: Request) {
  try {
    const session = await requirePermission('bookings.read');
    const { searchParams } = new URL(request.url);
    const branchFilter = searchParams.get('branchId');
    const status = searchParams.get('status') || undefined;

    const effectiveBranchId = session.role === 'ADMIN' ? branchFilter : session.branchId;
    const bookings = await getBookings({
      branchId: effectiveBranchId || undefined,
      status,
    });

    return NextResponse.json({ success: true, bookings });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve bookings' }, { status: 500 });
  }
}
