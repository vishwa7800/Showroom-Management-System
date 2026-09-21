'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getFrontDeskDashboardData } from '@/lib/db/dashboard-data';
import {
  Users,
  Clock,
  Compass,
  CalendarDays,
  UserCheck,
  UserPlus,
  ArrowRight,
  Coffee,
  CheckCircle2,
  Bike,
} from 'lucide-react';

interface FrontDeskDashboardProps {
  onQuickAction: (actionKey: string) => void;
}

export function FrontDeskDashboard({ onQuickAction }: FrontDeskDashboardProps) {
  const data = getFrontDeskDashboardData();

  return (
    <div className="space-y-6">
      {/* High-Speed Reception Header & Highlighted Walk-In Trigger */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Front Desk & Guest Reception Queue
            </h1>
            <Badge variant="hero" className="font-bold text-[10px] uppercase">
              Showroom Welcome Desk
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Fast customer check-in, lounge queue tracking, and sales executive floor assignment.
          </p>
        </div>

        {/* PRIMARY HIGHLIGHTED ACTION: Register Walk-In */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="lg"
            onClick={() => onQuickAction('REGISTER_WALK_IN')}
            className="gap-2 text-sm font-bold shadow-md shadow-hero/20 h-11 px-5"
          >
            <UserPlus className="h-5 w-5" />
            <span>Register Walk-In Guest</span>
          </Button>

          <Button
            size="sm"
            onClick={() => onQuickAction('LOG_INQUIRY')}
            variant="outline"
            className="gap-1.5 text-xs text-slate-700 h-11"
          >
            <UserCheck className="h-4 w-4 text-hero" />
            New Inquiry
          </Button>

          <Button
            size="sm"
            onClick={() => onQuickAction('BOOK_TEST_RIDE')}
            variant="outline"
            className="gap-1.5 text-xs text-slate-700 h-11"
          >
            <Compass className="h-4 w-4 text-hero" />
            Book Test Ride
          </Button>
        </div>
      </div>

      {/* Front Desk Flow KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-hero">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Today's Walk-in Footfall
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {data.kpis.todayWalkIns} <span className="text-xs font-normal text-slate-400">Visitors</span>
              </h3>
              <span className="text-[11px] text-slate-500 mt-1 block">
                +4 vs yesterday morning
              </span>
            </div>
            <div className="h-11 w-11 rounded-lg bg-hero-50 text-hero flex items-center justify-center">
              <Users className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Guests Waiting in Lounge
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {data.kpis.waitingInLounge} <span className="text-xs font-normal text-slate-400">Guests</span>
              </h3>
              <span className="text-[11px] text-amber-600 font-bold flex items-center gap-1 mt-1">
                <Coffee className="h-3 w-3" /> Average wait: 6 mins
              </span>
            </div>
            <div className="h-11 w-11 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Coffee className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Available Sales Consultants
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {data.kpis.availableFloorExecutives} <span className="text-xs font-normal text-slate-400">Ready on Floor</span>
              </h3>
              <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
                Ready for immediate assignment
              </span>
            </div>
            <div className="h-11 w-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Today's Appointments
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {data.kpis.todayAppointments} <span className="text-xs font-normal text-slate-400">Scheduled</span>
              </h3>
              <span className="text-[11px] text-blue-600 font-medium mt-1 block">
                {data.kpis.todayTestRidesBooked} Test Rides confirmed
              </span>
            </div>
            <div className="h-11 w-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <CalendarDays className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Guest Reception & Waiting Queue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4 text-hero" />
              Live Showroom Guest Queue & Status
            </CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Current visitors inside the showroom, purpose of visit, and assigned consultant.
            </p>
          </div>
          <Badge variant="hero" className="text-[10px]">
            {data.guestQueue.length} Current Visitors
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="text-left p-3.5">Guest Name & Phone</th>
                  <th className="text-left p-3.5">Visit Purpose</th>
                  <th className="text-left p-3.5">Target Model</th>
                  <th className="text-left p-3.5">Assigned Consultant</th>
                  <th className="text-center p-3.5">Queue Status</th>
                  <th className="text-right p-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {data.guestQueue.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5">
                      <span className="font-bold text-slate-900 block">{g.guestName}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{g.phone}</span>
                    </td>
                    <td className="p-3.5">
                      <Badge variant="outline" className="font-semibold text-[10px]">
                        {g.purpose.replace(/_/g, ' ')}
                      </Badge>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        In: {g.entryTime} ({g.waitMinutes}m ago)
                      </span>
                    </td>
                    <td className="p-3.5 font-medium text-slate-800">
                      {g.interestedModel || 'N/A'}
                    </td>
                    <td className="p-3.5">
                      {g.assignedExecutive ? (
                        <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                          {g.assignedExecutive}
                        </span>
                      ) : (
                        <Badge variant="danger" className="text-[9px]">
                          UNASSIGNED
                        </Badge>
                      )}
                    </td>
                    <td className="p-3.5 text-center">
                      <Badge
                        variant={
                          g.status === 'IN_DISCUSSION'
                            ? 'success'
                            : g.status === 'TEST_RIDE'
                            ? 'info'
                            : 'warning'
                        }
                        className="text-[10px] font-bold"
                      >
                        {g.status.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right">
                      <Button
                        size="sm"
                        onClick={() => onQuickAction('ASSIGN_LEAD')}
                        variant="outline"
                        className="text-[11px] h-7 gap-1 text-slate-700"
                      >
                        Assign / Update
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Floor Sales Consultant Availability Counter */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Floor Sales Consultant Live Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {data.floorExecutives.map((exec) => (
              <div
                key={exec.name}
                className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-900 block">{exec.name}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    {exec.currentGuest ? `With ${exec.currentGuest}` : 'Available for walk-in'}
                  </span>
                </div>
                <Badge
                  variant={exec.status === 'AVAILABLE' ? 'success' : 'warning'}
                  withDot
                  className="text-[9px]"
                >
                  {exec.status === 'AVAILABLE' ? 'Free' : 'Busy'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
