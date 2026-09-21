'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatINR } from '@/lib/utils';
import { getAdminDashboardData } from '@/lib/db/dashboard-data';
import {
  TrendingUp,
  Bike,
  Wrench,
  Building2,
  AlertTriangle,
  FileCheck,
  Target,
  DollarSign,
  Star,
  Users,
  Plus,
  FileBarChart,
  ArrowUpRight,
} from 'lucide-react';

interface AdminDashboardProps {
  activeBranchId: string | null;
  onQuickAction: (actionKey: string) => void;
}

export function AdminDashboard({ activeBranchId, onQuickAction }: AdminDashboardProps) {
  const data = getAdminDashboardData(activeBranchId);

  return (
    <div className="space-y-6">
      {/* Executive Header & Quick Directives */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Executive Business Overview
            </h1>
            <Badge variant="hero" className="font-bold text-[10px] uppercase">
              Dealership Principal
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time cross-branch financial health, revenue targets, and executive approval queue.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/reports">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs text-slate-700 h-9 hover:bg-slate-50"
            >
              <Target className="h-4 w-4 text-hero" />
              Set Sales Quota
            </Button>
          </Link>
          <Link href="/employees">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs font-semibold h-9 border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <Users className="h-4 w-4 text-slate-600" />
              Manage Staff
            </Button>
          </Link>
          <Link href="/employees/create">
            <Button
              size="sm"
              className="gap-1.5 text-xs font-semibold h-9 bg-hero hover:bg-hero-700 text-white shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Add Member
            </Button>
          </Link>
        </div>
      </div>

      {/* High-Level Executive KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Monthly Dealership Revenue
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {formatINR(data.kpis.monthlyRevenue)}
              </h3>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
                <ArrowUpRight className="h-3 w-3" /> +14.2% vs last month
              </span>
            </div>
            <div className="h-11 w-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-hero">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Bike Deliveries (vs Target)
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {data.kpis.bikesSold} <span className="text-xs text-slate-400 font-normal">/ {data.kpis.targetBikes} units</span>
              </h3>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-hero h-full rounded-full"
                  style={{ width: `${data.kpis.salesTargetProgress}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 font-semibold mt-1 block">
                {data.kpis.salesTargetProgress}% achieved
              </span>
            </div>
            <div className="h-11 w-11 rounded-lg bg-hero-50 text-hero flex items-center justify-center">
              <Bike className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Workshop & Service Income
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {formatINR(data.kpis.serviceRevenue)}
              </h3>
              <span className="text-[11px] text-blue-600 font-semibold flex items-center gap-0.5 mt-1">
                <Wrench className="h-3 w-3" /> 92.5% on-time completion
              </span>
            </div>
            <div className="h-11 w-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wrench className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Total Stock Valuation
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {formatINR(data.kpis.totalStockValue)}
              </h3>
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-1">
                <Star className="h-3 w-3 text-amber-500 fill-amber-500" /> CSAT: 4.8 / 5.0 Rating
              </span>
            </div>
            <div className="h-11 w-11 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Branch Performance Comparison Matrix */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-sm">Cross-Branch Performance & Quota Matrix</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Live unit sales, revenue generation, and customer satisfaction index across all locations.
            </p>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono">
            3 Active Branches
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50/80 border-y border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="text-left p-3.5">Branch Location</th>
                  <th className="text-center p-3.5">Bikes Sold / Target</th>
                  <th className="text-right p-3.5">Vehicle Revenue</th>
                  <th className="text-right p-3.5">Service Revenue</th>
                  <th className="text-center p-3.5">Target Achievement</th>
                  <th className="text-center p-3.5">CSAT Index</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {data.branches.map((b) => {
                  const percent = Math.round((b.salesCount / b.targetCount) * 100);
                  return (
                    <tr key={b.branchId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-hero" />
                        <span>{b.branchName}</span>
                      </td>
                      <td className="p-3.5 text-center font-medium">
                        {b.salesCount} <span className="text-slate-400 text-[11px]">/ {b.targetCount}</span>
                      </td>
                      <td className="p-3.5 text-right font-bold text-slate-900">
                        {formatINR(b.revenue)}
                      </td>
                      <td className="p-3.5 text-right font-medium text-slate-700">
                        {formatINR(b.serviceRevenue)}
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="inline-flex items-center gap-2">
                          <span className="font-semibold text-xs text-slate-800">{percent}%</span>
                          <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                percent >= 80 ? 'bg-emerald-500' : percent >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${Math.min(percent, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 text-center">
                        <Badge variant="success" className="font-bold text-[10px]">
                          ★ {b.customerSatisfaction}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Critical Business Alerts & Executive Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Alerts */}
        <Card className="border border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Executive Business Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.alerts.map((alt) => (
              <div
                key={alt.id}
                className={`p-3.5 rounded-lg border text-xs flex items-start gap-3 ${
                  alt.level === 'CRITICAL'
                    ? 'bg-rose-50 border-rose-200 text-rose-800'
                    : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}
              >
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold">{alt.title}</p>
                  <p className="text-[11px] mt-0.5 leading-snug">{alt.message}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Executive Approvals Queue */}
        <Card className="border border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-hero" />
              Pending Executive Authorizations
            </CardTitle>
            <Badge variant="outline" className="text-[10px]">
              2 Awaiting
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentApprovals.map((appr) => (
              <div
                key={appr.id}
                className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 block">{appr.title}</span>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    Customer / Requester: {appr.customer} • {appr.date}
                  </span>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="font-bold text-slate-900 block">{formatINR(appr.amount)}</span>
                  <Button
                    size="sm"
                    onClick={() => onQuickAction('REVIEW_BOOKING')}
                    className="h-6 text-[10px] px-2 mt-1"
                  >
                    Review & Authorize
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
