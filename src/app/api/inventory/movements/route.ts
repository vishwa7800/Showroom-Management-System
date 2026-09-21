// Shreeji Hero Showroom ERP - Stock Movements Ledger API Handler

import { NextResponse } from 'next/server';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { getStockMovements } from '@/lib/db/inventory-store';

export async function GET(request: Request) {
  try {
    const session = await requirePermission('inventory.read');
    const { searchParams } = new URL(request.url);
    const branchFilter = searchParams.get('branchId');

    const effectiveBranchId = session.role === 'ADMIN' ? branchFilter : session.branchId;
    const movements = await getStockMovements(effectiveBranchId);

    return NextResponse.json({ success: true, movements });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve stock movements' }, { status: 500 });
  }
}
