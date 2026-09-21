// Shreeji Hero Showroom ERP - Inventory Vendors API Handler

import { NextResponse } from 'next/server';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { getVendors } from '@/lib/db/inventory-store';

export async function GET(request: Request) {
  try {
    await requirePermission('inventory.read');
    const vendors = await getVendors();
    return NextResponse.json({ success: true, vendors });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve vendors' }, { status: 500 });
  }
}
