'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/context';
import { ROLE_QUICK_ACTIONS } from '@/lib/constants';
import {
  Bell,
  Search,
  Plus,
  Building2,
  ChevronDown,
  LogOut,
  Sparkles,
  CheckCheck,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { QuickActionModal } from '@/components/dashboard/QuickActionModal';

export function TopHeader() {
  const router = useRouter();
  const { user, activeBranch, activeBranchId, switchBranch, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeModalAction, setActiveModalAction] = useState<string | null>(null);

  // Live Notifications State
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchLiveNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (e) {
      // fallback silently
    }
  };

  useEffect(() => {
    if (user) {
      fetchLiveNotifications();
      const interval = setInterval(fetchLiveNotifications, 30000); // 30s polling
      return () => clearInterval(interval);
    }
  }, [activeBranchId, user]);

  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/notifications/read-all', { method: 'POST' });
      fetchLiveNotifications();
    } catch (e) {
      // fallback
    }
  };

  const handleMarkSingleRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
      fetchLiveNotifications();
    } catch (e) {
      // fallback
    }
  };

  const roleQuickActions = user ? (ROLE_QUICK_ACTIONS[user.role] || []) : [];

  const handleSelectQuickAction = (qa: any) => {
    setShowCreateMenu(false);
    if (qa.href) {
      router.push(qa.href);
    } else {
      setActiveModalAction(qa.actionKey);
    }
  };

  if (!user) {
    return (
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-800 text-sm">Shreeji Hero</span>
        </div>
        <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
      </header>
    );
  }

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-20 select-none">
        {/* Left Area: Branch Selector & Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 text-sm tracking-tight hidden sm:inline">
              Shreeji Hero
            </span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            {user.role === 'ADMIN' ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 transition-colors text-xs font-semibold text-slate-800"
                >
                  <Building2 className="h-3.5 w-3.5 text-hero" />
                  <span>{activeBranch ? activeBranch.name : 'All Dealership Branches'}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
                </button>

                {showUserMenu && (
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-dropdown border border-slate-200 py-2 z-30 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Switch Active Dealership Branch
                    </div>
                    <button
                      onClick={() => {
                        switchBranch(null);
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 hover:bg-hero-50/60 hover:text-hero transition-colors"
                    >
                      <span className="font-medium">All Branches Consolidated</span>
                      {!activeBranchId && <CheckCheck className="h-3.5 w-3.5 text-hero" />}
                    </button>
                    <div className="my-1 border-t border-slate-100" />
                    <button
                      onClick={() => {
                        switchBranch('SHR-HLV');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 hover:bg-hero-50/60 hover:text-hero transition-colors"
                    >
                      <span>Halvad Branch (HQ)</span>
                      {activeBranchId === 'SHR-HLV' && <CheckCheck className="h-3.5 w-3.5 text-hero" />}
                    </button>
                    <button
                      onClick={() => {
                        switchBranch('SHR-DHN');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 hover:bg-hero-50/60 hover:text-hero transition-colors"
                    >
                      <span>Dhrangadhra Branch</span>
                      {activeBranchId === 'SHR-DHN' && <CheckCheck className="h-3.5 w-3.5 text-hero" />}
                    </button>
                    <button
                      onClick={() => {
                        switchBranch('SHR-JTP');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 hover:bg-hero-50/60 hover:text-hero transition-colors"
                    >
                      <span>Jetpur Branch</span>
                      {activeBranchId === 'SHR-JTP' && <CheckCheck className="h-3.5 w-3.5 text-hero" />}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Badge variant="hero" className="font-bold tracking-wider uppercase text-[11px] py-1 px-2.5">
                {activeBranch ? activeBranch.name.toUpperCase() : 'HALVAD BRANCH'}
              </Badge>
            )}
          </div>
        </div>

        {/* Right Area: Actions & Profile */}
        <div className="flex items-center gap-3">
          {/* Dynamic Role-Aware "+ Create New" Quick Action Button */}
          {roleQuickActions.length > 0 && (
            <div className="relative">
              <Button
                size="sm"
                onClick={() => setShowCreateMenu(!showCreateMenu)}
                className="gap-1.5 shadow-xs font-semibold text-xs h-8 bg-hero hover:bg-hero-700 text-white"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+ Create New</span>
              </Button>

              {/* Quick Actions Menu */}
              {showCreateMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-dropdown border border-slate-200 py-2 z-30 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Quick Actions ({user.role.replace(/_/g, ' ')})
                    </span>
                    <Sparkles className="h-3 w-3 text-hero" />
                  </div>
                  <div className="p-1 space-y-0.5">
                    {roleQuickActions.map((qa) => {
                      const Icon = qa.icon;
                      return (
                        <button
                          key={qa.id}
                          onClick={() => handleSelectQuickAction(qa)}
                          className="w-full flex items-start gap-2.5 px-3 py-2 rounded-md hover:bg-hero-50/60 transition-colors text-left group"
                        >
                          <Icon className="h-4 w-4 text-slate-400 group-hover:text-hero mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-xs font-semibold text-slate-800 block group-hover:text-hero">
                              {qa.label}
                            </span>
                            <span className="text-[10px] text-slate-400 block leading-tight">
                              {qa.description}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Dynamic Role-Aware Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-hero text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-dropdown border border-slate-200 overflow-hidden z-30 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {user.role.replace(/_/g, ' ')} Alerts ({unreadCount})
                  </span>
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] text-hero font-semibold flex items-center gap-1 hover:underline"
                  >
                    <CheckCheck className="h-3 w-3" />
                    <span>Mark all read</span>
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No active notifications.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <Link
                        key={n.id}
                        href={n.linkUrl || '/notifications'}
                        onClick={() => {
                          handleMarkSingleRead(n.id);
                          setShowNotifications(false);
                        }}
                        className={`p-3 block hover:bg-slate-50 transition-colors ${
                          !n.isRead ? 'bg-hero-50/20 border-l-2 border-l-hero' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-900 truncate">{n.title}</p>
                          <Badge
                            variant={
                              n.priority === 'CRITICAL'
                                ? 'danger'
                                : n.priority === 'IMPORTANT'
                                ? 'warning'
                                : 'outline'
                            }
                            className="text-[9px] px-1 py-0 uppercase"
                          >
                            {n.priority}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                          {n.message}
                        </p>
                      </Link>
                    ))
                  )}
                </div>
                <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
                  <Link
                    href="/notifications"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs font-bold text-hero hover:underline flex items-center justify-center gap-1"
                  >
                    <span>View All Notifications & Reminders</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Sign Out Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                {user.name.slice(0, 2).toUpperCase()}
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-dropdown border border-slate-200 py-2 z-30 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Badge variant="hero" className="text-[9px] uppercase font-bold">
                      {user.role.replace(/_/g, ' ')}
                    </Badge>
                    <span className="text-[10px] text-slate-400">
                      {user.branchName || 'All Branches'}
                    </span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Dynamic Action Modal Launcher */}
      <QuickActionModal
        actionKey={activeModalAction}
        onClose={() => setActiveModalAction(null)}
      />
    </>
  );
}
