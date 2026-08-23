// Shreeji Hero Showroom ERP - Granular RBAC & Permission Architecture

import { Role } from '@/types';

export type PermissionKey =
  // Dashboard
  | 'dashboard.view_all'
  | 'dashboard.view_branch'
  | 'dashboard.view_sales'
  | 'dashboard.view_front_desk'
  | 'dashboard.view_service'
  | 'dashboard.view_service_advisor'
  | 'dashboard.view_finance'
  | 'dashboard.view_inventory'
  // Customers
  | 'customers.read'
  | 'customers.create'
  | 'customers.update'
  | 'customers.delete'
  // Leads
  | 'leads.read'
  | 'leads.create'
  | 'leads.update'
  | 'leads.assign'
  // Test Rides
  | 'test_rides.read'
  | 'test_rides.create'
  | 'test_rides.update'
  // Bookings & Sales
  | 'sales.read'
  | 'sales.create'
  | 'sales.update'
  | 'sales.approve'
  | 'bookings.read'
  | 'bookings.create'
  | 'bookings.update'
  // Service Floor & Job Cards
  | 'service.read'
  | 'service.create_booking'
  | 'service.check_in'
  | 'service.create_job_card'
  | 'service.update_job_card'
  | 'service.assign_tech'
  | 'service.complete_job'
  // Inventory & Spares
  | 'inventory.read'
  | 'inventory.create'
  | 'inventory.adjust'
  | 'inventory.transfer'
  | 'spares.read'
  | 'spares.update_stock'
  // Finance & Invoices
  | 'finance.read'
  | 'finance.create_invoice'
  | 'finance.record_payment'
  | 'finance.view_reports'
  // Administration & Config
  | 'employees.read'
  | 'employees.manage'
  | 'branches.read'
  | 'branches.manage'
  | 'settings.read'
  | 'settings.manage'
  | 'audit.read';

export const ROLE_PERMISSIONS: Record<Role, PermissionKey[]> = {
  ADMIN: [
    'dashboard.view_all',
    'customers.read', 'customers.create', 'customers.update', 'customers.delete',
    'leads.read', 'leads.create', 'leads.update', 'leads.assign',
    'test_rides.read', 'test_rides.create', 'test_rides.update',
    'sales.read', 'sales.create', 'sales.update', 'sales.approve',
    'bookings.read', 'bookings.create', 'bookings.update',
    'service.read', 'service.create_booking', 'service.check_in', 'service.create_job_card', 'service.update_job_card', 'service.assign_tech', 'service.complete_job',
    'inventory.read', 'inventory.create', 'inventory.adjust', 'inventory.transfer', 'spares.read', 'spares.update_stock',
    'finance.read', 'finance.create_invoice', 'finance.record_payment', 'finance.view_reports',
    'employees.read', 'employees.manage',
    'branches.read', 'branches.manage',
    'settings.read', 'settings.manage',
    'audit.read',
  ],

  SHOWROOM_MANAGER: [
    'dashboard.view_branch',
    'customers.read', 'customers.create', 'customers.update',
    'leads.read', 'leads.create', 'leads.update', 'leads.assign',
    'test_rides.read', 'test_rides.create', 'test_rides.update',
    'sales.read', 'sales.create', 'sales.update', 'sales.approve',
    'bookings.read', 'bookings.create', 'bookings.update',
    'service.read', 'service.create_booking', 'service.check_in', 'service.create_job_card', 'service.update_job_card', 'service.assign_tech', 'service.complete_job',
    'inventory.read', 'inventory.transfer', 'spares.read',
    'finance.read', 'finance.create_invoice', 'finance.record_payment', 'finance.view_reports',
    'employees.read',
    'branches.read',
    'audit.read',
  ],

  SALES_EXECUTIVE: [
    'dashboard.view_sales',
    'customers.read', 'customers.create', 'customers.update',
    'leads.read', 'leads.create', 'leads.update',
    'test_rides.read', 'test_rides.create', 'test_rides.update',
    'bookings.read', 'bookings.create', 'bookings.update',
    'sales.read', 'sales.create', 'sales.update',
    'inventory.read',
    'branches.read',
  ],

  FRONT_DESK: [
    'dashboard.view_front_desk',
    'customers.read', 'customers.create', 'customers.update',
    'leads.read', 'leads.create',
    'test_rides.read', 'test_rides.create',
    'service.read', 'service.create_booking',
    'branches.read',
  ],

  SERVICE_MANAGER: [
    'dashboard.view_service',
    'customers.read',
    'service.read', 'service.create_booking', 'service.check_in', 'service.create_job_card', 'service.update_job_card', 'service.assign_tech', 'service.complete_job',
    'spares.read', 'spares.update_stock',
    'finance.read',
    'branches.read',
  ],

  SERVICE_ADVISOR: [
    'dashboard.view_service_advisor',
    'customers.read', 'customers.create', 'customers.update',
    'service.read', 'service.create_booking', 'service.check_in', 'service.create_job_card', 'service.update_job_card',
    'spares.read',
    'branches.read',
  ],

  ACCOUNTANT: [
    'dashboard.view_finance',
    'customers.read',
    'sales.read',
    'service.read',
    'finance.read', 'finance.create_invoice', 'finance.record_payment', 'finance.view_reports',
    'branches.read',
  ],

  INVENTORY_MANAGER: [
    'dashboard.view_inventory',
    'inventory.read', 'inventory.create', 'inventory.adjust', 'inventory.transfer',
    'spares.read', 'spares.update_stock',
    'sales.read',
    'service.read',
    'branches.read',
  ],
};

export function hasPermission(role: Role, permission: PermissionKey): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

export function hasBranchAccess(
  userRole: Role,
  userBranchId: string | null,
  targetBranchId: string | null
): boolean {
  // Admin has cross-branch access everywhere
  if (userRole === 'ADMIN') return true;
  // If target branch is not restricted (all-branch query), allow or filter in service
  if (!targetBranchId) return true;
  // Other roles can only access their assigned branch
  return userBranchId === targetBranchId;
}
