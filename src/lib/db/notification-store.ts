// Shreeji Hero Showroom ERP - Notifications, Messaging & Customer Engagement Store

import { Role } from '@/types';

export interface InternalNotificationRecord {
  id: string;
  title: string;
  message: string;
  priority: 'INFO' | 'NORMAL' | 'IMPORTANT' | 'CRITICAL';
  module: 'SALES' | 'SERVICE' | 'FINANCE' | 'INVENTORY' | 'CRM' | 'SYSTEM';
  recordId?: string;
  targetRole?: Role;
  userId?: string;
  branchId?: string;
  isRead: boolean;
  linkUrl: string;
  createdAt: string;
}

export interface CustomerNotificationRecord {
  id: string;
  customerId: string;
  title: string;
  message: string;
  module: 'SALES' | 'SERVICE' | 'FINANCE' | 'GENERAL';
  isRead: boolean;
  createdAt: string;
}

export interface CustomerPreferenceRecord {
  customerId: string;
  allowWhatsapp: boolean;
  allowSms: boolean;
  allowEmail: boolean;
  allowPortal: boolean;
  updatedAt: string;
}

// -------------------------------------------------------------
// IN-MEMORY SEED DATASETS
// -------------------------------------------------------------

let notificationsDb: InternalNotificationRecord[] = [
  {
    id: 'notif_01',
    title: 'Booking Approval Required',
    message: 'New booking #BK-2024-002 for Hero Xtreme 160R (Neha Gupta) awaits Showroom Manager approval.',
    priority: 'IMPORTANT',
    module: 'SALES',
    recordId: 'bk_02',
    targetRole: 'SHOWROOM_MANAGER',
    branchId: 'br_halvad',
    isRead: false,
    linkUrl: '/sales',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: 'notif_02',
    title: 'Critical Low Stock: Front Brake Shoes',
    message: 'Front Brake Shoe Set (SP-BRK-102) has fallen to 6 units (Min threshold: 15). Reorder suggested.',
    priority: 'CRITICAL',
    module: 'INVENTORY',
    recordId: 'sp_02',
    targetRole: 'INVENTORY_MANAGER',
    branchId: 'br_halvad',
    isRead: false,
    linkUrl: '/inventory',
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
  },
  {
    id: 'notif_03',
    title: 'Customer Additional Work Approval Pending',
    message: 'Job Card #JC-8902 (Rahul Sharma) awaiting approval for Chain & Sprocket Replacement (₹1,450).',
    priority: 'IMPORTANT',
    module: 'SERVICE',
    recordId: 'jc_02',
    targetRole: 'SERVICE_ADVISOR',
    branchId: 'br_halvad',
    isRead: false,
    linkUrl: '/service',
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
  },
  {
    id: 'notif_04',
    title: 'New Counter Payment Recorded',
    message: 'Receipt #PAY-2024-004 of ₹280 received for Workshop Invoice #SR-INV-2024-7001.',
    priority: 'NORMAL',
    module: 'FINANCE',
    recordId: 'pay_04',
    targetRole: 'ACCOUNTANT',
    branchId: 'br_halvad',
    isRead: true,
    linkUrl: '/finance',
    createdAt: new Date(Date.now() - 180 * 60000).toISOString(),
  },
  {
    id: 'notif_05',
    title: 'Overdue Follow-Up Reminder',
    message: 'Hot Lead #LD-2026-001 (Ramesh Patel - Hero Splendor Plus) follow-up call is due today.',
    priority: 'IMPORTANT',
    module: 'CRM',
    recordId: 'ld_01',
    targetRole: 'SALES_EXECUTIVE',
    branchId: 'br_halvad',
    isRead: false,
    linkUrl: '/leads',
    createdAt: new Date(Date.now() - 240 * 60000).toISOString(),
  },
];

let customerNotificationsDb: CustomerNotificationRecord[] = [
  {
    id: 'cnotif_01',
    customerId: 'c_02',
    title: '🎉 Vehicle Booking Confirmed!',
    message: 'Your booking #BK-2024-001 for Hero Splendor Plus is confirmed. Pre-Delivery Inspection is scheduled.',
    module: 'SALES',
    isRead: false,
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
  },
  {
    id: 'cnotif_02',
    customerId: 'c_04',
    title: '🔧 Workshop Quality Check Passed',
    message: 'Your Hero Xpulse 200 4V service has passed quality testing and is ready for pickup at Halvad Workshop.',
    module: 'SERVICE',
    isRead: false,
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
  },
];

let preferencesDb: Record<string, CustomerPreferenceRecord> = {
  c_01: {
    customerId: 'c_01',
    allowWhatsapp: true,
    allowSms: true,
    allowEmail: true,
    allowPortal: true,
    updatedAt: new Date().toISOString(),
  },
};

// -------------------------------------------------------------
// STORE METHODS
// -------------------------------------------------------------

export async function getInternalNotifications(filter?: {
  role?: Role;
  userId?: string;
  branchId?: string | null;
  module?: string;
  unreadOnly?: boolean;
}): Promise<InternalNotificationRecord[]> {
  let result = [...notificationsDb];

  if (filter?.role && filter.role !== 'ADMIN') {
    result = result.filter(
      (n) => !n.targetRole || n.targetRole === filter.role || n.userId === filter.userId
    );
  }

  if (filter?.branchId && filter.role !== 'ADMIN') {
    result = result.filter((n) => !n.branchId || n.branchId === filter.branchId);
  }

  if (filter?.module && filter.module !== 'ALL') {
    result = result.filter((n) => n.module === filter.module);
  }

  if (filter?.unreadOnly) {
    result = result.filter((n) => !n.isRead);
  }

  return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createInternalNotification(data: {
  title: string;
  message: string;
  priority?: InternalNotificationRecord['priority'];
  module: InternalNotificationRecord['module'];
  recordId?: string;
  targetRole?: Role;
  userId?: string;
  branchId?: string;
  linkUrl: string;
}): Promise<InternalNotificationRecord> {
  const newNotif: InternalNotificationRecord = {
    id: `notif_${Date.now()}`,
    title: data.title,
    message: data.message,
    priority: data.priority || 'NORMAL',
    module: data.module,
    recordId: data.recordId,
    targetRole: data.targetRole,
    userId: data.userId,
    branchId: data.branchId,
    isRead: false,
    linkUrl: data.linkUrl,
    createdAt: new Date().toISOString(),
  };

  notificationsDb.unshift(newNotif);
  return newNotif;
}

export async function markNotificationAsRead(id: string): Promise<boolean> {
  const notif = notificationsDb.find((n) => n.id === id);
  if (notif) {
    notif.isRead = true;
    return true;
  }
  return false;
}

export async function markAllNotificationsAsRead(userId?: string): Promise<number> {
  let count = 0;
  notificationsDb.forEach((n) => {
    if (!n.isRead) {
      n.isRead = true;
      count++;
    }
  });
  return count;
}

export async function getCustomerNotifications(customerId: string): Promise<CustomerNotificationRecord[]> {
  return customerNotificationsDb
    .filter((cn) => cn.customerId === customerId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createCustomerNotification(data: {
  customerId: string;
  title: string;
  message: string;
  module: CustomerNotificationRecord['module'];
}): Promise<CustomerNotificationRecord> {
  const newNotif: CustomerNotificationRecord = {
    id: `cnotif_${Date.now()}`,
    customerId: data.customerId,
    title: data.title,
    message: data.message,
    module: data.module,
    isRead: false,
    createdAt: new Date().toISOString(),
  };

  customerNotificationsDb.unshift(newNotif);
  return newNotif;
}

export async function getCustomerPreferences(customerId: string): Promise<CustomerPreferenceRecord> {
  if (!preferencesDb[customerId]) {
    preferencesDb[customerId] = {
      customerId,
      allowWhatsapp: true,
      allowSms: true,
      allowEmail: true,
      allowPortal: true,
      updatedAt: new Date().toISOString(),
    };
  }
  return preferencesDb[customerId];
}

export async function updateCustomerPreferences(
  customerId: string,
  prefs: Partial<CustomerPreferenceRecord>
): Promise<CustomerPreferenceRecord> {
  const current = await getCustomerPreferences(customerId);
  preferencesDb[customerId] = {
    ...current,
    ...prefs,
    updatedAt: new Date().toISOString(),
  };
  return preferencesDb[customerId];
}

// -------------------------------------------------------------
// DYNAMIC MESSAGE TEMPLATES
// -------------------------------------------------------------

export function getDynamicTemplates(params: {
  customerName?: string;
  vehicleModel?: string;
  bookingCode?: string;
  jobCardNumber?: string;
  invoiceNumber?: string;
  amount?: number;
  date?: string;
}) {
  const name = params.customerName || 'Customer';
  const bike = params.vehicleModel || 'Hero Two-Wheeler';
  const amt = params.amount ? `₹${params.amount.toLocaleString('en-IN')}` : '';

  return [
    {
      id: 'tmpl_booking_confirm',
      title: 'Booking Confirmation',
      channel: 'WHATSAPP',
      content: `Namaste ${name}! 🙏 Congratulations on booking your new ${bike} with Shreeji Hero Motors. Your Booking Reference is #${params.bookingCode || 'BK-1001'}. Our sales team will keep you updated on Pre-Delivery Inspection and delivery dates.`,
    },
    {
      id: 'tmpl_test_ride_reminder',
      title: 'Test Ride Scheduled',
      channel: 'WHATSAPP',
      content: `Hello ${name}, your scheduled test ride for the new ${bike} is confirmed for ${params.date || 'today'}. Please visit Shreeji Hero Showroom with your valid driving license. We look forward to seeing you! 🏍️`,
    },
    {
      id: 'tmpl_service_ready',
      title: 'Vehicle Service Ready for Pickup',
      channel: 'WHATSAPP',
      content: `Dear ${name}, your ${bike} (Job Card #${params.jobCardNumber || 'JC-8901'}) has completed service and passed our 7-point road safety quality check. Total Bill: ${amt}. It is ready for pickup at Shreeji Hero Workshop.`,
    },
    {
      id: 'tmpl_payment_receipt',
      title: 'Official Payment Receipt',
      channel: 'SMS',
      content: `Shreeji Hero: Received payment of ${amt} against Invoice #${params.invoiceNumber || 'INV-1001'}. Thank you for choosing Shreeji Hero Motors!`,
    },
    {
      id: 'tmpl_extra_approval',
      title: 'Additional Service Work Approval',
      channel: 'WHATSAPP',
      content: `Namaste ${name}, during technical inspection of your ${bike}, our workshop technician recommended additional repairs totaling ${amt}. Please review and approve to proceed with fitting genuine parts.`,
    },
  ];
}
