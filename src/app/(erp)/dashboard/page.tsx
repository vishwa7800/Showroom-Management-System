'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { ManagerDashboard } from '@/components/dashboard/ManagerDashboard';
import { SalesDashboard } from '@/components/dashboard/SalesDashboard';
import { FrontDeskDashboard } from '@/components/dashboard/FrontDeskDashboard';
import { ServiceManagerDashboard } from '@/components/dashboard/ServiceManagerDashboard';
import { ServiceAdvisorDashboard } from '@/components/dashboard/ServiceAdvisorDashboard';
import { AccountantDashboard } from '@/components/dashboard/AccountantDashboard';
import { InventoryDashboard } from '@/components/dashboard/InventoryDashboard';
import { QuickActionModal } from '@/components/dashboard/QuickActionModal';
import { Skeleton } from '@/components/ui/Skeleton';

export default function DashboardPage() {
  const router = useRouter();
  const { user, activeBranchId, isLoading } = useAuth();
  const [activeActionKey, setActiveActionKey] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-28 rounded-lg" />
          <Skeleton className="h-28 rounded-lg" />
          <Skeleton className="h-28 rounded-lg" />
          <Skeleton className="h-28 rounded-lg" />
        </div>
        <Skeleton className="h-80 w-full rounded-lg" />
      </div>
    );
  }

  const handleQuickAction = (actionKey: string) => {
    setActiveActionKey(actionKey);
  };

  const renderRoleDashboard = () => {
    switch (user.role) {
      case 'ADMIN':
        return (
          <AdminDashboard
            activeBranchId={activeBranchId}
            onQuickAction={handleQuickAction}
          />
        );
      case 'SHOWROOM_MANAGER':
        return (
          <ManagerDashboard
            branchId={activeBranchId || undefined}
            onQuickAction={handleQuickAction}
          />
        );
      case 'SALES_EXECUTIVE':
        return <SalesDashboard onQuickAction={handleQuickAction} />;
      case 'FRONT_DESK':
        return <FrontDeskDashboard onQuickAction={handleQuickAction} />;
      case 'SERVICE_MANAGER':
        return <ServiceManagerDashboard onQuickAction={handleQuickAction} />;
      case 'SERVICE_ADVISOR':
        return <ServiceAdvisorDashboard onQuickAction={handleQuickAction} />;
      case 'ACCOUNTANT':
        return <AccountantDashboard onQuickAction={handleQuickAction} />;
      case 'INVENTORY_MANAGER':
        return <InventoryDashboard onQuickAction={handleQuickAction} />;
      default:
        return (
          <div className="p-8 bg-white rounded-lg border text-center">
            <h2 className="text-base font-bold text-slate-800">
              Welcome, {user.name}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select an authorized module from the sidebar navigation.
            </p>
          </div>
        );
    }
  };

  return (
    <>
      {renderRoleDashboard()}
      {activeActionKey && (
        <QuickActionModal
          actionKey={activeActionKey}
          onClose={() => setActiveActionKey(null)}
        />
      )}
    </>
  );
}
