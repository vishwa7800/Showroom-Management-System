// Shreeji Hero Showroom ERP - Customer Owned Vehicles API

import { NextResponse } from 'next/server';
import { requireCustomerAuth, CustomerAuthError } from '@/lib/auth/customer-server';
import { getCustomerById } from '@/lib/db/crm-store';

const customerVehiclesRegistry: Record<string, any[]> = {
  c_01: [
    {
      id: 'cv_01',
      modelName: 'Hero Splendor Plus',
      variantName: 'Drum Self Cast',
      color: 'Black with Sports Red',
      registrationNumber: 'GJ-36-AB-1234',
      vinNumber: 'MBLHAW14XN9001234',
      engineNumber: 'HA10EHN9001234',
      purchaseDate: '2024-01-15',
      warrantyUntil: '2029-01-14',
      status: 'ACTIVE',
      lastServiceDate: '2024-04-12',
      nextServiceDue: '2024-07-12',
    },
  ],
  c_02: [
    {
      id: 'cv_02',
      modelName: 'Hero HF Deluxe',
      variantName: 'Self Start Alloy',
      color: 'Techno Blue',
      registrationNumber: 'GJ-36-CD-5678',
      vinNumber: 'MBLHAW14XN9005678',
      engineNumber: 'HA10EHN9005678',
      purchaseDate: '2024-02-10',
      warrantyUntil: '2029-02-09',
      status: 'ACTIVE',
      lastServiceDate: '2024-05-02',
      nextServiceDue: '2024-08-02',
    },
  ],
};

export async function GET() {
  try {
    const session = await requireCustomerAuth();
    const customer = await getCustomerById(session.customerId);

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const defaultVehicles = [
      {
        id: `cv_${session.customerId}`,
        modelName: 'Hero Splendor Plus',
        variantName: 'Disc Self Cast',
        color: 'Black with Sports Red',
        registrationNumber: 'GJ-36-AB-1234',
        vinNumber: 'MBLHAW14XN9001001',
        engineNumber: 'HA10EHN9001001',
        purchaseDate: '2024-01-15',
        warrantyUntil: '2029-01-14',
        status: 'ACTIVE',
        lastServiceDate: '2024-04-12',
        nextServiceDue: '2024-07-12',
      },
    ];

    const vehicles = customerVehiclesRegistry[session.customerId] || defaultVehicles;

    return NextResponse.json({ success: true, vehicles });
  } catch (error: any) {
    if (error instanceof CustomerAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Failed to retrieve vehicles' }, { status: 500 });
  }
}
