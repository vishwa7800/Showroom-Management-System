// Shreeji Hero Showroom ERP - Dealership Customer Offers API

import { NextResponse } from 'next/server';
import { requireCustomerAuth, CustomerAuthError } from '@/lib/auth/customer-server';

export async function GET() {
  try {
    await requireCustomerAuth();

    const offers = [
      {
        id: 'ofr_01',
        title: 'Monsoon Safety Service Camp 🌧️',
        description: 'Complimentary 21-point vehicle health checkup + 10% off on genuine brake shoes and engine oil replacement.',
        validUntil: '30 June 2024',
        code: 'MONSOON2024',
        badge: 'Seasonal Offer',
      },
      {
        id: 'ofr_02',
        title: 'Hero Joyride Annual Maintenance Package',
        description: 'Save up to 30% on periodic servicing with 4 free labor services and 2 free wash coupons.',
        validUntil: '31 Dec 2024',
        code: 'JOYRIDE24',
        badge: 'AMC Plan',
      },
      {
        id: 'ofr_03',
        title: 'Hero GoodLife Loyalty Points',
        description: 'Earn 100 bonus reward points on every genuine parts purchase above ₹1,000.',
        validUntil: 'Ongoing',
        code: 'GOODLIFE',
        badge: 'Rewards',
      },
    ];

    return NextResponse.json({ success: true, offers });
  } catch (error: any) {
    if (error instanceof CustomerAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve offers' }, { status: 500 });
  }
}
