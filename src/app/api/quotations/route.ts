// Shreeji Hero Showroom ERP - Quotations API Route Handler

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requirePermission, AuthError } from '@/lib/auth/server';
import { getQuotations, createQuotation } from '@/lib/db/sales-store';
import { findCustomerById } from '@/lib/db/crm-store';
import { createAuditLog } from '@/lib/audit';

const QuotationSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  modelName: z.string().min(1, 'Vehicle model is required'),
  variantName: z.string().min(1, 'Variant is required'),
  color: z.string().min(1, 'Color is required'),
  exShowroomPrice: z.number().min(1000, 'Ex-showroom price required'),
  rtoCharges: z.number().optional(),
  insuranceCharges: z.number().optional(),
  accessoriesCharges: z.number().optional(),
  discount: z.number().optional(),
  downPayment: z.number().optional(),
  loanAmount: z.number().optional(),
  estimatedEmi: z.number().optional(),
  tenureMonths: z.number().optional(),
  notes: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const session = await requirePermission('sales.read');
    const { searchParams } = new URL(request.url);
    const branchFilter = searchParams.get('branchId');
    const customerId = searchParams.get('customerId') || undefined;

    const effectiveBranchId = session.role === 'ADMIN' ? branchFilter : session.branchId;
    const quotations = await getQuotations({
      branchId: effectiveBranchId || undefined,
      customerId,
    });

    return NextResponse.json({ success: true, quotations });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve quotations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requirePermission('sales.create');
    const body = await request.json();
    const result = QuotationSchema.safeParse(body);

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

    const quotation = await createQuotation({
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      branchId,
      salesExecutiveId: session.userId,
      salesExecutiveName: session.name,
      modelName: data.modelName,
      variantName: data.variantName,
      color: data.color,
      exShowroomPrice: data.exShowroomPrice,
      rtoCharges: data.rtoCharges,
      insuranceCharges: data.insuranceCharges,
      accessoriesCharges: data.accessoriesCharges,
      discount: data.discount,
      downPayment: data.downPayment,
      loanAmount: data.loanAmount,
      estimatedEmi: data.estimatedEmi,
      tenureMonths: data.tenureMonths,
      notes: data.notes,
    });

    await createAuditLog({
      actorId: session.userId,
      actorName: session.name,
      actorRole: session.role,
      branchId: session.branchId,
      action: 'QUOTATION_CREATE',
      entity: 'Quotation',
      entityId: quotation.id,
      changeDetails: {
        quotationNumber: quotation.quotationNumber,
        customer: customer.name,
        model: quotation.modelName,
        onRoadPrice: quotation.onRoadPrice,
      },
    });

    return NextResponse.json({ success: true, quotation }, { status: 201 });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error.message || 'Failed to create quotation' }, { status: 400 });
  }
}
