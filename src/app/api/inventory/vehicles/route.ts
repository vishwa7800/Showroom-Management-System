// Shreeji Hero Showroom ERP - Vehicle Stock API Handler

import { NextResponse } from 'next/server';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { getVehicleInventory } from '@/lib/db/inventory-store';

export async function GET(request: Request) {
  try {
    const session = await requirePermission('inventory.read');
    const { searchParams } = new URL(request.url);
    const branchFilter = searchParams.get('branchId');
    const status = searchParams.get('status') || undefined;
    const modelId = searchParams.get('modelId') || undefined;

    const effectiveBranchId = session.role === 'ADMIN' ? branchFilter : session.branchId;
    const vehicles = await getVehicleInventory({
      branchId: effectiveBranchId || undefined,
      status,
      modelId,
    });

    return NextResponse.json({ success: true, vehicles });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve vehicle inventory' }, { status: 500 });
  }
}
