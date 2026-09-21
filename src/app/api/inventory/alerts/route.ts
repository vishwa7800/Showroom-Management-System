// Shreeji Hero Showroom ERP - Inventory Alerts API Handler

import { NextResponse } from 'next/server';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { getSpareParts, getVehicleInventory } from '@/lib/db/inventory-store';

export async function GET(request: Request) {
  try {
    const session = await requirePermission('inventory.read');
    const { searchParams } = new URL(request.url);
    const branchFilter = searchParams.get('branchId');

    const effectiveBranchId = session.role === 'ADMIN' ? branchFilter : session.branchId;

    const [parts, vehicles] = await Promise.all([
      getSpareParts({ branchId: effectiveBranchId }),
      getVehicleInventory({ branchId: effectiveBranchId }),
    ]);

    const lowStockParts = parts.filter(
      (p) => p.status === 'LOW_STOCK' || p.status === 'OUT_OF_STOCK'
    );
    const inTransitVehicles = vehicles.filter((v) => v.status === 'IN_TRANSIT');

    return NextResponse.json({
      success: true,
      alerts: {
        lowStockParts,
        inTransitVehicles,
      },
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve inventory alerts' }, { status: 500 });
  }
}
