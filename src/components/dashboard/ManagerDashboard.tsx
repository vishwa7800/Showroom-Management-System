'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatINR } from '@/lib/utils';
import { getManagerDashboardData } from '@/lib/db/dashboard-data';
import {
  Users,
  Bike,
  Clock,
  CalendarCheck,
  AlertCircle,
  Trophy,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  PhoneCall,
} from 'lucide-react';

interface ManagerDashboardProps {
  branchId?: string;
  onQuickAction: (actionKey: string) => void;
}

export function ManagerDashboard({ branchId, onQuickAction }: ManagerDashboardProps) {
  const data = getManagerDashboardData(branchId);

  return (
    <div className="space-y-6">
      {/* Showroom Manager Action Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Showroom Operations & Team Overview
            </h1>
            <Badge variant="hero" className="font-bold text-[10px] uppercase">
              Halvad Branch Floor
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time branch footfall, sales consultant targets, vehicle handover schedule, and staff attendance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={() => onQuickAction('ASSIGN_LEAD')}
            variant="outline"
            className="gap-1.5 text-xs text-slate-700 h-9"
          >
            <UserCheck className="h-4 w-4 text-hero" />
            Assign Lead to Exec
          </Button>
          <Button
            size="sm"
            onClick={() => onQuickAction('AUTHORIZE_DELIVERY')}
            className="gap-1.5 text-xs font-semibold h-9"
          >
            <Bike className="h-4 w-4" />
            Authorize Deliveries
          </Button>
        </div>
      </div>

      {/* Operational KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-hero">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Today's Bookings
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {data.kpis.todayBookings} <span className="text-xs font-normal text-slate-400">Tokens</span>
              </h3>
              <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
                <CheckCircle2 className="h-3 w-3" /> Target: 6 bookings/day
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
                Pending Deliveries Today
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {data.kpis.pendingDeliveriesToday} <span className="text-xs font-normal text-slate-400">Bikes</span>
              </h3>
              <span className="text-[11px] text-blue-600 font-medium flex items-center gap-1 mt-1">
                <Clock className="h-3 w-3" /> Scheduled 16:00 – 18:30
              </span>
            </div>
            <div className="h-11 w-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <CalendarCheck className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Showroom Footfall Today
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {data.kpis.showroomFootfallToday} <span className="text-xs font-normal text-slate-400">Guests</span>
              </h3>
              <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                Pipeline Value: {formatINR(data.kpis.pipelineValue)}
              </span>
            </div>
            <div className="h-11 w-11 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Staff Attendance
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {data.kpis.staffAttendancePresent} <span className="text-xs font-normal text-slate-400">/ {data.kpis.staffAttendanceTotal} Present</span>
              </h3>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                92.3% Showroom Floor Strength
              </span>
            </div>
            <div className="h-11 w-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Consultant Performance Leaderboard */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-sm flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              Sales Executive Floor Leaderboard (Current Month)
            </CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Target achievement, confirmed bookings, and revenue by sales consultant.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onQuickAction('ASSIGN_LEAD')}
            className="text-xs h-7"
          >
            Assign Inbound Leads
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="text-left p-3.5">Sales Executive</th>
                  <th className="text-center p-3.5">Bikes Delivered</th>
                  <th className="text-center p-3.5">Open Bookings</th>
                  <th className="text-right p-3.5">Delivered Revenue</th>
                  <th className="text-center p-3.5">Monthly Target Quota</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {data.salesLeaderboard.map((exec, idx) => (
                  <tr key={exec.name} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold">
                        #{idx + 1}
                      </span>
                      <span>{exec.name}</span>
                    </td>
                    <td className="p-3.5 text-center font-semibold text-slate-900">
                      {exec.salesCount} units
                    </td>
                    <td className="p-3.5 text-center font-medium text-hero">
                      {exec.bookingsCount} active
                    </td>
                    <td className="p-3.5 text-right font-bold text-slate-900">
                      {formatINR(exec.revenue)}
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="inline-flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-800">{exec.targetPercent}%</span>
                        <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              exec.targetPercent >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${exec.targetPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Deliveries Today Schedule & Urgent Escalations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Vehicle Delivery Queue */}
        <Card className="border border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-hero" />
              Today's Scheduled Handover / Deliveries
            </CardTitle>
            <Badge variant="hero" className="text-[10px]">
              {data.deliveriesToday.length} Scheduled
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.deliveriesToday.map((del) => (
              <div
                key={del.id}
                className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{del.customerName}</span>
                    <Badge variant="outline" className="text-[10px]">
                      {del.time}
                    </Badge>
                  </div>
                  <span className="text-[11px] text-slate-600 mt-0.5 block">
                    {del.model} • Exec: {del.exec}
                  </span>
                </div>
                <div className="text-right">
                  <Badge
                    variant={del.pdiStatus === 'PASSED' ? 'success' : 'warning'}
                    className="text-[9px] uppercase font-bold"
                  >
                    PDI: {del.pdiStatus}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Customer Escalations & Approvals */}
        <Card className="border border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-500" />
              Customer Escalations & Action Items
            </CardTitle>
            <Badge variant="danger" className="text-[10px]">
              {data.escalations.length} Urgent
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.escalations.map((esc) => (
              <div
                key={esc.id}
                className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-900">{esc.customer}</span>
                  <Badge variant="danger" className="text-[9px]">
                    {esc.priority} PRIORITY
                  </Badge>
                </div>
                <p className="text-[11px] text-rose-700 leading-snug">{esc.issue}</p>
                <div className="flex justify-end gap-2 pt-1">
                  <Button
                    size="sm"
                    onClick={() => onQuickAction('LOG_FOLLOW_UP')}
                    className="h-7 text-[10px] gap-1 bg-rose-600 hover:bg-rose-700 text-white"
                  >
                    <PhoneCall className="h-3 w-3" />
                    Call & Resolve
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
