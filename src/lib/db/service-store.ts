// Shreeji Hero Showroom ERP - Complete Service Center & Workshop Data Store

import { addTimelineEntry } from './crm-store';

export interface ServiceBookingRecord {
  id: string;
  bookingCode: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  vehicleId: string;
  registrationNumber: string;
  modelName: string;
  serviceType: string;
  scheduledDate: string;
  preferredTime?: string;
  branchId: string;
  advisorName?: string;
  customerComplaint: string;
  notes?: string;
  status:
    | 'REQUESTED'
    | 'CONFIRMED'
    | 'CHECKED_IN'
    | 'IN_SERVICE'
    | 'READY_FOR_DELIVERY'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'NO_SHOW';
  createdAt: string;
}

export interface ServiceBayRecord {
  id: string;
  code: string; // e.g. "BAY-01"
  name: string;
  branchId: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
  currentJobCardId?: string;
  currentJobCardNumber?: string;
  currentVehicleReg?: string;
  assignedTechnician?: string;
  startTime?: string;
  isDelayed?: boolean;
}

export interface JobCardItemRecord {
  id: string;
  itemType: 'LABOUR' | 'PART';
  description: string;
  sparePartId?: string;
  partNumber?: string;
  qty: number;
  unitPrice: number;
  gstRate: number;
  totalAmount: number;
}

export interface ServiceApprovalRecord {
  id: string;
  jobCardId: string;
  description: string;
  estimatedCost: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  customerResponseNotes?: string;
  createdAt: string;
}

export interface JobCardRecord {
  id: string;
  jobCardNumber: string;
  serviceBookingId?: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  vehicleId: string;
  registrationNumber: string;
  modelName: string;
  vinNumber?: string;
  engineNumber?: string;
  branchId: string;
  advisorId: string;
  advisorName: string;
  technicianId?: string;
  technicianName?: string;
  bayId?: string;
  bayCode?: string;
  serviceType: string;
  customerComplaints: string;
  inspectionFindings?: string;
  fuelLevel: string;
  kmReading: number;
  status:
    | 'OPEN'
    | 'INSPECTION'
    | 'ESTIMATE_PENDING'
    | 'CUSTOMER_APPROVAL'
    | 'WORK_IN_PROGRESS'
    | 'QUALITY_CHECK'
    | 'READY_FOR_DELIVERY'
    | 'COMPLETED'
    | 'CANCELLED';
  isDelayed?: boolean;
  delayReason?: string;
  isWaitingForParts?: boolean;
  estDelivery: string;
  items: JobCardItemRecord[];
  approvals: ServiceApprovalRecord[];
  totalLabour: number;
  totalParts: number;
  totalAmount: number;
  qcStatus: 'PENDING' | 'PASSED' | 'FAILED';
  invoiceNumber?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

// -------------------------------------------------------------
// IN-MEMORY WORKSHOP SEED REPOSITORY
// -------------------------------------------------------------

let baysDb: ServiceBayRecord[] = [
  {
    id: 'bay_01',
    code: 'BAY-01',
    name: 'Bay 1 - Express Lube & Tune',
    branchId: 'br_halvad',
    status: 'OCCUPIED',
    currentJobCardId: 'jc_01',
    currentJobCardNumber: 'JC-8901',
    currentVehicleReg: 'GJ-36-AB-1234',
    assignedTechnician: 'Pravin Solanki',
    startTime: '10:00 AM',
    isDelayed: false,
  },
  {
    id: 'bay_02',
    code: 'BAY-02',
    name: 'Bay 2 - Periodic Maintenance',
    branchId: 'br_halvad',
    status: 'OCCUPIED',
    currentJobCardId: 'jc_02',
    currentJobCardNumber: 'JC-8902',
    currentVehicleReg: 'GJ-36-CD-5678',
    assignedTechnician: 'Dhaval Makwana',
    startTime: '09:30 AM',
    isDelayed: true,
  },
  {
    id: 'bay_03',
    code: 'BAY-03',
    name: 'Bay 3 - Electrical & Diagnostics',
    branchId: 'br_halvad',
    status: 'AVAILABLE',
  },
  {
    id: 'bay_04',
    code: 'BAY-04',
    name: 'Bay 4 - Major Engine Overhaul',
    branchId: 'br_halvad',
    status: 'AVAILABLE',
  },
  {
    id: 'bay_05',
    code: 'BAY-05',
    name: 'Bay 5 - Accidental & Frame Alignment',
    branchId: 'br_halvad',
    status: 'AVAILABLE',
  },
  {
    id: 'bay_06',
    code: 'BAY-06',
    name: 'Bay 6 - Final Quality Check & Wash',
    branchId: 'br_halvad',
    status: 'OCCUPIED',
    currentJobCardId: 'jc_03',
    currentJobCardNumber: 'JC-8898',
    currentVehicleReg: 'GJ-36-EF-9012',
    assignedTechnician: 'Kishore Parmar',
    startTime: '11:15 AM',
    isDelayed: false,
  },
];

let bookingsDb: ServiceBookingRecord[] = [
  {
    id: 'sb_01',
    bookingCode: 'SR-2024-101',
    customerId: 'c_01',
    customerName: 'Ramesh Patel',
    customerPhone: '+91 98765 43210',
    vehicleId: 'cv_01',
    registrationNumber: 'GJ-36-AB-1234',
    modelName: 'Hero Splendor Plus',
    serviceType: 'Free Service #4',
    scheduledDate: '2024-05-16T10:00:00.000Z',
    preferredTime: '10:00 AM',
    branchId: 'br_halvad',
    advisorName: 'Kiran Solanki',
    customerComplaint: 'Regular 12,000 km periodic check-up, engine oil change, front brake squeal.',
    status: 'IN_SERVICE',
    createdAt: '2024-05-15T09:00:00.000Z',
  },
  {
    id: 'sb_02',
    bookingCode: 'SR-2024-102',
    customerId: 'c_02',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 43220',
    vehicleId: 'cv_02',
    registrationNumber: 'GJ-36-CD-5678',
    modelName: 'Hero Passion Pro',
    serviceType: 'Paid Periodic Service',
    scheduledDate: '2024-05-16T11:30:00.000Z',
    preferredTime: '11:30 AM',
    branchId: 'br_halvad',
    advisorName: 'Kiran Solanki',
    customerComplaint: 'Cold start issue, chain loose, gear shifting hard.',
    status: 'IN_SERVICE',
    createdAt: '2024-05-15T14:00:00.000Z',
  },
  {
    id: 'sb_03',
    bookingCode: 'SR-2024-103',
    customerId: 'c_03',
    customerName: 'Neha Gupta',
    customerPhone: '+91 98765 43230',
    vehicleId: 'cv_03',
    registrationNumber: 'GJ-36-GH-3456',
    modelName: 'Hero Pleasure Plus XTEC',
    serviceType: 'Free Service #2',
    scheduledDate: '2024-05-17T09:30:00.000Z',
    preferredTime: '09:30 AM',
    branchId: 'br_halvad',
    customerComplaint: 'Handlebar vibration at 40kmph.',
    status: 'CONFIRMED',
    createdAt: '2024-05-16T10:00:00.000Z',
  },
];

let jobCardsDb: JobCardRecord[] = [
  {
    id: 'jc_01',
    jobCardNumber: 'JC-8901',
    serviceBookingId: 'sb_01',
    customerId: 'c_01',
    customerName: 'Ramesh Patel',
    customerPhone: '+91 98765 43210',
    vehicleId: 'cv_01',
    registrationNumber: 'GJ-36-AB-1234',
    modelName: 'Hero Splendor Plus',
    vinNumber: 'MBLHAW14XN9001234',
    engineNumber: 'HA10EHN9001234',
    branchId: 'br_halvad',
    advisorId: 'usr_service_kiran',
    advisorName: 'Kiran Solanki',
    technicianId: 'usr_tech_pravin',
    technicianName: 'Pravin Solanki',
    bayId: 'bay_01',
    bayCode: 'BAY-01',
    serviceType: 'Free Service #4',
    customerComplaints: '12,000 km service, engine oil change, front brake squeal.',
    inspectionFindings: 'Front brake pads worn down to 1.5mm; rear chain slack excessive.',
    fuelLevel: '1/2 Tank',
    kmReading: 12450,
    status: 'WORK_IN_PROGRESS',
    estDelivery: 'Today, 15:30 PM',
    items: [
      {
        id: 'jci_01',
        itemType: 'PART',
        description: 'Hero 4T Plus Genuine Engine Oil (900ml)',
        partNumber: 'SP-ENG-001',
        qty: 1,
        unitPrice: 380,
        gstRate: 18,
        totalAmount: 380,
      },
      {
        id: 'jci_02',
        itemType: 'PART',
        description: 'Front Brake Shoe Set',
        partNumber: 'SP-BRK-102',
        qty: 1,
        unitPrice: 240,
        gstRate: 18,
        totalAmount: 240,
      },
      {
        id: 'jci_03',
        itemType: 'LABOUR',
        description: 'Free Service Periodic Labour (Coupon 4)',
        qty: 1,
        unitPrice: 0,
        gstRate: 18,
        totalAmount: 0,
      },
    ],
    approvals: [],
    totalLabour: 0,
    totalParts: 620,
    totalAmount: 620,
    qcStatus: 'PENDING',
    createdAt: '2024-05-16T10:00:00.000Z',
    updatedAt: '2024-05-16T10:30:00.000Z',
  },
  {
    id: 'jc_02',
    jobCardNumber: 'JC-8902',
    serviceBookingId: 'sb_02',
    customerId: 'c_02',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 43220',
    vehicleId: 'cv_02',
    registrationNumber: 'GJ-36-CD-5678',
    modelName: 'Hero Passion Pro',
    vinNumber: 'MBLHAW14XN9005678',
    engineNumber: 'HA10EHN9005678',
    branchId: 'br_halvad',
    advisorId: 'usr_service_kiran',
    advisorName: 'Kiran Solanki',
    technicianId: 'usr_tech_dhaval',
    technicianName: 'Dhaval Makwana',
    bayId: 'bay_02',
    bayCode: 'BAY-02',
    serviceType: 'Paid Periodic Service',
    customerComplaints: 'Cold start issue, chain loose, gear shifting hard.',
    inspectionFindings: 'Spark plug fouled; drive chain worn and requires sprocket replacement.',
    fuelLevel: 'Reserve',
    kmReading: 24120,
    status: 'CUSTOMER_APPROVAL',
    isDelayed: true,
    delayReason: 'Awaiting customer telephone approval for Chain Sprocket Kit (₹1,250).',
    estDelivery: 'Today, 17:00 PM',
    items: [
      {
        id: 'jci_04',
        itemType: 'PART',
        description: 'Hero Spark Plug NGK',
        partNumber: 'SP-IGN-005',
        qty: 1,
        unitPrice: 120,
        gstRate: 18,
        totalAmount: 120,
      },
      {
        id: 'jci_05',
        itemType: 'LABOUR',
        description: 'Paid Periodic General Service Labour',
        qty: 1,
        unitPrice: 450,
        gstRate: 18,
        totalAmount: 450,
      },
    ],
    approvals: [
      {
        id: 'app_01',
        jobCardId: 'jc_02',
        description: 'Drive Chain & Sprocket Replacement Kit + Labour',
        estimatedCost: 1450,
        status: 'PENDING',
        createdAt: '2024-05-16T11:00:00.000Z',
      },
    ],
    totalLabour: 450,
    totalParts: 120,
    totalAmount: 570,
    qcStatus: 'PENDING',
    createdAt: '2024-05-16T09:30:00.000Z',
    updatedAt: '2024-05-16T11:00:00.000Z',
  },
  {
    id: 'jc_03',
    jobCardNumber: 'JC-8898',
    customerId: 'c_04',
    customerName: 'Dinesh Kumar',
    customerPhone: '+91 98765 43240',
    vehicleId: 'cv_04',
    registrationNumber: 'GJ-36-EF-9012',
    modelName: 'Hero Xpulse 200 4V',
    branchId: 'br_halvad',
    advisorId: 'usr_service_kiran',
    advisorName: 'Kiran Solanki',
    technicianId: 'usr_tech_kishore',
    technicianName: 'Kishore Parmar',
    bayId: 'bay_06',
    bayCode: 'BAY-06',
    serviceType: 'Running Repair',
    customerComplaints: 'Clutch cable snapped on highway.',
    inspectionFindings: 'Replaced clutch inner cable and adjusted lever free play to 15mm.',
    fuelLevel: 'Full Tank',
    kmReading: 8900,
    status: 'READY_FOR_DELIVERY',
    estDelivery: 'Today, 12:00 PM',
    items: [
      {
        id: 'jci_06',
        itemType: 'PART',
        description: 'Clutch Cable Assembly',
        partNumber: 'SP-CBL-011',
        qty: 1,
        unitPrice: 180,
        gstRate: 18,
        totalAmount: 180,
      },
      {
        id: 'jci_07',
        itemType: 'LABOUR',
        description: 'Cable Replacement & Tuning Labour',
        qty: 1,
        unitPrice: 100,
        gstRate: 18,
        totalAmount: 100,
      },
    ],
    approvals: [],
    totalLabour: 100,
    totalParts: 180,
    totalAmount: 280,
    qcStatus: 'PASSED',
    createdAt: '2024-05-16T08:30:00.000Z',
    updatedAt: '2024-05-16T11:15:00.000Z',
  },
];

// -------------------------------------------------------------
// STORE METHODS
// -------------------------------------------------------------

export async function getServiceBays(branchId?: string | null): Promise<ServiceBayRecord[]> {
  let result = [...baysDb];
  if (branchId) result = result.filter((b) => b.branchId === branchId);
  return result;
}

export async function getServiceBookings(filter?: {
  branchId?: string | null;
  status?: string;
}): Promise<ServiceBookingRecord[]> {
  let result = [...bookingsDb];
  if (filter?.branchId) result = result.filter((b) => b.branchId === filter.branchId);
  if (filter?.status) result = result.filter((b) => b.status === filter.status);
  return result;
}

export async function createServiceBooking(data: {
  customerId: string;
  customerName: string;
  customerPhone: string;
  vehicleId: string;
  registrationNumber: string;
  modelName: string;
  serviceType: string;
  scheduledDate: string;
  preferredTime?: string;
  branchId: string;
  customerComplaint: string;
  notes?: string;
  actorName?: string;
}): Promise<ServiceBookingRecord> {
  const bookingCode = `SR-${new Date().getFullYear()}-${100 + bookingsDb.length + 1}`;
  const newBooking: ServiceBookingRecord = {
    id: `sb_${Date.now()}`,
    bookingCode,
    customerId: data.customerId,
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    vehicleId: data.vehicleId,
    registrationNumber: data.registrationNumber,
    modelName: data.modelName,
    serviceType: data.serviceType,
    scheduledDate: data.scheduledDate,
    preferredTime: data.preferredTime,
    branchId: data.branchId,
    customerComplaint: data.customerComplaint,
    notes: data.notes,
    status: 'CONFIRMED',
    createdAt: new Date().toISOString(),
  };

  bookingsDb.unshift(newBooking);

  await addTimelineEntry({
    customerId: data.customerId,
    type: 'SERVICE',
    title: `Service Appointment Booked: ${data.modelName}`,
    description: `Service booking #${bookingCode} scheduled for ${data.registrationNumber} (${data.serviceType}).`,
    actorName: data.actorName || 'Reception Desk',
  });

  return newBooking;
}

export async function checkInVehicle(data: {
  customerId: string;
  customerName: string;
  customerPhone: string;
  vehicleId: string;
  registrationNumber: string;
  modelName: string;
  vinNumber?: string;
  engineNumber?: string;
  branchId: string;
  advisorId: string;
  advisorName: string;
  serviceType: string;
  customerComplaints: string;
  fuelLevel: string;
  kmReading: number;
  estDeliveryHours?: number;
  serviceBookingId?: string;
}): Promise<JobCardRecord> {
  // Check duplicate active check-in
  const activeExisting = jobCardsDb.find(
    (jc) =>
      jc.registrationNumber === data.registrationNumber &&
      jc.status !== 'COMPLETED' &&
      jc.status !== 'CANCELLED'
  );
  if (activeExisting) {
    throw new Error(
      `Vehicle ${data.registrationNumber} is already checked in under active Job Card #${activeExisting.jobCardNumber}.`
    );
  }

  const jobCardNumber = `JC-${8900 + jobCardsDb.length + 1}`;
  const now = new Date();
  const deliveryHours = data.estDeliveryHours || 4;
  const estDeliveryTime = new Date(now.getTime() + deliveryHours * 3600000);

  const newJobCard: JobCardRecord = {
    id: `jc_${Date.now()}`,
    jobCardNumber,
    serviceBookingId: data.serviceBookingId,
    customerId: data.customerId,
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    vehicleId: data.vehicleId,
    registrationNumber: data.registrationNumber,
    modelName: data.modelName,
    vinNumber: data.vinNumber,
    engineNumber: data.engineNumber,
    branchId: data.branchId,
    advisorId: data.advisorId,
    advisorName: data.advisorName,
    serviceType: data.serviceType,
    customerComplaints: data.customerComplaints,
    fuelLevel: data.fuelLevel,
    kmReading: data.kmReading,
    status: 'OPEN',
    estDelivery: `Today, ${estDeliveryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    items: [],
    approvals: [],
    totalLabour: 0,
    totalParts: 0,
    totalAmount: 0,
    qcStatus: 'PENDING',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  jobCardsDb.unshift(newJobCard);

  // If service booking was linked, update its status
  if (data.serviceBookingId) {
    const booking = bookingsDb.find((b) => b.id === data.serviceBookingId);
    if (booking) booking.status = 'CHECKED_IN';
  }

  await addTimelineEntry({
    customerId: data.customerId,
    type: 'SERVICE',
    title: `Vehicle Reception & Check-In`,
    description: `Job Card #${jobCardNumber} created for ${data.registrationNumber}. Odo: ${data.kmReading} KM, Fuel: ${data.fuelLevel}. Complaints: ${data.customerComplaints}.`,
    actorName: data.advisorName,
  });

  return newJobCard;
}

export async function getJobCards(filter?: {
  branchId?: string | null;
  status?: string;
  isDelayed?: boolean;
}): Promise<JobCardRecord[]> {
  let result = [...jobCardsDb];
  if (filter?.branchId) result = result.filter((jc) => jc.branchId === filter.branchId);
  if (filter?.status) result = result.filter((jc) => jc.status === filter.status);
  if (filter?.isDelayed !== undefined) result = result.filter((jc) => !!jc.isDelayed === filter.isDelayed);
  return result;
}

export async function assignBayAndTechnician(
  jobCardId: string,
  bayId: string,
  technicianId: string,
  technicianName: string,
  managerName: string
): Promise<JobCardRecord> {
  const jc = jobCardsDb.find((j) => j.id === jobCardId);
  if (!jc) throw new Error('Job Card not found');

  const bay = baysDb.find((b) => b.id === bayId);
  if (!bay) throw new Error('Service bay not found');

  // Prevent multiple active jobs in same bay
  if (bay.status === 'OCCUPIED' && bay.currentJobCardId !== jobCardId) {
    throw new Error(`Service Bay ${bay.code} is currently OCCUPIED by ${bay.currentVehicleReg}.`);
  }

  // Release old bay if reassigned
  if (jc.bayId && jc.bayId !== bayId) {
    const oldBay = baysDb.find((b) => b.id === jc.bayId);
    if (oldBay) {
      oldBay.status = 'AVAILABLE';
      oldBay.currentJobCardId = undefined;
      oldBay.currentVehicleReg = undefined;
    }
  }

  // Assign new bay
  bay.status = 'OCCUPIED';
  bay.currentJobCardId = jc.id;
  bay.currentJobCardNumber = jc.jobCardNumber;
  bay.currentVehicleReg = jc.registrationNumber;
  bay.assignedTechnician = technicianName;
  bay.startTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  jc.bayId = bay.id;
  jc.bayCode = bay.code;
  jc.technicianId = technicianId;
  jc.technicianName = technicianName;
  jc.status = 'WORK_IN_PROGRESS';
  jc.updatedAt = new Date().toISOString();

  await addTimelineEntry({
    customerId: jc.customerId,
    type: 'SERVICE',
    title: `Work In Progress Assigned: ${bay.code}`,
    description: `Job Card #${jc.jobCardNumber} assigned to Technician ${technicianName} in ${bay.name}.`,
    actorName: managerName,
  });

  return jc;
}

export async function recordCustomerApproval(
  jobCardId: string,
  approvalId: string,
  approved: boolean,
  customerNotes?: string,
  actorName: string = 'Service Advisor'
): Promise<JobCardRecord> {
  const jc = jobCardsDb.find((j) => j.id === jobCardId);
  if (!jc) throw new Error('Job Card not found');

  const app = jc.approvals.find((a) => a.id === approvalId);
  if (!app) throw new Error('Approval request not found');

  app.status = approved ? 'APPROVED' : 'REJECTED';
  app.customerResponseNotes = customerNotes;

  if (approved) {
    // Add as approved part/labour item
    jc.items.push({
      id: `jci_${Date.now()}`,
      itemType: 'PART',
      description: `[Extra Approved] ${app.description}`,
      qty: 1,
      unitPrice: app.estimatedCost,
      gstRate: 18,
      totalAmount: app.estimatedCost,
    });
    jc.totalParts += app.estimatedCost;
    jc.totalAmount += app.estimatedCost;
    jc.status = 'WORK_IN_PROGRESS';
    jc.isDelayed = false;
  }

  jc.updatedAt = new Date().toISOString();

  await addTimelineEntry({
    customerId: jc.customerId,
    type: 'SERVICE',
    title: approved ? `Additional Work Approved by Customer` : `Additional Work Rejected`,
    description: `Customer ${approved ? 'approved' : 'rejected'} additional repair of ₹${app.estimatedCost}: ${app.description}.`,
    actorName,
  });

  return jc;
}

export async function completeQualityCheck(
  jobCardId: string,
  passed: boolean,
  checkedBy: string,
  notes?: string
): Promise<JobCardRecord> {
  const jc = jobCardsDb.find((j) => j.id === jobCardId);
  if (!jc) throw new Error('Job Card not found');

  jc.qcStatus = passed ? 'PASSED' : 'FAILED';
  if (passed) {
    jc.status = 'READY_FOR_DELIVERY';
    // Free up the bay
    if (jc.bayId) {
      const bay = baysDb.find((b) => b.id === jc.bayId);
      if (bay) {
        bay.status = 'AVAILABLE';
        bay.currentJobCardId = undefined;
        bay.currentVehicleReg = undefined;
      }
    }
  }
  jc.updatedAt = new Date().toISOString();

  await addTimelineEntry({
    customerId: jc.customerId,
    type: 'SERVICE',
    title: `Workshop Quality Check: ${jc.qcStatus}`,
    description: passed
      ? `Final 7-point road test and inspection PASSED by ${checkedBy}. Ready for customer billing and gate pass.`
      : `Quality check FAILED: ${notes || 'Re-work required by technician'}.`,
    actorName: checkedBy,
  });

  return jc;
}

export async function completeServiceDelivery(
  jobCardId: string,
  data: {
    finalKmReading: number;
    paymentMode: string;
    advisorName: string;
  }
): Promise<JobCardRecord> {
  const jc = jobCardsDb.find((j) => j.id === jobCardId);
  if (!jc) throw new Error('Job Card not found');

  if (jc.qcStatus !== 'PASSED') {
    throw new Error('Cannot deliver vehicle: Quality Check (QC) has not PASSED.');
  }

  const now = new Date().toISOString();
  jc.status = 'COMPLETED';
  jc.completedAt = now;
  jc.invoiceNumber = `SR-INV-${new Date().getFullYear()}-${7000 + jobCardsDb.length + 1}`;
  jc.updatedAt = now;

  // Free up bay if still attached
  if (jc.bayId) {
    const bay = baysDb.find((b) => b.id === jc.bayId);
    if (bay) {
      bay.status = 'AVAILABLE';
      bay.currentJobCardId = undefined;
      bay.currentVehicleReg = undefined;
    }
  }

  await addTimelineEntry({
    customerId: jc.customerId,
    type: 'SERVICE',
    title: `Service Completed & Gate Pass Issued`,
    description: `Vehicle ${jc.registrationNumber} delivered to customer. Total Bill: ₹${jc.totalAmount.toLocaleString('en-IN')} (${data.paymentMode}). Invoice & Gate Pass #${jc.invoiceNumber}.`,
    actorName: data.advisorName,
  });

  return jc;
}
