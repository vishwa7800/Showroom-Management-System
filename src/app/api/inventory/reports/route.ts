// Shreeji Hero Showroom ERP - Inventory Valuation & Reports API Handler

import { NextResponse } from 'next/server';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { getInventoryValuation } from '@/lib/db/inventory-store';

export async function GET(request: Request) {
  try {
    const session = await requirePermission('inventory.read');
    const { searchParams } = new URL(request.url);
    const branchFilter = searchParams.get('branchId');

    const effectiveBranchId = session.role === 'ADMIN' ? branchFilter : session.branchId;
    const valuation = await getInventoryValuation(effectiveBranchId);

    return NextResponse.json({ success: true, valuation });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to calculate inventory valuation' }, { status: 500 });
  }
}
