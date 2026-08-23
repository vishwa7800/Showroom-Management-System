'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatINR } from '@/lib/utils';
import { getServiceAdvisorDashboardData } from '@/lib/db/dashboard-data';
import {
  Wrench,
  Clock,
  CheckCircle2,
  CalendarDays,
  Plus,
  PhoneCall,
  MessageSquare,
  FileCheck,
  Bike,
  AlertCircle,
} from 'lucide-react';

interface ServiceAdvisorDashboardProps {
  onQuickAction: (actionKey: string) => void;
}

export function ServiceAdvisorDashboard({ onQuickAction }: ServiceAdvisorDashboardProps) {
  const data = getServiceAdvisorDashboardData();

  return (
    <div className="space-y-6">
      {/* Service Advisor Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Customer Service Advisor Desk
            </h1>
            <Badge variant="hero" className="font-bold text-[10px] uppercase">
              Customer Liaison
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Job card generation, vehicle check-ins, customer estimate approvals, and delivery handovers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={() => onQuickAction('CREATE_JOB_CARD')}
            className="gap-1.5 text-xs font-semibold h-9"
          >
            <Plus className="h-4 w-4" />
            Create Job Card
          </Button>
          <Button
            size="sm"
            onClick={() => onQuickAction('CHECK_IN_VEHICLE')}
            variant="outline"
            className="gap-1.5 text-xs text-slate-700 h-9"
          >
            <Bike className="h-4 w-4 text-hero" />
            Check-In Vehicle
          </Button>
          <Button
            size="sm"
            onClick={() => onQuickAction('PREPARE_DELIVERY')}
            variant="outline"
            className="gap-1.5 text-xs text-slate-700 h-9"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Prepare Handover
          </Button>
        </div>
      </div>

      {/* Advisor KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-hero">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Today's Service Bookings
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {data.kpis.todayBookingsCount} <span className="text-xs font-normal text-slate-400">Appointments</span>
              </h3>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {data.kpis.vehiclesReceivedCount} vehicles already arrived
              </span>
            </div>
            <div className="h-11 w-11 rounded-lg bg-hero-50 text-hero flex items-center justify-center">
              <CalendarDays className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Active Job Cards
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {data.kpis.activeJobCardsCount} <span className="text-xs font-normal text-slate-400">In Workshop</span>
              </h3>
              <span className="text-[11px] text-blue-600 font-medium mt-1 block">
                {data.kpis.pendingInspectionsCount} pending initial inspection
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
                Approvals Pending Customer
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {data.kpis.customerApprovalsPending} <span className="text-xs font-normal text-slate-400">Extra Parts</span>
              </h3>
              <span className="text-[11px] text-amber-600 font-semibold mt-1 block">
                Call customer for authorization
              </span>
            </div>
            <div className="h-11 w-11 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Ready for Handover / Delivery
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {data.kpis.vehiclesReadyForPickup} <span className="text-xs font-normal text-slate-400">Bikes</span>
              </h3>
              <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
                Final bill & gate pass ready
              </span>
            </div>
            <div className="h-11 w-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Pending Approvals & Callback Callouts */}
      <Card className="border-2 border-amber-200">
        <CardHeader className="bg-amber-50/50 flex flex-row items-center justify-between pb-3 border-b border-amber-100">
          <div>
            <CardTitle className="text-sm flex items-center gap-2 font-bold text-slate-900">
              <PhoneCall className="h-4 w-4 text-amber-600" />
              Customer Contact Required (Approvals & Ready Notifications)
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Contact customers to confirm repair estimates or notify vehicle readiness.
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {data.pendingCustomerCalls.map((c) => (
              <div
                key={c.jobCard}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{c.customer}</span>
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {c.jobCard}
                    </Badge>
                  </div>
                  <p className="text-slate-700 mt-1 font-medium">{c.reason}</p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${c.phone}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-emerald-600 text-white font-semibold shadow-xs"
                  >
                    <PhoneCall className="h-3 w-3" />
                    Call {c.phone}
                  </a>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onQuickAction('CREATE_JOB_CARD')}
                    className="text-xs h-7 text-slate-700"
                  >
                    Update Job Card
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Job Cards Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-sm">Active Job Card Lifecycle</CardTitle>
          <Button
            size="sm"
            onClick={() => onQuickAction('CREATE_JOB_CARD')}
            className="text-xs h-7"
          >
            + New Job Card
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="text-left p-3.5">Job Card #</th>
                  <th className="text-left p-3.5">Customer & Vehicle</th>
                  <th className="text-left p-3.5">Service Type</th>
                  <th className="text-center p-3.5">Workflow Status</th>
                  <th className="text-right p-3.5">Promised Handover</th>
                  <th className="text-right p-3.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {data.jobQueue.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-bold font-mono text-hero">{job.jobCardNumber}</td>
                    <td className="p-3.5">
                      <span className="font-bold text-slate-900 block">{job.customerName}</span>
                      <span className="text-[11px] text-slate-400">
                        {job.vehicleModel} ({job.regNumber})
                      </span>
                    </td>
                    <td className="p-3.5 font-medium">{job.serviceType}</td>
                    <td className="p-3.5 text-center">
                      <Badge
                        variant={
                          job.status === 'READY_FOR_DELIVERY'
                            ? 'success'
                            : job.status === 'APPROVAL_PENDING'
                            ? 'warning'
                            : 'info'
                        }
                        className="text-[10px] font-bold"
                      >
                        {job.status.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right font-medium text-slate-900">
                      {job.estDelivery}
                    </td>
                    <td className="p-3.5 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onQuickAction('PREPARE_DELIVERY')}
                        className="text-[11px] h-7"
                      >
                        {job.status === 'READY_FOR_DELIVERY' ? 'Gate Pass' : 'View'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
