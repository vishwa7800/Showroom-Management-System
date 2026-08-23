// Shreeji Hero Showroom Management System - Core TypeScript Definitions

export type Role =
  | 'ADMIN'
  | 'SHOWROOM_MANAGER'
  | 'SALES_EXECUTIVE'
  | 'FRONT_DESK'
  | 'SERVICE_MANAGER'
  | 'SERVICE_ADVISOR'
  | 'ACCOUNTANT'
  | 'INVENTORY_MANAGER';

export type AccountStatus = 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'DISABLED' | 'LOCKED';
export type BranchStatus = 'ACTIVE' | 'INACTIVE';

export type VehicleStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'DEMO' | 'IN_TRANSIT' | 'IN_SERVICE';
export type LeadStatus = 'NEW' | 'CONTACTED' | 'TEST_RIDE_SCHEDULED' | 'QUOTED' | 'BOOKED' | 'LOST';
export type LeadSource = 'WALK_IN' | 'PHONE_INQUIRY' | 'WEBSITE' | 'REFERRAL' | 'EVENT' | 'SOCIAL' | 'OTHER';
export type TestRideStatus = 'REQUESTED' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'ALLOCATED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'UNPAID' | 'PENDING' | 'PARTIAL' | 'PAID' | 'REFUNDED';
export type PaymentMethod = 'CASH' | 'UPI' | 'CARD' | 'BANK_TRANSFER' | 'CHEQUE' | 'FINANCIER';
export type JobCardStatus = 'CHECKED_IN' | 'INSPECTION' | 'IN_PROGRESS' | 'QUALITY_CHECK' | 'READY_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
export type ServiceType = 'FREE_SERVICE_1' | 'FREE_SERVICE_2' | 'FREE_SERVICE_3' | 'FREE_SERVICE_4' | 'FREE_SERVICE_5' | 'PAID_SERVICE' | 'RUNNING_REPAIR' | 'ACCIDENTAL' | 'WARRANTY_CLAIM';

export interface Branch {
  id: string;
  code: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email?: string;
  hasSales: boolean;
  hasService: boolean;
  status: BranchStatus;
}

export interface UserProfile {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  branchId: string | null;
  branchName?: string;
  department?: string;
  designation?: string;
  status: AccountStatus;
  avatarUrl?: string;
}

export interface Customer {
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
  branchId: string;
  status: 'ACTIVE' | 'INACTIVE';
  notes?: string;
  createdAt: string;
}

export interface CustomerVehicle {
  id: string;
  customerId: string;
  registrationNumber: string;
  modelName: string;
  variantName?: string;
  color?: string;
  vinNumber?: string;
  engineNumber?: string;
  purchaseDate?: string;
  warrantyUntil?: string;
  status: 'ACTIVE' | 'TRANSFERRED' | 'INACTIVE';
  imageUrl?: string;
}

export interface VehicleUnit {
  id: string;
  vin: string;
  engineNumber: string;
  modelName: string;
  variantName: string;
  color: string;
  branchId: string;
  branchName?: string;
  status: VehicleStatus;
  purchasePrice: number;
  sellingPrice: number;
  arrivalDate: string;
}

export interface Lead {
  id: string;
  leadCode: string;
  customerName: string;
  phone: string;
  email?: string;
  branchId: string;
  assignedToName?: string;
  interestedModel: string;
  source: LeadSource;
  status: LeadStatus;
  followUpDate?: string;
  notes?: string;
  createdAt: string;
}

export interface TestRide {
  id: string;
  customerName: string;
  phone: string;
  vehicleModel: string;
  branchId: string;
  executiveName?: string;
  scheduledAt: string;
  status: TestRideStatus;
  remarks?: string;
}

export interface Booking {
  id: string;
  bookingCode: string;
  customerName: string;
  phone: string;
  vehicleModel: string;
  variantName?: string;
  color?: string;
  branchId: string;
  bookingAmount: number;
  paymentStatus: PaymentStatus;
  status: BookingStatus;
  deliveryDate?: string;
  createdAt: string;
}

export interface JobCard {
  id: string;
  jobCardNumber: string;
  customerName: string;
  phone: string;
  vehicleRegNumber: string;
  vehicleModel: string;
  branchId: string;
  advisorName: string;
  technicianName?: string;
  complaints: string;
  findings?: string;
  status: JobCardStatus;
  estDelivery?: string;
  totalLabour: number;
  totalParts: number;
  totalAmount: number;
  createdAt: string;
}

export interface SparePart {
  id: string;
  partNumber: string;
  name: string;
  category: string;
  brand: string;
  unitPrice: number;
  costPrice: number;
  currentStock: number;
  minStockLevel: number;
  branchId: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  type: 'SALE' | 'SERVICE' | 'COUNTER_SALE';
  customerName: string;
  phone: string;
  branchId: string;
  subtotal: number;
  gstAmount: number;
  discount: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  dueDate?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'LEAD' | 'SERVICE' | 'INVENTORY' | 'FINANCE' | 'SYSTEM';
  isRead: boolean;
  timeAgo: string;
  linkUrl?: string;
}
