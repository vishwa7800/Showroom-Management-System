// Shreeji Hero Showroom ERP - Internal Notifications API Route Handler

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth, AuthError } from '@/lib/auth/server';
import { getInternalNotifications, createInternalNotification } from '@/lib/db/notification-store';
import { Role } from '@/types';

const CreateNotifSchema = z.object({
  title: z.string().min(1),
  message: z.string().min(1),
  priority: z.enum(['INFO', 'NORMAL', 'IMPORTANT', 'CRITICAL']).optional(),
  module: z.enum(['SALES', 'SERVICE', 'FINANCE', 'INVENTORY', 'CRM', 'SYSTEM']),
  recordId: z.string().optional(),
  targetRole: z.string().optional(),
  linkUrl: z.string().min(1),
});

export async function GET(request: Request) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);
    const moduleFilter = searchParams.get('module') || undefined;
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    const notifications = await getInternalNotifications({
      role: session.role,
      userId: session.userId,
      branchId: session.branchId,
      module: moduleFilter,
      unreadOnly,
    });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return NextResponse.json({ success: true, notifications, unreadCount });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve notifications' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const result = CreateNotifSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Valid notification details required' }, { status: 400 });
    }

    const data = result.data;
    const notif = await createInternalNotification({
      title: data.title,
      message: data.message,
      priority: data.priority,
      module: data.module,
      recordId: data.recordId,
      targetRole: data.targetRole as Role | undefined,
      branchId: session.branchId || undefined,
      linkUrl: data.linkUrl,
    });

    return NextResponse.json({ success: true, notification: notif }, { status: 201 });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message || 'Failed to create notification' }, { status: 400 });
  }
}
