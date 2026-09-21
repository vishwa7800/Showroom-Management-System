// Shreeji Hero Showroom ERP - Complete Sales, Bookings, Quotations & Deliveries Data Store

import { addTimelineEntry } from './crm-store';

export interface VehicleStockUnit {
  id: string;
  vin: string;
  engineNumber: string;
  modelName: string;
  variantName: string;
  color: string;
  branchId: string;
  branchName?: string;
  status: 'AVAILABLE' | 'RESERVED' | 'BOOKED' | 'SOLD' | 'DELIVERED' | 'DEMO' | 'IN_SERVICE';
  purchasePrice: number;
  exShowroomPrice: number;
  arrivalDate: string;
}

export interface QuotationRecord {
  id: string;
  quotationNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  branchId: string;
  salesExecutiveId: string;
  salesExecutiveName: string;
  modelName: string;
  variantName: string;
  color: string;
  exShowroomPrice: number;
  rtoCharges: number;
  insuranceCharges: number;
  accessoriesCharges: number;
  discount: number;
  onRoadPrice: number;
  downPayment?: number;
  loanAmount?: number;
  estimatedEmi?: number;
  tenureMonths?: number;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'EXPIRED' | 'CANCELLED' | 'CONVERTED';
  validUntil: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingRecord {
  id: string;
  bookingCode: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  branchId: string;
  salesExecutiveId: string;
  salesExecutiveName: string;
  modelName: string;
  variantName: string;
  color: string;
  allocatedUnitId?: string;
  allocatedVin?: string;
  allocatedEngine?: string;
  bookingAmount: number;
  totalOnRoadPrice: number;
  paidAmount: number;
  paymentMode: 'CASH' | 'UPI' | 'CARD' | 'BANK_TRANSFER' | 'FINANCIER';
  paymentStatus: 'PAID' | 'PARTIAL' | 'PENDING';
  status: 'PENDING_APPROVAL' | 'CONFIRMED' | 'VEHICLE_ALLOCATED' | 'PAYMENT_PENDING' | 'READY_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  approvedBy?: string;
  approvedAt?: string;
  deliveryDate?: string;
  pdiStatus: 'PENDING' | 'PASSED' | 'FAILED';
  invoiceNumber?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PdiChecklist {
  cleanlinessPassed: boolean;
  bodyPassed: boolean;
  tyresPassed: boolean;
  batteryPassed: boolean;
  lightsPassed: boolean;
  hornPassed: boolean;
  fuelLevel: string;
  odometerReading: number;
  keysCount: number;
  toolkitPresent: boolean;
  ownerManualPresent: boolean;
  notes?: string;
}

export interface SalesInvoiceRecord {
  id: string;
  invoiceNumber: string;
  bookingCode: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  modelName: string;
  variantName: string;
  vin: string;
  engineNumber: string;
  color: string;
  exShowroomPrice: number;
  rtoCharges: number;
  insuranceCharges: number;
  accessoriesCharges: number;
  discount: number;
  totalAmount: number;
  gstAmount: number;
  paymentMode: string;
  salesExecutiveName: string;
  branchId: string;
  invoiceDate: string;
}

// -------------------------------------------------------------
// IN-MEMORY & GLOBALTHIS REPOSITORIES
// -------------------------------------------------------------

const globalForSales = globalThis as unknown as {
  __shreejiVehicleUnitsDb?: VehicleStockUnit[];
  __shreejiQuotationsDb?: QuotationRecord[];
  __shreejiBookingsDb?: BookingRecord[];
  __shreejiSalesInvoicesDb?: SalesInvoiceRecord[];
};

let defaultVehicleUnits: VehicleStockUnit[] = globalForSales.__shreejiVehicleUnitsDb || [
  {
    id: 'vu_01',
    vin: 'MBLHAW14XN9002011',
    engineNumber: 'HA10EHN9002011',
    modelName: 'Hero Splendor Plus XTEC',
    variantName: 'Disc Self Cast',
    color: 'Black Nexus Blue',
    branchId: 'br_halvad',
    branchName: 'Halvad Branch',
    status: 'AVAILABLE',
    purchasePrice: 62000,
    exShowroomPrice: 79500,
    arrivalDate: '2024-05-01T08:00:00.000Z',
  },
  {
    id: 'vu_02',
    vin: 'MBLHAW14XN9002012',
    engineNumber: 'HA10EHN9002012',
    modelName: 'Hero Splendor Plus XTEC',
    variantName: 'Drum Self Cast',
    color: 'Sports Red',
    branchId: 'br_halvad',
    branchName: 'Halvad Branch',
    status: 'AVAILABLE',
    purchasePrice: 60000,
    exShowroomPrice: 77200,
    arrivalDate: '2024-05-01T08:00:00.000Z',
  },
  {
    id: 'vu_03',
    vin: 'MBLHAW14XN9003001',
    engineNumber: 'HA10EHN9003001',
    modelName: 'Hero Xtreme 160R 4V',
    variantName: 'Double Disc ABS',
    color: 'Matte Shadow Blue',
    branchId: 'br_halvad',
    branchName: 'Halvad Branch',
    status: 'AVAILABLE',
    purchasePrice: 104000,
    exShowroomPrice: 128000,
    arrivalDate: '2024-05-05T09:00:00.000Z',
  },
  {
    id: 'vu_04',
    vin: 'MBLHAW14XN9003002',
    engineNumber: 'HA10EHN9003002',
    modelName: 'Hero Xtreme 160R 4V',
    variantName: 'Double Disc ABS',
    color: 'Sports Red',
    branchId: 'br_halvad',
    branchName: 'Halvad Branch',
    status: 'AVAILABLE',
    purchasePrice: 104000,
    exShowroomPrice: 128000,
    arrivalDate: '2024-05-05T09:00:00.000Z',
  },
  {
    id: 'vu_05',
    vin: 'MBLHAW14XN9004001',
    engineNumber: 'HA10EHN9004001',
    modelName: 'Hero Xpulse 200 4V',
    variantName: 'Pro Edition',
    color: 'Trail Blue',
    branchId: 'br_halvad',
    branchName: 'Halvad Branch',
    status: 'AVAILABLE',
    purchasePrice: 122000,
    exShowroomPrice: 152000,
    arrivalDate: '2024-05-08T10:00:00.000Z',
  },
  {
    id: 'vu_06',
    vin: 'MBLHAW14XN9005001',
    engineNumber: 'HA10EHN9005001',
    modelName: 'Hero HF Deluxe',
    variantName: 'Self Cast',
    color: 'Black with Red Stripe',
    branchId: 'br_halvad',
    branchName: 'Halvad Branch',
    status: 'AVAILABLE',
    purchasePrice: 51000,
    exShowroomPrice: 65400,
    arrivalDate: '2024-05-10T11:00:00.000Z',
  },
];

let defaultQuotations: QuotationRecord[] = [
  {
    id: 'qt_01',
    quotationNumber: 'QT-2024-001',
    customerId: 'c_02',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 43220',
    branchId: 'br_halvad',
    salesExecutiveId: 'usr_sales_amit',
    salesExecutiveName: 'Amit Verma',
    modelName: 'Hero Splendor Plus XTEC',
    variantName: 'Disc Self Cast',
    color: 'Black Nexus Blue',
    exShowroomPrice: 79500,
    rtoCharges: 5800,
    insuranceCharges: 4200,
    accessoriesCharges: 2500,
    discount: 1500,
    onRoadPrice: 90500,
    downPayment: 25000,
    loanAmount: 65500,
    estimatedEmi: 3120,
    tenureMonths: 24,
    status: 'ACCEPTED',
    validUntil: '2024-05-30T00:00:00.000Z',
    notes: 'Includes ₹1,500 showroom festive discount.',
    createdAt: '2024-05-10T10:00:00.000Z',
    updatedAt: '2024-05-12T11:00:00.000Z',
  },
  {
    id: 'qt_02',
    quotationNumber: 'QT-2024-002',
    customerId: 'c_03',
    customerName: 'Neha Gupta',
    customerPhone: '+91 98765 43230',
    branchId: 'br_halvad',
    salesExecutiveId: 'usr_sales_amit',
    salesExecutiveName: 'Amit Verma',
    modelName: 'Hero Xtreme 160R 4V',
    variantName: 'Double Disc ABS',
    color: 'Sports Red',
    exShowroomPrice: 128000,
    rtoCharges: 9800,
    insuranceCharges: 6200,
    accessoriesCharges: 3500,
    discount: 2000,
    onRoadPrice: 145500,
    downPayment: 45000,
    loanAmount: 100500,
    estimatedEmi: 4680,
    tenureMonths: 24,
    status: 'SENT',
    validUntil: '2024-05-31T00:00:00.000Z',
    notes: 'Hero FinCorp 24M EMI quote.',
    createdAt: '2024-05-14T14:30:00.000Z',
    updatedAt: '2024-05-14T14:30:00.000Z',
  },
];

let defaultBookings: BookingRecord[] = [
  {
    id: 'bk_01',
    bookingCode: 'BK-2024-001',
    customerId: 'c_02',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 43220',
    branchId: 'br_halvad',
    salesExecutiveId: 'usr_sales_amit',
    salesExecutiveName: 'Amit Verma',
    modelName: 'Hero Splendor Plus XTEC',
    variantName: 'Disc Self Cast',
    color: 'Black Nexus Blue',
    allocatedUnitId: 'vu_01',
    allocatedVin: 'MBLHAW14XN9002011',
    allocatedEngine: 'HA10EHN9002011',
    bookingAmount: 5000,
    totalOnRoadPrice: 90500,
    paidAmount: 90500, // Full payment done
    paymentMode: 'UPI',
    paymentStatus: 'PAID',
    status: 'READY_FOR_DELIVERY',
    approvedBy: 'Vikram Singh (Manager)',
    approvedAt: '2024-05-13T10:00:00.000Z',
    deliveryDate: 'Today, 16:00 PM',
    pdiStatus: 'PASSED',
    invoiceNumber: 'INV-2024-1001',
    remarks: 'Customer taking delivery with family.',
    createdAt: '2024-05-12T11:30:00.000Z',
    updatedAt: '2024-05-16T09:00:00.000Z',
  },
  {
    id: 'bk_02',
    bookingCode: 'BK-2024-002',
    customerId: 'c_03',
    customerName: 'Neha Gupta',
    customerPhone: '+91 98765 43230',
    branchId: 'br_halvad',
    salesExecutiveId: 'usr_sales_amit',
    salesExecutiveName: 'Amit Verma',
    modelName: 'Hero Xtreme 160R 4V',
    variantName: 'Double Disc ABS',
    color: 'Sports Red',
    bookingAmount: 5000,
    totalOnRoadPrice: 145500,
    paidAmount: 5000,
    paymentMode: 'UPI',
    paymentStatus: 'PARTIAL',
    status: 'PENDING_APPROVAL',
    pdiStatus: 'PENDING',
    remarks: 'Token payment received. Awaiting manager approval.',
    createdAt: '2024-05-15T15:00:00.000Z',
    updatedAt: '2024-05-15T15:00:00.000Z',
  },
];

let defaultSalesInvoices: SalesInvoiceRecord[] = [
  {
    id: 'inv_01',
    invoiceNumber: 'INV-2024-1001',
    bookingCode: 'BK-2024-001',
    customerId: 'c_02',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 43220',
    customerAddress: 'Near Old Bus Stand, Main Bazar, Halvad',
    modelName: 'Hero Splendor Plus XTEC',
    variantName: 'Disc Self Cast',
    vin: 'MBLHAW14XN9002011',
    engineNumber: 'HA10EHN9002011',
    color: 'Black Nexus Blue',
    exShowroomPrice: 79500,
    rtoCharges: 5800,
    insuranceCharges: 4200,
    accessoriesCharges: 2500,
    discount: 1500,
    totalAmount: 90500,
    gstAmount: 14310, // 18% on applicable base
    paymentMode: 'UPI',
    salesExecutiveName: 'Amit Verma',
    branchId: 'br_halvad',
    invoiceDate: '16 May 2024',
  },
];

if (!globalForSales.__shreejiVehicleUnitsDb) globalForSales.__shreejiVehicleUnitsDb = defaultVehicleUnits;
if (!globalForSales.__shreejiQuotationsDb) globalForSales.__shreejiQuotationsDb = defaultQuotations;
if (!globalForSales.__shreejiBookingsDb) globalForSales.__shreejiBookingsDb = defaultBookings;
if (!globalForSales.__shreejiSalesInvoicesDb) globalForSales.__shreejiSalesInvoicesDb = defaultSalesInvoices;

const vehicleUnitsDb = globalForSales.__shreejiVehicleUnitsDb;
const quotationsDb = globalForSales.__shreejiQuotationsDb;
const bookingsDb = globalForSales.__shreejiBookingsDb;
const salesInvoicesDb = globalForSales.__shreejiSalesInvoicesDb;

// -------------------------------------------------------------
// STORE METHODS
// -------------------------------------------------------------

export async function getAvailableVehicles(branchId?: string | null): Promise<VehicleStockUnit[]> {
  let result = vehicleUnitsDb.filter((u) => u.status === 'AVAILABLE');
  if (branchId) {
    result = result.filter((u) => u.branchId === branchId);
  }
  return result;
}

export async function getQuotations(filter?: {
  branchId?: string | null;
  customerId?: string;
  status?: string;
}): Promise<QuotationRecord[]> {
  let result = [...quotationsDb];
  if (filter?.branchId) result = result.filter((q) => q.branchId === filter.branchId);
  if (filter?.customerId) result = result.filter((q) => q.customerId === filter.customerId);
  if (filter?.status) result = result.filter((q) => q.status === filter.status);
  return result;
}

export async function createQuotation(data: {
  customerId: string;
  customerName: string;
  customerPhone: string;
  branchId: string;
  salesExecutiveId: string;
  salesExecutiveName: string;
  modelName: string;
  variantName: string;
  color: string;
  exShowroomPrice: number;
  rtoCharges?: number;
  insuranceCharges?: number;
  accessoriesCharges?: number;
  discount?: number;
  downPayment?: number;
  loanAmount?: number;
  estimatedEmi?: number;
  tenureMonths?: number;
  notes?: string;
}): Promise<QuotationRecord> {
  const rto = data.rtoCharges || Math.round(data.exShowroomPrice * 0.075);
  const ins = data.insuranceCharges || Math.round(data.exShowroomPrice * 0.05);
  const acc = data.accessoriesCharges || 2500;
  const disc = data.discount || 0;
  const onRoadPrice = data.exShowroomPrice + rto + ins + acc - disc;

  const quotationNumber = `QT-${new Date().getFullYear()}-${100 + quotationsDb.length + 1}`;
  const now = new Date().toISOString();

  const newQuote: QuotationRecord = {
    id: `qt_${Date.now()}`,
    quotationNumber,
    customerId: data.customerId,
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    branchId: data.branchId,
    salesExecutiveId: data.salesExecutiveId,
    salesExecutiveName: data.salesExecutiveName,
    modelName: data.modelName,
    variantName: data.variantName,
    color: data.color,
    exShowroomPrice: data.exShowroomPrice,
    rtoCharges: rto,
    insuranceCharges: ins,
    accessoriesCharges: acc,
    discount: disc,
    onRoadPrice,
    downPayment: data.downPayment,
    loanAmount: data.loanAmount,
    estimatedEmi: data.estimatedEmi,
    tenureMonths: data.tenureMonths || 24,
    status: 'SENT',
    validUntil: new Date(Date.now() + 86400000 * 15).toISOString(),
    notes: data.notes,
    createdAt: now,
    updatedAt: now,
  };

  quotationsDb.unshift(newQuote);

  await addTimelineEntry({
    customerId: data.customerId,
    type: 'QUOTATION',
    title: `Quotation Generated: ${data.modelName}`,
    description: `Quotation #${quotationNumber} created with On-Road price ₹${onRoadPrice.toLocaleString('en-IN')}.`,
    actorName: data.salesExecutiveName,
  });

  return newQuote;
}

export async function convertQuotationToBooking(
  quotationId: string,
  bookingAmount: number = 5000,
  paymentMode: BookingRecord['paymentMode'] = 'UPI',
  actorName: string = 'Sales Executive'
): Promise<BookingRecord> {
  const quote = quotationsDb.find((q) => q.id === quotationId);
  if (!quote) throw new Error('Quotation not found');

  quote.status = 'CONVERTED';
  quote.updatedAt = new Date().toISOString();

  const bookingCode = `BK-${new Date().getFullYear()}-${100 + bookingsDb.length + 1}`;
  const now = new Date().toISOString();

  const newBooking: BookingRecord = {
    id: `bk_${Date.now()}`,
    bookingCode,
    customerId: quote.customerId,
    customerName: quote.customerName,
    customerPhone: quote.customerPhone,
    branchId: quote.branchId,
    salesExecutiveId: quote.salesExecutiveId,
    salesExecutiveName: quote.salesExecutiveName,
    modelName: quote.modelName,
    variantName: quote.variantName,
    color: quote.color,
    bookingAmount,
    totalOnRoadPrice: quote.onRoadPrice,
    paidAmount: bookingAmount,
    paymentMode,
    paymentStatus: bookingAmount >= quote.onRoadPrice ? 'PAID' : 'PARTIAL',
    status: 'PENDING_APPROVAL',
    pdiStatus: 'PENDING',
    createdAt: now,
    updatedAt: now,
  };

  bookingsDb.unshift(newBooking);

  await addTimelineEntry({
    customerId: quote.customerId,
    type: 'BOOKING',
    title: `Vehicle Booking Created: ${quote.modelName}`,
    description: `Booking #${bookingCode} initialized with token payment of ₹${bookingAmount.toLocaleString('en-IN')}. Awaiting Showroom Manager approval.`,
    actorName,
  });

  return newBooking;
}

export async function getBookings(filter?: {
  branchId?: string | null;
  status?: string;
}): Promise<BookingRecord[]> {
  let result = [...bookingsDb];
  if (filter?.branchId) result = result.filter((b) => b.branchId === filter.branchId);
  if (filter?.status) result = result.filter((b) => b.status === filter.status);
  return result;
}

export async function approveBooking(
  bookingId: string,
  managerName: string,
  approved: boolean = true,
  rejectionReason?: string
): Promise<BookingRecord> {
  const booking = bookingsDb.find((b) => b.id === bookingId);
  if (!booking) throw new Error('Booking not found');

  const now = new Date().toISOString();
  if (approved) {
    booking.status = 'CONFIRMED';
    booking.approvedBy = managerName;
    booking.approvedAt = now;
    booking.updatedAt = now;

    await addTimelineEntry({
      customerId: booking.customerId,
      type: 'BOOKING',
      title: 'Booking Approved by Showroom Manager',
      description: `Booking #${booking.bookingCode} confirmed by ${managerName}. Ready for physical vehicle allocation.`,
      actorName: managerName,
    });
  } else {
    booking.status = 'CANCELLED';
    booking.remarks = rejectionReason || 'Rejected during manager review.';
    booking.updatedAt = now;

    await addTimelineEntry({
      customerId: booking.customerId,
      type: 'BOOKING',
      title: 'Booking Rejected / Cancelled',
      description: `Booking #${booking.bookingCode} rejected: ${booking.remarks}`,
      actorName: managerName,
    });
  }

  return booking;
}

export async function allocateVehicleUnit(
  bookingId: string,
  vehicleUnitId: string,
  actorName: string = 'Staff'
): Promise<BookingRecord> {
  const booking = bookingsDb.find((b) => b.id === bookingId);
  if (!booking) throw new Error('Booking not found');

  if (booking.status !== 'CONFIRMED' && booking.status !== 'PENDING_APPROVAL') {
    throw new Error(`Cannot allocate vehicle. Booking is in '${booking.status}' status.`);
  }

  const unit = vehicleUnitsDb.find((u) => u.id === vehicleUnitId);
  if (!unit) throw new Error('Vehicle unit not found in inventory.');

  if (unit.status !== 'AVAILABLE') {
    throw new Error(`Vehicle unit (VIN: ${unit.vin}) is not available (Current status: ${unit.status}).`);
  }

  // Lock unit to BOOKED / RESERVED
  unit.status = 'BOOKED';

  booking.allocatedUnitId = unit.id;
  booking.allocatedVin = unit.vin;
  booking.allocatedEngine = unit.engineNumber;
  booking.status = 'VEHICLE_ALLOCATED';
  booking.updatedAt = new Date().toISOString();

  await addTimelineEntry({
    customerId: booking.customerId,
    type: 'BOOKING',
    title: `Physical Vehicle Allocated`,
    description: `Vehicle unit allocated: ${unit.modelName} (VIN: ${unit.vin}, Engine: ${unit.engineNumber}).`,
    actorName,
  });

  return booking;
}

export async function performPdiInspection(
  bookingId: string,
  checklist: PdiChecklist,
  technicianName: string = 'Suresh Technician'
): Promise<BookingRecord> {
  const booking = bookingsDb.find((b) => b.id === bookingId);
  if (!booking) throw new Error('Booking not found');

  if (!booking.allocatedUnitId) {
    throw new Error('Cannot perform PDI without an allocated vehicle unit.');
  }

  const allPassed =
    checklist.cleanlinessPassed &&
    checklist.bodyPassed &&
    checklist.tyresPassed &&
    checklist.batteryPassed &&
    checklist.lightsPassed &&
    checklist.hornPassed &&
    checklist.toolkitPresent &&
    checklist.ownerManualPresent;

  booking.pdiStatus = allPassed ? 'PASSED' : 'FAILED';
  if (allPassed && booking.status === 'VEHICLE_ALLOCATED') {
    booking.status = 'READY_FOR_DELIVERY';
  }
  booking.updatedAt = new Date().toISOString();

  await addTimelineEntry({
    customerId: booking.customerId,
    type: 'PDI',
    title: `Pre-Delivery Inspection: ${booking.pdiStatus}`,
    description: allPassed
      ? `12-point PDI passed successfully by ${technicianName}. Vehicle ready for customer delivery.`
      : `PDI inspection issues noted: ${checklist.notes || 'Re-inspection required'}.`,
    actorName: technicianName,
  });

  return booking;
}

export async function completeVehicleDelivery(
  bookingId: string,
  deliveryData: {
    odometerReading: number;
    deliveryExecutiveName: string;
    customerNotes?: string;
  }
): Promise<{ booking: BookingRecord; invoice: SalesInvoiceRecord }> {
  const booking = bookingsDb.find((b) => b.id === bookingId);
  if (!booking) throw new Error('Booking not found');

  // Business Rules Verification
  if (!booking.allocatedUnitId || !booking.allocatedVin) {
    throw new Error('Vehicle unit not allocated to this booking.');
  }
  if (booking.pdiStatus !== 'PASSED') {
    throw new Error('Cannot complete delivery: PDI inspection is not marked as PASSED.');
  }

  const now = new Date().toISOString();
  const unit = vehicleUnitsDb.find((u) => u.id === booking.allocatedUnitId);
  if (unit) {
    unit.status = 'SOLD';
  }

  booking.status = 'DELIVERED';
  booking.updatedAt = now;

  // Generate Final Invoice
  const invoiceNumber = `INV-${new Date().getFullYear()}-${1000 + salesInvoicesDb.length + 1}`;
  booking.invoiceNumber = invoiceNumber;

  const newInvoice: SalesInvoiceRecord = {
    id: `inv_${Date.now()}`,
    invoiceNumber,
    bookingCode: booking.bookingCode,
    customerId: booking.customerId,
    customerName: booking.customerName,
    customerPhone: booking.customerPhone,
    customerAddress: 'Registered Customer Address, Halvad',
    modelName: booking.modelName,
    variantName: booking.variantName,
    vin: booking.allocatedVin,
    engineNumber: booking.allocatedEngine || 'N/A',
    color: booking.color,
    exShowroomPrice: Math.round(booking.totalOnRoadPrice * 0.85),
    rtoCharges: 5800,
    insuranceCharges: 4200,
    accessoriesCharges: 2500,
    discount: 1500,
    totalAmount: booking.totalOnRoadPrice,
    gstAmount: Math.round(booking.totalOnRoadPrice * 0.18 * 0.85),
    paymentMode: booking.paymentMode,
    salesExecutiveName: deliveryData.deliveryExecutiveName,
    branchId: booking.branchId,
    invoiceDate: new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
  };

  salesInvoicesDb.unshift(newInvoice);

  // Sync with Customer 360 Timeline
  await addTimelineEntry({
    customerId: booking.customerId,
    type: 'DELIVERY',
    title: `Vehicle Delivered & Handed Over`,
    description: `Congratulations! ${booking.modelName} (VIN: ${booking.allocatedVin}) delivered with Gate Pass #${invoiceNumber}. Handed over by ${deliveryData.deliveryExecutiveName}.`,
    actorName: deliveryData.deliveryExecutiveName,
  });

  return { booking, invoice: newInvoice };
}

export async function getSalesInvoices(branchId?: string | null): Promise<SalesInvoiceRecord[]> {
  let result = [...salesInvoicesDb];
  if (branchId) {
    result = result.filter((i) => i.branchId === branchId);
  }
  return result;
}
