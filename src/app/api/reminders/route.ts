// Shreeji Hero Showroom ERP - Dealership Reminders Engine API Handler

import { NextResponse } from 'next/server';
import { requireAuth, AuthError } from '@/lib/auth/server';
import { getFollowUps, getTestRides } from '@/lib/db/crm-store';
import { getJobCards } from '@/lib/db/service-store';
import { getSpareParts } from '@/lib/db/inventory-store';

export async function GET(request: Request) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);
    const branchFilter = searchParams.get('branchId');

    const effectiveBranchId = session.role === 'ADMIN' ? branchFilter : session.branchId;

    const [followUps, testRides, jobCards, spares] = await Promise.all([
      getFollowUps({ branchId: effectiveBranchId }),
      getTestRides(effectiveBranchId),
      getJobCards({ branchId: effectiveBranchId }),
      getSpareParts({ branchId: effectiveBranchId }),
    ]);

    const reminders = [
      ...followUps
        .filter((f) => f.status === 'PENDING')
        .map((f) => ({
          id: `rem_fu_${f.id}`,
          type: 'FOLLOW_UP_DUE',
          title: `Follow-Up Due: ${f.customerName}`,
          description: `Scheduled ${f.type} for Lead. Notes: ${f.notes}`,
          priority: 'IMPORTANT',
          linkUrl: '/leads',
          dueDate: f.scheduledAt,
        })),
      ...testRides
        .filter((t) => t.status === 'SCHEDULED')
        .map((t) => ({
          id: `rem_tr_${t.id}`,
          type: 'TEST_RIDE_SCHEDULED',
          title: `Test Ride Today: ${t.customerName}`,
          description: `Scheduled test ride on ${t.vehicleModel}.`,
          priority: 'NORMAL',
          linkUrl: '/test-rides',
          dueDate: t.scheduledAt,
        })),
      ...jobCards
        .filter((j) => j.status === 'CUSTOMER_APPROVAL')
        .map((j) => ({
          id: `rem_jc_${j.id}`,
          type: 'APPROVAL_PENDING',
          title: `Service Approval: ${j.customerName}`,
          description: `Job Card #${j.jobCardNumber} awaiting extra repair approval.`,
          priority: 'IMPORTANT',
          linkUrl: '/service',
          dueDate: j.createdAt,
        })),
      ...spares
        .filter((s) => s.status === 'LOW_STOCK' || s.status === 'OUT_OF_STOCK')
        .map((s) => ({
          id: `rem_sp_${s.id}`,
          type: 'STOCK_REORDER',
          title: `Stock Alert: ${s.name}`,
          description: `Current Stock (${s.currentStock}) is at or below minimum (${s.minStockLevel}).`,
          priority: s.status === 'OUT_OF_STOCK' ? 'CRITICAL' : 'IMPORTANT',
          linkUrl: '/inventory',
          dueDate: new Date().toISOString(),
        })),
    ];

    return NextResponse.json({ success: true, reminders });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve dealership reminders' }, { status: 500 });
  }
}
