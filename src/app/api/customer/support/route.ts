// Shreeji Hero Showroom ERP - Customer Support & Assistance Request API

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireCustomerAuth, CustomerAuthError } from '@/lib/auth/customer-server';
import { appendCustomerTimeline } from '@/lib/db/crm-store';
import { createInternalNotification } from '@/lib/db/notification-store';

const SupportSchema = z.object({
  topic: z.enum(['SERVICE_QUERY', 'FINANCE_EMI', 'WARRANTY_CLAIM', 'DOCUMENT_RC_INSURANCE', 'FEEDBACK_COMPLAINT']),
  vehicleReg: z.string().optional(),
  message: z.string().min(5),
});

export async function POST(request: Request) {
  try {
    const session = await requireCustomerAuth();
    const body = await request.json();
    const result = SupportSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Valid support topic and message required' }, { status: 400 });
    }

    const { topic, vehicleReg, message } = result.data;

    await appendCustomerTimeline({
      customerId: session.customerId,
      type: 'INQUIRY',
      title: `Customer Support Request: ${topic.replace(/_/g, ' ')}`,
      description: `Message: "${message}" ${vehicleReg ? `(Vehicle: ${vehicleReg})` : ''}`,
      actorName: session.name,
    });

    await createInternalNotification({
      title: `Support Ticket: ${session.name} (${topic.replace(/_/g, ' ')})`,
      message: `Customer Inquiry: "${message}"`,
      priority: topic === 'FEEDBACK_COMPLAINT' ? 'CRITICAL' : 'IMPORTANT',
      module: 'CRM',
      targetRole: topic === 'SERVICE_QUERY' ? 'SERVICE_ADVISOR' : topic === 'FINANCE_EMI' ? 'ACCOUNTANT' : 'FRONT_DESK',
      branchId: session.branchId,
      linkUrl: '/leads',
    });

    return NextResponse.json({
      success: true,
      message: 'Your inquiry has been submitted. Our dealership executive will contact you shortly.',
    });
  } catch (error: any) {
    if (error instanceof CustomerAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to submit support request' }, { status: 500 });
  }
}
