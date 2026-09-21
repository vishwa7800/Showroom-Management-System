// Shreeji Hero Showroom ERP - Confirm Transfer Receipt API

import { NextResponse } from 'next/server';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { confirmTransferReceipt } from '@/lib/db/inventory-store';
import { createAuditLog } from '@/lib/audit';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requirePermission('inventory.transfer');
    const { id } = params;

    const transfer = await confirmTransferReceipt(id, session.name);

    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      branchId: session.branchId,
      action: 'STOCK_TRANSFER_RECEIVED',
      entity: 'StockTransferRecord',
      entityId: id,
      changeDetails: {
        code: transfer.transferCode,
        receivedBy: session.name,
        targetBranch: transfer.targetBranchName,
      },
    });

    return NextResponse.json({ success: true, transfer });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message || 'Failed to confirm transfer receipt' }, { status: 400 });
  }
}
