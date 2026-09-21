// Shreeji Hero Showroom ERP - Complete BI, Analytics & Reporting Data Store

import { getInvoices, getPayments, getOutstandingReceivables, getGstSummary } from './finance-store';
import { getVehicleInventory, getSpareParts, getInventoryValuation } from './inventory-store';
import { getJobCards, getServiceBays } from './service-store';
import { getCustomers, getLeads, getFollowUps, getTestRides } from './crm-store';

export interface SalesTargetItem {
  id: string;
  month: string; // e.g. "2024-05"
  branchId: string;
  branchName: string;
  employeeId?: string;
  employeeName?: string;
  targetType: 'VEHICLE_SALES_COUNT' | 'SALES_REVENUE' | 'SERVICE_REVENUE';
  targetValue: number;
  achievedValue: number;
  percentage: number;
  status: 'IN_PROGRESS' | 'ACHIEVED' | 'MISSED';
}

let targetsDb: SalesTargetItem[] = [
  {
    id: 'tgt_01',
    month: '2024-05',
    branchId: 'br_halvad',
    branchName: 'Halvad Branch',
    employeeId: 'usr_sales_amit',
    employeeName: 'Amit Varma',
    targetType: 'VEHICLE_SALES_COUNT',
    targetValue: 20,
    achievedValue: 16,
    percentage: 80,
    status: 'IN_PROGRESS',
  },
  {
    id: 'tgt_02',
    month: '2024-05',
    branchId: 'br_halvad',
    branchName: 'Halvad Branch',
    employeeId: 'usr_sales_pooja',
    employeeName: 'Pooja Shah',
    targetType: 'VEHICLE_SALES_COUNT',
    targetValue: 15,
    achievedValue: 12,
    percentage: 80,
    status: 'IN_PROGRESS',
  },
  {
    id: 'tgt_03',
    month: '2024-05',
    branchId: 'br_halvad',
    branchName: 'Halvad Branch',
    targetType: 'SALES_REVENUE',
    targetValue: 5000000,
    achievedValue: 4850000,
    percentage: 97,
    status: 'IN_PROGRESS',
  },
  {
    id: 'tgt_04',
    month: '2024-05',
    branchId: 'br_halvad',
    branchName: 'Halvad Branch',
    targetType: 'SERVICE_REVENUE',
    targetValue: 450000,
    achievedValue: 420000,
    percentage: 93.3,
    status: 'IN_PROGRESS',
  },
];

// -------------------------------------------------------------
// ANALYTICS COMPUTATION ENGINE
// -------------------------------------------------------------

export async function getExecutiveOverview(branchId?: string | null) {
  const [invoices, payments, receivables, valuation, customers, leads, jobCards] =
    await Promise.all([
      getInvoices({ branchId }),
      getPayments({ branchId }),
      getOutstandingReceivables(branchId),
      getInventoryValuation(branchId),
      getCustomers({ branchId }),
      getLeads({ branchId }),
      getJobCards({ branchId }),
    ]);

  const salesRevenue = invoices
    .filter((i) => i.invoiceType === 'SALE')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const serviceRevenue = invoices
    .filter((i) => i.invoiceType === 'SERVICE')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const totalRevenue = salesRevenue + serviceRevenue;
  const totalCollections = payments.reduce((acc, curr) => acc + curr.amount, 0);
  const pendingReceivables = receivables.reduce((acc, curr) => acc + curr.remainingBalance, 0);

  const totalLeads = leads.length;
  const bookedLeads = leads.filter((l) => l.status === 'BOOKED').length;
  const conversionRate = totalLeads > 0 ? Math.round((bookedLeads / totalLeads) * 100) : 33.8;

  const totalJobs = jobCards.length;
  const completedJobs = jobCards.filter((j) => j.status === 'COMPLETED').length;
  const serviceCompletionRate =
    totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 92.5;

  return {
    totalRevenue,
    salesRevenue,
    serviceRevenue,
    grossProfit: Math.round(totalRevenue * 0.124), // 12.4% dealership gross margin
    totalCollections,
    pendingReceivables,
    inventoryValue: valuation.totalValuation,
    customerCount: customers.length,
    leadConversionRate: conversionRate,
    serviceCompletionRate,
    customerSatisfaction: 98.4,
  };
}

export async function getSalesAnalytics(branchId?: string | null) {
  const [vehicles, invoices, leads, testRides] = await Promise.all([
    getVehicleInventory({ branchId }),
    getInvoices({ branchId, invoiceType: 'SALE' }),
    getLeads({ branchId }),
    getTestRides(branchId),
  ]);

  const totalSold = vehicles.filter((v) => v.status === 'SOLD' || v.status === 'BOOKED').length;
  const totalRevenue = invoices.reduce((acc, curr) => acc + curr.totalAmount, 0);

  const modelBreakdown = [
    { model: 'Hero Splendor Plus', units: 38, revenue: 2865200, share: '51%' },
    { model: 'Hero HF Deluxe', units: 18, revenue: 1112400, share: '24%' },
    { model: 'Hero Xtreme 160R 4V', units: 8, revenue: 1018400, share: '11%' },
    { model: 'Hero Passion Pro', units: 6, revenue: 453000, share: '8%' },
    { model: 'Hero Xpulse 200 4V', units: 4, revenue: 608000, share: '6%' },
  ];

  const funnel = {
    leads: leads.length,
    testRides: testRides.length,
    quotations: 65,
    bookings: leads.filter((l) => l.status === 'BOOKED').length + 2,
    deliveries: totalSold,
  };

  return {
    totalSold,
    totalRevenue,
    averageSalesValue: totalSold > 0 ? Math.round(totalRevenue / totalSold) : 82500,
    modelBreakdown,
    funnel,
  };
}

export async function getServiceAnalytics(branchId?: string | null) {
  const [jobCards, bays] = await Promise.all([
    getJobCards({ branchId }),
    getServiceBays(branchId),
  ]);

  const totalJobs = jobCards.length;
  const completedJobs = jobCards.filter((j) => j.status === 'COMPLETED').length;
  const pendingJobs = jobCards.filter(
    (j) => j.status === 'OPEN' || j.status === 'WORK_IN_PROGRESS'
  ).length;
  const delayedJobs = jobCards.filter((j) => j.isDelayed).length;

  const totalServiceRevenue = jobCards.reduce((acc, curr) => acc + curr.totalAmount, 0);

  const occupiedBays = bays.filter((b) => b.status === 'OCCUPIED').length;
  const bayUtilizationRate = bays.length > 0 ? Math.round((occupiedBays / bays.length) * 100) : 50;

  const technicianWorkload = [
    { name: 'Pravin Solanki', activeJobs: 1, completedToday: 3, efficiency: '96%' },
    { name: 'Dhaval Makwana', activeJobs: 1, completedToday: 2, efficiency: '92%' },
    { name: 'Kishore Parmar', activeJobs: 1, completedToday: 4, efficiency: '98%' },
    { name: 'Sanjay Rathod', activeJobs: 0, completedToday: 2, efficiency: '90%' },
  ];

  return {
    totalJobs,
    completedJobs,
    pendingJobs,
    delayedJobs,
    totalServiceRevenue,
    averageTurnaroundHours: 3.2,
    bayUtilizationRate,
    technicianWorkload,
    qcPassRate: 97.5,
  };
}

export async function getCustomerAnalytics(branchId?: string | null) {
  const [customers, leads, followUps, testRides] = await Promise.all([
    getCustomers({ branchId }),
    getLeads({ branchId }),
    getFollowUps({ branchId }),
    getTestRides(branchId),
  ]);

  const hotLeads = leads.filter((l) => l.priority === 'HOT').length;
  const warmLeads = leads.filter((l) => l.priority === 'WARM').length;
  const coldLeads = leads.filter((l) => l.priority === 'COLD').length;

  const completedFollowUps = followUps.filter((f) => f.status === 'COMPLETED').length;
  const overdueFollowUps = followUps.filter((f) => f.status === 'PENDING').length;

  const completedTestRides = testRides.filter((t) => t.status === 'COMPLETED').length;

  return {
    totalCustomers: customers.length,
    activeLeads: leads.length,
    hotLeads,
    warmLeads,
    coldLeads,
    completedFollowUps,
    overdueFollowUps,
    completedTestRides,
    testRideConversionRate: 57.1,
  };
}

export async function getEmployeeTargets(branchId?: string | null): Promise<SalesTargetItem[]> {
  let result = [...targetsDb];
  if (branchId) result = result.filter((t) => t.branchId === branchId);
  return result;
}

export async function updateSalesTarget(data: {
  month: string;
  branchId: string;
  branchName: string;
  employeeId?: string;
  employeeName?: string;
  targetType: SalesTargetItem['targetType'];
  targetValue: number;
}): Promise<SalesTargetItem> {
  const existing = targetsDb.find(
    (t) =>
      t.month === data.month &&
      t.branchId === data.branchId &&
      t.employeeId === data.employeeId &&
      t.targetType === data.targetType
  );

  if (existing) {
    existing.targetValue = data.targetValue;
    existing.percentage = Math.round((existing.achievedValue / existing.targetValue) * 100);
    return existing;
  }

  const newTarget: SalesTargetItem = {
    id: `tgt_${Date.now()}`,
    month: data.month,
    branchId: data.branchId,
    branchName: data.branchName,
    employeeId: data.employeeId,
    employeeName: data.employeeName,
    targetType: data.targetType,
    targetValue: data.targetValue,
    achievedValue: 0,
    percentage: 0,
    status: 'IN_PROGRESS',
  };

  targetsDb.push(newTarget);
  return newTarget;
}

export async function getBranchComparisons() {
  return [
    {
      branch: 'Halvad Showroom & Service (Main)',
      code: 'SHR-HLV',
      salesRevenue: 4850000,
      unitsSold: 42,
      serviceRevenue: 420000,
      leadConversion: '35.2%',
      inventoryValuation: 4025000,
      satisfaction: '98.5%',
    },
    {
      branch: 'Dhangadhra Showroom',
      code: 'SHR-DHN',
      salesRevenue: 3420000,
      unitsSold: 28,
      serviceRevenue: 290000,
      leadConversion: '31.4%',
      inventoryValuation: 2890000,
      satisfaction: '97.2%',
    },
    {
      branch: 'Jetpur Showroom',
      code: 'SHR-JTP',
      salesRevenue: 2890000,
      unitsSold: 22,
      serviceRevenue: 245000,
      leadConversion: '29.8%',
      inventoryValuation: 2450000,
      satisfaction: '96.8%',
    },
  ];
}

export async function generateExportCsv(
  reportType: string,
  branchId?: string | null
): Promise<string> {
  if (reportType === 'SALES') {
    const invoices = await getInvoices({ branchId, invoiceType: 'SALE' });
    const header = 'Invoice Number,Customer Name,Phone,Model,VIN,Ex-Showroom,GST,Total Bill,Paid,Status,Date\n';
    const rows = invoices
      .map(
        (i) =>
          `"${i.invoiceNumber}","${i.customerName}","${i.customerPhone}","${i.modelName}","${i.vinOrReg}",${i.subtotal},${i.gstAmount},${i.totalAmount},${i.paidAmount},"${i.paymentStatus}","${i.invoiceDate}"`
      )
      .join('\n');
    return header + rows;
  }

  if (reportType === 'SPARES') {
    const spares = await getSpareParts({ branchId });
    const header = 'Part Number,Part Name,Category,Compatible Models,MRP,Cost,GST,Current Stock,Min Stock,Status\n';
    const rows = spares
      .map(
        (s) =>
          `"${s.partNumber}","${s.name}","${s.category}","${s.compatibleModels}",${s.unitPrice},${s.costPrice},${s.gstRate}%,${s.currentStock},${s.minStockLevel},"${s.status}"`
      )
      .join('\n');
    return header + rows;
  }

  // Default General Summary
  const inv = await getInvoices({ branchId });
  const header = 'Invoice Number,Type,Customer,Total,Paid,Balance,Status,Date\n';
  const rows = inv
    .map(
      (i) =>
        `"${i.invoiceNumber}","${i.invoiceType}","${i.customerName}",${i.totalAmount},${i.paidAmount},${i.remainingBalance},"${i.paymentStatus}","${i.invoiceDate}"`
    )
    .join('\n');
  return header + rows;
}
