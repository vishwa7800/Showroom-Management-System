// Shreeji Hero Showroom ERP - Sanitized Report Export API Handler

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth, AuthError } from '@/lib/auth/server';
import { generateExportCsv } from '@/lib/db/analytics-store';
import { createAuditLog } from '@/lib/audit';

const ExportSchema = z.object({
  reportType: z.enum(['SALES', 'SPARES', 'GENERAL']),
});

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const result = ExportSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Valid report type required' }, { status: 400 });
    }

    const effectiveBranchId = session.role === 'ADMIN' ? undefined : session.branchId;
    const csvContent = await generateExportCsv(result.data.reportType, effectiveBranchId);

    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      branchId: session.branchId,
      action: 'REPORT_EXPORT',
      entity: 'Report',
      entityId: result.data.reportType,
      changeDetails: {
        type: result.data.reportType,
        format: 'CSV',
      },
    });

    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="shreeji_hero_${result.data.reportType.toLowerCase()}_report.csv"`,
      },
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to export report' }, { status: 500 });
  }
}
