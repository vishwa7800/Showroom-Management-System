// Shreeji Hero Showroom ERP - Customer Auto Loan & EMI API

import { NextResponse } from 'next/server';
import { requireCustomerAuth, CustomerAuthError } from '@/lib/auth/customer-server';
import { getAutoLoans } from '@/lib/db/finance-store';

export async function GET() {
  try {
    const session = await requireCustomerAuth();
    const loans = await getAutoLoans();
    const customerLoans = loans.filter((l) => l.customerId === session.customerId);

    return NextResponse.json({ success: true, loans: customerLoans });
  } catch (error: any) {
    if (error instanceof CustomerAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve loan details' }, { status: 500 });
  }
}
