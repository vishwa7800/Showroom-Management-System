'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import {
  BookingRecord,
  QuotationRecord,
  VehicleStockUnit,
  SalesInvoiceRecord,
  PdiChecklist,
} from '@/lib/db/sales-store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import {
  ShoppingBag,
  FileText,
  Bike,
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
  Key,
  Truck,
} from 'lucide-react';
import { formatINR, formatDate } from '@/lib/utils';

export default function SalesPage() {
  const { user, activeBranchId, can } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<
    'BOOKINGS' | 'QUOTATIONS' | 'ALLOCATION' | 'PDI_DELIVERY' | 'INVOICES'
  >('BOOKINGS');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Datasets
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [quotations, setQuotations] = useState<QuotationRecord[]>([]);
  const [availableVehicles, setAvailableVehicles] = useState<VehicleStockUnit[]>([]);
  const [invoices, setInvoices] = useState<SalesInvoiceRecord[]>([]);

  // Modals State
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    phone: '',
    modelName: 'Hero Splendor Plus XTEC',
    variantName: 'Disc Self Cast',
    color: 'Black Nexus Blue',
    exShowroomPrice: 79500,
    rtoCharges: 5800,
    insuranceCharges: 4200,
    accessoriesCharges: 2500,
    discount: 1500,
    downPayment: 25000,
    loanAmount: 65500,
    notes: '',
  });

  const [selectedBookingForApproval, setSelectedBookingForApproval] =
    useState<BookingRecord | null>(null);
  const [selectedBookingForAlloc, setSelectedBookingForAlloc] =
    useState<BookingRecord | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState('');

  const [selectedBookingForPdi, setSelectedBookingForPdi] =
    useState<BookingRecord | null>(null);
  const [pdiForm, setPdiForm] = useState<PdiChecklist>({
    cleanlinessPassed: true,
    bodyPassed: true,
    tyresPassed: true,
    batteryPassed: true,
    lightsPassed: true,
    hornPassed: true,
    fuelLevel: '2 Litres',
    odometerReading: 2,
    keysCount: 2,
    toolkitPresent: true,
    ownerManualPresent: true,
    notes: '',
  });

  const [selectedBookingForDelivery, setSelectedBookingForDelivery] =
    useState<BookingRecord | null>(null);
  const [deliveryForm, setDeliveryForm] = useState({
    odometerReading: 3,
    customerNotes: 'Customer satisfied with PDI and briefing.',
  });

  const [viewInvoice, setViewInvoice] = useState<SalesInvoiceRecord | null>(null);

  const fetchSalesData = async () => {
    try {
      setIsLoading(true);
      const [bRes, qRes, vRes, iRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/quotations'),
        fetch('/api/vehicles/available'),
        fetch('/api/sales/invoices'),
      ]);

      const [bData, qData, vData, iData] = await Promise.all([
        bRes.json(),
        qRes.json(),
        vRes.json(),
        iRes.json(),
      ]);

      if (bData.success) setBookings(bData.bookings);
      if (qData.success) setQuotations(qData.quotations);
      if (vData.success) setAvailableVehicles(vData.vehicles);
      if (iData.success) setInvoices(iData.invoices);
    } catch (e) {
      toast('Error', 'Failed to load sales pipeline data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, [activeBranchId]);

  // Handlers
  const handleCreateQuotation = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1. Find or create customer
      const searchRes = await fetch(`/api/customers?search=${quoteForm.phone}`);
      const searchData = await searchRes.json();
      let customerId: string;

      if (searchData.customers?.[0]) {
        customerId = searchData.customers[0].id;
      } else {
        const custRes = await fetch('/api/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: quoteForm.name,
            phone: quoteForm.phone,
            address: 'Showroom Sales Quotation',
            city: 'Halvad',
            pincode: '363330',
            branchId: activeBranchId || 'br_halvad',
            source: 'WALK_IN',
          }),
        });
        const custData = await custRes.json();
        customerId = custData.customer.id;
      }

      // 2. Create Quotation
      const res = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          modelName: quoteForm.modelName,
          variantName: quoteForm.variantName,
          color: quoteForm.color,
          exShowroomPrice: Number(quoteForm.exShowroomPrice),
          rtoCharges: Number(quoteForm.rtoCharges),
          insuranceCharges: Number(quoteForm.insuranceCharges),
          accessoriesCharges: Number(quoteForm.accessoriesCharges),
          discount: Number(quoteForm.discount),
          downPayment: Number(quoteForm.downPayment),
          loanAmount: Number(quoteForm.loanAmount),
          notes: quoteForm.notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast('Cannot Create Quote', data.error, 'error');
        return;
      }

      toast(
        'Quotation Generated',
        `Quote #${data.quotation.quotationNumber} saved with on-road price ₹${data.quotation.onRoadPrice.toLocaleString('en-IN')}.`,
        'success'
      );
      setIsQuoteModalOpen(false);
      fetchSalesData();
    } catch (e) {
      toast('Error', 'Network error creating quotation', 'error');
    }
  };

  const handleConvertQuote = async (quoteId: string) => {
    try {
      const res = await fetch(`/api/quotations/${quoteId}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingAmount: 5000, paymentMode: 'UPI' }),
      });
      const data = await res.json();
      if (data.success) {
        toast(
          'Converted to Booking',
          `Booking #${data.booking.bookingCode} generated. Submitted for Manager approval.`,
          'success'
        );
        fetchSalesData();
        setActiveTab('BOOKINGS');
      }
    } catch (e) {
      toast('Error', 'Failed to convert quotation', 'error');
    }
  };

  const handleApproveBooking = async (approved: boolean) => {
    if (!selectedBookingForApproval) return;

    try {
      const res = await fetch(`/api/bookings/${selectedBookingForApproval.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved }),
      });
      const data = await res.json();
      if (data.success) {
        toast(
          approved ? 'Booking Approved' : 'Booking Rejected',
          `Booking #${data.booking.bookingCode} status updated.`,
          approved ? 'success' : 'error'
        );
        setSelectedBookingForApproval(null);
        fetchSalesData();
      }
    } catch (e) {
      toast('Error', 'Failed to approve booking', 'error');
    }
  };

  const handleAllocateVehicle = async () => {
    if (!selectedBookingForAlloc || !selectedUnitId) return;

    try {
      const res = await fetch(`/api/bookings/${selectedBookingForAlloc.id}/allocate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleUnitId: selectedUnitId }),
      });
      const data = await res.json();
      if (data.success) {
        toast(
          'Vehicle Unit Allocated',
          `Allocated Chassis VIN: ${data.booking.allocatedVin}.`,
          'success'
        );
        setSelectedBookingForAlloc(null);
        setSelectedUnitId('');
        fetchSalesData();
      }
    } catch (e) {
      toast('Error', 'Failed to allocate vehicle', 'error');
    }
  };

  const handleSavePdi = async () => {
    if (!selectedBookingForPdi) return;

    try {
      const res = await fetch(`/api/bookings/${selectedBookingForPdi.id}/pdi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pdiForm),
      });
      const data = await res.json();
      if (data.success) {
        toast(
          'PDI Inspection Logged',
          `Status: ${data.booking.pdiStatus}. Vehicle ready for delivery checklist.`,
          'success'
        );
        setSelectedBookingForPdi(null);
        fetchSalesData();
      }
    } catch (e) {
      toast('Error', 'Failed to save PDI inspection', 'error');
    }
  };

  const handleCompleteDelivery = async () => {
    if (!selectedBookingForDelivery) return;

    try {
      const res = await fetch(`/api/bookings/${selectedBookingForDelivery.id}/deliver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deliveryForm),
      });
      const data = await res.json();
      if (data.success) {
        toast(
          '🎉 Delivery Completed!',
          `Vehicle successfully delivered. Tax Invoice & Gate Pass #${data.invoice.invoiceNumber} generated.`,
          'success'
        );
        setSelectedBookingForDelivery(null);
        fetchSalesData();
        setViewInvoice(data.invoice);
      }
    } catch (e) {
      toast('Error', 'Failed to complete delivery', 'error');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus =
      bookingStatusFilter === 'ALL' || b.status === bookingStatusFilter;
    const matchesSearch =
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerPhone.includes(searchQuery) ||
      b.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.modelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.allocatedVin && b.allocatedVin.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Vehicle Sales, Bookings & Delivery Desk
            </h1>
            <Badge variant="hero" className="font-bold text-[10px] uppercase">
              Sales Desk
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete vehicle sale lifecycle: Quotation → Booking → Approval → Allocation → PDI → Delivery Gate Pass.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {can('sales.create') && (
            <Button
              size="sm"
              onClick={() => setIsQuoteModalOpen(true)}
              className="gap-1.5 text-xs font-semibold h-9 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>+ Generate Quotation</span>
            </Button>
          )}
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold select-none bg-white px-4 pt-3 rounded-t-lg border-t border-x">
        <button
          onClick={() => setActiveTab('BOOKINGS')}
          className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px ${
            activeTab === 'BOOKINGS'
              ? 'border-hero text-hero'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Vehicle Bookings ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('QUOTATIONS')}
          className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px ${
            activeTab === 'QUOTATIONS'
              ? 'border-hero text-hero'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Quotations ({quotations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ALLOCATION')}
          className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px ${
            activeTab === 'ALLOCATION'
              ? 'border-hero text-hero'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Key className="h-4 w-4" />
          <span>Physical Stock Allocation ({availableVehicles.length} Units Avail)</span>
        </button>

        <button
          onClick={() => setActiveTab('PDI_DELIVERY')}
          className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px ${
            activeTab === 'PDI_DELIVERY'
              ? 'border-hero text-hero'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Truck className="h-4 w-4" />
          <span>PDI & Delivery Handover</span>
        </button>

        <button
          onClick={() => setActiveTab('INVOICES')}
          className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px ${
            activeTab === 'INVOICES'
              ? 'border-hero text-hero'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Printer className="h-4 w-4" />
          <span>Tax Invoices ({invoices.length})</span>
        </button>
      </div>

      {/* TAB 1: VEHICLE BOOKINGS */}
      {activeTab === 'BOOKINGS' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by customer, booking code, VIN, phone..."
                className="w-full h-8 pl-8 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-1 focus:ring-hero"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto text-xs">
              {(
                [
                  'ALL',
                  'PENDING_APPROVAL',
                  'CONFIRMED',
                  'VEHICLE_ALLOCATED',
                  'READY_FOR_DELIVERY',
                  'DELIVERED',
                ] as const
              ).map((st) => (
                <button
                  key={st}
                  onClick={() => setBookingStatusFilter(st)}
                  className={`text-[11px] px-2.5 py-1 rounded font-medium whitespace-nowrap transition-colors ${
                    bookingStatusFilter === st
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
                      <th className="text-left p-3.5">Booking Code</th>
                      <th className="text-left p-3.5">Customer & Phone</th>
                      <th className="text-left p-3.5">Hero Model & Variant</th>
                      <th className="text-left p-3.5">Allocated VIN / Chassis</th>
                      <th className="text-right p-3.5">Total On-Road</th>
                      <th className="text-center p-3.5">Booking Status</th>
                      <th className="text-right p-3.5">Lifecycle Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3.5 font-bold font-mono text-hero">{b.bookingCode}</td>
                        <td className="p-3.5">
                          <Link
                            href={`/customers/${b.customerId}`}
                            className="font-bold text-slate-900 hover:text-hero block"
                          >
                            {b.customerName}
                          </Link>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {b.customerPhone}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-semibold text-slate-900 block">{b.modelName}</span>
                          <span className="text-[10px] text-slate-400 block">
                            {b.variantName} • {b.color}
                          </span>
                        </td>
                        <td className="p-3.5">
                          {b.allocatedVin ? (
                            <span className="font-mono text-[11px] font-semibold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">
                              {b.allocatedVin}
                            </span>
                          ) : (
                            <span className="text-[11px] text-amber-600 font-medium italic">
                              Pending Allocation
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-right font-bold text-slate-900">
                          {formatINR(b.totalOnRoadPrice)}
                          <span className="text-[10px] text-slate-400 block font-normal">
                            Paid: {formatINR(b.paidAmount)} ({b.paymentMode})
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          <Badge
                            variant={
                              b.status === 'DELIVERED'
                                ? 'success'
                                : b.status === 'READY_FOR_DELIVERY'
                                ? 'info'
                                : b.status === 'CONFIRMED' || b.status === 'VEHICLE_ALLOCATED'
                                ? 'hero'
                                : 'warning'
                            }
                            className="text-[10px] font-bold"
                          >
                            {b.status.replace(/_/g, ' ')}
                          </Badge>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Manager Approval Trigger */}
                            {b.status === 'PENDING_APPROVAL' && can('sales.approve') && (
                              <Button
                                size="sm"
                                onClick={() => setSelectedBookingForApproval(b)}
                                className="text-[10px] h-7 bg-slate-900 hover:bg-slate-800"
                              >
                                Review & Approve
                              </Button>
                            )}

                            {/* Physical Unit Allocation Trigger */}
                            {b.status === 'CONFIRMED' && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedBookingForAlloc(b);
                                  setSelectedUnitId(availableVehicles[0]?.id || '');
                                }}
                                className="text-[10px] h-7"
                              >
                                Allocate Bike
                              </Button>
                            )}

                            {/* PDI Trigger */}
                            {b.status === 'VEHICLE_ALLOCATED' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedBookingForPdi(b)}
                                className="text-[10px] h-7 gap-1 text-slate-700"
                              >
                                <ClipboardCheck className="h-3 w-3 text-hero" />
                                Run PDI
                              </Button>
                            )}

                            {/* Delivery Handover Trigger */}
                            {b.status === 'READY_FOR_DELIVERY' && (
                              <Button
                                size="sm"
                                onClick={() => setSelectedBookingForDelivery(b)}
                                className="text-[10px] h-7 gap-1 bg-emerald-600 hover:bg-emerald-700"
                              >
                                <Truck className="h-3 w-3" />
                                Handover Delivery
                              </Button>
                            )}

                            {b.status === 'DELIVERED' && b.invoiceNumber && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  const inv = invoices.find((i) => i.invoiceNumber === b.invoiceNumber);
                                  if (inv) setViewInvoice(inv);
                                }}
                                className="text-[10px] h-7 text-hero font-bold"
                              >
                                View Invoice
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

      {/* TAB 2: QUOTATIONS */}
      {activeTab === 'QUOTATIONS' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm">Customer Quotations Ledger</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">
                Official on-road price quotes with tax, insurance, RTO, and financier EMI breakdowns.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setIsQuoteModalOpen(true)}
              className="text-xs h-8 gap-1.5 font-semibold"
            >
              <Plus className="h-3.5 w-3.5" />
              New Quotation
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 text-xs">
              {quotations.map((q) => (
                <div
                  key={q.id}
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono text-hero">{q.quotationNumber}</span>
                      <span className="font-bold text-slate-900">{q.customerName}</span>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {q.customerPhone}
                      </Badge>
                      <Badge
                        variant={q.status === 'CONVERTED' ? 'success' : 'info'}
                        className="text-[9px] font-bold"
                      >
                        {q.status}
                      </Badge>
                    </div>
                    <p className="text-slate-600">
                      <strong>{q.modelName}</strong> ({q.variantName} • {q.color})
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                      <span>Ex-Showroom: {formatINR(q.exShowroomPrice)}</span>
                      <span>RTO: {formatINR(q.rtoCharges)}</span>
                      <span>Ins: {formatINR(q.insuranceCharges)}</span>
                      <span>Acc: {formatINR(q.accessoriesCharges)}</span>
                      {q.discount > 0 && (
                        <span className="text-emerald-600 font-semibold">
                          Discount: -{formatINR(q.discount)}
                        </span>
                      )}
                    </div>
                    {q.estimatedEmi && (
                      <span className="text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded inline-block font-semibold">
                        Estimated EMI: ₹{q.estimatedEmi.toLocaleString('en-IN')}/mo (DP: {formatINR(q.downPayment || 0)})
                      </span>
                    )}
                  </div>

                  <div className="text-right flex-shrink-0 space-y-1">
                    <span className="text-base font-bold text-slate-900 block">
                      {formatINR(q.onRoadPrice)}
                    </span>
                    {q.status !== 'CONVERTED' && (
                      <Button
                        size="sm"
                        onClick={() => handleConvertQuote(q.id)}
                        className="text-[11px] h-7 gap-1 font-semibold"
                      >
                        Convert to Booking
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 3: PHYSICAL VEHICLE ALLOCATION */}
      {activeTab === 'ALLOCATION' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">In-Stock Showroom Vehicle Fleet (Available for Allocation)</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Physical units with verified Chassis VIN and Engine numbers ready to assign to confirmed customer bookings.
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="text-left p-3.5">Chassis Number / VIN</th>
                    <th className="text-left p-3.5">Engine Number</th>
                    <th className="text-left p-3.5">Model & Variant</th>
                    <th className="text-left p-3.5">Color Scheme</th>
                    <th className="text-right p-3.5">Ex-Showroom</th>
                    <th className="text-center p-3.5">Stock Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {availableVehicles.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 font-bold font-mono text-slate-900">{v.vin}</td>
                      <td className="p-3.5 font-mono text-slate-500">{v.engineNumber}</td>
                      <td className="p-3.5 font-semibold text-slate-800">
                        {v.modelName} - {v.variantName}
                      </td>
                      <td className="p-3.5 text-slate-600">{v.color}</td>
                      <td className="p-3.5 text-right font-bold text-slate-900">
                        {formatINR(v.exShowroomPrice)}
                      </td>
                      <td className="p-3.5 text-center">
                        <Badge variant="success" withDot className="text-[10px]">
                          Available
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 4: PDI & DELIVERY HANDOVER */}
      {activeTab === 'PDI_DELIVERY' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Pending Pre-Delivery Inspections (PDI)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 text-xs">
                {bookings
                  .filter((b) => b.status === 'VEHICLE_ALLOCATED')
                  .map((b) => (
                    <div key={b.id} className="p-4 flex items-center justify-between gap-4">
                      <div>
                        <span className="font-bold text-slate-900 block">{b.customerName}</span>
                        <span className="text-slate-600 block">
                          {b.modelName} • VIN: {b.allocatedVin}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => setSelectedBookingForPdi(b)}
                        className="text-[11px] h-7"
                      >
                        Start Inspection
                      </Button>
                    </div>
                  ))}
                {bookings.filter((b) => b.status === 'VEHICLE_ALLOCATED').length === 0 && (
                  <p className="p-6 text-center text-slate-400 text-xs">No pending PDI inspections.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Ready for Customer Delivery Handover</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 text-xs">
                {bookings
                  .filter((b) => b.status === 'READY_FOR_DELIVERY')
                  .map((b) => (
                    <div key={b.id} className="p-4 flex items-center justify-between gap-4">
                      <div>
                        <span className="font-bold text-slate-900 block">{b.customerName}</span>
                        <span className="text-slate-600 block">
                          {b.modelName} • VIN: {b.allocatedVin}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-semibold block">
                          ✓ PDI Passed • Ready for Key Handover
                        </span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => setSelectedBookingForDelivery(b)}
                        className="text-[11px] h-7 bg-emerald-600 hover:bg-emerald-700"
                      >
                        Handover Delivery
                      </Button>
                    </div>
                  ))}
                {bookings.filter((b) => b.status === 'READY_FOR_DELIVERY').length === 0 && (
                  <p className="p-6 text-center text-slate-400 text-xs">
                    No vehicles waiting for delivery handover.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 5: FINALIZED TAX INVOICES */}
      {activeTab === 'INVOICES' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Finalized Sales Invoices & Gate Passes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="text-left p-3.5">Invoice Number</th>
                    <th className="text-left p-3.5">Customer & Phone</th>
                    <th className="text-left p-3.5">Vehicle VIN & Model</th>
                    <th className="text-left p-3.5">Invoice Date</th>
                    <th className="text-right p-3.5">Total Amount</th>
                    <th className="text-right p-3.5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 font-bold font-mono text-hero">{inv.invoiceNumber}</td>
                      <td className="p-3.5">
                        <span className="font-bold text-slate-900 block">{inv.customerName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {inv.customerPhone}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold text-slate-800 block">{inv.modelName}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          VIN: {inv.vin}
                        </span>
                      </td>
                      <td className="p-3.5 font-medium text-slate-700">{inv.invoiceDate}</td>
                      <td className="p-3.5 text-right font-bold text-slate-900">
                        {formatINR(inv.totalAmount)}
                      </td>
                      <td className="p-3.5 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setViewInvoice(inv)}
                          className="text-[11px] h-7 gap-1"
                        >
                          <Printer className="h-3 w-3" />
                          View Print
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* MODAL: Generate Quotation */}
      <Modal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        title="Generate Vehicle Sales Quotation"
        description="Calculate on-road pricing with RTO, insurance, accessories, and loan EMI."
        size="lg"
      >
        <form onSubmit={handleCreateQuotation} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Customer Name</label>
              <Input
                value={quoteForm.name}
                onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                placeholder="e.g. Rahul Sharma"
                required
                autoFocus
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mobile Number</label>
              <Input
                value={quoteForm.phone}
                onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                placeholder="+91 98765 XXXXX"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Hero Model</label>
              <select
                value={quoteForm.modelName}
                onChange={(e) => setQuoteForm({ ...quoteForm, modelName: e.target.value })}
                className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-xs text-slate-800"
              >
                <option value="Hero Splendor Plus XTEC">Hero Splendor Plus XTEC</option>
                <option value="Hero Xtreme 160R 4V">Hero Xtreme 160R 4V</option>
                <option value="Hero Xpulse 200 4V">Hero Xpulse 200 4V</option>
                <option value="Hero HF Deluxe">Hero HF Deluxe</option>
                <option value="Hero Passion Pro">Hero Passion Pro</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Variant</label>
              <Input
                value={quoteForm.variantName}
                onChange={(e) => setQuoteForm({ ...quoteForm, variantName: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Color Scheme</label>
              <Input
                value={quoteForm.color}
                onChange={(e) => setQuoteForm({ ...quoteForm, color: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Ex-Showroom (₹)</label>
              <Input
                type="number"
                value={quoteForm.exShowroomPrice}
                onChange={(e) =>
                  setQuoteForm({ ...quoteForm, exShowroomPrice: Number(e.target.value) })
                }
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">RTO Tax (₹)</label>
              <Input
                type="number"
                value={quoteForm.rtoCharges}
                onChange={(e) =>
                  setQuoteForm({ ...quoteForm, rtoCharges: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Insurance (₹)</label>
              <Input
                type="number"
                value={quoteForm.insuranceCharges}
                onChange={(e) =>
                  setQuoteForm({ ...quoteForm, insuranceCharges: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Showroom Disc (₹)</label>
              <Input
                type="number"
                value={quoteForm.discount}
                onChange={(e) =>
                  setQuoteForm({ ...quoteForm, discount: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsQuoteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" className="font-semibold">
              Generate & Save Quotation
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: Booking Approval */}
      {selectedBookingForApproval && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedBookingForApproval(null)}
          title="Showroom Manager Review & Approval"
          description={`Booking #${selectedBookingForApproval.bookingCode} for ${selectedBookingForApproval.customerName}`}
          size="md"
        >
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
              <p>
                <strong>Customer:</strong> {selectedBookingForApproval.customerName} (
                {selectedBookingForApproval.customerPhone})
              </p>
              <p>
                <strong>Vehicle:</strong> {selectedBookingForApproval.modelName} (
                {selectedBookingForApproval.variantName} • {selectedBookingForApproval.color})
              </p>
              <p>
                <strong>Total Price:</strong> {formatINR(selectedBookingForApproval.totalOnRoadPrice)} |{' '}
                <strong>Token Paid:</strong> {formatINR(selectedBookingForApproval.paidAmount)} (
                {selectedBookingForApproval.paymentMode})
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleApproveBooking(false)}
                className="text-red-600 hover:bg-red-50 text-[11px]"
              >
                Reject Booking
              </Button>
              <Button
                size="sm"
                onClick={() => handleApproveBooking(true)}
                className="font-semibold text-[11px]"
              >
                Confirm & Approve
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: Allocate Physical Stock Unit */}
      {selectedBookingForAlloc && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedBookingForAlloc(null)}
          title="Allocate Physical Stock Unit"
          description={`Assign in-stock vehicle to Booking #${selectedBookingForAlloc.bookingCode} (${selectedBookingForAlloc.customerName})`}
          size="md"
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Select Available Vehicle Unit (Chassis / VIN)
              </label>
              <select
                value={selectedUnitId}
                onChange={(e) => setSelectedUnitId(e.target.value)}
                className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-xs text-slate-800"
              >
                {availableVehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    VIN: {v.vin} | Eng: {v.engineNumber} | {v.modelName} ({v.color})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedBookingForAlloc(null)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleAllocateVehicle}>
                Lock & Allocate Unit
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: 12-Point PDI Checklist */}
      {selectedBookingForPdi && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedBookingForPdi(null)}
          title="12-Point Pre-Delivery Inspection (PDI)"
          description={`Vehicle VIN: ${selectedBookingForPdi.allocatedVin} • Model: ${selectedBookingForPdi.modelName}`}
          size="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pdiForm.cleanlinessPassed}
                  onChange={(e) =>
                    setPdiForm({ ...pdiForm, cleanlinessPassed: e.target.checked })
                  }
                  className="rounded text-hero focus:ring-hero"
                />
                <span>Exterior Cleanliness & Polish</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pdiForm.bodyPassed}
                  onChange={(e) => setPdiForm({ ...pdiForm, bodyPassed: e.target.checked })}
                  className="rounded text-hero focus:ring-hero"
                />
                <span>Body Panels & Scratch Inspection</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pdiForm.tyresPassed}
                  onChange={(e) => setPdiForm({ ...pdiForm, tyresPassed: e.target.checked })}
                  className="rounded text-hero focus:ring-hero"
                />
                <span>Tyre Pressure & Tread Check</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pdiForm.batteryPassed}
                  onChange={(e) =>
                    setPdiForm({ ...pdiForm, batteryPassed: e.target.checked })
                  }
                  className="rounded text-hero focus:ring-hero"
                />
                <span>Battery Terminal & Voltage (12.4V+)</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pdiForm.lightsPassed}
                  onChange={(e) => setPdiForm({ ...pdiForm, lightsPassed: e.target.checked })}
                  className="rounded text-hero focus:ring-hero"
                />
                <span>Headlight, Tail Light & Blinkers</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pdiForm.hornPassed}
                  onChange={(e) => setPdiForm({ ...pdiForm, hornPassed: e.target.checked })}
                  className="rounded text-hero focus:ring-hero"
                />
                <span>Horn & Instrument Console</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pdiForm.toolkitPresent}
                  onChange={(e) =>
                    setPdiForm({ ...pdiForm, toolkitPresent: e.target.checked })
                  }
                  className="rounded text-hero focus:ring-hero"
                />
                <span>Toolkit & First Aid Kit Present</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pdiForm.ownerManualPresent}
                  onChange={(e) =>
                    setPdiForm({ ...pdiForm, ownerManualPresent: e.target.checked })
                  }
                  className="rounded text-hero focus:ring-hero"
                />
                <span>Owner's Manual & Service Book</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedBookingForPdi(null)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleSavePdi}>
                Submit PDI Verification
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: Delivery Handover & Gate Pass */}
      {selectedBookingForDelivery && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedBookingForDelivery(null)}
          title="Vehicle Handover & Gate Pass Generation"
          description={`Customer: ${selectedBookingForDelivery.customerName} • VIN: ${selectedBookingForDelivery.allocatedVin}`}
          size="md"
        >
          <div className="space-y-4 text-xs">
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg space-y-1">
              <p className="font-bold">✓ Pre-Delivery Checklist Verified:</p>
              <p>• PDI Inspection: PASSED • Full Payment Received: {formatINR(selectedBookingForDelivery.paidAmount)}</p>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Odometer Reading (KM)</label>
              <Input
                type="number"
                value={deliveryForm.odometerReading}
                onChange={(e) =>
                  setDeliveryForm({
                    ...deliveryForm,
                    odometerReading: Number(e.target.value),
                  })
                }
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Customer Handover Notes</label>
              <Input
                value={deliveryForm.customerNotes}
                onChange={(e) =>
                  setDeliveryForm({ ...deliveryForm, customerNotes: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedBookingForDelivery(null)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleCompleteDelivery}
                className="bg-emerald-600 hover:bg-emerald-700 font-semibold"
              >
                Complete Delivery & Print Gate Pass
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: Invoice & Gate Pass Preview */}
      {viewInvoice && (
        <Modal
          isOpen={true}
          onClose={() => setViewInvoice(null)}
          title="Hero Dealership Tax Invoice & Gate Pass"
          description={`Invoice #${viewInvoice.invoiceNumber} • Date: ${viewInvoice.invoiceDate}`}
          size="lg"
        >
          <div className="space-y-4 text-xs p-2">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">SHREEJI HERO MOTORS</h2>
                <p className="text-[11px] text-slate-500">Authorized Hero MotoCorp Dealership, Halvad Branch</p>
                <p className="text-[10px] text-slate-400 font-mono">GSTIN: 24AAACS1234F1Z8</p>
              </div>
              <div className="text-right">
                <Badge variant="hero" className="font-mono text-xs">
                  {viewInvoice.invoiceNumber}
                </Badge>
                <p className="text-[10px] text-slate-400 mt-1">Date: {viewInvoice.invoiceDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="font-bold text-slate-700 block">Billed To Customer:</span>
                <p className="font-semibold text-slate-900">{viewInvoice.customerName}</p>
                <p className="text-slate-500">{viewInvoice.customerPhone}</p>
                <p className="text-slate-500">{viewInvoice.customerAddress}</p>
              </div>
              <div>
                <span className="font-bold text-slate-700 block">Vehicle Identifiers:</span>
                <p className="font-semibold text-slate-900">{viewInvoice.modelName}</p>
                <p className="font-mono text-slate-600">VIN: {viewInvoice.vin}</p>
                <p className="font-mono text-slate-600">Engine: {viewInvoice.engineNumber}</p>
              </div>
            </div>

            <table className="w-full border-collapse">
              <thead className="bg-slate-100 text-slate-600 font-semibold border-y">
                <tr>
                  <th className="text-left p-2">Description</th>
                  <th className="text-right p-2">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-2">Ex-Showroom Price</td>
                  <td className="p-2 text-right">{formatINR(viewInvoice.exShowroomPrice)}</td>
                </tr>
                <tr>
                  <td className="p-2">RTO Registration & Road Tax</td>
                  <td className="p-2 text-right">{formatINR(viewInvoice.rtoCharges)}</td>
                </tr>
                <tr>
                  <td className="p-2">5-Year Comprehensive Insurance</td>
                  <td className="p-2 text-right">{formatINR(viewInvoice.insuranceCharges)}</td>
                </tr>
                <tr>
                  <td className="p-2">Hero Genuine Accessories & Leg Guard</td>
                  <td className="p-2 text-right">{formatINR(viewInvoice.accessoriesCharges)}</td>
                </tr>
                {viewInvoice.discount > 0 && (
                  <tr className="text-emerald-700">
                    <td className="p-2">Special Showroom Festive Discount</td>
                    <td className="p-2 text-right">-{formatINR(viewInvoice.discount)}</td>
                  </tr>
                )}
                <tr className="font-bold bg-slate-50 text-sm border-t border-slate-300">
                  <td className="p-2">Final On-Road Total Amount</td>
                  <td className="p-2 text-right text-hero">{formatINR(viewInvoice.totalAmount)}</td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewInvoice(null)}
              >
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => window.print()}
                className="gap-1.5 font-semibold"
              >
                <Printer className="h-3.5 w-3.5" />
                Print Tax Invoice & Gate Pass
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
