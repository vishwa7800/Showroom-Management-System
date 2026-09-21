// Shreeji Hero Showroom ERP - CRM In-Memory & Relational Data Store

export interface CustomerRecord {
  id: string;
  customerCode: string;
  name: string;
  phone: string;
  altPhone?: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  dateOfBirth?: string;
  preferredContact: 'PHONE' | 'WHATSAPP' | 'EMAIL';
  source: string;
  branchId: string;
  branchName?: string;
  status: 'ACTIVE' | 'INACTIVE';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerTimelineItem {
  id: string;
  customerId: string;
  type:
    | 'INQUIRY'
    | 'FOLLOW_UP'
    | 'TEST_RIDE'
    | 'QUOTATION'
    | 'BOOKING'
    | 'SALE'
    | 'SERVICE'
    | 'PAYMENT'
    | 'PDI'
    | 'DELIVERY'
    | 'REFUND'
    | 'NOTE';
  title: string;
  description: string;
  actorName: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface LeadRecord {
  id: string;
  leadCode: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  branchId: string;
  branchName?: string;
  assignedToId?: string;
  assignedToName?: string;
  modelName: string;
  variantName?: string;
  source: string;
  status: 'NEW' | 'CONTACTED' | 'INTERESTED' | 'TEST_RIDE' | 'QUOTATION' | 'NEGOTIATION' | 'BOOKED' | 'CONVERTED' | 'LOST';
  priority: 'HOT' | 'WARM' | 'COLD';
  estimatedValue?: number;
  expectedPurchaseDate?: string;
  lostReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FollowUpRecord {
  id: string;
  leadId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  interestedModel: string;
  branchId: string;
  assignedToId: string;
  assignedToName: string;
  type: 'CALL' | 'WHATSAPP' | 'VISIT' | 'MEETING' | 'OTHER';
  status: 'PENDING' | 'COMPLETED' | 'MISSED' | 'RESCHEDULED';
  scheduledAt: string; // ISO date string
  completedAt?: string;
  notes: string;
  customerResponse?: string;
  nextFollowUpDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WalkInRecord {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  branchId: string;
  assignedToId?: string;
  assignedToName?: string;
  purpose: 'NEW_PURCHASE' | 'TEST_RIDE' | 'SERVICE' | 'GENERAL_INQUIRY';
  interestedModel?: string;
  status: 'WAITING' | 'ASSIGNED' | 'IN_DISCUSSION' | 'TEST_RIDE' | 'COMPLETED' | 'LEFT';
  entryTime: string;
  exitTime?: string;
  notes?: string;
  createdAt: string;
}

export interface TestRideRecord {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  leadId?: string;
  branchId: string;
  vehicleModel: string;
  executiveId?: string;
  executiveName?: string;
  scheduledAt: string;
  completedAt?: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  feedback?: string;
  remarks?: string;
  createdAt: string;
}

export interface AppointmentRecord {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  branchId: string;
  assignedToId?: string;
  assignedToName?: string;
  type: 'SALES_CONSULTATION' | 'TEST_RIDE' | 'SERVICE_CHECKIN' | 'VEHICLE_DELIVERY';
  scheduledAt: string;
  durationMinutes: number;
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  notes?: string;
  createdAt: string;
}

// -------------------------------------------------------------
// IN-MEMORY & GLOBALTHIS SEED REPOSITORY
// -------------------------------------------------------------

const globalForCrm = globalThis as unknown as {
  __shreejiCustomersDb?: CustomerRecord[];
  __shreejiLeadsDb?: LeadRecord[];
  __shreejiFollowUpsDb?: FollowUpRecord[];
  __shreejiWalkinsDb?: WalkInRecord[];
  __shreejiTestRidesDb?: TestRideRecord[];
  __shreejiTimelinesDb?: CustomerTimelineItem[];
};

let defaultCustomers: CustomerRecord[] = [
  {
    id: 'c_01',
    customerCode: 'SHR-C1001',
    name: 'Ramesh Patel',
    phone: '+91 98765 43210',
    altPhone: '+91 98765 43211',
    email: 'ramesh.patel@gmail.com',
    address: 'Block A-102, Gokul Heights, Station Road',
    city: 'Halvad',
    state: 'Gujarat',
    pincode: '363330',
    preferredContact: 'WHATSAPP',
    source: 'WALK_IN',
    branchId: 'br_halvad',
    branchName: 'Halvad Branch',
    status: 'ACTIVE',
    notes: 'Long time Hero loyalist. Owns Splendor Plus. Looking for 1st bike for son.',
    createdAt: '2023-04-10T10:00:00.000Z',
    updatedAt: '2024-05-15T12:00:00.000Z',
  },
  {
    id: 'c_02',
    customerCode: 'SHR-C1002',
    name: 'Rahul Sharma',
    phone: '+91 98765 43220',
    altPhone: '',
    email: 'rahul.sharma@yahoo.com',
    address: 'Near Old Bus Stand, Main Bazar',
    city: 'Halvad',
    state: 'Gujarat',
    pincode: '363330',
    preferredContact: 'PHONE',
    source: 'WEBSITE',
    branchId: 'br_halvad',
    branchName: 'Halvad Branch',
    status: 'ACTIVE',
    notes: 'Interested in exchange bonus for 2018 Splendor against Splendor+ XTEC.',
    createdAt: '2024-05-01T09:30:00.000Z',
    updatedAt: '2024-05-15T11:00:00.000Z',
  },
  {
    id: 'c_03',
    customerCode: 'SHR-C1003',
    name: 'Neha Gupta',
    phone: '+91 98765 43230',
    email: 'neha.gupta@outlook.com',
    address: 'Plot 45, Sardar Nagar',
    city: 'Halvad',
    state: 'Gujarat',
    pincode: '363330',
    preferredContact: 'PHONE',
    source: 'WALK_IN',
    branchId: 'br_halvad',
    branchName: 'Halvad Branch',
    status: 'ACTIVE',
    notes: 'Took test ride of Xtreme 160R 4V. Exploring 2-year EMI scheme.',
    createdAt: '2024-05-10T14:15:00.000Z',
    updatedAt: '2024-05-14T16:45:00.000Z',
  },
  {
    id: 'c_04',
    customerCode: 'SHR-C1004',
    name: 'Dinesh Kumar',
    phone: '+91 98765 43240',
    email: 'dinesh.k@gmail.com',
    address: 'Kalyan Nagar, Near Highway Circle',
    city: 'Halvad',
    state: 'Gujarat',
    pincode: '363330',
    preferredContact: 'PHONE',
    source: 'WALK_IN',
    branchId: 'br_halvad',
    branchName: 'Halvad Branch',
    status: 'ACTIVE',
    notes: 'Walk-in inquiry for Xpulse 200 4V touring accessories.',
    createdAt: '2024-05-16T10:45:00.000Z',
    updatedAt: '2024-05-16T10:45:00.000Z',
  },
];

let defaultTimelines: CustomerTimelineItem[] = [
  {
    id: 'tl_01',
    customerId: 'c_01',
    type: 'SALE',
    title: 'Vehicle Purchase Completed',
    description: 'Purchased Hero Splendor Plus (GJ-36-AB-1234) with 5-year extended warranty.',
    actorName: 'Amit Verma (Sales)',
    createdAt: '2023-04-15T14:30:00.000Z',
  },
  {
    id: 'tl_02',
    customerId: 'c_01',
    type: 'SERVICE',
    title: 'Free Service #3 Completed',
    description: 'General check-up, engine oil flush, brake tuning (#JC-8899). Total Bill: ₹0 (Free Coupon).',
    actorName: 'Kiran Solanki (Service Advisor)',
    createdAt: '2024-02-10T11:00:00.000Z',
  },
  {
    id: 'tl_03',
    customerId: 'c_02',
    type: 'INQUIRY',
    title: 'Online Web Lead Inward',
    description: 'Expressed interest in Hero Splendor Plus XTEC (Black Nexus Blue).',
    actorName: 'Web Portal Integration',
    createdAt: '2024-05-01T09:30:00.000Z',
  },
  {
    id: 'tl_04',
    customerId: 'c_02',
    type: 'FOLLOW_UP',
    title: 'Follow-up Call Completed',
    description: 'Customer requested exchange valuation for old 2018 Splendor.',
    actorName: 'Amit Verma (Sales)',
    createdAt: '2024-05-05T15:00:00.000Z',
  },
  {
    id: 'tl_05',
    customerId: 'c_03',
    type: 'TEST_RIDE',
    title: 'Test Ride Completed',
    description: 'Completed 5km road test of Xtreme 160R 4V with Executive Rahul Joshi.',
    actorName: 'Rahul Joshi (Sales)',
    createdAt: '2024-05-12T16:00:00.000Z',
  },
];

let defaultLeads: LeadRecord[] = [
  {
    id: 'ld_01',
    leadCode: 'LD-2024-001',
    customerId: 'c_02',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 43220',
    branchId: 'br_halvad',
    branchName: 'Halvad Branch',
    assignedToId: 'usr_sales_amit',
    assignedToName: 'Amit Verma',
    modelName: 'Hero Splendor Plus XTEC',
    variantName: 'Disc Self Cast',
    source: 'WEBSITE',
    status: 'INTERESTED',
    priority: 'HOT',
    estimatedValue: 79500,
    expectedPurchaseDate: '2024-05-25',
    notes: 'Wants 2-year finance quote. Exchange bonus applicable for 2018 Splendor.',
    createdAt: '2024-05-01T09:30:00.000Z',
    updatedAt: '2024-05-15T11:00:00.000Z',
  },
  {
    id: 'ld_02',
    leadCode: 'LD-2024-002',
    customerId: 'c_03',
    customerName: 'Neha Gupta',
    customerPhone: '+91 98765 43230',
    branchId: 'br_halvad',
    branchName: 'Halvad Branch',
    assignedToId: 'usr_sales_amit',
    assignedToName: 'Amit Verma',
    modelName: 'Hero Xtreme 160R 4V',
    variantName: 'Double Disc ABS',
    source: 'WALK_IN',
    status: 'TEST_RIDE',
    priority: 'HOT',
    estimatedValue: 128000,
    expectedPurchaseDate: '2024-05-20',
    notes: 'Loved the acceleration during test ride. Deciding between Sports Red & Matte Blue.',
    createdAt: '2024-05-10T14:15:00.000Z',
    updatedAt: '2024-05-14T16:45:00.000Z',
  },
  {
    id: 'ld_03',
    leadCode: 'LD-2024-003',
    customerId: 'c_04',
    customerName: 'Dinesh Kumar',
    customerPhone: '+91 98765 43240',
    branchId: 'br_halvad',
    branchName: 'Halvad Branch',
    assignedToId: 'usr_sales_amit',
    assignedToName: 'Amit Verma',
    modelName: 'Hero Xpulse 200 4V',
    variantName: 'Pro Edition',
    source: 'WALK_IN',
    status: 'CONTACTED',
    priority: 'HOT',
    estimatedValue: 152000,
    expectedPurchaseDate: '2024-06-01',
    notes: 'Touring enthusiast. Inquiring on delivery timeline and pannier luggage mounts.',
    createdAt: '2024-05-16T10:45:00.000Z',
    updatedAt: '2024-05-16T10:45:00.000Z',
  },
  {
    id: 'ld_04',
    leadCode: 'LD-2024-004',
    customerId: 'c_01',
    customerName: 'Ramesh Patel',
    customerPhone: '+91 98765 43210',
    branchId: 'br_halvad',
    branchName: 'Halvad Branch',
    assignedToId: 'usr_sales_amit',
    assignedToName: 'Amit Verma',
    modelName: 'Hero Passion Pro',
    variantName: 'Disc Self Cast',
    source: 'REFERRAL',
    status: 'QUOTATION',
    priority: 'WARM',
    estimatedValue: 74000,
    expectedPurchaseDate: '2024-05-30',
    notes: 'College commute bike for son. Full cash payment planned.',
    createdAt: '2024-05-08T11:00:00.000Z',
    updatedAt: '2024-05-12T14:20:00.000Z',
  },
];

let defaultFollowUps: FollowUpRecord[] = [
  {
    id: 'fu_01',
    leadId: 'ld_01',
    customerId: 'c_02',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 43220',
    interestedModel: 'Hero Splendor Plus XTEC',
    branchId: 'br_halvad',
    assignedToId: 'usr_sales_amit',
    assignedToName: 'Amit Verma',
    type: 'CALL',
    status: 'PENDING',
    scheduledAt: new Date().toISOString(),
    notes: 'Call to share the ₹4,000 Hero exchange bonus quotation.',
    createdAt: '2024-05-15T10:00:00.000Z',
    updatedAt: '2024-05-15T10:00:00.000Z',
  },
  {
    id: 'fu_02',
    leadId: 'ld_02',
    customerId: 'c_03',
    customerName: 'Neha Gupta',
    customerPhone: '+91 98765 43230',
    interestedModel: 'Hero Xtreme 160R 4V',
    branchId: 'br_halvad',
    assignedToId: 'usr_sales_amit',
    assignedToName: 'Amit Verma',
    type: 'WHATSAPP',
    status: 'PENDING',
    scheduledAt: new Date().toISOString(),
    notes: 'Send PDF brochure of Matte Blue color scheme and EMI calculation table.',
    createdAt: '2024-05-14T16:00:00.000Z',
    updatedAt: '2024-05-14T16:00:00.000Z',
  },
  {
    id: 'fu_03',
    leadId: 'ld_04',
    customerId: 'c_01',
    customerName: 'Ramesh Patel',
    customerPhone: '+91 98765 43210',
    interestedModel: 'Hero Passion Pro',
    branchId: 'br_halvad',
    assignedToId: 'usr_sales_amit',
    assignedToName: 'Amit Verma',
    type: 'VISIT',
    status: 'PENDING',
    scheduledAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday (Overdue)
    notes: 'Schedule family visit to showroom for color finalization.',
    createdAt: '2024-05-13T10:00:00.000Z',
    updatedAt: '2024-05-13T10:00:00.000Z',
  },
];

let defaultWalkIns: WalkInRecord[] = [
  {
    id: 'wi_01',
    customerId: 'c_04',
    customerName: 'Dinesh Kumar',
    customerPhone: '+91 98765 43240',
    branchId: 'br_halvad',
    assignedToId: 'usr_sales_amit',
    assignedToName: 'Amit Verma',
    purpose: 'NEW_PURCHASE',
    interestedModel: 'Hero Xpulse 200 4V',
    status: 'IN_DISCUSSION',
    entryTime: '10:45 AM',
    notes: 'Interested in Xpulse 200 pro edition.',
    createdAt: '2024-05-16T10:45:00.000Z',
  },
  {
    id: 'wi_02',
    customerId: 'c_03',
    customerName: 'Neha Gupta',
    customerPhone: '+91 98765 43230',
    branchId: 'br_halvad',
    assignedToId: 'usr_sales_amit',
    assignedToName: 'Amit Verma',
    purpose: 'TEST_RIDE',
    interestedModel: 'Hero Xtreme 160R 4V',
    status: 'TEST_RIDE',
    entryTime: '11:00 AM',
    notes: 'Taking test ride with executive.',
    createdAt: '2024-05-16T11:00:00.000Z',
  },
  {
    id: 'wi_03',
    customerId: 'c_01',
    customerName: 'Ramesh Patel',
    customerPhone: '+91 98765 43210',
    branchId: 'br_halvad',
    purpose: 'SERVICE',
    interestedModel: 'Hero Splendor Plus',
    status: 'WAITING',
    entryTime: '11:15 AM',
    notes: 'Waiting in lounge for service check-in.',
    createdAt: '2024-05-16T11:15:00.000Z',
  },
];

let defaultTestRides: TestRideRecord[] = [
  {
    id: 'tr_01',
    customerId: 'c_03',
    customerName: 'Neha Gupta',
    customerPhone: '+91 98765 43230',
    leadId: 'ld_02',
    branchId: 'br_halvad',
    vehicleModel: 'Hero Xtreme 160R 4V',
    executiveId: 'usr_sales_amit',
    executiveName: 'Amit Verma',
    scheduledAt: '2024-05-16T11:00:00.000Z',
    status: 'CONFIRMED',
    remarks: 'Driving license verified.',
    createdAt: '2024-05-15T12:00:00.000Z',
  },
  {
    id: 'tr_02',
    customerId: 'c_04',
    customerName: 'Dinesh Kumar',
    customerPhone: '+91 98765 43240',
    leadId: 'ld_03',
    branchId: 'br_halvad',
    vehicleModel: 'Hero Xpulse 200 4V',
    executiveId: 'usr_sales_amit',
    executiveName: 'Amit Verma',
    scheduledAt: '2024-05-17T15:30:00.000Z',
    status: 'SCHEDULED',
    remarks: 'Off-road demo ride requested.',
    createdAt: '2024-05-16T11:15:00.000Z',
  },
];

if (!globalForCrm.__shreejiCustomersDb) globalForCrm.__shreejiCustomersDb = defaultCustomers;
if (!globalForCrm.__shreejiTimelinesDb) globalForCrm.__shreejiTimelinesDb = defaultTimelines;
if (!globalForCrm.__shreejiLeadsDb) globalForCrm.__shreejiLeadsDb = defaultLeads;
if (!globalForCrm.__shreejiFollowUpsDb) globalForCrm.__shreejiFollowUpsDb = defaultFollowUps;
if (!globalForCrm.__shreejiWalkinsDb) globalForCrm.__shreejiWalkinsDb = defaultWalkIns;
if (!globalForCrm.__shreejiTestRidesDb) globalForCrm.__shreejiTestRidesDb = defaultTestRides;

const customersDb = globalForCrm.__shreejiCustomersDb;
const timelinesDb = globalForCrm.__shreejiTimelinesDb;
const leadsDb = globalForCrm.__shreejiLeadsDb;
const followUpsDb = globalForCrm.__shreejiFollowUpsDb;
const walkInsDb = globalForCrm.__shreejiWalkinsDb;
const testRidesDb = globalForCrm.__shreejiTestRidesDb;

// -------------------------------------------------------------
// STORE METHODS (CRUD + Duplicate Prevention + Business Logic)
// -------------------------------------------------------------

export async function findCustomerByPhone(phone: string): Promise<CustomerRecord | null> {
  const clean = phone.replace(/[^0-9]/g, '').slice(-10);
  const found = customersDb.find((c) => c.phone.replace(/[^0-9]/g, '').slice(-10) === clean);
  return found || null;
}

export async function findCustomerById(id: string): Promise<CustomerRecord | null> {
  return customersDb.find((c) => c.id === id) || null;
}

export const getCustomerById = findCustomerById;
export const appendCustomerTimeline = addTimelineEntry;

export async function getCustomers(filter?: {
  branchId?: string | null;
  search?: string;
  limit?: number;
}): Promise<CustomerRecord[]> {
  let result = [...customersDb];

  if (filter?.branchId) {
    result = result.filter((c) => c.branchId === filter.branchId);
  }

  if (filter?.search) {
    const q = filter.search.toLowerCase().trim();
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.customerCode.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
    );
  }

  return result;
}

export async function createCustomer(data: {
  name: string;
  phone: string;
  altPhone?: string;
  email?: string;
  address: string;
  city: string;
  state?: string;
  pincode: string;
  branchId: string;
  preferredContact?: 'PHONE' | 'WHATSAPP' | 'EMAIL';
  source?: string;
  notes?: string;
  actorName?: string;
}): Promise<CustomerRecord> {
  // Check Duplicate by 10-digit mobile number
  const existing = await findCustomerByPhone(data.phone);
  if (existing) {
    throw new Error(`Customer with mobile ${data.phone} already exists (${existing.name} — ${existing.customerCode}).`);
  }

  const customerCode = `SHR-C${1000 + customersDb.length + 1}`;
  const now = new Date().toISOString();

  const newCustomer: CustomerRecord = {
    id: `c_${Date.now()}`,
    customerCode,
    name: data.name,
    phone: data.phone,
    altPhone: data.altPhone,
    email: data.email,
    address: data.address,
    city: data.city,
    state: data.state || 'Gujarat',
    pincode: data.pincode,
    preferredContact: data.preferredContact || 'PHONE',
    source: data.source || 'WALK_IN',
    branchId: data.branchId,
    branchName: 'Halvad Branch',
    status: 'ACTIVE',
    notes: data.notes,
    createdAt: now,
    updatedAt: now,
  };

  customersDb.unshift(newCustomer);

  // Add initial timeline item
  timelinesDb.unshift({
    id: `tl_${Date.now()}`,
    customerId: newCustomer.id,
    type: 'INQUIRY',
    title: 'Customer Registered',
    description: `Customer profile created with source: ${newCustomer.source}`,
    actorName: data.actorName || 'System',
    createdAt: now,
  });

  return newCustomer;
}

export async function updateCustomer(
  id: string,
  data: Partial<CustomerRecord>,
  actorName: string = 'System'
): Promise<CustomerRecord> {
  const customer = customersDb.find((c) => c.id === id);
  if (!customer) throw new Error('Customer not found');

  Object.assign(customer, data, { updatedAt: new Date().toISOString() });

  timelinesDb.unshift({
    id: `tl_${Date.now()}`,
    customerId: id,
    type: 'NOTE',
    title: 'Profile Updated',
    description: 'Customer contact details or address updated.',
    actorName,
    createdAt: new Date().toISOString(),
  });

  return customer;
}

export async function getCustomerTimeline(customerId: string): Promise<CustomerTimelineItem[]> {
  return timelinesDb
    .filter((t) => t.customerId === customerId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function addTimelineEntry(entry: {
  customerId: string;
  type:
    | 'INQUIRY'
    | 'FOLLOW_UP'
    | 'TEST_RIDE'
    | 'QUOTATION'
    | 'BOOKING'
    | 'SALE'
    | 'SERVICE'
    | 'PAYMENT'
    | 'PDI'
    | 'DELIVERY'
    | 'REFUND'
    | 'NOTE';
  title: string;
  description: string;
  actorName: string;
  metadata?: Record<string, any>;
}): Promise<CustomerTimelineItem> {
  const item: CustomerTimelineItem = {
    id: `tl_${Date.now()}`,
    customerId: entry.customerId,
    type: entry.type,
    title: entry.title,
    description: entry.description,
    actorName: entry.actorName,
    metadata: entry.metadata,
    createdAt: new Date().toISOString(),
  };
  timelinesDb.unshift(item);
  return item;
}

// -------------------------------------------------------------
// LEADS STORE METHODS
// -------------------------------------------------------------

export async function getLeads(filter?: {
  branchId?: string | null;
  assignedToId?: string;
  status?: string;
}): Promise<LeadRecord[]> {
  let result = [...leadsDb];
  if (filter?.branchId) {
    result = result.filter((l) => l.branchId === filter.branchId);
  }
  if (filter?.assignedToId) {
    result = result.filter((l) => l.assignedToId === filter.assignedToId);
  }
  if (filter?.status) {
    result = result.filter((l) => l.status === filter.status);
  }
  return result;
}

export async function createLead(data: {
  customerId: string;
  customerName: string;
  customerPhone: string;
  branchId: string;
  assignedToId?: string;
  assignedToName?: string;
  modelName: string;
  variantName?: string;
  priority?: 'HOT' | 'WARM' | 'COLD';
  estimatedValue?: number;
  expectedPurchaseDate?: string;
  source?: string;
  notes?: string;
  actorName?: string;
}): Promise<LeadRecord> {
  const leadCode = `LD-${new Date().getFullYear()}-${100 + leadsDb.length + 1}`;
  const now = new Date().toISOString();

  const newLead: LeadRecord = {
    id: `ld_${Date.now()}`,
    leadCode,
    customerId: data.customerId,
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    branchId: data.branchId,
    assignedToId: data.assignedToId,
    assignedToName: data.assignedToName,
    modelName: data.modelName,
    variantName: data.variantName,
    source: data.source || 'WALK_IN',
    status: 'NEW',
    priority: data.priority || 'HOT',
    estimatedValue: data.estimatedValue || 75000,
    expectedPurchaseDate: data.expectedPurchaseDate,
    notes: data.notes,
    createdAt: now,
    updatedAt: now,
  };

  leadsDb.unshift(newLead);

  // Add Customer Timeline Entry
  await addTimelineEntry({
    customerId: data.customerId,
    type: 'INQUIRY',
    title: `Sales Lead Created: ${data.modelName}`,
    description: `Lead #${leadCode} logged with priority ${newLead.priority}. Assigned to: ${data.assignedToName || 'Unassigned'}.`,
    actorName: data.actorName || 'System',
  });

  // Auto-schedule 1st Follow-up
  if (data.assignedToId) {
    followUpsDb.unshift({
      id: `fu_${Date.now()}`,
      leadId: newLead.id,
      customerId: data.customerId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      interestedModel: data.modelName,
      branchId: data.branchId,
      assignedToId: data.assignedToId,
      assignedToName: data.assignedToName || 'Sales Executive',
      type: 'CALL',
      status: 'PENDING',
      scheduledAt: new Date(Date.now() + 3600000 * 24).toISOString(), // Tomorrow
      notes: `First discovery call for ${data.modelName}.`,
      createdAt: now,
      updatedAt: now,
    });
  }

  return newLead;
}

export async function updateLeadStatus(
  leadId: string,
  nextStatus: LeadRecord['status'],
  actorName: string = 'System'
): Promise<LeadRecord> {
  const lead = leadsDb.find((l) => l.id === leadId);
  if (!lead) throw new Error('Lead not found');

  const oldStatus = lead.status;
  lead.status = nextStatus;
  lead.updatedAt = new Date().toISOString();

  await addTimelineEntry({
    customerId: lead.customerId,
    type: nextStatus === 'BOOKED' ? 'BOOKING' : 'NOTE',
    title: `Lead Status: ${nextStatus.replace(/_/g, ' ')}`,
    description: `Lead #${lead.leadCode} moved from ${oldStatus} to ${nextStatus}.`,
    actorName,
  });

  return lead;
}

export async function assignLead(
  leadId: string,
  assignedToId: string,
  assignedToName: string,
  actorName: string = 'Manager'
): Promise<LeadRecord> {
  const lead = leadsDb.find((l) => l.id === leadId);
  if (!lead) throw new Error('Lead not found');

  lead.assignedToId = assignedToId;
  lead.assignedToName = assignedToName;
  lead.updatedAt = new Date().toISOString();

  await addTimelineEntry({
    customerId: lead.customerId,
    type: 'NOTE',
    title: 'Lead Reassigned',
    description: `Lead #${lead.leadCode} assigned to Sales Executive ${assignedToName}.`,
    actorName,
  });

  return lead;
}

// -------------------------------------------------------------
// FOLLOW-UPS STORE METHODS
// -------------------------------------------------------------

export async function getFollowUps(filter?: {
  branchId?: string | null;
  assignedToId?: string;
  scope?: 'DUE_TODAY' | 'OVERDUE' | 'UPCOMING' | 'COMPLETED';
}): Promise<FollowUpRecord[]> {
  let result = [...followUpsDb];

  if (filter?.branchId) {
    result = result.filter((f) => f.branchId === filter.branchId);
  }
  if (filter?.assignedToId) {
    result = result.filter((f) => f.assignedToId === filter.assignedToId);
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const todayEnd = todayStart + 86400000;

  if (filter?.scope === 'DUE_TODAY') {
    result = result.filter((f) => {
      const t = new Date(f.scheduledAt).getTime();
      return f.status === 'PENDING' && t >= todayStart && t <= todayEnd;
    });
  } else if (filter?.scope === 'OVERDUE') {
    result = result.filter((f) => {
      const t = new Date(f.scheduledAt).getTime();
      return f.status === 'PENDING' && t < todayStart;
    });
  } else if (filter?.scope === 'UPCOMING') {
    result = result.filter((f) => {
      const t = new Date(f.scheduledAt).getTime();
      return f.status === 'PENDING' && t > todayEnd;
    });
  } else if (filter?.scope === 'COMPLETED') {
    result = result.filter((f) => f.status === 'COMPLETED');
  }

  return result;
}

export async function completeFollowUp(
  id: string,
  data: {
    customerResponse: string;
    nextFollowUpDate?: string;
    actorName?: string;
  }
): Promise<FollowUpRecord> {
  const fu = followUpsDb.find((f: FollowUpRecord) => f.id === id);
  if (!fu) throw new Error('Follow-up record not found');

  const now = new Date().toISOString();
  fu.status = 'COMPLETED';
  fu.completedAt = now;
  fu.customerResponse = data.customerResponse;
  fu.nextFollowUpDate = data.nextFollowUpDate;
  fu.updatedAt = now;

  await addTimelineEntry({
    customerId: fu.customerId,
    type: 'FOLLOW_UP',
    title: 'Customer Follow-Up Completed',
    description: `Response: ${data.customerResponse}`,
    actorName: data.actorName || fu.assignedToName,
  });

  // If next follow-up date is provided, schedule it automatically
  if (data.nextFollowUpDate) {
    followUpsDb.unshift({
      id: `fu_${Date.now()}`,
      leadId: fu.leadId,
      customerId: fu.customerId,
      customerName: fu.customerName,
      customerPhone: fu.customerPhone,
      interestedModel: fu.interestedModel,
      branchId: fu.branchId,
      assignedToId: fu.assignedToId,
      assignedToName: fu.assignedToName,
      type: fu.type,
      status: 'PENDING',
      scheduledAt: data.nextFollowUpDate,
      notes: `Next scheduled callback. Previous note: ${data.customerResponse}`,
      createdAt: now,
      updatedAt: now,
    });
  }

  return fu;
}

// -------------------------------------------------------------
// WALK-IN & TEST RIDE STORE METHODS
// -------------------------------------------------------------

export async function getWalkIns(branchId?: string | null): Promise<WalkInRecord[]> {
  let result = [...walkInsDb];
  if (branchId) {
    result = result.filter((w) => w.branchId === branchId);
  }
  return result;
}

export async function registerWalkIn(data: {
  customerName: string;
  customerPhone: string;
  purpose: WalkInRecord['purpose'];
  interestedModel?: string;
  branchId: string;
  assignedToId?: string;
  assignedToName?: string;
  notes?: string;
}): Promise<WalkInRecord> {
  // Search or create customer
  let customer = await findCustomerByPhone(data.customerPhone);
  if (!customer) {
    customer = await createCustomer({
      name: data.customerName,
      phone: data.customerPhone,
      address: 'Showroom Walk-in',
      city: 'Halvad',
      pincode: '363330',
      branchId: data.branchId,
      source: 'WALK_IN',
    });
  }

  const now = new Date().toISOString();
  const newWalkIn: WalkInRecord = {
    id: `wi_${Date.now()}`,
    customerId: customer.id,
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    branchId: data.branchId,
    assignedToId: data.assignedToId,
    assignedToName: data.assignedToName,
    purpose: data.purpose,
    interestedModel: data.interestedModel,
    status: data.assignedToId ? 'ASSIGNED' : 'WAITING',
    entryTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    notes: data.notes,
    createdAt: now,
  };

  walkInsDb.unshift(newWalkIn);

  await addTimelineEntry({
    customerId: customer.id,
    type: 'INQUIRY',
    title: 'Showroom Walk-In Registered',
    description: `Purpose: ${data.purpose.replace(/_/g, ' ')} • Model: ${data.interestedModel || 'N/A'}.`,
    actorName: 'Front Desk',
  });

  return newWalkIn;
}

export async function updateWalkInStatus(
  id: string,
  status: WalkInRecord['status']
): Promise<WalkInRecord> {
  const wi = walkInsDb.find((w) => w.id === id);
  if (!wi) throw new Error('Walk-in record not found');

  wi.status = status;
  if (status === 'COMPLETED' || status === 'LEFT') {
    wi.exitTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return wi;
}

export async function getTestRides(branchId?: string | null): Promise<TestRideRecord[]> {
  let result = [...testRidesDb];
  if (branchId) {
    result = result.filter((t) => t.branchId === branchId);
  }
  return result;
}

export async function scheduleTestRide(data: {
  customerId: string;
  customerName: string;
  customerPhone: string;
  leadId?: string;
  branchId: string;
  vehicleModel: string;
  executiveId?: string;
  executiveName?: string;
  scheduledAt: string;
  remarks?: string;
  actorName?: string;
}): Promise<TestRideRecord> {
  const newTestRide: TestRideRecord = {
    id: `tr_${Date.now()}`,
    customerId: data.customerId,
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    leadId: data.leadId,
    branchId: data.branchId,
    vehicleModel: data.vehicleModel,
    executiveId: data.executiveId,
    executiveName: data.executiveName,
    scheduledAt: data.scheduledAt,
    status: 'SCHEDULED',
    remarks: data.remarks,
    createdAt: new Date().toISOString(),
  };

  testRidesDb.unshift(newTestRide);

  await addTimelineEntry({
    customerId: data.customerId,
    type: 'TEST_RIDE',
    title: `Test Ride Scheduled: ${data.vehicleModel}`,
    description: `Reserved on ${new Date(data.scheduledAt).toLocaleDateString()} with Executive ${data.executiveName || 'Assigned Staff'}.`,
    actorName: data.actorName || 'Sales Desk',
  });

  return newTestRide;
}

export async function completeTestRide(
  id: string,
  data: {
    status: 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
    feedback?: string;
    actorName?: string;
  }
): Promise<TestRideRecord> {
  const tr = testRidesDb.find((t) => t.id === id);
  if (!tr) throw new Error('Test ride record not found');

  tr.status = data.status;
  tr.feedback = data.feedback;
  tr.completedAt = new Date().toISOString();

  await addTimelineEntry({
    customerId: tr.customerId,
    type: 'TEST_RIDE',
    title: `Test Ride ${data.status.replace(/_/g, ' ')}: ${tr.vehicleModel}`,
    description: data.feedback ? `Customer feedback: ${data.feedback}` : `Outcome: ${data.status}`,
    actorName: data.actorName || 'Sales Consultant',
  });

  return tr;
}
