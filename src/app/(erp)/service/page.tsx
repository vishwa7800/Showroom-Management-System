'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import {
  ServiceBayRecord,
  ServiceBookingRecord,
  JobCardRecord,
  ServiceApprovalRecord,
} from '@/lib/db/service-store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import {
  Wrench,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  UserCheck,
  Search,
  Printer,
  Sparkles,
  ClipboardCheck,
  AlertTriangle,
  Flame,
  Truck,
  Activity,
  Gauge,
} from 'lucide-react';
import { formatINR, formatDate } from '@/lib/utils';

export default function ServicePage() {
  const { user, activeBranchId, can } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<
    'FLOOR_BAYS' | 'JOB_CARDS' | 'CHECK_IN' | 'BOOKINGS' | 'DELIVERIES'
  >('FLOOR_BAYS');
  const [jobCardStatusFilter, setJobCardStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Datasets
  const [bays, setBays] = useState<ServiceBayRecord[]>([]);
  const [jobCards, setJobCards] = useState<JobCardRecord[]>([]);
  const [bookings, setBookings] = useState<ServiceBookingRecord[]>([]);

  // Fast Check-In Modal / Form State
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [checkInForm, setCheckInForm] = useState({
    name: '',
    phone: '',
    registrationNumber: '',
    modelName: 'Hero Splendor Plus',
    serviceType: 'Free Service #4',
    customerComplaints: 'Engine oil change, chain adjustment, front brake tuning',
    fuelLevel: '1/2 Tank',
    kmReading: 12000,
  });

  // Assign Bay & Tech Modal
  const [selectedJcForAssign, setSelectedJcForAssign] = useState<JobCardRecord | null>(null);
  const [targetBayId, setTargetBayId] = useState('bay_03');
  const [targetTechName, setTargetTechName] = useState('Pravin Solanki');

  // Customer Approval Modal
  const [selectedJcForApproval, setSelectedJcForApproval] = useState<JobCardRecord | null>(null);
  const [selectedApproval, setSelectedApproval] = useState<ServiceApprovalRecord | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('');

  // Quality Check Modal
  const [selectedJcForQc, setSelectedJcForQc] = useState<JobCardRecord | null>(null);
  const [qcNotes, setQcNotes] = useState('');

  // Delivery / Gate Pass Modal
  const [selectedJcForDelivery, setSelectedJcForDelivery] = useState<JobCardRecord | null>(null);
  const [deliveryKm, setDeliveryKm] = useState(12002);
  const [paymentMode, setPaymentMode] = useState('UPI');

  // Gate Pass Print View
  const [printGatePassJc, setPrintGatePassJc] = useState<JobCardRecord | null>(null);

  const fetchWorkshopData = async () => {
    try {
      setIsLoading(true);
      const [baysRes, jcRes, bkRes] = await Promise.all([
        fetch('/api/service/bays'),
        fetch('/api/service/job-cards'),
        fetch('/api/service/bookings'),
      ]);

      const [baysData, jcData, bkData] = await Promise.all([
        baysRes.json(),
        jcRes.json(),
        bkRes.json(),
      ]);

      if (baysData.success) setBays(baysData.bays);
      if (jcData.success) setJobCards(jcData.jobCards);
      if (bkData.success) setBookings(bkData.bookings);
    } catch (e) {
      toast('Error', 'Failed to load workshop live data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkshopData();
  }, [activeBranchId]);

  // Handlers
  const handleCheckInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1. Ensure customer exists
      let customerId: string;
      const searchRes = await fetch(`/api/customers?search=${checkInForm.phone}`);
      const searchData = await searchRes.json();

      if (searchData.customers?.[0]) {
        customerId = searchData.customers[0].id;
      } else {
        const custRes = await fetch('/api/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: checkInForm.name,
            phone: checkInForm.phone,
            address: 'Workshop Walk-In Service',
            city: 'Halvad',
            pincode: '363330',
            branchId: activeBranchId || 'br_halvad',
            source: 'WALK_IN',
          }),
        });
        const custData = await custRes.json();
        customerId = custData.customer.id;
      }

      // 2. Perform Vehicle Check-In
      const res = await fetch('/api/service/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          vehicleId: `veh_${Date.now()}`,
          registrationNumber: checkInForm.registrationNumber,
          modelName: checkInForm.modelName,
          serviceType: checkInForm.serviceType,
          customerComplaints: checkInForm.customerComplaints,
          fuelLevel: checkInForm.fuelLevel,
          kmReading: Number(checkInForm.kmReading),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast('Cannot Check In Vehicle', data.error, 'error');
        return;
      }

      toast(
        'Vehicle Checked In',
        `Job Card #${data.jobCard.jobCardNumber} created for ${checkInForm.registrationNumber}. Moved to workshop queue.`,
        'success'
      );
      setIsCheckInModalOpen(false);
      fetchWorkshopData();
      setActiveTab('JOB_CARDS');
    } catch (e) {
      toast('Error', 'Network error during vehicle check-in', 'error');
    }
  };

  const handleAssignBayAndTech = async () => {
    if (!selectedJcForAssign) return;

    try {
      const res = await fetch(`/api/service/job-cards/${selectedJcForAssign.id}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bayId: targetBayId,
          technicianId: `tech_${targetTechName.toLowerCase().replace(/ /g, '_')}`,
          technicianName: targetTechName,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast('Cannot Assign Bay', data.error, 'error');
        return;
      }

      toast(
        'Bay & Technician Assigned',
        `Job #${data.jobCard.jobCardNumber} assigned to ${targetTechName} in ${data.jobCard.bayCode}.`,
        'success'
      );
      setSelectedJcForAssign(null);
      fetchWorkshopData();
    } catch (e) {
      toast('Error', 'Failed to assign bay and technician', 'error');
    }
  };

  const handleCustomerApprovalSubmit = async (approved: boolean) => {
    if (!selectedJcForApproval || !selectedApproval) return;

    try {
      const res = await fetch(`/api/service/job-cards/${selectedJcForApproval.id}/approval`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approvalId: selectedApproval.id,
          approved,
          customerNotes: approvalNotes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast(
          approved ? 'Additional Work Approved' : 'Additional Work Rejected',
          `Customer decision logged for Job #${data.jobCard.jobCardNumber}.`,
          approved ? 'success' : 'info'
        );
        setSelectedJcForApproval(null);
        setSelectedApproval(null);
        setApprovalNotes('');
        fetchWorkshopData();
      }
    } catch (e) {
      toast('Error', 'Failed to record customer approval', 'error');
    }
  };

  const handleQualityCheckSubmit = async (passed: boolean) => {
    if (!selectedJcForQc) return;

    try {
      const res = await fetch(`/api/service/job-cards/${selectedJcForQc.id}/qc`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passed, notes: qcNotes }),
      });

      const data = await res.json();
      if (data.success) {
        toast(
          passed ? 'Quality Check PASSED' : 'Quality Check FAILED',
          `QC recorded for Job #${data.jobCard.jobCardNumber}. Ready for gate pass.`,
          passed ? 'success' : 'error'
        );
        setSelectedJcForQc(null);
        setQcNotes('');
        fetchWorkshopData();
      }
    } catch (e) {
      toast('Error', 'Failed to record quality check', 'error');
    }
  };

  const handleServiceDeliverySubmit = async () => {
    if (!selectedJcForDelivery) return;

    try {
      const res = await fetch(`/api/service/job-cards/${selectedJcForDelivery.id}/deliver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          finalKmReading: Number(deliveryKm),
          paymentMode,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast('Cannot Complete Delivery', data.error, 'error');
        return;
      }

      toast(
        '🎉 Vehicle Delivered & Gate Pass Issued',
        `Gate Pass & Invoice #${data.jobCard.invoiceNumber} generated for ${data.jobCard.registrationNumber}.`,
        'success'
      );
      setSelectedJcForDelivery(null);
      fetchWorkshopData();
      setPrintGatePassJc(data.jobCard);
    } catch (e) {
      toast('Error', 'Failed to complete service delivery', 'error');
    }
  };

  const filteredJobCards = jobCards.filter((jc) => {
    const matchesStatus =
      jobCardStatusFilter === 'ALL' || jc.status === jobCardStatusFilter;
    const matchesSearch =
      jc.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      jc.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      jc.jobCardNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      jc.modelName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Service Center & Workshop Management
            </h1>
            <Badge variant="hero" className="font-bold text-[10px] uppercase">
              Workshop Operations
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Reception Check-in, 6-Bay Floor Matrix, Digital Job Cards, Quality Control, and Delivery Gate Passes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {can('service.create_job_card') && (
            <Button
              size="sm"
              onClick={() => setIsCheckInModalOpen(true)}
              className="gap-1.5 text-xs font-semibold h-9 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>+ Reception Check-In</span>
            </Button>
          )}
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold select-none bg-white px-4 pt-3 rounded-t-lg border-t border-x overflow-x-auto">
        <button
          onClick={() => setActiveTab('FLOOR_BAYS')}
          className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px whitespace-nowrap ${
            activeTab === 'FLOOR_BAYS'
              ? 'border-hero text-hero'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Activity className="h-4 w-4" />
          <span>Workshop 6-Bay Floor Live</span>
        </button>

        <button
          onClick={() => setActiveTab('JOB_CARDS')}
          className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px whitespace-nowrap ${
            activeTab === 'JOB_CARDS'
              ? 'border-hero text-hero'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Wrench className="h-4 w-4" />
          <span>Active Job Cards ({jobCards.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('BOOKINGS')}
          className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px whitespace-nowrap ${
            activeTab === 'BOOKINGS'
              ? 'border-hero text-hero'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>Service Appointments ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('DELIVERIES')}
          className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px whitespace-nowrap ${
            activeTab === 'DELIVERIES'
              ? 'border-hero text-hero'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Truck className="h-4 w-4" />
          <span>Quality Check & Gate Passes</span>
        </button>
      </div>

      {/* TAB 1: WORKSHOP 6-BAY FLOOR MATRIX */}
      {activeTab === 'FLOOR_BAYS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bays.map((bay) => (
              <div
                key={bay.id}
                className={`p-4 rounded-lg border transition-all ${
                  bay.status === 'OCCUPIED'
                    ? bay.isDelayed
                      ? 'bg-red-50/50 border-red-200 shadow-sm'
                      : 'bg-white border-slate-200 shadow-sm'
                    : 'bg-slate-50/70 border-slate-200 border-dashed'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-sm text-slate-900">{bay.code}</span>
                    <span className="text-xs text-slate-500 font-medium truncate max-w-[150px]">
                      {bay.name.split(' - ')[1]}
                    </span>
                  </div>
                  <Badge
                    variant={
                      bay.status === 'OCCUPIED'
                        ? bay.isDelayed
                          ? 'danger'
                          : 'hero'
                        : 'success'
                    }
                    className="text-[10px] font-bold"
                  >
                    {bay.status === 'OCCUPIED'
                      ? bay.isDelayed
                        ? 'DELAYED'
                        : 'IN SERVICE'
                      : 'VACANT'}
                  </Badge>
                </div>

                {bay.status === 'OCCUPIED' ? (
                  <div className="space-y-2 mt-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">
                        {bay.currentVehicleReg}
                      </span>
                      <Badge variant="outline" className="font-mono text-[10px]">
                        {bay.currentJobCardNumber}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-slate-600 text-[11px]">
                      <p className="flex items-center gap-1">
                        <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                        Technician: <strong className="text-slate-800">{bay.assignedTechnician}</strong>
                      </p>
                      <p className="flex items-center gap-1 text-slate-400">
                        <Clock className="h-3.5 w-3.5" />
                        Started at: {bay.startTime}
                      </p>
                    </div>

                    {bay.isDelayed && (
                      <div className="p-2 bg-red-100 text-red-800 rounded text-[11px] flex items-center gap-1.5 font-medium">
                        <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>Delayed: Customer Approval Pending</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-slate-400">
                    <p className="font-medium text-slate-500">Bay is Available</p>
                    <p className="text-[11px]">Ready for next incoming job card</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE JOB CARDS LEDGER */}
      {activeTab === 'JOB_CARDS' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by customer, registration, job card number..."
                className="w-full h-8 pl-8 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-1 focus:ring-hero"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto text-xs">
              {(
                [
                  'ALL',
                  'OPEN',
                  'CUSTOMER_APPROVAL',
                  'WORK_IN_PROGRESS',
                  'QUALITY_CHECK',
                  'READY_FOR_DELIVERY',
                  'COMPLETED',
                ] as const
              ).map((st) => (
                <button
                  key={st}
                  onClick={() => setJobCardStatusFilter(st)}
                  className={`text-[11px] px-2.5 py-1 rounded font-medium whitespace-nowrap transition-colors ${
                    jobCardStatusFilter === st
                      ? 'bg-slate-900 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                    <tr>
                      <th className="text-left p-3.5">Job Card & Reg</th>
                      <th className="text-left p-3.5">Customer & Phone</th>
                      <th className="text-left p-3.5">Service Type & Bay</th>
                      <th className="text-left p-3.5">Assigned Technician</th>
                      <th className="text-right p-3.5">Total Estimate</th>
                      <th className="text-center p-3.5">Status</th>
                      <th className="text-right p-3.5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredJobCards.map((jc) => (
                      <tr key={jc.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3.5">
                          <span className="font-bold font-mono text-hero block">
                            {jc.jobCardNumber}
                          </span>
                          <span className="font-mono text-[11px] font-bold text-slate-800">
                            {jc.registrationNumber}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <Link
                            href={`/customers/${jc.customerId}`}
                            className="font-bold text-slate-900 hover:text-hero block"
                          >
                            {jc.customerName}
                          </Link>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {jc.customerPhone}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-semibold text-slate-800 block">
                            {jc.serviceType}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Bay: <strong>{jc.bayCode || 'Unassigned'}</strong>
                          </span>
                        </td>
                        <td className="p-3.5">
                          {jc.technicianName ? (
                            <span className="flex items-center gap-1 font-medium">
                              <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                              {jc.technicianName}
                            </span>
                          ) : (
                            <Badge variant="warning" className="text-[9px]">
                              UNASSIGNED
                            </Badge>
                          )}
                        </td>
                        <td className="p-3.5 text-right font-bold text-slate-900">
                          {formatINR(jc.totalAmount)}
                          <span className="text-[10px] text-slate-400 block font-normal">
                            Parts: {formatINR(jc.totalParts)}
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          <Badge
                            variant={
                              jc.status === 'COMPLETED'
                                ? 'success'
                                : jc.status === 'READY_FOR_DELIVERY'
                                ? 'info'
                                : jc.status === 'CUSTOMER_APPROVAL' || jc.isDelayed
                                ? 'danger'
                                : 'hero'
                            }
                            className="text-[10px] font-bold"
                          >
                            {jc.status.replace(/_/g, ' ')}
                          </Badge>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {jc.status === 'OPEN' && can('service.assign_tech') && (
                              <Button
                                size="sm"
                                onClick={() => setSelectedJcForAssign(jc)}
                                className="text-[10px] h-7"
                              >
                                Assign Bay
                              </Button>
                            )}

                            {jc.status === 'CUSTOMER_APPROVAL' && jc.approvals?.[0] && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedJcForApproval(jc);
                                  setSelectedApproval(jc.approvals[0]);
                                }}
                                className="text-[10px] h-7 bg-amber-50 text-amber-800 border-amber-300"
                              >
                                Record Approval
                              </Button>
                            )}

                            {jc.status === 'WORK_IN_PROGRESS' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedJcForQc(jc)}
                                className="text-[10px] h-7 gap-1 text-slate-700"
                              >
                                <ClipboardCheck className="h-3 w-3 text-hero" />
                                Quality Check
                              </Button>
                            )}

                            {jc.status === 'READY_FOR_DELIVERY' && (
                              <Button
                                size="sm"
                                onClick={() => setSelectedJcForDelivery(jc)}
                                className="text-[10px] h-7 bg-emerald-600 hover:bg-emerald-700"
                              >
                                Release Gate Pass
                              </Button>
                            )}

                            {jc.status === 'COMPLETED' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setPrintGatePassJc(jc)}
                                className="text-[10px] h-7 text-hero font-bold"
                              >
                                Gate Pass
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 3: SERVICE BOOKINGS */}
      {activeTab === 'BOOKINGS' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Customer Service Appointment Bookings</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 text-xs">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono text-hero">{b.bookingCode}</span>
                      <span className="font-bold text-slate-900">{b.customerName}</span>
                      <Badge variant="outline" className="font-mono text-[10px]">
                        {b.registrationNumber}
                      </Badge>
                      <Badge
                        variant={b.status === 'CONFIRMED' ? 'success' : 'info'}
                        className="text-[9px] font-bold"
                      >
                        {b.status}
                      </Badge>
                    </div>
                    <p className="text-slate-600">
                      <strong>{b.modelName}</strong> • {b.serviceType}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Complaint: <em>"{b.customerComplaint}"</em>
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-xs text-slate-500 block mb-1">
                      Scheduled: {formatDate(b.scheduledDate)} ({b.preferredTime})
                    </span>
                    {b.status === 'CONFIRMED' && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setCheckInForm({
                            name: b.customerName,
                            phone: b.customerPhone,
                            registrationNumber: b.registrationNumber,
                            modelName: b.modelName,
                            serviceType: b.serviceType,
                            customerComplaints: b.customerComplaint,
                            fuelLevel: '1/2 Tank',
                            kmReading: 12000,
                          });
                          setIsCheckInModalOpen(true);
                        }}
                        className="text-[11px] h-7"
                      >
                        Check-In Bike
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 4: DELIVERIES & GATE PASSES */}
      {activeTab === 'DELIVERIES' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Vehicles Ready for Delivery & Completed Handover</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 text-xs">
              {jobCards
                .filter((j) => j.status === 'READY_FOR_DELIVERY' || j.status === 'COMPLETED')
                .map((j) => (
                  <div
                    key={j.id}
                    className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-hero">{j.jobCardNumber}</span>
                        <span className="font-bold text-slate-900">{j.customerName}</span>
                        <span className="font-mono text-slate-700 font-semibold">
                          ({j.registrationNumber})
                        </span>
                      </div>
                      <p className="text-slate-600 mt-0.5">
                        {j.modelName} • {j.serviceType} • Bill: <strong>{formatINR(j.totalAmount)}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {j.status === 'READY_FOR_DELIVERY' ? (
                        <Button
                          size="sm"
                          onClick={() => setSelectedJcForDelivery(j)}
                          className="text-[11px] h-7 bg-emerald-600 hover:bg-emerald-700"
                        >
                          Handover & Print Gate Pass
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setPrintGatePassJc(j)}
                          className="text-[11px] h-7 gap-1"
                        >
                          <Printer className="h-3 w-3" />
                          View Gate Pass
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* MODAL: Reception Check-In */}
      <Modal
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
        title="Service Reception & Vehicle Check-In"
        description="Record odometer, fuel gauge, customer complaints, and create digital Job Card."
        size="lg"
      >
        <form onSubmit={handleCheckInSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Customer Full Name</label>
              <Input
                value={checkInForm.name}
                onChange={(e) => setCheckInForm({ ...checkInForm, name: e.target.value })}
                placeholder="e.g. Ramesh Patel"
                required
                autoFocus
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mobile Number</label>
              <Input
                value={checkInForm.phone}
                onChange={(e) => setCheckInForm({ ...checkInForm, phone: e.target.value })}
                placeholder="+91 98765 XXXXX"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Vehicle Registration #</label>
              <Input
                value={checkInForm.registrationNumber}
                onChange={(e) =>
                  setCheckInForm({
                    ...checkInForm,
                    registrationNumber: e.target.value.toUpperCase(),
                  })
                }
                placeholder="GJ-36-AB-1234"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Hero Model</label>
              <select
                value={checkInForm.modelName}
                onChange={(e) => setCheckInForm({ ...checkInForm, modelName: e.target.value })}
                className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-xs text-slate-800"
              >
                <option value="Hero Splendor Plus">Hero Splendor Plus</option>
                <option value="Hero Passion Pro">Hero Passion Pro</option>
                <option value="Hero HF Deluxe">Hero HF Deluxe</option>
                <option value="Hero Xpulse 200 4V">Hero Xpulse 200 4V</option>
                <option value="Hero Xtreme 160R 4V">Hero Xtreme 160R 4V</option>
                <option value="Hero Pleasure Plus XTEC">Hero Pleasure Plus XTEC</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Service Type</label>
              <select
                value={checkInForm.serviceType}
                onChange={(e) => setCheckInForm({ ...checkInForm, serviceType: e.target.value })}
                className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-xs text-slate-800"
              >
                <option value="Free Service #1">Free Service #1</option>
                <option value="Free Service #2">Free Service #2</option>
                <option value="Free Service #3">Free Service #3</option>
                <option value="Free Service #4">Free Service #4</option>
                <option value="Free Service #5">Free Service #5</option>
                <option value="Paid Periodic Service">Paid Periodic Service</option>
                <option value="Running Repair">Running Repair</option>
                <option value="Accidental Repair">Accidental Repair</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Current Odometer (KM)</label>
              <Input
                type="number"
                value={checkInForm.kmReading}
                onChange={(e) =>
                  setCheckInForm({ ...checkInForm, kmReading: Number(e.target.value) })
                }
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Fuel Gauge Level</label>
              <select
                value={checkInForm.fuelLevel}
                onChange={(e) => setCheckInForm({ ...checkInForm, fuelLevel: e.target.value })}
                className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-xs text-slate-800"
              >
                <option value="Reserve">Reserve</option>
                <option value="1/4 Tank">1/4 Tank</option>
                <option value="1/2 Tank">1/2 Tank</option>
                <option value="3/4 Tank">3/4 Tank</option>
                <option value="Full Tank">Full Tank</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Customer Complaints & Work Requested
            </label>
            <textarea
              value={checkInForm.customerComplaints}
              onChange={(e) =>
                setCheckInForm({ ...checkInForm, customerComplaints: e.target.value })
              }
              placeholder="e.g. Engine oil flush, chain adjustment, squeaking noise in rear brakes..."
              className="w-full h-16 rounded-md border border-slate-200 p-2 text-xs focus:ring-1 focus:ring-hero"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCheckInModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" className="font-semibold">
              Generate Job Card
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: Assign Bay and Technician */}
      {selectedJcForAssign && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedJcForAssign(null)}
          title="Assign Workshop Service Bay & Technician"
          description={`Job Card #${selectedJcForAssign.jobCardNumber} (${selectedJcForAssign.registrationNumber})`}
          size="md"
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Select Service Bay</label>
              <select
                value={targetBayId}
                onChange={(e) => setTargetBayId(e.target.value)}
                className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-xs text-slate-800"
              >
                {bays.map((b) => (
                  <option key={b.id} value={b.id} disabled={b.status === 'OCCUPIED'}>
                    {b.code} - {b.name} ({b.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Allocate Service Technician
              </label>
              <select
                value={targetTechName}
                onChange={(e) => setTargetTechName(e.target.value)}
                className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-xs text-slate-800"
              >
                <option value="Pravin Solanki">Pravin Solanki (Active: 1 • Workload: Normal)</option>
                <option value="Dhaval Makwana">Dhaval Makwana (Active: 1 • Workload: Normal)</option>
                <option value="Kishore Parmar">Kishore Parmar (Active: 0 • Workload: Free)</option>
                <option value="Sanjay Rathod">Sanjay Rathod (Active: 0 • Workload: Free)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedJcForAssign(null)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleAssignBayAndTech}>
                Confirm Bay Assignment
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: Customer Additional Work Approval */}
      {selectedJcForApproval && selectedApproval && (
        <Modal
          isOpen={true}
          onClose={() => {
            setSelectedJcForApproval(null);
            setSelectedApproval(null);
          }}
          title="Customer Approval for Additional Repair Work"
          description={`Job Card #${selectedJcForApproval.jobCardNumber} (${selectedJcForApproval.customerName})`}
          size="md"
        >
          <div className="space-y-4 text-xs">
            <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-lg space-y-1">
              <p className="font-bold">Additional Work Discovered by Technician:</p>
              <p>{selectedApproval.description}</p>
              <p className="font-bold text-sm text-hero">
                Estimated Cost: {formatINR(selectedApproval.estimatedCost)}
              </p>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Customer Feedback / Call Notes
              </label>
              <textarea
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                placeholder="Spoke with customer over phone; approved chain sprocket replacement..."
                className="w-full h-16 rounded-md border border-slate-200 p-2 text-xs focus:ring-1 focus:ring-hero"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCustomerApprovalSubmit(false)}
                className="text-red-600 text-[11px]"
              >
                Customer Rejected
              </Button>
              <Button
                size="sm"
                onClick={() => handleCustomerApprovalSubmit(true)}
                className="font-semibold text-[11px]"
              >
                Customer Approved
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: Quality Check (QC) */}
      {selectedJcForQc && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedJcForQc(null)}
          title="Post-Service 7-Point Quality Check"
          description={`Vehicle ${selectedJcForQc.registrationNumber} • Job #${selectedJcForQc.jobCardNumber}`}
          size="md"
        >
          <div className="space-y-4 text-xs">
            <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded text-hero focus:ring-hero" />
                <span>All customer requested complaints serviced & verified</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded text-hero focus:ring-hero" />
                <span>Engine oil level & drain bolt torqued</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded text-hero focus:ring-hero" />
                <span>Brake free-play & tyre pressure calibrated</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded text-hero focus:ring-hero" />
                <span>Electricals, headlight, horn & indicators verified</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded text-hero focus:ring-hero" />
                <span>Vehicle washed, polished & clean</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded text-hero focus:ring-hero" />
                <span>1km Road test ride completed without vibration</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQualityCheckSubmit(false)}
                className="text-red-600 text-[11px]"
              >
                QC Failed (Rework)
              </Button>
              <Button
                size="sm"
                onClick={() => handleQualityCheckSubmit(true)}
                className="font-semibold text-[11px]"
              >
                Pass Quality Check
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: Delivery Handover & Gate Pass Release */}
      {selectedJcForDelivery && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedJcForDelivery(null)}
          title="Service Handover & Gate Pass Release"
          description={`Customer: ${selectedJcForDelivery.customerName} (${selectedJcForDelivery.registrationNumber})`}
          size="md"
        >
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
              <p>
                <strong>Total Service Bill:</strong> {formatINR(selectedJcForDelivery.totalAmount)}
              </p>
              <p className="text-emerald-700 font-semibold">✓ Quality Check Passed</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Final Odometer (KM)</label>
                <Input
                  type="number"
                  value={deliveryKm}
                  onChange={(e) => setDeliveryKm(Number(e.target.value))}
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Payment Method</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-xs text-slate-800"
                >
                  <option value="UPI">UPI / QR Code</option>
                  <option value="CASH">Cash Counter</option>
                  <option value="CARD">Credit / Debit Card</option>
                  <option value="FREE_COUPON">Free Service Coupon</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedJcForDelivery(null)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleServiceDeliverySubmit}
                className="bg-emerald-600 hover:bg-emerald-700 font-semibold"
              >
                Complete Delivery & Release Gate Pass
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: Service Invoice & Gate Pass Preview */}
      {printGatePassJc && (
        <Modal
          isOpen={true}
          onClose={() => setPrintGatePassJc(null)}
          title="Hero Workshop Service Gate Pass & Invoice"
          description={`Gate Pass #${printGatePassJc.invoiceNumber || 'GP-8901'}`}
          size="lg"
        >
          <div className="space-y-4 text-xs p-2">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">SHREEJI HERO WORKSHOP</h2>
                <p className="text-[11px] text-slate-500">Authorized Hero Service Center, Halvad Branch</p>
              </div>
              <div className="text-right">
                <Badge variant="hero" className="font-mono text-xs">
                  {printGatePassJc.invoiceNumber || 'GATE PASS'}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="font-bold text-slate-700 block">Customer Information:</span>
                <p className="font-semibold text-slate-900">{printGatePassJc.customerName}</p>
                <p className="text-slate-500">{printGatePassJc.customerPhone}</p>
              </div>
              <div>
                <span className="font-bold text-slate-700 block">Vehicle Identifiers:</span>
                <p className="font-bold text-slate-900">{printGatePassJc.registrationNumber}</p>
                <p className="text-slate-500">{printGatePassJc.modelName}</p>
              </div>
            </div>

            <table className="w-full border-collapse">
              <thead className="bg-slate-100 text-slate-600 font-semibold border-y">
                <tr>
                  <th className="text-left p-2">Work & Parts Description</th>
                  <th className="text-center p-2">Qty</th>
                  <th className="text-right p-2">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {printGatePassJc.items.map((item) => (
                  <tr key={item.id}>
                    <td className="p-2">{item.description}</td>
                    <td className="p-2 text-center">{item.qty}</td>
                    <td className="p-2 text-right">{formatINR(item.totalAmount)}</td>
                  </tr>
                ))}
                <tr className="font-bold bg-slate-50 text-sm border-t border-slate-300">
                  <td className="p-2" colSpan={2}>
                    Total Invoice Amount
                  </td>
                  <td className="p-2 text-right text-hero">
                    {formatINR(printGatePassJc.totalAmount)}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setPrintGatePassJc(null)}>
                Close
              </Button>
              <Button size="sm" onClick={() => window.print()} className="gap-1.5 font-semibold">
                <Printer className="h-3.5 w-3.5" />
                Print Gate Pass
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
