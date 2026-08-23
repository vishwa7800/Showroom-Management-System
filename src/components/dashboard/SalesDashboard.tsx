'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatINR } from '@/lib/utils';
import { getSalesDashboardData } from '@/lib/db/dashboard-data';
import {
  Flame,
  PhoneCall,
  Calendar,
  Compass,
  CheckCircle2,
  Plus,
  Clock,
  Bike,
  MessageSquare,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface SalesDashboardProps {
  onQuickAction: (actionKey: string) => void;
}

export function SalesDashboard({ onQuickAction }: SalesDashboardProps) {
  const data = getSalesDashboardData();

  return (
    <div className="space-y-6">
      {/* Sales Consultant Action Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              My Sales Pipeline & Actionable Leads
            </h1>
            <Badge variant="hero" className="font-bold text-[10px] uppercase">
              Sales Consultant
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Prioritized customer follow-ups, test ride schedules, and personal quota progress.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={() => onQuickAction('ADD_LEAD')}
            className="gap-1.5 text-xs font-semibold h-9"
          >
            <Plus className="h-4 w-4" />
            Add New Lead
          </Button>
          <Button
            size="sm"
            onClick={() => onQuickAction('SCHEDULE_TEST_RIDE')}
            variant="outline"
            className="gap-1.5 text-xs text-slate-700 h-9"
          >
            <Compass className="h-4 w-4 text-hero" />
            Schedule Test Ride
          </Button>
          <Button
            size="sm"
            onClick={() => onQuickAction('CREATE_BOOKING')}
            variant="outline"
            className="gap-1.5 text-xs text-slate-700 h-9"
          >
            <Bike className="h-4 w-4 text-emerald-600" />
            Create Booking
          </Button>
        </div>
      </div>

      {/* Sales Performance & Target Achievement Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-rose-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Hot Leads Ready to Close
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {data.kpis.hotLeadsCount} <span className="text-xs font-normal text-slate-400">Prospects</span>
              </h3>
              <span className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
                <Flame className="h-3.5 w-3.5" /> Immediate conversion priority
              </span>
            </div>
            <div className="h-11 w-11 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Flame className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Follow-ups Due Today
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {data.kpis.followUpsDueToday} <span className="text-xs font-normal text-slate-400">Calls</span>
              </h3>
              {data.kpis.overdueFollowUps > 0 ? (
                <span className="text-[11px] text-rose-600 font-bold flex items-center gap-1 mt-1">
                  ⚠️ {data.kpis.overdueFollowUps} Overdue from yesterday
                </span>
              ) : (
                <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
                  All past follow-ups completed
                </span>
              )}
            </div>
            <div className="h-11 w-11 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <PhoneCall className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-hero">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Personal Sales Target (Quota)
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {data.kpis.targetPercent}% <span className="text-xs font-normal text-slate-400">({formatINR(data.kpis.achievedSales)})</span>
              </h3>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-hero h-full rounded-full"
                  style={{ width: `${data.kpis.targetPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 font-semibold mt-1 block">
                Target: {formatINR(data.kpis.monthlySalesTarget)}
              </span>
            </div>
            <div className="h-11 w-11 rounded-lg bg-hero-50 text-hero flex items-center justify-center">
              <TrendingUp className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Scheduled Test Rides Today
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {data.kpis.scheduledTestRidesToday} <span className="text-xs font-normal text-slate-400">Rides</span>
              </h3>
              <span className="text-[11px] text-blue-600 font-medium mt-1 block">
                4 Pending customer responses
              </span>
            </div>
            <div className="h-11 w-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Compass className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* HIGHEST VISIBILITY SECTION: Actionable Follow-Up Schedule */}
      <Card className="border-2 border-amber-200">
        <CardHeader className="bg-amber-50/50 flex flex-row items-center justify-between pb-3 border-b border-amber-100">
          <div>
            <CardTitle className="text-sm flex items-center gap-2 text-slate-900 font-bold">
              <Clock className="h-4 w-4 text-amber-600" />
              High Priority Follow-Up Action Queue (Today's Callbacks)
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Contact prospects at promised timings to maximize booking conversion.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => onQuickAction('LOG_FOLLOW_UP')}
            className="text-xs h-8 gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Log Follow-Up Note
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {data.followUps.map((fu) => (
              <div
                key={fu.id}
                className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                  fu.isOverdue ? 'bg-rose-50/60' : 'hover:bg-slate-50'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-slate-900 text-sm">{fu.customerName}</span>
                    <Badge
                      variant={fu.status === 'HOT' ? 'danger' : 'warning'}
                      className="text-[10px] font-bold"
                    >
                      {fu.status} LEAD
                    </Badge>
                    <span className="text-slate-400 text-xs font-mono">{fu.phone}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                    <Bike className="h-3.5 w-3.5 text-hero" />
                    <span>Interested in: {fu.interestedModel}</span>
                  </div>

                  <p className="text-xs text-slate-600 bg-white/80 p-2 rounded border border-slate-200/80 leading-relaxed max-w-2xl">
                    <span className="font-semibold text-slate-700">Notes: </span>
                    {fu.notes}
                  </p>

                  <span className="text-[10px] text-slate-400 block">
                    Last contact: {fu.lastContact} • Scheduled: {fu.dueDate} at {fu.dueTime}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                  <a
                    href={`tel:${fu.phone}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                  >
                    <PhoneCall className="h-3.5 w-3.5" />
                    Call Now
                  </a>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onQuickAction('LOG_FOLLOW_UP')}
                    className="text-xs h-8 gap-1 text-slate-700"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
                    Add Note
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onQuickAction('CREATE_BOOKING')}
                    variant="outline"
                    className="text-xs h-8 gap-1 text-hero border-hero-200 hover:bg-hero-50"
                  >
                    <Bike className="h-3.5 w-3.5" />
                    Book Bike
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Models Demand Insights */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Current Model Demand & Booking Conversions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            {data.topSellingBikes.map((bike) => (
              <div key={bike.model} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block truncate">{bike.model}</span>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200">
                  <span className="text-slate-500">Delivered:</span>
                  <span className="font-bold text-emerald-600">{bike.soldCount} units</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-slate-500">Open Inquiries:</span>
                  <span className="font-bold text-hero">{bike.leadInterest}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
