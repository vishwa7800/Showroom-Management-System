// Shreeji Hero Showroom ERP - Customer Service History API

import { NextResponse } from 'next/server';
import { requireCustomerAuth, CustomerAuthError } from '@/lib/auth/customer-server';
import { getJobCards } from '@/lib/db/service-store';

export async function GET() {
  try {
    const session = await requireCustomerAuth();
    const jobCards = await getJobCards();

    const history = jobCards
      .filter((j) => j.customerId === session.customerId && (j.status === 'COMPLETED' || j.status === 'READY_FOR_DELIVERY'))
      .map((j) => ({
        id: j.id,
        jobCardNumber: j.jobCardNumber,
        serviceType: j.serviceType,
        vehicleReg: j.registrationNumber,
        modelName: j.modelName,
        kmReading: j.kmReading || 4520,
        complaints: j.customerComplaints,
        inspectionFindings: j.inspectionFindings,
        totalLabour: j.totalLabour,
        totalParts: j.totalParts,
        totalAmount: j.totalAmount,
        completedAt: j.completedAt || j.updatedAt,
        status: j.status,
      }));

    return NextResponse.json({ success: true, history });
  } catch (error: any) {
    if (error instanceof CustomerAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve service history' }, { status: 500 });
  }
}
