// Shreeji Hero Showroom ERP - Communication Preferences API Handler

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth, AuthError } from '@/lib/auth/server';
import { getCustomerPreferences, updateCustomerPreferences } from '@/lib/db/notification-store';
import { createAuditLog } from '@/lib/audit';

const PrefSchema = z.object({
  customerId: z.string().min(1),
  allowWhatsapp: z.boolean().optional(),
  allowSms: z.boolean().optional(),
  allowEmail: z.boolean().optional(),
  allowPortal: z.boolean().optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId') || 'c_01';
    const prefs = await getCustomerPreferences(customerId);
    return NextResponse.json({ success: true, preferences: prefs });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to retrieve preferences' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const result = PrefSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Valid preferences required' }, { status: 400 });
    }

    const data = result.data;
    const updated = await updateCustomerPreferences(data.customerId, data);

    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      branchId: session.branchId,
      action: 'PREFERENCE_CHANGE',
      entity: 'CommunicationPreference',
      entityId: data.customerId,
      changeDetails: {
        whatsapp: updated.allowWhatsapp,
        sms: updated.allowSms,
        email: updated.allowEmail,
      },
    });

    return NextResponse.json({ success: true, preferences: updated });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message || 'Failed to update preferences' }, { status: 400 });
  }
}
