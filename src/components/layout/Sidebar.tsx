'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth/context';
import { Role } from '@/types';
import {
  Bike,
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Wrench,
  UserCheck,
  CreditCard,
  BarChart3,
  Settings,
  Bell,
  Compass,
  FileText,
  CalendarDays,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  ClipboardList,
} from 'lucide-react';

interface SidebarLink {
  title: string;
  href: string;
  icon: any;
  badge?: string;
  isSubmenu?: boolean;
  subItems?: { title: string; href: string }[];
}

function getRoleNavLinks(role: Role): SidebarLink[] {
  switch (role) {
    case 'ADMIN':
      return [
        { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        {
          title: 'Employees',
          href: '/employees',
          icon: Users,
          isSubmenu: true,
          subItems: [
            { title: 'All Employees', href: '/employees' },
            { title: 'Create Employee', href: '/employees/create' },
          ],
        },
        { title: 'Customers / CRM', href: '/customers', icon: Users },
        { title: 'Sales & Bookings', href: '/sales', icon: ShoppingCart },
        { title: 'Service Center', href: '/service', icon: Wrench },
        { title: 'Inventory', href: '/inventory', icon: Package },
        { title: 'Account & Billing', href: '/finance', icon: CreditCard },
        { title: 'Reports & Analytics', href: '/reports', icon: BarChart3 },
        { title: 'Notifications', href: '/notifications', icon: Bell },
        { title: 'Branch / Settings', href: '/settings', icon: Settings },
      ];

    case 'SHOWROOM_MANAGER':
      return [
        { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { title: 'Customers / CRM', href: '/customers', icon: Users },
        { title: 'Sales & Bookings', href: '/sales', icon: ShoppingCart },
        { title: 'Service Center', href: '/service', icon: Wrench },
        { title: 'Inventory', href: '/inventory', icon: Package },
        { title: 'Account & Billing', href: '/finance', icon: CreditCard },
        { title: 'Reports', href: '/reports', icon: BarChart3 },
        { title: 'Notifications', href: '/notifications', icon: Bell },
        { title: 'Employees Directory', href: '/employees', icon: Users },
      ];

    case 'SALES_EXECUTIVE':
      return [
        { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { title: 'Customers', href: '/customers', icon: Users },
        { title: 'Leads & Follow-ups', href: '/leads', icon: UserCheck },
        { title: 'Test Rides', href: '/test-rides', icon: Compass },
        { title: 'Sales & Bookings', href: '/sales', icon: ShoppingCart },
        { title: 'Notifications', href: '/notifications', icon: Bell },
      ];

    case 'FRONT_DESK':
      return [
        { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { title: 'Customers', href: '/customers', icon: Users },
        { title: 'Walk-ins & Leads', href: '/leads', icon: UserCheck },
        { title: 'Appointments', href: '/service', icon: CalendarDays },
        { title: 'Test Rides', href: '/test-rides', icon: Compass },
        { title: 'Notifications', href: '/notifications', icon: Bell },
      ];

    case 'SERVICE_MANAGER':
      return [
        { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { title: 'Service Bay Queue', href: '/service', icon: Wrench },
        { title: 'Job Cards', href: '/service', icon: ClipboardList },
        { title: 'Service Reports', href: '/reports', icon: BarChart3 },
        { title: 'Spare Parts Stock', href: '/inventory', icon: Package },
        { title: 'Notifications', href: '/notifications', icon: Bell },
      ];

    case 'SERVICE_ADVISOR':
      return [
        { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { title: 'Service Appointments', href: '/service', icon: CalendarDays },
        { title: 'Vehicle Check-in', href: '/service', icon: Wrench },
        { title: 'Job Cards', href: '/service', icon: ClipboardList },
        { title: 'Customer History', href: '/customers', icon: Users },
        { title: 'Notifications', href: '/notifications', icon: Bell },
      ];

    case 'ACCOUNTANT':
      return [
        { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { title: 'Invoices & Billing', href: '/finance', icon: CreditCard },
        { title: 'Financial Reports', href: '/reports', icon: BarChart3 },
        { title: 'Notifications', href: '/notifications', icon: Bell },
      ];

    case 'INVENTORY_MANAGER':
      return [
        { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { title: 'Vehicle & Spares Stock', href: '/inventory', icon: Package },
        { title: 'Stock Movements', href: '/inventory', icon: Package },
        { title: 'Notifications', href: '/notifications', icon: Bell },
      ];

    default:
      return [
        { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { title: 'Notifications', href: '/notifications', icon: Bell },
      ];
  }
}

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [employeesExpanded, setEmployeesExpanded] = useState(
    pathname.startsWith('/employees')
  );

  if (!user) {
    return (
      <aside className="w-64 flex-shrink-0 bg-[#0D111A] text-slate-300 border-r border-slate-800 flex flex-col h-screen select-none">
        <div className="h-16 flex items-center px-5 border-b border-slate-800/80 gap-3">
          <div className="h-9 w-9 rounded-xl bg-hero flex items-center justify-center text-white shadow-md">
            <Bike className="h-5 w-5" />
          </div>
          <span className="font-black text-white text-base">Hero ERP</span>
        </div>
        <div className="flex-1 p-4 space-y-3">
          <div className="h-8 bg-slate-800/40 rounded animate-pulse" />
          <div className="h-8 bg-slate-800/40 rounded animate-pulse" />
          <div className="h-8 bg-slate-800/40 rounded animate-pulse" />
        </div>
      </aside>
    );
  }

  const links = getRoleNavLinks(user.role);

  return (
    <aside className="w-64 flex-shrink-0 bg-[#0D111A] text-slate-300 border-r border-slate-800 flex flex-col h-screen select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-slate-800/80 gap-3">
        <div className="h-9 w-9 rounded-xl bg-hero flex items-center justify-center text-white shadow-md shadow-hero/20 flex-shrink-0">
          <Bike className="h-5 w-5" />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-black text-white text-base leading-tight tracking-tight">
              Hero
            </span>
          </div>
          <span className="text-[10px] font-semibold tracking-wider text-slate-400 truncate">
            Showroom Management
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5 text-xs font-medium">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));

          if (link.isSubmenu && link.subItems) {
            return (
              <div key={link.title} className="space-y-1">
                <button
                  type="button"
                  onClick={() => setEmployeesExpanded(!employeesExpanded)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all',
                    pathname.startsWith(link.href)
                      ? 'bg-indigo-600/20 text-indigo-400 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span>{link.title}</span>
                  </div>
                  {employeesExpanded ? (
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                  )}
                </button>

                {employeesExpanded && (
                  <div className="pl-6 pr-1 space-y-1 pt-0.5">
                    {link.subItems.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={cn(
                          'flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[11px] transition-all',
                          pathname === sub.href
                            ? 'bg-indigo-600 text-white font-bold shadow-xs'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                        )}
                      >
                        <span
                          className={cn(
                            'h-1.5 w-1.5 rounded-full',
                            pathname === sub.href ? 'bg-white' : 'bg-slate-500'
                          )}
                        />
                        <span>{sub.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={link.title}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                isActive
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span>{link.title}</span>
            </Link>
          );
        })}
      </div>

      {/* Current User Card */}
      <div className="p-3 border-t border-slate-800/80 bg-[#0A0D14]">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/80 border border-slate-800">
          <div className="relative">
            <div className="h-9 w-9 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs border border-slate-700">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-bold text-white truncate">
              {user.name}
            </span>
            <span className="text-[10px] font-medium text-slate-400 truncate">
              {user.role.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
