// Shreeji Hero Showroom ERP - Customer Additional Work Approval API

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireCustomerAuth, CustomerAuthError } from '@/lib/auth/customer-server';
import { getJobCards, recordCustomerApproval } from '@/lib/db/service-store';
import { appendCustomerTimeline } from '@/lib/db/crm-store';
import { createInternalNotification } from '@/lib/db/notification-store';

const ApprovalSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  customerNotes: z.string().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireCustomerAuth();
    const { id } = params;
    const body = await request.json();
    const result = ApprovalSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Valid approval status required' }, { status: 400 });
    }

    const jobCards = await getJobCards();
    const jobCard = jobCards.find((j) => j.id === id);

    if (!jobCard) {
      return NextResponse.json({ error: 'Job card not found' }, { status: 404 });
    }

    // Critical IDOR Guard: Verify ownership
    if (jobCard.customerId !== session.customerId) {
      return NextResponse.json({ error: 'Unauthorized to modify another customer service job' }, { status: 403 });
    }

    const approvalId = jobCard.approvals?.[0]?.id || 'app_01';
    const isApproved = result.data.status === 'APPROVED';

    const updatedJobCard = await recordCustomerApproval(
      id,
      approvalId,
      isApproved,
      result.data.customerNotes,
      session.name
    );

    await appendCustomerTimeline({
      customerId: session.customerId,
      type: 'SERVICE',
      title: `Additional Service Work ${result.data.status}`,
      description: `Customer ${result.data.status.toLowerCase()} additional workshop repair estimate for Job Card #${jobCard.jobCardNumber}.`,
      actorName: session.name,
    });

    await createInternalNotification({
      title: `Customer ${result.data.status} Extra Repairs: #${jobCard.jobCardNumber}`,
      message: `${session.name} ${result.data.status.toLowerCase()} additional repair work. Workshop technician may proceed.`,
      priority: 'IMPORTANT',
      module: 'SERVICE',
      recordId: jobCard.id,
      targetRole: 'SERVICE_ADVISOR',
      branchId: jobCard.branchId,
      linkUrl: '/service',
    });

    return NextResponse.json({ success: true, jobCard: updatedJobCard });
  } catch (error: any) {
    if (error instanceof CustomerAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message || 'Failed to update approval' }, { status: 400 });
  }
}
