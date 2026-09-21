// Shreeji Hero Showroom ERP - Structured Role-Specific Dashboard Data Store

export interface BranchSalesComparison {
  branchId: string;
  branchName: string;
  salesCount: number;
  revenue: number;
  targetCount: number;
  targetRevenue: number;
  serviceRevenue: number;
  customerSatisfaction: number;
}

export interface SalesFollowUpItem {
  id: string;
  customerName: string;
  phone: string;
  interestedModel: string;
  status: 'HOT' | 'WARM' | 'COLD';
  dueDate: string;
  dueTime: string;
  isOverdue: boolean;
  notes: string;
  lastContact: string;
}

export interface FrontDeskGuestItem {
  id: string;
  guestName: string;
  phone: string;
  purpose: 'NEW_PURCHASE' | 'SERVICE' | 'TEST_RIDE' | 'GENERAL_INQUIRY';
  interestedModel?: string;
  assignedExecutive?: string;
  status: 'WAITING_IN_LOUNGE' | 'IN_DISCUSSION' | 'TEST_RIDE' | 'COMPLETED';
  entryTime: string;
  waitMinutes: number;
}

export interface DelayedServiceJob {
  id: string;
  jobCardNumber: string;
  customerName: string;
  phone: string;
  vehicleModel: string;
  regNumber: string;
  bayNumber: string;
  technicianName: string;
  promisedDelivery: string;
  delayMinutes: number;
  delayReason: string;
  status: 'IN_PROGRESS' | 'WAITING_PARTS' | 'INSPECTION';
}

export interface AdvisorJobQueueItem {
  id: string;
  jobCardNumber: string;
  customerName: string;
  phone: string;
  vehicleModel: string;
  regNumber: string;
  serviceType: string;
  status: 'CHECKED_IN' | 'INSPECTION' | 'APPROVAL_PENDING' | 'IN_PROGRESS' | 'READY_FOR_DELIVERY';
  extraPartsEstimate?: number;
  customerApprovalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  estDelivery: string;
}

export interface OverdueReceivableItem {
  id: string;
  invoiceNumber: string;
  customerName: string;
  phone: string;
  invoiceType: 'VEHICLE_SALE' | 'SERVICE_BILL' | 'SPARE_PARTS';
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  dueDate: string;
  daysOverdue: number;
  financierName?: string;
}

export interface CriticalStockItem {
  id: string;
  itemType: 'BIKE' | 'SPARE_PART';
  partNumberOrModel: string;
  itemName: string;
  category: string;
  currentStock: number;
  minThreshold: number;
  reorderQuantity: number;
  unitCost: number;
  status: 'CRITICAL' | 'LOW' | 'OUT_OF_STOCK';
}

// -------------------------------------------------------------
// DATA GETTERS PER ROLE (Separated and modular)
// -------------------------------------------------------------

export function getAdminDashboardData(branchId?: string | null) {
  const branches: BranchSalesComparison[] = [
    {
      branchId: 'br_halvad',
      branchName: 'Halvad Branch (HQ)',
      salesCount: 32,
      revenue: 2480000,
      targetCount: 40,
      targetRevenue: 3000000,
      serviceRevenue: 480000,
      customerSatisfaction: 4.9,
    },
    {
      branchId: 'br_dhangadhra',
      branchName: 'Dhangadhra Branch',
      salesCount: 19,
      revenue: 1480000,
      targetCount: 25,
      targetRevenue: 1900000,
      serviceRevenue: 240000,
      customerSatisfaction: 4.7,
    },
    {
      branchId: 'br_jetpur',
      branchName: 'Jetpur Branch',
      salesCount: 14,
      revenue: 1100000,
      targetCount: 18,
      targetRevenue: 1400000,
      serviceRevenue: 160000,
      customerSatisfaction: 4.8,
    },
  ];

  const isHalvad = branchId === 'br_halvad' || branchId === 'SHR-HLV';
  const isDhangadhra = branchId === 'br_dhangadhra' || branchId === 'SHR-DHN';
  const isJetpur = branchId === 'br_jetpur' || branchId === 'SHR-JTP';

  if (isHalvad) {
    return {
      kpis: {
        monthlyRevenue: 2480000,
        netProfitEstimated: 490000,
        bikesSold: 32,
        targetBikes: 40,
        serviceRevenue: 480000,
        salesTargetProgress: 80.0,
        totalStockValue: 9500000,
        pendingReceivables: 240000,
        customerSatisfactionRating: 4.9,
      },
      branches: [branches[0]],
      alerts: [
        {
          id: 'alt_h1',
          level: 'SUCCESS',
          title: 'Halvad Milestone Achieved',
          message: 'Halvad HQ reached 80% monthly sales quota with 10 days remaining.',
        },
        {
          id: 'alt_h2',
          level: 'INFO',
          title: 'Workshop Peak Hours',
          message: '6-Bay workshop running at 85% capacity today with 14 job cards.',
        },
      ],
      recentApprovals: [
        {
          id: 'appr_01',
          type: 'LOAN_DISBURSEMENT',
          title: 'Hero FinCorp Loan #LN-882 (Splendor+)',
          amount: 65000,
          customer: 'Ravi Patel',
          date: 'Today, 14:00',
        },
      ],
    };
  }

  if (isDhangadhra) {
    return {
      kpis: {
        monthlyRevenue: 1480000,
        netProfitEstimated: 275000,
        bikesSold: 19,
        targetBikes: 25,
        serviceRevenue: 240000,
        salesTargetProgress: 76.0,
        totalStockValue: 5200000,
        pendingReceivables: 145000,
        customerSatisfactionRating: 4.7,
      },
      branches: [branches[1]],
      alerts: [
        {
          id: 'alt_d1',
          level: 'WARNING',
          title: 'Dhangadhra Stock Notice',
          message: 'Low stock for Passion Plus (only 2 units left in Dhangadhra stockyard).',
        },
      ],
      recentApprovals: [
        {
          id: 'appr_d1',
          type: 'TOKEN_BOOKING',
          title: 'Xtreme 125R Booking Token Received',
          amount: 10000,
          customer: 'Suresh Parmar',
          date: 'Today, 12:15',
        },
      ],
    };
  }

  if (isJetpur) {
    return {
      kpis: {
        monthlyRevenue: 1100000,
        netProfitEstimated: 155000,
        bikesSold: 14,
        targetBikes: 18,
        serviceRevenue: 160000,
        salesTargetProgress: 77.8,
        totalStockValue: 3800000,
        pendingReceivables: 100000,
        customerSatisfactionRating: 4.8,
      },
      branches: [branches[2]],
      alerts: [
        {
          id: 'alt_j1',
          level: 'WARNING',
          title: 'Jetpur Branch Sales Gap',
          message: 'Jetpur is 4 bikes short of its mid-month target quota.',
        },
        {
          id: 'alt_j2',
          level: 'INFO',
          title: 'Stock Transfer Pending',
          message: '5 units Xpulse 200 inward transfer from Halvad HQ in transit.',
        },
      ],
      recentApprovals: [
        {
          id: 'appr_02',
          type: 'STOCK_TRANSFER',
          title: '5 Units Xpulse 200 Inward Transfer (Halvad -> Jetpur)',
          amount: 725000,
          customer: 'Jetpur Manager',
          date: 'Today, 11:30',
        },
      ],
    };
  }

  return {
    kpis: {
      monthlyRevenue: 4860000,
      netProfitEstimated: 920000,
      bikesSold: 65,
      targetBikes: 80,
      serviceRevenue: 880000,
      salesTargetProgress: 81.25,
      totalStockValue: 18500000,
      pendingReceivables: 485000,
      customerSatisfactionRating: 4.8,
    },
    branches,
    alerts: [
      {
        id: 'alt_01',
        level: 'WARNING',
        title: 'Jetpur Branch Sales Gap',
        message: 'Jetpur is at 62% of monthly target with 12 days remaining.',
      },
      {
        id: 'alt_02',
        level: 'CRITICAL',
        title: 'GST Return Filing Due',
        message: 'GSTR-3B monthly compilation ready for verification.',
      },
    ],
    recentApprovals: [
      {
        id: 'appr_01',
        type: 'LOAN_DISBURSEMENT',
        title: 'Hero FinCorp Loan #LN-882 (Splendor+)',
        amount: 65000,
        customer: 'Ravi Patel',
        date: 'Today, 14:00',
      },
      {
        id: 'appr_02',
        type: 'STOCK_TRANSFER',
        title: '5 Units Xpulse 200 Inward Transfer (Halvad -> Jetpur)',
        amount: 725000,
        customer: 'Jetpur Manager',
        date: 'Today, 11:30',
      },
    ],
  };
}

export function getManagerDashboardData(branchId: string = 'br_halvad') {
  return {
    kpis: {
      todayBookings: 8,
      pendingDeliveriesToday: 5,
      activeLeadsPipeline: 48,
      showroomFootfallToday: 38,
      staffAttendancePresent: 24,
      staffAttendanceTotal: 26,
      pipelineValue: 3450000,
      customerEscalationsCount: 1,
    },
    salesLeaderboard: [
      { name: 'Amit Verma', salesCount: 12, bookingsCount: 4, revenue: 940000, targetPercent: 94 },
      { name: 'Rahul Joshi', salesCount: 9, bookingsCount: 3, revenue: 710000, targetPercent: 78 },
      { name: 'Priya Dave', salesCount: 7, bookingsCount: 2, revenue: 550000, targetPercent: 70 },
    ],
    deliveriesToday: [
      { id: 'del_01', customerName: 'Suresh Patel', model: 'Hero Splendor+ XTEC', time: '16:00 Today', exec: 'Amit Verma', pdiStatus: 'PASSED' },
      { id: 'del_02', customerName: 'Manish Trivedi', model: 'Hero HF Deluxe', time: '17:30 Today', exec: 'Rahul Joshi', pdiStatus: 'PASSED' },
      { id: 'del_03', customerName: 'Harshil Shah', model: 'Hero Xtreme 160R', time: '18:00 Today', exec: 'Amit Verma', pdiStatus: 'IN_PROGRESS' },
    ],
    escalations: [
      { id: 'esc_01', customer: 'Dhaval Mehta', issue: 'Delay in RTO registration number generation', priority: 'HIGH', time: '2 hours ago' },
    ],
  };
}

export function getSalesDashboardData(userId?: string) {
  const followUps: SalesFollowUpItem[] = [
    {
      id: 'fu_01',
      customerName: 'Rahul Sharma',
      phone: '+91 98765 43210',
      interestedModel: 'Hero Splendor Plus XTEC',
      status: 'HOT',
      dueDate: 'Today',
      dueTime: '14:00 PM',
      isOverdue: false,
      notes: 'Interested in exchange bonus for 2018 Splendor. Wants finance quote for 2 years.',
      lastContact: 'Yesterday via WhatsApp',
    },
    {
      id: 'fu_02',
      customerName: 'Neha Gupta',
      phone: '+91 98765 43230',
      interestedModel: 'Hero Xtreme 160R 4V',
      status: 'HOT',
      dueDate: 'Today',
      dueTime: '16:30 PM',
      isOverdue: false,
      notes: 'Completed test ride. Call to confirm color choice (Sports Red or Matte Blue).',
      lastContact: '2 days ago in Showroom',
    },
    {
      id: 'fu_03',
      customerName: 'Kishore Parmar',
      phone: '+91 98765 43231',
      interestedModel: 'Hero HF Deluxe Drum',
      status: 'WARM',
      dueDate: 'Yesterday',
      dueTime: '11:00 AM',
      isOverdue: true,
      notes: 'Needs down payment details of ₹15,000 loan offer.',
      lastContact: '3 days ago',
    },
    {
      id: 'fu_04',
      customerName: 'Ankit Vaghela',
      phone: '+91 98765 43232',
      interestedModel: 'Hero Passion Pro Disc',
      status: 'HOT',
      dueDate: 'Tomorrow',
      dueTime: '10:30 AM',
      isOverdue: false,
      notes: 'Family visit scheduled for color selection and booking token payment.',
      lastContact: 'Yesterday call',
    },
  ];

  return {
    kpis: {
      hotLeadsCount: 9,
      followUpsDueToday: 6,
      overdueFollowUps: 2,
      monthlySalesTarget: 300000,
      achievedSales: 195000,
      targetPercent: 65,
      scheduledTestRidesToday: 3,
      pendingCustomerResponses: 4,
    },
    followUps,
    topSellingBikes: [
      { model: 'Splendor Plus', soldCount: 8, leadInterest: 18 },
      { model: 'Passion Pro', soldCount: 5, leadInterest: 11 },
      { model: 'Xtreme 160R', soldCount: 4, leadInterest: 9 },
      { model: 'HF Deluxe', soldCount: 3, leadInterest: 7 },
    ],
  };
}

export function getFrontDeskDashboardData() {
  const guestQueue: FrontDeskGuestItem[] = [
    {
      id: 'g_01',
      guestName: 'Dinesh Kumar',
      phone: '+91 98765 43240',
      purpose: 'NEW_PURCHASE',
      interestedModel: 'Hero Xpulse 200 4V',
      assignedExecutive: 'Amit Verma',
      status: 'IN_DISCUSSION',
      entryTime: '10:45 AM',
      waitMinutes: 2,
    },
    {
      id: 'g_02',
      guestName: 'Bhavin Vora',
      phone: '+91 98765 43241',
      purpose: 'TEST_RIDE',
      interestedModel: 'Hero Splendor Plus',
      assignedExecutive: 'Rahul Joshi',
      status: 'TEST_RIDE',
      entryTime: '11:00 AM',
      waitMinutes: 5,
    },
    {
      id: 'g_03',
      guestName: 'Jignesh Makwana',
      phone: '+91 98765 43242',
      purpose: 'SERVICE',
      status: 'WAITING_IN_LOUNGE',
      entryTime: '11:15 AM',
      waitMinutes: 12,
    },
    {
      id: 'g_04',
      guestName: 'Sunita Ben Patel',
      phone: '+91 98765 43243',
      purpose: 'NEW_PURCHASE',
      interestedModel: 'Hero Pleasure+ XTEC',
      status: 'WAITING_IN_LOUNGE',
      entryTime: '11:20 AM',
      waitMinutes: 7,
    },
  ];

  return {
    kpis: {
      todayWalkIns: 18,
      todayAppointments: 6,
      waitingInLounge: 2,
      todayTestRidesBooked: 4,
      unassignedVisitors: 2,
      availableFloorExecutives: 4,
    },
    guestQueue,
    floorExecutives: [
      { name: 'Amit Verma', status: 'BUSY_WITH_GUEST', currentGuest: 'Dinesh Kumar' },
      { name: 'Rahul Joshi', status: 'ON_TEST_RIDE', currentGuest: 'Bhavin Vora' },
      { name: 'Priya Dave', status: 'AVAILABLE', currentGuest: null },
      { name: 'Kishan Solanki', status: 'AVAILABLE', currentGuest: null },
    ],
  };
}

export function getServiceManagerDashboardData() {
  const delayedJobs: DelayedServiceJob[] = [
    {
      id: 'dj_01',
      jobCardNumber: 'JC-8891',
      customerName: 'Jatin Prajapati',
      phone: '+91 98765 43250',
      vehicleModel: 'Hero Xtreme 160R',
      regNumber: 'GJ-36-KL-7788',
      bayNumber: 'Bay 2 (Major Repairs)',
      technicianName: 'Suresh Tech',
      promisedDelivery: '11:30 AM Today',
      delayMinutes: 60,
      delayReason: 'Brake caliper seal replacement required customer approval.',
      status: 'IN_PROGRESS',
    },
    {
      id: 'dj_02',
      jobCardNumber: 'JC-8884',
      customerName: 'Ketan Barot',
      phone: '+91 98765 43251',
      vehicleModel: 'Hero Glamour',
      regNumber: 'GJ-13-MN-4422',
      bayNumber: 'Bay 4',
      technicianName: 'Vikash Tech',
      promisedDelivery: '12:00 PM Today',
      delayMinutes: 30,
      delayReason: 'Carburetor ultrasound cleaning took extra time.',
      status: 'IN_PROGRESS',
    },
  ];

  return {
    kpis: {
      pendingJobs: 18,
      activeInBayJobs: 12,
      delayedJobsCount: 2,
      vehiclesReadyForPickup: 6,
      vehiclesDueToday: 14,
      serviceCompletionRate: 92.5,
      workshopBayLoadPercent: 88,
      activeComplaintsCount: 2,
    },
    delayedJobs,
    bays: [
      { bay: 'Bay 1 — Quick Service', status: 'OCCUPIED', vehicle: 'Splendor Plus (GJ-13-AB-1234)', tech: 'Amit K.' },
      { bay: 'Bay 2 — Major Repairs', status: 'DELAYED', vehicle: 'Xtreme 160R (GJ-36-KL-7788)', tech: 'Suresh Tech' },
      { bay: 'Bay 3 — Periodic Maintenance', status: 'OCCUPIED', vehicle: 'HF Deluxe (GJ-13-EF-1122)', tech: 'Ramesh Tech' },
      { bay: 'Bay 4 — Electricals & Tuning', status: 'DELAYED', vehicle: 'Glamour (GJ-13-MN-4422)', tech: 'Vikash Tech' },
      { bay: 'Bay 5 — Free Service Express', status: 'OCCUPIED', vehicle: 'Passion Pro (GJ-36-XY-9876)', tech: 'Deepak Tech' },
      { bay: 'Bay 6 — Washing & Detailing', status: 'OCCUPIED', vehicle: 'Glamour XTEC (GJ-13-CD-5566)', tech: 'Arun Wash' },
    ],
  };
}

export function getServiceAdvisorDashboardData() {
  const jobQueue: AdvisorJobQueueItem[] = [
    {
      id: 'adv_01',
      jobCardNumber: 'JC-8901',
      customerName: 'Ramesh Patel',
      phone: '+91 98765 43210',
      vehicleModel: 'Splendor Plus',
      regNumber: 'GJ-13-AB-1234',
      serviceType: 'Paid Periodic Service',
      status: 'IN_PROGRESS',
      estDelivery: '14:30 Today',
    },
    {
      id: 'adv_02',
      jobCardNumber: 'JC-8905',
      customerName: 'Ashwin Parmar',
      phone: '+91 98765 43255',
      vehicleModel: 'Hero Glamour XTEC',
      regNumber: 'GJ-36-ZZ-9911',
      serviceType: 'Running Repair',
      status: 'APPROVAL_PENDING',
      extraPartsEstimate: 1450,
      customerApprovalStatus: 'PENDING',
      estDelivery: '17:00 Today',
    },
    {
      id: 'adv_03',
      jobCardNumber: 'JC-8899',
      customerName: 'Mahesh Shah',
      phone: '+91 98765 43219',
      vehicleModel: 'Hero Glamour',
      regNumber: 'GJ-13-CD-5566',
      serviceType: 'Free Service #3',
      status: 'READY_FOR_DELIVERY',
      estDelivery: 'Ready for Pickup',
    },
    {
      id: 'adv_04',
      jobCardNumber: 'JC-8910',
      customerName: 'Dinesh Jha',
      phone: '+91 98765 43220',
      vehicleModel: 'Hero HF Deluxe',
      regNumber: 'GJ-13-EF-1122',
      serviceType: 'Paid Service',
      status: 'CHECKED_IN',
      estDelivery: '16:00 Today',
    },
  ];

  return {
    kpis: {
      todayBookingsCount: 12,
      vehiclesReceivedCount: 7,
      activeJobCardsCount: 6,
      pendingInspectionsCount: 3,
      customerApprovalsPending: 1,
      vehiclesReadyForPickup: 4,
    },
    jobQueue,
    pendingCustomerCalls: [
      { customer: 'Ashwin Parmar', phone: '+91 98765 43255', reason: 'Need approval for Clutch Plate replacement (₹1,450)', jobCard: 'JC-8905' },
      { customer: 'Mahesh Shah', phone: '+91 98765 43219', reason: 'Send WhatsApp notification that vehicle is ready for pickup', jobCard: 'JC-8899' },
    ],
  };
}

export function getAccountantDashboardData() {
  const overdueReceivables: OverdueReceivableItem[] = [
    {
      id: 'rec_01',
      invoiceNumber: 'INV-2024-1002',
      customerName: 'Rohit Verma',
      phone: '+91 98765 43260',
      invoiceType: 'VEHICLE_SALE',
      totalAmount: 78000,
      paidAmount: 53000,
      balanceDue: 25000,
      dueDate: '10 May 2024',
      daysOverdue: 5,
      financierName: 'Direct Customer Balance',
    },
    {
      id: 'rec_02',
      invoiceNumber: 'INV-2024-1009',
      customerName: 'Neha Singh',
      phone: '+91 98765 43261',
      invoiceType: 'VEHICLE_SALE',
      totalAmount: 125000,
      paidAmount: 107000,
      balanceDue: 18000,
      dueDate: '12 May 2024',
      daysOverdue: 3,
      financierName: 'Hero FinCorp Disbursal',
    },
    {
      id: 'rec_03',
      invoiceNumber: 'INV-2024-0988',
      customerName: 'Amit Kumar',
      phone: '+91 98765 43262',
      invoiceType: 'SERVICE_BILL',
      totalAmount: 15000,
      paidAmount: 0,
      balanceDue: 15000,
      dueDate: '13 May 2024',
      daysOverdue: 2,
    },
  ];

  return {
    kpis: {
      todayCollections: 185000,
      monthlyRevenue: 1845000,
      unpaidInvoicesCount: 8,
      unpaidInvoicesAmount: 245000,
      overdueAmountTotal: 68000,
      gstLiabilityMonth: 112400,
      totalInvoicesCount: 42,
    },
    overdueReceivables,
    financierDisbursals: [
      { financier: 'Hero FinCorp', pendingAmount: 195000, count: 3, status: 'APPROVAL_PASSED' },
      { financier: 'HDFC Bank Auto Loan', pendingAmount: 128000, count: 1, status: 'DISBURSAL_PENDING' },
      { financier: 'L&T Finance', pendingAmount: 72000, count: 1, status: 'DOCS_PENDING' },
    ],
  };
}

export function getInventoryDashboardData() {
  const criticalStock: CriticalStockItem[] = [
    {
      id: 'cs_01',
      itemType: 'BIKE',
      partNumberOrModel: 'Splendor Plus Drum',
      itemName: 'Hero Splendor Plus (Sports Red)',
      category: 'Commuter Bike',
      currentStock: 2,
      minThreshold: 5,
      reorderQuantity: 10,
      unitCost: 63000,
      status: 'LOW',
    },
    {
      id: 'cs_02',
      itemType: 'BIKE',
      partNumberOrModel: 'Passion Pro Disc',
      itemName: 'Hero Passion Pro (Sports Red)',
      category: 'Executive Bike',
      currentStock: 1,
      minThreshold: 3,
      reorderQuantity: 5,
      unitCost: 68000,
      status: 'CRITICAL',
    },
    {
      id: 'cs_03',
      itemType: 'SPARE_PART',
      partNumberOrModel: 'SP-ENG-4T',
      itemName: 'Hero Genuine 4T Plus 10W30 Engine Oil (1L)',
      category: 'Lubricants',
      currentStock: 4,
      minThreshold: 15,
      reorderQuantity: 50,
      unitCost: 320,
      status: 'CRITICAL',
    },
    {
      id: 'cs_04',
      itemType: 'SPARE_PART',
      partNumberOrModel: 'SP-BRK-102',
      itemName: 'Brake Pad Set (Front)',
      category: 'Brakes',
      currentStock: 2,
      minThreshold: 10,
      reorderQuantity: 25,
      unitCost: 210,
      status: 'CRITICAL',
    },
    {
      id: 'cs_05',
      itemType: 'SPARE_PART',
      partNumberOrModel: 'SP-FLT-301',
      itemName: 'Air Filter Element',
      category: 'Filters',
      currentStock: 0,
      minThreshold: 8,
      reorderQuantity: 20,
      unitCost: 110,
      status: 'OUT_OF_STOCK',
    },
  ];

  return {
    kpis: {
      totalStockValue: 11500000,
      totalBikesInStock: 85,
      lowStockItemsCount: 12,
      outOfStockCount: 3,
      totalSparePartsUnits: 256,
      incomingUnitsExpected: 15,
    },
    criticalStock,
    recentMovements: [
      { id: 'mv_01', type: 'FACTORY_INWARD', item: 'Hero Splendor+ (5 Units)', date: 'Today, 09:15 AM', ref: 'INV-FAC-9912' },
      { id: 'mv_02', type: 'INTER_BRANCH_TRANSFER', item: 'Hero Xpulse 200 (2 Units Halvad -> Dhangadhra)', date: 'Yesterday', ref: 'TRF-0881' },
      { id: 'mv_03', type: 'WORKSHOP_CONSUMPTION', item: 'Engine Oil 4T (12 Cans)', date: 'Today, 11:30 AM', ref: 'JC-BATCH-12' },
    ],
  };
}
