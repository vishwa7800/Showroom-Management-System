// Shreeji Hero Showroom ERP - Available Vehicles API Handler

import { NextResponse } from 'next/server';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { getAvailableVehicles } from '@/lib/db/sales-store';

export async function GET(request: Request) {
  try {
    const session = await requirePermission('inventory.read');
    const { searchParams } = new URL(request.url);
    const branchFilter = searchParams.get('branchId');

    const effectiveBranchId = session.role === 'ADMIN' ? branchFilter : session.branchId;
    const vehicles = await getAvailableVehicles(effectiveBranchId);

    return NextResponse.json({ success: true, vehicles });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve available vehicles' }, { status: 500 });
  }
}
