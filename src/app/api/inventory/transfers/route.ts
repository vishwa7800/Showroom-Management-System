// Shreeji Hero Showroom ERP - Inter-Branch Stock Transfers API Handler

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { getStockTransfers, requestStockTransfer } from '@/lib/db/inventory-store';
import { createAuditLog } from '@/lib/audit';

const TransferSchema = z.object({
  itemType: z.enum(['VEHICLE', 'SPARE_PART']),
  vehicleUnitId: z.string().optional(),
  sparePartId: z.string().optional(),
  itemDescription: z.string().min(1, 'Description required'),
  quantity: z.number().min(1),
  sourceBranchId: z.string().min(1, 'Source branch required'),
  sourceBranchName: z.string().min(1, 'Source branch name required'),
  targetBranchId: z.string().min(1, 'Target branch required'),
  targetBranchName: z.string().min(1, 'Target branch name required'),
  notes: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const session = await requirePermission('inventory.transfer');
    const { searchParams } = new URL(request.url);
    const branchFilter = searchParams.get('branchId');

    const effectiveBranchId = session.role === 'ADMIN' ? branchFilter : session.branchId;
    const transfers = await getStockTransfers(effectiveBranchId);

    return NextResponse.json({ success: true, transfers });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve stock transfers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requirePermission('inventory.transfer');
    const body = await request.json();
    const result = TransferSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || 'Validation failed' },
        { status: 400 }
      );
    }

    const data = result.data;
    const transfer = await requestStockTransfer({
      ...data,
      requestedById: session.userId,
      requestedByName: session.name,
    });

    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      branchId: session.branchId,
      action: 'STOCK_TRANSFER_REQUEST',
      entity: 'StockTransferRecord',
      entityId: transfer.id,
      changeDetails: {
        code: transfer.transferCode,
        item: transfer.itemDescription,
        from: transfer.sourceBranchName,
        to: transfer.targetBranchName,
      },
    });

    return NextResponse.json({ success: true, transfer }, { status: 201 });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message || 'Failed to request transfer' }, { status: 400 });
  }
}
