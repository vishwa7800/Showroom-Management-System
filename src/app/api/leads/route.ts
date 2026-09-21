// Shreeji Hero Showroom ERP - Leads API Route Handler

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { getLeads, createLead, findCustomerById } from '@/lib/db/crm-store';
import { createAuditLog } from '@/lib/audit';

const LeadCreateSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  modelName: z.string().min(1, 'Target vehicle model is required'),
  variantName: z.string().optional(),
  priority: z.enum(['HOT', 'WARM', 'COLD']).optional(),
  estimatedValue: z.number().optional(),
  expectedPurchaseDate: z.string().optional(),
  source: z.string().optional(),
  assignedToId: z.string().optional(),
  assignedToName: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const session = await requirePermission('leads.read');
    const { searchParams } = new URL(request.url);
    const branchFilter = searchParams.get('branchId');
    const assignedFilter = searchParams.get('assignedToId');
    const statusFilter = searchParams.get('status');

    let effectiveBranchId = branchFilter;
    if (session.role !== 'ADMIN') {
      effectiveBranchId = session.branchId;
    }

    let effectiveAssignedId = assignedFilter || undefined;
    if (session.role === 'SALES_EXECUTIVE') {
      effectiveAssignedId = session.userId;
    }

    const leads = await getLeads({
      branchId: effectiveBranchId || undefined,
      assignedToId: effectiveAssignedId,
      status: statusFilter || undefined,
    });

    return NextResponse.json({ success: true, leads });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve leads' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requirePermission('leads.create');
    const body = await request.json();
    const result = LeadCreateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || 'Validation failed' },
        { status: 400 }
      );
    }

    const data = result.data;
    const customer = await findCustomerById(data.customerId);
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const branchId = session.branchId || customer.branchId || 'br_halvad';
    const assignedToId = data.assignedToId || (session.role === 'SALES_EXECUTIVE' ? session.userId : undefined);
    const assignedToName = data.assignedToName || (session.role === 'SALES_EXECUTIVE' ? session.name : undefined);

    const newLead = await createLead({
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      branchId,
      assignedToId,
      assignedToName,
      modelName: data.modelName,
      variantName: data.variantName,
      priority: data.priority,
      estimatedValue: data.estimatedValue,
      expectedPurchaseDate: data.expectedPurchaseDate,
      source: data.source,
      notes: data.notes,
      actorName: session.name,
    });

    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      branchId: session.branchId,
      action: 'LEAD_CREATE',
      entity: 'Lead',
      entityId: newLead.id,
      changeDetails: {
        leadCode: newLead.leadCode,
        customer: customer.name,
        model: newLead.modelName,
        priority: newLead.priority,
      },
    });

    return NextResponse.json({ success: true, lead: newLead }, { status: 201 });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message || 'Failed to create lead' }, { status: 400 });
  }
}
