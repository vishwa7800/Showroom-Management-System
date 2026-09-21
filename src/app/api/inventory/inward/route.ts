// Shreeji Hero Showroom ERP - Stock Inward API Route Handler

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { inwardVehicleUnit } from '@/lib/db/inventory-store';
import { createAuditLog } from '@/lib/audit';

const InwardSchema = z.object({
  vin: z.string().min(8, 'Valid Chassis / VIN required'),
  engineNumber: z.string().min(6, 'Valid Engine number required'),
  modelId: z.string().min(1, 'Model is required'),
  modelName: z.string().min(1, 'Model name is required'),
  variantName: z.string().min(1, 'Variant is required'),
  color: z.string().min(1, 'Color is required'),
  purchasePrice: z.number().min(1000, 'Purchase price required'),
  sellingPrice: z.number().min(1000, 'Selling price required'),
});

export async function POST(request: Request) {
  try {
    const session = await requirePermission('inventory.create');
    const body = await request.json();
    const result = InwardSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || 'Validation failed' },
        { status: 400 }
      );
    }

    const data = result.data;
    const branchId = session.branchId || 'br_halvad';

    const unit = await inwardVehicleUnit({
      ...data,
      branchId,
      actorId: session.userId,
      actorName: session.name,
    });

    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      branchId: session.branchId,
      action: 'STOCK_INWARD',
      entity: 'VehicleUnit',
      entityId: unit.id,
      changeDetails: {
        vin: unit.vin,
        engineNumber: unit.engineNumber,
        model: unit.modelName,
        branch: unit.branchName,
      },
    });

    return NextResponse.json({ success: true, unit }, { status: 201 });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message || 'Failed to inward vehicle unit' }, { status: 400 });
  }
}
