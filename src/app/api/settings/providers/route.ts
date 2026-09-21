import { NextResponse } from 'next/server';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { getProviderStatuses } from '@/lib/services/communication-provider';

export async function GET(request: Request) {
  try {
    const session = await requirePermission('settings.read');
    const providers = getProviderStatuses();
    return NextResponse.json({
      success: true,
      providers,
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json(
      { error: error.message || 'Failed to fetch provider status' },
      { status: 500 }
    );
  }
}
