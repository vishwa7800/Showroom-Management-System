// Shreeji Hero Showroom ERP - Complete Finance, Invoicing & Payments Data Store

import { addTimelineEntry } from './crm-store';

export interface FinanceInvoiceRecord {
  id: string;
  invoiceNumber: string;
  invoiceType: 'SALE' | 'SERVICE';
  referenceCode: string; // Booking Code or Job Card Number
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  branchId: string;
  branchName?: string;
  modelName: string;
  vinOrReg: string;
  subtotal: number;
  gstAmount: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  remainingBalance: number;
  paymentStatus: 'PAID' | 'PARTIALLY_PAID' | 'PENDING' | 'CANCELLED';
  dueDate: string;
  daysOverdue: number;
  invoiceDate: string;
  createdAt: string;
}

export interface FinancePaymentRecord {
  id: string;
  paymentCode: string;
  invoiceId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  branchId: string;
  amount: number;
  paymentMethod: 'CASH' | 'UPI' | 'CARD' | 'BANK_TRANSFER' | 'CHEQUE' | 'FINANCIER';
  referenceNumber?: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  notes?: string;
  recordedById: string;
  recordedByName: string;
  createdAt: string;
}

export interface AutoLoanRecord {
  id: string;
  applicationNo: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  saleInvoiceNumber: string;
  vehicleModel: string;
  loanProvider: string; // e.g. "Hero FinCorp", "HDFC Bank", "L&T Finance"
  loanAmount: number;
  downPayment: number;
  tenureMonths: number;
  monthlyEmi: number;
  emiStartDate: string;
  status: 'APPLICATION' | 'APPROVED' | 'DISBURSEMENT_PENDING' | 'DISBURSED' | 'COMPLETED';
  disbursedAmount?: number;
  disbursalRef?: string;
  disbursedAt?: string;
  createdAt: string;
}

export interface RefundRecordItem {
  id: string;
  refundCode: string;
  paymentId?: string;
  invoiceId?: string;
  invoiceNumber?: string;
  customerId: string;
  customerName: string;
  branchId: string;
  amount: number;
  reason: string;
  refundMethod: 'CASH' | 'UPI' | 'BANK_TRANSFER';
  referenceNumber?: string;
  status: 'PENDING' | 'APPROVED' | 'PROCESSED' | 'REJECTED';
  approvedByName?: string;
  processedAt?: string;
  createdAt: string;
}

// -------------------------------------------------------------
// IN-MEMORY SEED REPOSITORY
// -------------------------------------------------------------

let invoicesDb: FinanceInvoiceRecord[] = [
  {
    id: 'fin_inv_01',
    invoiceNumber: 'INV-2024-1001',
    invoiceType: 'SALE',
    referenceCode: 'BK-2024-001',
    customerId: 'c_02',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 43220',
    customerAddress: 'Near Old Bus Stand, Main Bazar, Halvad',
    branchId: 'br_halvad',
    branchName: 'Halvad Branch',
    modelName: 'Hero Splendor Plus XTEC',
    vinOrReg: 'MBLHAW14XN9002011',
    subtotal: 76190,
    gstAmount: 14310,
    discount: 1500,
    totalAmount: 90500,
    paidAmount: 90500,
    remainingBalance: 0,
    paymentStatus: 'PAID',
    dueDate: '2024-05-16',
    daysOverdue: 0,
    invoiceDate: '16 May 2024',
    createdAt: '2024-05-16T09:00:00.000Z',
  },
  {
    id: 'fin_inv_02',
    invoiceNumber: 'INV-2024-1002',
    invoiceType: 'SALE',
    referenceCode: 'BK-2024-002',
    customerId: 'c_03',
    customerName: 'Neha Gupta',
    customerPhone: '+91 98765 43230',
    customerAddress: 'Plot 45, Sardar Nagar, Halvad',
    branchId: 'br_halvad',
    branchName: 'Halvad Branch',
    modelName: 'Hero Xtreme 160R 4V',
    vinOrReg: 'MBLHAW14XN9003001',
    subtotal: 123305,
    gstAmount: 22195,
    discount: 2000,
    totalAmount: 145500,
    paidAmount: 45000, // Down payment done; ₹100,500 pending financier disbursal
    remainingBalance: 100500,
    paymentStatus: 'PARTIALLY_PAID',
    dueDate: '2024-05-20',
    daysOverdue: 0,
    invoiceDate: '15 May 2024',
    createdAt: '2024-05-15T11:00:00.000Z',
  },
  {
    id: 'fin_inv_03',
    invoiceNumber: 'SR-INV-2024-7001',
    invoiceType: 'SERVICE',
    referenceCode: 'JC-8898',
    customerId: 'c_04',
    customerName: 'Dinesh Kumar',
    customerPhone: '+91 98765 43240',
    customerAddress: 'Kalyan Nagar, Halvad',
    branchId: 'br_halvad',
    branchName: 'Halvad Branch',
    modelName: 'Hero Xpulse 200 4V',
    vinOrReg: 'GJ-36-EF-9012',
    subtotal: 237,
    gstAmount: 43,
    discount: 0,
    totalAmount: 280,
    paidAmount: 280,
    remainingBalance: 0,
    paymentStatus: 'PAID',
    dueDate: '2024-05-16',
    daysOverdue: 0,
    invoiceDate: '16 May 2024',
    createdAt: '2024-05-16T11:15:00.000Z',
  },
  {
    id: 'fin_inv_04',
    invoiceNumber: 'SR-INV-2024-6995',
    invoiceType: 'SERVICE',
    referenceCode: 'JC-8820',
    customerId: 'c_01',
    customerName: 'Ramesh Patel',
    customerPhone: '+91 98765 43210',
    customerAddress: 'Block A-102, Gokul Heights, Halvad',
    branchId: 'br_halvad',
    branchName: 'Halvad Branch',
    modelName: 'Hero Splendor Plus',
    vinOrReg: 'GJ-36-AB-1234',
    subtotal: 1864,
    gstAmount: 336,
    discount: 0,
    totalAmount: 2200,
    paidAmount: 1000,
    remainingBalance: 1200,
    paymentStatus: 'PARTIALLY_PAID',
    dueDate: '2024-05-10',
    daysOverdue: 6,
    invoiceDate: '10 May 2024',
    createdAt: '2024-05-10T14:00:00.000Z',
  },
];

let paymentsDb: FinancePaymentRecord[] = [
  {
    id: 'pay_01',
    paymentCode: 'PAY-2024-001',
    invoiceId: 'fin_inv_01',
    invoiceNumber: 'INV-2024-1001',
    customerId: 'c_02',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 43220',
    branchId: 'br_halvad',
    amount: 5000,
    paymentMethod: 'UPI',
    referenceNumber: 'UPI/412389102391',
    status: 'SUCCESS',
    notes: 'Token booking payment',
    recordedById: 'usr_acct_neha',
    recordedByName: 'Neha Joshi (Accountant)',
    createdAt: '2024-05-12T11:30:00.000Z',
  },
  {
    id: 'pay_02',
    paymentCode: 'PAY-2024-002',
    invoiceId: 'fin_inv_01',
    invoiceNumber: 'INV-2024-1001',
    customerId: 'c_02',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 43220',
    branchId: 'br_halvad',
    amount: 85500,
    paymentMethod: 'UPI',
    referenceNumber: 'UPI/412399812401',
    status: 'SUCCESS',
    notes: 'Final settlement payment before delivery',
    recordedById: 'usr_acct_neha',
    recordedByName: 'Neha Joshi (Accountant)',
    createdAt: '2024-05-16T09:00:00.000Z',
  },
  {
    id: 'pay_03',
    paymentCode: 'PAY-2024-003',
    invoiceId: 'fin_inv_02',
    invoiceNumber: 'INV-2024-1002',
    customerId: 'c_03',
    customerName: 'Neha Gupta',
    customerPhone: '+91 98765 43230',
    branchId: 'br_halvad',
    amount: 45000,
    paymentMethod: 'BANK_TRANSFER',
    referenceNumber: 'NEFT/HDFC90123891',
    status: 'SUCCESS',
    notes: 'Customer down payment',
    recordedById: 'usr_acct_neha',
    recordedByName: 'Neha Joshi (Accountant)',
    createdAt: '2024-05-15T11:00:00.000Z',
  },
  {
    id: 'pay_04',
    paymentCode: 'PAY-2024-004',
    invoiceId: 'fin_inv_03',
    invoiceNumber: 'SR-INV-2024-7001',
    customerId: 'c_04',
    customerName: 'Dinesh Kumar',
    customerPhone: '+91 98765 43240',
    branchId: 'br_halvad',
    amount: 280,
    paymentMethod: 'CASH',
    referenceNumber: 'CASH-REC-8901',
    status: 'SUCCESS',
    notes: 'Workshop service bill counter settlement',
    recordedById: 'usr_acct_neha',
    recordedByName: 'Neha Joshi (Accountant)',
    createdAt: '2024-05-16T11:15:00.000Z',
  },
];

let loansDb: AutoLoanRecord[] = [
  {
    id: 'ln_01',
    applicationNo: 'HFC-2024-8901',
    customerId: 'c_03',
    customerName: 'Neha Gupta',
    customerPhone: '+91 98765 43230',
    saleInvoiceNumber: 'INV-2024-1002',
    vehicleModel: 'Hero Xtreme 160R 4V',
    loanProvider: 'Hero FinCorp',
    loanAmount: 100500,
    downPayment: 45000,
    tenureMonths: 24,
    monthlyEmi: 4680,
    emiStartDate: '2024-06-05',
    status: 'DISBURSEMENT_PENDING',
    createdAt: '2024-05-15T12:00:00.000Z',
  },
  {
    id: 'ln_02',
    applicationNo: 'HDFC-2024-3420',
    customerId: 'c_01',
    customerName: 'Ramesh Patel',
    customerPhone: '+91 98765 43210',
    saleInvoiceNumber: 'INV-2023-0891',
    vehicleModel: 'Hero Splendor Plus',
    loanProvider: 'HDFC Bank',
    loanAmount: 55000,
    downPayment: 25000,
    tenureMonths: 24,
    monthlyEmi: 2610,
    emiStartDate: '2023-05-10',
    status: 'COMPLETED',
    disbursedAmount: 55000,
    disbursalRef: 'DISB/HDFC/20230415',
    disbursedAt: '2023-04-15T14:00:00.000Z',
    createdAt: '2023-04-12T10:00:00.000Z',
  },
];

let refundsDb: RefundRecordItem[] = [
  {
    id: 'ref_01',
    refundCode: 'REF-2024-001',
    invoiceNumber: 'INV-2024-0980',
    customerId: 'c_01',
    customerName: 'Ramesh Patel',
    branchId: 'br_halvad',
    amount: 1000,
    reason: 'Cancelled duplicate accessory booking fee',
    refundMethod: 'UPI',
    referenceNumber: 'UPI/REF/9812401',
    status: 'PROCESSED',
    approvedByName: 'Rajesh Patel (Admin)',
    processedAt: '2024-05-10T16:00:00.000Z',
    createdAt: '2024-05-09T11:00:00.000Z',
  },
];

// -------------------------------------------------------------
// STORE METHODS
// -------------------------------------------------------------

export async function getInvoices(filter?: {
  branchId?: string | null;
  paymentStatus?: string;
  invoiceType?: string;
}): Promise<FinanceInvoiceRecord[]> {
  let result = [...invoicesDb];
  if (filter?.branchId) result = result.filter((i) => i.branchId === filter.branchId);
  if (filter?.paymentStatus && filter.paymentStatus !== 'ALL') {
    result = result.filter((i) => i.paymentStatus === filter.paymentStatus);
  }
  if (filter?.invoiceType && filter.invoiceType !== 'ALL') {
    result = result.filter((i) => i.invoiceType === filter.invoiceType);
  }
  return result;
}

export async function findInvoiceById(id: string): Promise<FinanceInvoiceRecord | null> {
  return invoicesDb.find((i) => i.id === id || i.invoiceNumber === id) || null;
}

export async function getPayments(filter?: {
  branchId?: string | null;
  invoiceId?: string;
}): Promise<FinancePaymentRecord[]> {
  let result = [...paymentsDb];
  if (filter?.branchId) result = result.filter((p) => p.branchId === filter.branchId);
  if (filter?.invoiceId) result = result.filter((p) => p.invoiceId === filter.invoiceId);
  return result;
}

export async function recordPayment(data: {
  invoiceId: string;
  amount: number;
  paymentMethod: FinancePaymentRecord['paymentMethod'];
  referenceNumber?: string;
  notes?: string;
  recordedById: string;
  recordedByName: string;
}): Promise<FinancePaymentRecord> {
  const invoice = invoicesDb.find((i) => i.id === data.invoiceId || i.invoiceNumber === data.invoiceId);
  if (!invoice) throw new Error('Invoice not found');

  if (invoice.paymentStatus === 'PAID') {
    throw new Error(`Invoice #${invoice.invoiceNumber} is already fully PAID.`);
  }

  if (data.amount <= 0) {
    throw new Error('Payment amount must be greater than ₹0.');
  }

  if (data.amount > invoice.remainingBalance) {
    throw new Error(
      `Payment of ₹${data.amount.toLocaleString('en-IN')} exceeds outstanding balance of ₹${invoice.remainingBalance.toLocaleString('en-IN')}.`
    );
  }

  const paymentCode = `PAY-${new Date().getFullYear()}-${100 + paymentsDb.length + 1}`;
  const now = new Date().toISOString();

  const newPayment: FinancePaymentRecord = {
    id: `pay_${Date.now()}`,
    paymentCode,
    invoiceId: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    customerId: invoice.customerId,
    customerName: invoice.customerName,
    customerPhone: invoice.customerPhone,
    branchId: invoice.branchId,
    amount: data.amount,
    paymentMethod: data.paymentMethod,
    referenceNumber: data.referenceNumber,
    status: 'SUCCESS',
    notes: data.notes,
    recordedById: data.recordedById,
    recordedByName: data.recordedByName,
    createdAt: now,
  };

  paymentsDb.unshift(newPayment);

  // Update invoice balance & status
  invoice.paidAmount += data.amount;
  invoice.remainingBalance -= data.amount;
  if (invoice.remainingBalance === 0) {
    invoice.paymentStatus = 'PAID';
  } else {
    invoice.paymentStatus = 'PARTIALLY_PAID';
  }

  // Update Customer 360 Timeline
  await addTimelineEntry({
    customerId: invoice.customerId,
    type: 'PAYMENT',
    title: `Payment Received: ₹${data.amount.toLocaleString('en-IN')}`,
    description: `Payment #${paymentCode} credited towards Invoice #${invoice.invoiceNumber} via ${data.paymentMethod}. Remaining: ₹${invoice.remainingBalance.toLocaleString('en-IN')}.`,
    actorName: data.recordedByName,
  });

  return newPayment;
}

export async function getOutstandingReceivables(branchId?: string | null): Promise<FinanceInvoiceRecord[]> {
  let result = invoicesDb.filter((i) => i.remainingBalance > 0 && i.paymentStatus !== 'CANCELLED');
  if (branchId) {
    result = result.filter((i) => i.branchId === branchId);
  }
  return result;
}

export async function getAutoLoans(branchId?: string | null): Promise<AutoLoanRecord[]> {
  return loansDb;
}

export async function recordLoanDisbursal(
  loanId: string,
  disbursedAmount: number,
  disbursalRef: string,
  accountantName: string
): Promise<AutoLoanRecord> {
  const loan = loansDb.find((l) => l.id === loanId);
  if (!loan) throw new Error('Auto loan record not found');

  const now = new Date().toISOString();
  loan.status = 'DISBURSED';
  loan.disbursedAmount = disbursedAmount;
  loan.disbursalRef = disbursalRef;
  loan.disbursedAt = now;

  // Credit the corresponding invoice
  const invoice = invoicesDb.find((i) => i.invoiceNumber === loan.saleInvoiceNumber);
  if (invoice) {
    await recordPayment({
      invoiceId: invoice.id,
      amount: disbursedAmount,
      paymentMethod: 'FINANCIER',
      referenceNumber: disbursalRef,
      notes: `Financier Disbursal from ${loan.loanProvider} (App #${loan.applicationNo})`,
      recordedById: 'acct',
      recordedByName: accountantName,
    });
  }

  return loan;
}

export async function getGstSummary(branchId?: string | null): Promise<{
  taxableSales: number;
  taxableService: number;
  totalCgst: number;
  totalSgst: number;
  totalGst: number;
}> {
  let list = invoicesDb.filter((i) => i.paymentStatus !== 'CANCELLED');
  if (branchId) list = list.filter((i) => i.branchId === branchId);

  const taxableSales = list
    .filter((i) => i.invoiceType === 'SALE')
    .reduce((acc, curr) => acc + curr.subtotal, 0);

  const taxableService = list
    .filter((i) => i.invoiceType === 'SERVICE')
    .reduce((acc, curr) => acc + curr.subtotal, 0);

  const totalGst = list.reduce((acc, curr) => acc + curr.gstAmount, 0);
  const totalCgst = Math.round(totalGst / 2);
  const totalSgst = Math.round(totalGst / 2);

  return {
    taxableSales,
    taxableService,
    totalCgst,
    totalSgst,
    totalGst,
  };
}

export async function getRefunds(branchId?: string | null): Promise<RefundRecordItem[]> {
  let result = [...refundsDb];
  if (branchId) result = result.filter((r) => r.branchId === branchId);
  return result;
}

export async function requestRefund(data: {
  invoiceNumber?: string;
  customerId: string;
  customerName: string;
  branchId: string;
  amount: number;
  reason: string;
  refundMethod: RefundRecordItem['refundMethod'];
  actorName: string;
}): Promise<RefundRecordItem> {
  const refundCode = `REF-${new Date().getFullYear()}-${100 + refundsDb.length + 1}`;
  const newRefund: RefundRecordItem = {
    id: `ref_${Date.now()}`,
    refundCode,
    invoiceNumber: data.invoiceNumber,
    customerId: data.customerId,
    customerName: data.customerName,
    branchId: data.branchId,
    amount: data.amount,
    reason: data.reason,
    refundMethod: data.refundMethod,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  };

  refundsDb.unshift(newRefund);

  await addTimelineEntry({
    customerId: data.customerId,
    type: 'REFUND',
    title: `Refund Requested: ₹${data.amount.toLocaleString('en-IN')}`,
    description: `Refund #${refundCode} requested for ₹${data.amount}: ${data.reason}. Awaiting Admin authorization.`,
    actorName: data.actorName,
  });

  return newRefund;
}

export async function approveRefund(
  refundId: string,
  approved: boolean,
  referenceNumber: string,
  adminName: string
): Promise<RefundRecordItem> {
  const ref = refundsDb.find((r) => r.id === refundId);
  if (!ref) throw new Error('Refund record not found');

  const now = new Date().toISOString();
  ref.status = approved ? 'PROCESSED' : 'REJECTED';
  ref.approvedByName = adminName;
  ref.referenceNumber = referenceNumber;
  ref.processedAt = now;

  await addTimelineEntry({
    customerId: ref.customerId,
    type: 'REFUND',
    title: approved ? `Refund Processed: ₹${ref.amount.toLocaleString('en-IN')}` : 'Refund Rejected',
    description: approved
      ? `Refund #${ref.refundCode} approved by ${adminName} via ${ref.refundMethod} (Ref: ${referenceNumber}).`
      : `Refund #${ref.refundCode} rejected by ${adminName}.`,
    actorName: adminName,
  });

  return ref;
}
