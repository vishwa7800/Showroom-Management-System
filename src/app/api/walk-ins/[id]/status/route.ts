// Shreeji Hero Showroom ERP - Walk-In Status API Route Handler

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { updateWalkInStatus } from '@/lib/db/crm-store';

const WalkInStatusSchema = z.object({
  status: z.enum(['WAITING', 'ASSIGNED', 'IN_DISCUSSION', 'TEST_RIDE', 'COMPLETED', 'LEFT']),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requirePermission('leads.update');
    const { id } = params;
    const body = await request.json();
    const result = WalkInStatusSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid walk-in status' }, { status: 400 });
    }

    const updated = await updateWalkInStatus(id, result.data.status);
    return NextResponse.json({ success: true, walkIn: updated });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message || 'Failed to update walk-in status' }, { status: 500 });
  }
}
