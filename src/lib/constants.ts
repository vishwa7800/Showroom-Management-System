// Shreeji Hero Showroom ERP - Global Constants, Navigation & Role Registries

import { Branch, Role } from '@/types';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Bike,
  Wrench,
  Package,
  CreditCard,
  FileBarChart,
  Settings,
  ShieldAlert,
  CalendarDays,
  Compass,
  AlertTriangle,
  FileText,
  Clock,
  ArrowRightLeft,
  Plus,
  Target,
  Building2,
  PhoneCall,
  CheckCircle,
} from 'lucide-react';

export const BRANCHES: Branch[] = [
  {
    id: 'br_halvad',
    code: 'SHR-HLV',
    name: 'Halvad Branch',
    address: 'National Highway 51, Near Dhrangadhra Circle',
    city: 'Halvad',
    state: 'Gujarat',
    pincode: '363330',
    phone: '+91 98765 43210',
    email: 'halvad@shreejihero.com',
    hasSales: true,
    hasService: true,
    status: 'ACTIVE',
  },
  {
    id: 'br_dhangadhra',
    code: 'SHR-DHN',
    name: 'Dhangadhra Branch',
    address: 'Station Road, Opposite City Mall',
    city: 'Dhangadhra',
    state: 'Gujarat',
    pincode: '363310',
    phone: '+91 98765 43211',
    email: 'dhangadhra@shreejihero.com',
    hasSales: true,
    hasService: true,
    status: 'ACTIVE',
  },
  {
    id: 'br_jetpur',
    code: 'SHR-JTP',
    name: 'Jetpur Branch',
    address: 'Junagadh Road, Near Sardar Patel Statue',
    city: 'Jetpur',
    state: 'Gujarat',
    pincode: '360370',
    phone: '+91 98765 43212',
    email: 'jetpur@shreejihero.com',
    hasSales: true,
    hasService: true,
    status: 'ACTIVE',
  },
];

export interface NavItem {
  title: string;
  href: string;
  icon: any;
  badge?: string;
  allowedRoles: Role[];
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const ERP_NAVIGATION_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        allowedRoles: [
          'ADMIN',
          'SHOWROOM_MANAGER',
          'SALES_EXECUTIVE',
          'FRONT_DESK',
          'SERVICE_MANAGER',
          'SERVICE_ADVISOR',
          'ACCOUNTANT',
          'INVENTORY_MANAGER',
        ],
      },
    ],
  },
  {
    label: 'Front Desk & CRM',
    items: [
      {
        title: 'Customers & CRM',
        href: '/customers',
        icon: Users,
        allowedRoles: ['ADMIN', 'SHOWROOM_MANAGER', 'SALES_EXECUTIVE', 'FRONT_DESK', 'SERVICE_ADVISOR', 'ACCOUNTANT'],
      },
      {
        title: 'Leads & Enquiries',
        href: '/leads',
        icon: UserCheck,
        badge: '12 New',
        allowedRoles: ['ADMIN', 'SHOWROOM_MANAGER', 'SALES_EXECUTIVE', 'FRONT_DESK'],
      },
      {
        title: 'Test Rides',
        href: '/test-rides',
        icon: Compass,
        allowedRoles: ['ADMIN', 'SHOWROOM_MANAGER', 'SALES_EXECUTIVE', 'FRONT_DESK'],
      },
    ],
  },
  {
    label: 'Sales Operations',
    items: [
      {
        title: 'Bookings & Sales',
        href: '/sales',
        icon: Bike,
        allowedRoles: ['ADMIN', 'SHOWROOM_MANAGER', 'SALES_EXECUTIVE', 'ACCOUNTANT'],
      },
    ],
  },
  {
    label: 'Workshop & Service',
    items: [
      {
        title: 'Service Floor & Job Cards',
        href: '/service',
        icon: Wrench,
        badge: '6 Bays',
        allowedRoles: ['ADMIN', 'SHOWROOM_MANAGER', 'SERVICE_MANAGER', 'SERVICE_ADVISOR'],
      },
      {
        title: 'Service Appointments',
        href: '/service/appointments',
        icon: CalendarDays,
        allowedRoles: ['ADMIN', 'SHOWROOM_MANAGER', 'SERVICE_MANAGER', 'SERVICE_ADVISOR', 'FRONT_DESK'],
      },
    ],
  },
  {
    label: 'Stock & Spares',
    items: [
      {
        title: 'Vehicle & Spares Stock',
        href: '/inventory',
        icon: Package,
        badge: 'Alerts',
        allowedRoles: ['ADMIN', 'SHOWROOM_MANAGER', 'INVENTORY_MANAGER', 'SALES_EXECUTIVE', 'SERVICE_MANAGER'],
      },
    ],
  },
  {
    label: 'Finance & Accounts',
    items: [
      {
        title: 'Invoices & Payments',
        href: '/finance',
        icon: CreditCard,
        allowedRoles: ['ADMIN', 'SHOWROOM_MANAGER', 'ACCOUNTANT'],
      },
    ],
  },
  {
    label: 'Management & Control',
    items: [
      {
        title: 'Reports & Analytics',
        href: '/reports',
        icon: FileBarChart,
        allowedRoles: ['ADMIN', 'SHOWROOM_MANAGER', 'ACCOUNTANT'],
      },
      {
        title: 'Employees & Roles',
        href: '/employees',
        icon: ShieldAlert,
        allowedRoles: ['ADMIN', 'SHOWROOM_MANAGER'],
      },
      {
        title: 'Showroom Settings',
        href: '/settings',
        icon: Settings,
        allowedRoles: ['ADMIN'],
      },
    ],
  },
];

// -------------------------------------------------------------
// ROLE-SPECIFIC QUICK ACTIONS FOR "+ CREATE NEW"
// -------------------------------------------------------------
export interface QuickActionItem {
  id: string;
  label: string;
  description: string;
  icon: any;
  actionKey: string;
}

export const ROLE_QUICK_ACTIONS: Record<Role, QuickActionItem[]> = {
  ADMIN: [
    { id: 'qa_adm_emp', label: 'Add New Employee', description: 'Onboard authorized dealership staff', icon: Users, actionKey: 'ADD_EMPLOYEE' },
    { id: 'qa_adm_tgt', label: 'Set Sales Target', description: 'Configure monthly branch sales quota', icon: Target, actionKey: 'SET_SALES_TARGET' },
    { id: 'qa_adm_br', label: 'Create Showroom Branch', description: 'Initialize new dealership location', icon: Building2, actionKey: 'CREATE_BRANCH' },
  ],
  SHOWROOM_MANAGER: [
    { id: 'qa_mgr_assign', label: 'Assign Lead to Exec', description: 'Route new lead to floor executive', icon: UserCheck, actionKey: 'ASSIGN_LEAD' },
    { id: 'qa_mgr_bk', label: 'Review Booking', description: 'Verify token & vehicle allocation', icon: CheckCircle, actionKey: 'REVIEW_BOOKING' },
    { id: 'qa_mgr_del', label: 'Authorize Delivery', description: 'Approve PDI and vehicle handover', icon: Bike, actionKey: 'AUTHORIZE_DELIVERY' },
  ],
  SALES_EXECUTIVE: [
    { id: 'qa_sls_lead', label: 'Add New Lead', description: 'Record prospective bike customer', icon: UserCheck, actionKey: 'ADD_LEAD' },
    { id: 'qa_sls_fu', label: 'Log Follow-Up Note', description: 'Schedule callback or meeting', icon: PhoneCall, actionKey: 'LOG_FOLLOW_UP' },
    { id: 'qa_sls_tr', label: 'Schedule Test Ride', description: 'Reserve demo bike time slot', icon: Compass, actionKey: 'SCHEDULE_TEST_RIDE' },
    { id: 'qa_sls_bk', label: 'Create Vehicle Booking', description: 'Record booking token amount', icon: Bike, actionKey: 'CREATE_BOOKING' },
  ],
  FRONT_DESK: [
    { id: 'qa_fd_walkin', label: 'Register Walk-In Guest', description: 'Fast visitor entry & queue entry', icon: Users, actionKey: 'REGISTER_WALK_IN' },
    { id: 'qa_fd_inq', label: 'Log New Inquiry', description: 'Record customer bike interest', icon: FileText, actionKey: 'LOG_INQUIRY' },
    { id: 'qa_fd_app', label: 'Book Test Ride', description: 'Schedule immediate demo bike ride', icon: Compass, actionKey: 'BOOK_TEST_RIDE' },
  ],
  SERVICE_MANAGER: [
    { id: 'qa_sm_queue', label: 'Assign Service Bay', description: 'Allocate job card to technician', icon: Wrench, actionKey: 'ASSIGN_BAY' },
    { id: 'qa_sm_delay', label: 'Review Delayed Jobs', description: 'Inspect bottleneck on workshop floor', icon: AlertTriangle, actionKey: 'REVIEW_DELAYS' },
    { id: 'qa_sm_appr', label: 'Approve Major Estimate', description: 'Authorize extra repair estimate', icon: CheckCircle, actionKey: 'APPROVE_REPAIR' },
  ],
  SERVICE_ADVISOR: [
    { id: 'qa_sa_jc', label: 'Create Job Card', description: 'Initial inspection & customer complaints', icon: Wrench, actionKey: 'CREATE_JOB_CARD' },
    { id: 'qa_sa_rcv', label: 'Receive / Check-in Vehicle', description: 'Record fuel, km, and body check', icon: Bike, actionKey: 'CHECK_IN_VEHICLE' },
    { id: 'qa_sa_hnd', label: 'Prepare Delivery Handover', description: 'Final bill & gate pass generation', icon: CheckCircle, actionKey: 'PREPARE_DELIVERY' },
  ],
  ACCOUNTANT: [
    { id: 'qa_acc_inv', label: 'Create Tax Invoice', description: 'Generate GST sale or service bill', icon: FileText, actionKey: 'CREATE_INVOICE' },
    { id: 'qa_acc_pay', label: 'Record Payment Receipt', description: 'Log Cash, UPI, Card or Financer payment', icon: CreditCard, actionKey: 'RECORD_PAYMENT' },
    { id: 'qa_acc_rec', label: 'Bank & Loan Reconcile', description: 'Match financier disbursement', icon: CheckCircle, actionKey: 'RECONCILE_PAYMENTS' },
  ],
  INVENTORY_MANAGER: [
    { id: 'qa_inv_in', label: 'Add Stock Inward', description: 'Receive factory batch or parts order', icon: Package, actionKey: 'ADD_STOCK_INWARD' },
    { id: 'qa_inv_trf', label: 'Transfer Stock to Branch', description: 'Inter-branch vehicle or spares transfer', icon: ArrowRightLeft, actionKey: 'TRANSFER_STOCK' },
    { id: 'qa_inv_vnd', label: 'Register Parts Vendor', description: 'Add authorized Hero parts supplier', icon: Users, actionKey: 'ADD_VENDOR' },
  ],
};

// -------------------------------------------------------------
// ROLE-SPECIFIC NOTIFICATIONS REGISTRY
// -------------------------------------------------------------
export interface RoleNotification {
  id: string;
  title: string;
  message: string;
  type: 'LEAD' | 'SERVICE' | 'INVENTORY' | 'FINANCE' | 'SYSTEM' | 'DELAY';
  timeAgo: string;
  isRead: boolean;
}

export const ROLE_NOTIFICATIONS_MAP: Record<Role, RoleNotification[]> = {
  ADMIN: [
    { id: 'n_a1', title: 'Monthly Target Milestone', message: 'Halvad Branch achieved 81% of monthly sales target (65 bikes sold).', type: 'SYSTEM', timeAgo: '20 mins ago', isRead: false },
    { id: 'n_a2', title: 'Pending Loan Approval', message: 'Hero FinCorp disbursed ₹65,000 for Customer Ravi Patel (#BK-1001).', type: 'FINANCE', timeAgo: '1 hour ago', isRead: false },
    { id: 'n_a3', title: 'Jetpur Branch Alert', message: 'Jetpur is 38% behind target for the first half of the month.', type: 'SYSTEM', timeAgo: '3 hours ago', isRead: true },
  ],
  SHOWROOM_MANAGER: [
    { id: 'n_m1', title: 'Delivery Scheduled Today', message: '5 vehicle handovers scheduled between 16:00 and 18:30.', type: 'LEAD', timeAgo: '15 mins ago', isRead: false },
    { id: 'n_m2', title: 'Customer Escalation', message: 'Dhaval Mehta enquired on RTO registration timeline.', type: 'SYSTEM', timeAgo: '2 hours ago', isRead: false },
    { id: 'n_m3', title: 'Attendance Alert', message: '24 out of 26 showroom employees checked in on time.', type: 'SYSTEM', timeAgo: '4 hours ago', isRead: true },
  ],
  SALES_EXECUTIVE: [
    { id: 'n_s1', title: 'Follow-Up Due Today', message: 'Call Rahul Sharma regarding exchange bonus quote for Splendor+ XTEC (14:00 PM).', type: 'LEAD', timeAgo: '10 mins ago', isRead: false },
    { id: 'n_s2', title: 'New Web Lead Assigned', message: 'Inquiry for Xtreme 160R 4V assigned by Front Desk (Neha Gupta).', type: 'LEAD', timeAgo: '45 mins ago', isRead: false },
    { id: 'n_s3', title: 'Test Ride Reminder', message: 'Ankit Vaghela scheduled for Passion Pro demo ride at 10:30 AM tomorrow.', type: 'LEAD', timeAgo: '2 hours ago', isRead: true },
  ],
  FRONT_DESK: [
    { id: 'n_fd1', title: 'Waiting Guest in Lounge', message: 'Jignesh Makwana has been waiting in lounge for 12 minutes for Service check-in.', type: 'SYSTEM', timeAgo: '5 mins ago', isRead: false },
    { id: 'n_fd2', title: 'New Walk-In Logged', message: 'Dinesh Kumar registered for Xpulse 200 4V inquiry.', type: 'LEAD', timeAgo: '30 mins ago', isRead: true },
  ],
  SERVICE_MANAGER: [
    { id: 'n_sm1', title: 'Delayed Job Alert: JC-8891', message: 'Xtreme 160R (Bay 2) is 60 minutes past promised delivery time.', type: 'DELAY', timeAgo: '10 mins ago', isRead: false },
    { id: 'n_sm2', title: 'Workshop Overload Warning', message: 'Workshop bay capacity reached 88% (12 active in-bay jobs).', type: 'SERVICE', timeAgo: '1 hour ago', isRead: false },
    { id: 'n_sm3', title: 'Customer Complaint Logged', message: 'Front brake vibration reported on freshly serviced HF Deluxe.', type: 'SERVICE', timeAgo: '2 hours ago', isRead: true },
  ],
  SERVICE_ADVISOR: [
    { id: 'n_sa1', title: 'Customer Approval Pending', message: 'Ashwin Parmar (#JC-8905) needs approval for Clutch Plate replacement (₹1,450).', type: 'SERVICE', timeAgo: '15 mins ago', isRead: false },
    { id: 'n_sa2', title: 'Vehicle Ready for Pickup', message: 'Glamour (#JC-8899) completed wash and quality check. Call Mahesh Shah.', type: 'SERVICE', timeAgo: '30 mins ago', isRead: false },
    { id: 'n_sa3', title: 'New Service Booking', message: 'Ramesh Patel booked Paid Periodic Service for Splendor Plus.', type: 'SERVICE', timeAgo: '1 hour ago', isRead: true },
  ],
  ACCOUNTANT: [
    { id: 'n_ac1', title: 'Payment Overdue Alert', message: 'Rohit Verma (INV-2024-1002) is 5 days overdue for ₹25,000 sales balance.', type: 'FINANCE', timeAgo: '25 mins ago', isRead: false },
    { id: 'n_ac2', title: 'Financier Disbursal Ready', message: 'Hero FinCorp approved ₹1,95,000 for 3 showroom booking loans.', type: 'FINANCE', timeAgo: '1 hour ago', isRead: false },
    { id: 'n_ac3', title: 'GST Monthly Summary', message: '₹1,12,400 monthly tax liability compiled for verification.', type: 'FINANCE', timeAgo: '3 hours ago', isRead: true },
  ],
  INVENTORY_MANAGER: [
    { id: 'n_iv1', title: 'Critical Low Stock: Air Filter', message: 'Air Filter Element stock is 0 units (Threshold: 8). Immediate reorder required.', type: 'INVENTORY', timeAgo: '10 mins ago', isRead: false },
    { id: 'n_iv2', title: 'Engine Oil Reorder Due', message: 'Hero 4T Plus 10W30 (1L) is at 4 units left (Threshold: 15).', type: 'INVENTORY', timeAgo: '45 mins ago', isRead: false },
    { id: 'n_iv3', title: 'Factory Shipment In-Transit', message: '15 units Splendor Plus & HF Deluxe dispatched from factory.', type: 'INVENTORY', timeAgo: '2 hours ago', isRead: true },
  ],
};
