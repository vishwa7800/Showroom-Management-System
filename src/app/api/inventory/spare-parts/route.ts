// Shreeji Hero Showroom ERP - Spare Parts API Route Handler

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { getSpareParts, adjustSpareStock } from '@/lib/db/inventory-store';
import { createAuditLog } from '@/lib/audit';

const AdjustStockSchema = z.object({
  sparePartId: z.string().min(1, 'Spare part ID is required'),
  quantityDelta: z.number(),
  reason: z.string().min(1, 'Reason for adjustment is required'),
});

export async function GET(request: Request) {
  try {
    const session = await requirePermission('spares.read');
    const { searchParams } = new URL(request.url);
    const branchFilter = searchParams.get('branchId');
    const category = searchParams.get('category') || undefined;
    const status = searchParams.get('status') || undefined;

    const effectiveBranchId = session.role === 'ADMIN' ? branchFilter : session.branchId;
    const parts = await getSpareParts({
      branchId: effectiveBranchId || undefined,
      category,
      status,
    });

    return NextResponse.json({ success: true, parts });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve spare parts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requirePermission('spares.update_stock');
    const body = await request.json();
    const result = AdjustStockSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || 'Validation failed' },
        { status: 400 }
      );
    }

    const data = result.data;
    const updated = await adjustSpareStock(
      data.sparePartId,
      data.quantityDelta,
      data.reason,
      session.userId,
      session.name
    );

    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      branchId: session.branchId,
      action: 'STOCK_ADJUSTMENT',
      entity: 'SparePart',
      entityId: updated.id,
      changeDetails: {
        partNumber: updated.partNumber,
        delta: data.quantityDelta,
        newStock: updated.currentStock,
        reason: data.reason,
      },
    });

    return NextResponse.json({ success: true, part: updated });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message || 'Failed to adjust spare stock' }, { status: 400 });
  }
}
