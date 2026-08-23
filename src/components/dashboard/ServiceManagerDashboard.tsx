'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getServiceManagerDashboardData } from '@/lib/db/dashboard-data';
import {
  Wrench,
  AlertTriangle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Activity,
  UserCheck,
  ShieldCheck,
  PhoneCall,
  ArrowRight,
} from 'lucide-react';

interface ServiceManagerDashboardProps {
  onQuickAction: (actionKey: string) => void;
}

export function ServiceManagerDashboard({ onQuickAction }: ServiceManagerDashboardProps) {
  const data = getServiceManagerDashboardData();

  return (
    <div className="space-y-6">
      {/* Service Manager Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Workshop Operations & Service Floor
            </h1>
            <Badge variant="hero" className="font-bold text-[10px] uppercase">
              Workshop Manager
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time bay occupancy, job card bottlenecks, technician workload, and delayed job resolution.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={() => onQuickAction('ASSIGN_BAY')}
            className="gap-1.5 text-xs font-semibold h-9"
          >
            <Wrench className="h-4 w-4" />
            Assign Service Bay
          </Button>
          <Button
            size="sm"
            onClick={() => onQuickAction('APPROVE_REPAIR')}
            variant="outline"
            className="gap-1.5 text-xs text-slate-700 h-9"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Approve Major Repair
          </Button>
        </div>
      </div>

      {/* Workshop Performance KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-rose-500 bg-rose-50/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                Delayed Services Alert
              </p>
              <h3 className="text-2xl font-bold text-rose-900 mt-1">
                {data.kpis.delayedJobsCount} <span className="text-xs font-normal text-rose-600">Overdue Jobs</span>
              </h3>
              <span className="text-[11px] text-rose-600 font-bold flex items-center gap-1 mt-1">
                <AlertTriangle className="h-3.5 w-3.5" /> Exceeded promised handover time
              </span>
            </div>
            <div className="h-11 w-11 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Active In-Bay Jobs
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {data.kpis.activeInBayJobs} <span className="text-xs font-normal text-slate-400">/ {data.kpis.pendingJobs} Total</span>
              </h3>
              <span className="text-[11px] text-blue-600 font-medium mt-1 block">
                Workshop Bay Load: {data.kpis.workshopBayLoadPercent}%
              </span>
            </div>
            <div className="h-11 w-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wrench className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Vehicles Ready for Pickup
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {data.kpis.vehiclesReadyForPickup} <span className="text-xs font-normal text-slate-400">Bikes</span>
              </h3>
              <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
                {data.kpis.vehiclesDueToday} total deliveries due today
              </span>
            </div>
            <div className="h-11 w-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                On-Time Completion Rate
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {data.kpis.serviceCompletionRate}%
              </h3>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {data.kpis.activeComplaintsCount} active customer complaints
              </span>
            </div>
            <div className="h-11 w-11 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Activity className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* HIGHEST VISIBILITY: Delayed Service Alerts Queue */}
      <Card className="border-2 border-rose-300">
        <CardHeader className="bg-rose-50/70 flex flex-row items-center justify-between pb-3 border-b border-rose-200">
          <div>
            <CardTitle className="text-sm flex items-center gap-2 text-rose-900 font-bold">
              <AlertTriangle className="h-4 w-4 text-rose-600" />
              Critical Delayed Jobs — Immediate Intervention Required
            </CardTitle>
            <p className="text-xs text-rose-700 mt-0.5">
              These vehicles have exceeded the delivery commitment given to the customer.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => onQuickAction('REVIEW_DELAYS')}
            className="text-xs h-8 bg-rose-600 hover:bg-rose-700 text-white"
          >
            Review Bottlenecks
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {data.delayedJobs.map((job) => (
              <div
                key={job.id}
                className="p-4 bg-rose-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-slate-900 text-sm font-mono">
                      {job.jobCardNumber}
                    </span>
                    <Badge variant="danger" className="text-[10px] font-bold">
                      +{job.delayMinutes} MINS DELAYED
                    </Badge>
                    <span className="font-bold text-slate-800 text-xs">{job.vehicleModel}</span>
                    <span className="text-slate-400 text-xs font-mono">({job.regNumber})</span>
                  </div>

                  <p className="text-xs text-slate-700">
                    <span className="font-semibold">Customer: </span> {job.customerName} ({job.phone}) • <span className="font-semibold">Technician: </span> {job.technicianName} ({job.bayNumber})
                  </p>

                  <p className="text-xs text-rose-800 bg-white p-2 rounded border border-rose-200 leading-snug max-w-2xl font-medium">
                    Reason: {job.delayReason}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={`tel:${job.phone}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300"
                  >
                    <PhoneCall className="h-3.5 w-3.5" />
                    Call Customer
                  </a>
                  <Button
                    size="sm"
                    onClick={() => onQuickAction('ASSIGN_BAY')}
                    className="text-xs h-8"
                  >
                    Reassign Bay / Expedite
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Workshop Bays Occupancy Floor */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Workshop Floor Bay Occupancy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {data.bays.map((b) => (
              <div
                key={b.bay}
                className={`p-3.5 rounded-lg border ${
                  b.status === 'DELAYED'
                    ? 'bg-rose-50/50 border-rose-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{b.bay}</span>
                  <Badge
                    variant={b.status === 'DELAYED' ? 'danger' : 'info'}
                    className="text-[9px]"
                  >
                    {b.status}
                  </Badge>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-200 space-y-1">
                  <p className="font-medium text-slate-800 text-[11px] truncate">{b.vehicle}</p>
                  <p className="text-[10px] text-slate-400">Assigned Tech: {b.tech}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
