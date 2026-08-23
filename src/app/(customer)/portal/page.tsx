'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bike,
  Wrench,
  CreditCard,
  FileText,
  Bell,
  User,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Sparkles,
  LogOut,
  Plus,
  Send,
  MessageSquare,
  AlertTriangle,
  Gift,
  HelpCircle,
  Settings,
  Printer,
  X,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { formatINR, formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function CustomerPortalPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<
    'DASHBOARD' | 'VEHICLES' | 'SERVICE' | 'HISTORY' | 'FINANCE' | 'INVOICES' | 'SUPPORT' | 'PROFILE'
  >('DASHBOARD');

  const [customer, setCustomer] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [activeServices, setActiveServices] = useState<any[]>([]);
  const [serviceHistory, setServiceHistory] = useState<any[]>([]);
  const [loans, setLoans] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [preferences, setPreferences] = useState<any>({
    allowWhatsapp: true,
    allowSms: true,
    allowEmail: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    vehicleId: '',
    vehicleReg: '',
    modelName: '',
    serviceType: 'PAID_SERVICE',
    scheduledDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    remarks: '',
  });

  // Support Form State
  const [supportForm, setSupportForm] = useState({
    topic: 'SERVICE_QUERY' as any,
    vehicleReg: '',
    message: '',
  });

  const fetchCustomerData = async () => {
    try {
      setIsLoading(true);
      const meRes = await fetch('/api/customer/me');
      if (!meRes.ok) {
        // Redirect to login if not authenticated
        router.push('/portal/login');
        return;
      }

      const meData = await meRes.json();
      setCustomer(meData.customer);
      if (meData.customer.preferences) setPreferences(meData.customer.preferences);

      const [vRes, sRes, hRes, lRes, iRes, nRes, oRes] = await Promise.all([
        fetch('/api/customer/vehicles'),
        fetch('/api/customer/service/tracking'),
        fetch('/api/customer/service/history'),
        fetch('/api/customer/finance'),
        fetch('/api/customer/invoices'),
        fetch('/api/customer/notifications'),
        fetch('/api/customer/offers'),
      ]);

      const [vData, sData, hData, lData, iData, nData, oData] = await Promise.all([
        vRes.json(),
        sRes.json(),
        hRes.json(),
        lRes.json(),
        iRes.json(),
        nRes.json(),
        oRes.json(),
      ]);

      if (vData.success) {
        setVehicles(vData.vehicles);
        if (vData.vehicles.length > 0) {
          setBookingForm((prev) => ({
            ...prev,
            vehicleId: vData.vehicles[0].id,
            vehicleReg: vData.vehicles[0].registrationNumber,
            modelName: vData.vehicles[0].modelName,
          }));
        }
      }
      if (sData.success) setActiveServices(sData.activeServices);
      if (hData.success) setServiceHistory(hData.history);
      if (lData.success) setLoans(lData.loans);
      if (iData.success) setInvoices(iData.invoices);
      if (nData.success) setNotifications(nData.notifications);
      if (oData.success) setOffers(oData.offers);
    } catch (e) {
      toast('Error', 'Failed to synchronize customer data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/customer/auth/logout', { method: 'POST' });
      toast('Logged Out', 'Customer session terminated safely.', 'success');
      router.push('/portal/login');
    } catch (e) {
      router.push('/portal/login');
    }
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/customer/service/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingForm),
      });

      const data = await res.json();
      if (!res.ok) {
        toast('Booking Failed', data.error || 'Unable to create service appointment', 'error');
        return;
      }

      toast('Appointment Confirmed!', `Booking #${data.booking.bookingCode} scheduled for ${bookingForm.scheduledDate}.`, 'success');
      setIsBookModalOpen(false);
      fetchCustomerData();
    } catch (e) {
      toast('Error', 'Failed to submit service booking', 'error');
    }
  };

  const handleServiceApproval = async (jobCardId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await fetch(`/api/customer/service/${jobCardId}/approval`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, customerNotes: `Confirmed by customer from self-service portal.` }),
      });

      const data = await res.json();
      if (data.success) {
        toast(`Additional Repairs ${status}`, `Workshop technician has been notified.`, 'success');
        fetchCustomerData();
      }
    } catch (e) {
      toast('Error', 'Failed to update approval', 'error');
    }
  };

  const handleSavePreferences = async (updated: any) => {
    setPreferences(updated);
    try {
      await fetch('/api/customer/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      toast('Preferences Saved', 'Your communication channel settings were updated.', 'success');
    } catch (e) {
      // fallback
    }
  };

  const handleSendSupport = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/customer/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supportForm),
      });

      const data = await res.json();
      if (data.success) {
        toast('Inquiry Submitted', data.message, 'success');
        setIsSupportModalOpen(false);
        setSupportForm({ topic: 'SERVICE_QUERY', vehicleReg: '', message: '' });
      }
    } catch (e) {
      toast('Error', 'Failed to send support ticket', 'error');
    }
  };

  if (isLoading && !customer) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-4 border-hero border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold tracking-wider text-slate-300">
            Connecting to Shreeji Hero Customer Cloud...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-hero selection:text-white">
      {/* Top Customer Portal Navigation Bar */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-hero flex items-center justify-center text-white font-bold shadow-sm shadow-hero/30">
            <Bike className="h-5 w-5" />
          </div>
          <div>
            <span className="font-black text-slate-900 text-base leading-none block">
              Shreeji Hero MotoCorp
            </span>
            <span className="text-[10px] font-bold text-hero tracking-widest uppercase">
              Customer Self-Service Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
              {customer?.name?.slice(0, 2).toUpperCase() || 'CU'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-900">{customer?.name || 'Customer'}</p>
              <p className="text-[10px] text-emerald-600 font-semibold font-mono">
                {customer?.customerCode || 'SHR-1001'} • Verified
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleLogout}
            className="text-xs h-8 gap-1 text-slate-600 hover:text-rose-600 hover:bg-rose-50"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Customer Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-card">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">
                Namaste, {customer?.name || 'Customer'}! 👋
              </h1>
              <Badge variant="hero" className="font-bold text-[10px] uppercase">
                Owner Portal
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Registered Phone: <strong>{customer?.phone}</strong> • Halvad Authorized Dealership
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setIsBookModalOpen(true)}
              className="gap-1.5 text-xs font-bold shadow-xs"
            >
              <Wrench className="h-3.5 w-3.5" />
              <span>Book a Service</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsSupportModalOpen(true)}
              className="gap-1.5 text-xs font-semibold text-slate-700"
            >
              <HelpCircle className="h-3.5 w-3.5 text-hero" />
              <span>Get Support</span>
            </Button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold select-none bg-white px-4 pt-3 rounded-t-lg border-t border-x overflow-x-auto">
          <button
            onClick={() => setActiveTab('DASHBOARD')}
            className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px whitespace-nowrap ${
              activeTab === 'DASHBOARD'
                ? 'border-hero text-hero'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('VEHICLES')}
            className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px whitespace-nowrap ${
              activeTab === 'VEHICLES'
                ? 'border-hero text-hero'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Bike className="h-4 w-4" />
            <span>My Vehicles ({vehicles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('SERVICE')}
            className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px whitespace-nowrap ${
              activeTab === 'SERVICE'
                ? 'border-hero text-hero'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Wrench className="h-4 w-4" />
            <span>Live Service Tracking ({activeServices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('HISTORY')}
            className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px whitespace-nowrap ${
              activeTab === 'HISTORY'
                ? 'border-hero text-hero'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>Service History</span>
          </button>

          <button
            onClick={() => setActiveTab('FINANCE')}
            className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px whitespace-nowrap ${
              activeTab === 'FINANCE'
                ? 'border-hero text-hero'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <CreditCard className="h-4 w-4" />
            <span>Loan & EMI Schedule</span>
          </button>

          <button
            onClick={() => setActiveTab('INVOICES')}
            className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px whitespace-nowrap ${
              activeTab === 'INVOICES'
                ? 'border-hero text-hero'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>My Invoices ({invoices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('PROFILE')}
            className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px whitespace-nowrap ${
              activeTab === 'PROFILE'
                ? 'border-hero text-hero'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>Profile & Communication</span>
          </button>
        </div>

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-6">
            {/* Quick KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 bg-white border-l-4 border-l-hero">
                <span className="text-[11px] font-bold text-slate-400 uppercase">My Hero Bikes</span>
                <p className="text-xl font-bold text-slate-900 mt-1">{vehicles.length} Registered</p>
                <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">
                  Under 5-Year Warranty
                </span>
              </Card>

              <Card className="p-4 bg-white border-l-4 border-l-indigo-500">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Active Workshop Job</span>
                <p className="text-xl font-bold text-indigo-700 mt-1">
                  {activeServices.length > 0 ? activeServices[0].status : 'None Active'}
                </p>
                <span className="text-[10px] text-slate-500 font-semibold mt-0.5 block">
                  {activeServices.length > 0 ? `#${activeServices[0].jobCardNumber}` : 'All bikes ready'}
                </span>
              </Card>

              <Card className="p-4 bg-white border-l-4 border-l-emerald-500">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Hero FinCorp EMI</span>
                <p className="text-xl font-bold text-emerald-700 mt-1">₹2,450 / mo</p>
                <span className="text-[10px] text-slate-500 font-semibold mt-0.5 block">
                  Next Due: 15 May 2024
                </span>
              </Card>

              <Card className="p-4 bg-white border-l-4 border-l-amber-500">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Unread Notifications</span>
                <p className="text-xl font-bold text-amber-700 mt-1">
                  {notifications.filter((n) => !n.isRead).length}
                </p>
                <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">
                  Real-time alerts active
                </span>
              </Card>
            </div>

            {/* Active Service Status Card */}
            {activeServices.length > 0 && (
              <Card className="p-5 border-2 border-indigo-100 bg-indigo-50/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        Live Workshop Tracker: #{activeServices[0].jobCardNumber}
                      </span>
                      <Badge variant="hero" className="text-[9px] uppercase font-bold">
                        {activeServices[0].status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Vehicle: <strong>{activeServices[0].modelName} ({activeServices[0].vehicleReg})</strong> • Assigned Bay: <strong>{activeServices[0].bayCode || 'BAY-01'}</strong>
                    </p>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => setActiveTab('SERVICE')}
                    className="text-xs h-8 gap-1 font-semibold"
                  >
                    <span>View Live Progress</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            )}

            {/* Promotional Offers Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {offers.map((o) => (
                <Card key={o.id} className="p-4 flex flex-col justify-between space-y-3 bg-gradient-to-br from-white to-slate-50">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <Badge variant="warning" className="text-[9px] font-bold uppercase">
                        {o.badge}
                      </Badge>
                      <span className="text-[10px] font-mono text-slate-400">Valid: {o.validUntil}</span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900">{o.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{o.description}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                    <span className="font-mono text-[11px] font-bold text-hero bg-hero-50 px-2 py-0.5 rounded border border-hero-200">
                      {o.code}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">Show coupon at desk</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: MY VEHICLES */}
        {activeTab === 'VEHICLES' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vehicles.map((v) => (
              <Card key={v.id} className="p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">{v.modelName}</h2>
                      <span className="text-xs text-slate-500 font-medium">
                        {v.variantName} • {v.color}
                      </span>
                    </div>
                    <Badge variant="success" className="font-bold text-xs uppercase tracking-wider">
                      {v.registrationNumber}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                    <div className="p-2.5 bg-slate-50 rounded">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Chassis / VIN</span>
                      <span className="font-mono font-bold text-slate-800 text-[11px]">{v.vinNumber}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Engine Number</span>
                      <span className="font-mono font-bold text-slate-800 text-[11px]">{v.engineNumber}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">5-Year Warranty</span>
                      <span className="font-semibold text-emerald-700">Valid until {v.warrantyUntil}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Next Service Recommended</span>
                      <span className="font-bold text-hero">{v.nextServiceDue}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setBookingForm((prev) => ({
                        ...prev,
                        vehicleId: v.id,
                        vehicleReg: v.registrationNumber,
                        modelName: v.modelName,
                      }));
                      setIsBookModalOpen(true);
                    }}
                    className="text-xs h-8 gap-1.5 font-semibold"
                  >
                    <Wrench className="h-3.5 w-3.5" />
                    <span>Book Service for this Bike</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* TAB 3: SERVICE TRACKING & LIVE ESTIMATE APPROVAL */}
        {activeTab === 'SERVICE' && (
          <div className="space-y-6">
            {activeServices.length === 0 ? (
              <Card className="p-12 text-center text-xs text-slate-400 space-y-3">
                <Bike className="h-10 w-10 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">No active workshop jobs right now.</p>
                <p>All your vehicles are in top road-ready condition!</p>
                <Button size="sm" onClick={() => setIsBookModalOpen(true)} className="gap-1.5 mt-2">
                  <Wrench className="h-3.5 w-3.5" />
                  <span>Book Periodic Service</span>
                </Button>
              </Card>
            ) : (
              activeServices.map((j) => (
                <Card key={j.id} className="p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-slate-900">
                          Job Card #{j.jobCardNumber} • {j.modelName}
                        </h2>
                        <Badge variant="hero" className="uppercase font-bold text-[10px]">
                          {j.serviceType.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Reg: <strong>{j.vehicleReg}</strong> • Service Advisor: <strong>{j.advisorName || 'Kiran Dave'}</strong>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Bill Amount</span>
                      <strong className="text-lg font-bold text-slate-900">{formatINR(j.totalAmount)}</strong>
                    </div>
                  </div>

                  {/* 9-Stage Visual Progression */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
                      Live Workshop Milestone Progress
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-[10px]">
                      {[
                        { label: '1. Booked', active: true },
                        { label: '2. Checked-In', active: true },
                        { label: '3. Inspection', active: true },
                        { label: '4. Estimate', active: true },
                        { label: '5. Work in Prog', active: j.status === 'WORK_IN_PROGRESS' || j.status === 'QUALITY_CHECK' || j.status === 'READY_FOR_DELIVERY' || j.status === 'COMPLETED' },
                        { label: '6. Quality Check', active: j.status === 'QUALITY_CHECK' || j.status === 'READY_FOR_DELIVERY' || j.status === 'COMPLETED' },
                        { label: '7. Ready Pickup', active: j.status === 'READY_FOR_DELIVERY' || j.status === 'COMPLETED' },
                        { label: '8. Completed', active: j.status === 'COMPLETED' },
                      ].map((st) => (
                        <div
                          key={st.label}
                          className={`p-2 rounded-lg font-bold border transition-colors ${
                            st.active
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-2xs'
                              : 'bg-slate-50 border-slate-200 text-slate-400'
                          }`}
                        >
                          {st.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 1-Click Additional Work Approval Box if applicable */}
                  {j.status === 'CUSTOMER_APPROVAL' && (
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-3">
                      <div className="flex items-start gap-2 text-amber-900">
                        <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold">Additional Work Recommendation from Workshop</h4>
                          <p className="text-xs text-amber-800 mt-1">
                            During safety inspection, technician Pravin Solanki found worn brake pads and recommended replacement (Estimated Cost: ₹1,450). Please approve to proceed.
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-amber-200">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleServiceApproval(j.id, 'REJECTED')}
                          className="text-xs h-8 text-slate-700 bg-white"
                        >
                          Reject Additional Work
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleServiceApproval(j.id, 'APPROVED')}
                          className="text-xs h-8 font-bold bg-emerald-600 hover:bg-emerald-700"
                        >
                          Approve Repairs (₹1,450)
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        )}

        {/* TAB 4: SERVICE HISTORY */}
        {activeTab === 'HISTORY' && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold">Past Service & Workshop Records</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 border-b text-slate-500 font-semibold">
                    <tr>
                      <th className="text-left p-3.5">Job Card #</th>
                      <th className="text-left p-3.5">Vehicle</th>
                      <th className="text-left p-3.5">Service Type</th>
                      <th className="text-center p-3.5">Odometer</th>
                      <th className="text-right p-3.5">Bill Amount (₹)</th>
                      <th className="text-center p-3.5">Date</th>
                      <th className="text-right p-3.5">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {serviceHistory.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-slate-400">
                          No past service records on file.
                        </td>
                      </tr>
                    ) : (
                      serviceHistory.map((h) => (
                        <tr key={h.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5 font-bold text-slate-900">#{h.jobCardNumber}</td>
                          <td className="p-3.5 font-semibold">
                            {h.modelName} ({h.vehicleReg})
                          </td>
                          <td className="p-3.5">
                            <Badge variant="outline" className="text-[9px] uppercase font-bold">
                              {h.serviceType.replace(/_/g, ' ')}
                            </Badge>
                          </td>
                          <td className="p-3.5 text-center font-mono">{h.kmReading} km</td>
                          <td className="p-3.5 text-right font-bold text-slate-900">{formatINR(h.totalAmount)}</td>
                          <td className="p-3.5 text-center font-mono text-[11px]">{formatDate(h.completedAt)}</td>
                          <td className="p-3.5 text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedInvoice(h)}
                              className="text-[11px] h-7 gap-1"
                            >
                              <FileText className="h-3 w-3" />
                              <span>Invoice</span>
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* TAB 5: FINANCE & EMI */}
        {activeTab === 'FINANCE' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-5 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Hero FinCorp Two-Wheeler Loan</h3>
                  <span className="text-xs text-slate-400 font-mono">App #HFC-2024-8901</span>
                </div>
                <Badge variant="success" className="text-[9px] uppercase font-bold">
                  Active & Regular
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-slate-50 rounded">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Monthly EMI</span>
                  <span className="text-base font-bold text-hero">₹2,450 / month</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Next Due Date</span>
                  <span className="text-base font-bold text-slate-900">15 May 2024</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Sanctioned Amount</span>
                  <span className="font-bold text-slate-800">₹58,000 (24 Months)</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Outstanding Balance</span>
                  <span className="font-bold text-slate-800">₹34,560 (18 Mos left)</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>Repayment Progress (6 of 24 installments paid)</span>
                  <span>25% Cleared</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '25%' }} />
                </div>
              </div>
            </Card>

            <Card className="p-5 space-y-3">
              <h3 className="font-bold text-sm text-slate-900 border-b pb-2">Auto-Debit & Payment Options</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your monthly EMI is configured with NACH Auto-Debit from State Bank of India. For advance foreclosure or NOC certificate requests, contact our showroom finance desk.
              </p>
              <div className="p-3 bg-slate-50 rounded text-xs space-y-1 border">
                <span className="font-bold text-slate-800 block">Dealership Finance Desk:</span>
                <span className="text-slate-600 block">Phone: +91 98765 43210 (Ext 4)</span>
                <span className="text-slate-600 block">Email: finance@shreejihero.com</span>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 6: INVOICES & BILLS */}
        {activeTab === 'INVOICES' && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold">My Official Tax Invoices</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 border-b text-slate-500 font-semibold">
                  <tr>
                    <th className="text-left p-3.5">Invoice #</th>
                    <th className="text-left p-3.5">Type</th>
                    <th className="text-right p-3.5">Subtotal (₹)</th>
                    <th className="text-right p-3.5">GST Tax (₹)</th>
                    <th className="text-right p-3.5">Total Bill (₹)</th>
                    <th className="text-center p-3.5">Payment Status</th>
                    <th className="text-right p-3.5">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {invoices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-slate-400">
                        No invoices on file.
                      </td>
                    </tr>
                  ) : (
                    invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3.5 font-bold text-slate-900">#{inv.invoiceNumber}</td>
                        <td className="p-3.5">
                          <Badge variant="outline" className="text-[9px] uppercase font-bold">
                            {inv.invoiceType}
                          </Badge>
                        </td>
                        <td className="p-3.5 text-right font-mono">{formatINR(inv.subtotal)}</td>
                        <td className="p-3.5 text-right font-mono">{formatINR(inv.gstAmount)}</td>
                        <td className="p-3.5 text-right font-bold text-slate-900">{formatINR(inv.totalAmount)}</td>
                        <td className="p-3.5 text-center">
                          <Badge
                            variant={inv.paymentStatus === 'PAID' ? 'success' : 'warning'}
                            className="text-[9px] uppercase font-bold"
                          >
                            {inv.paymentStatus}
                          </Badge>
                        </td>
                        <td className="p-3.5 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedInvoice(inv)}
                            className="text-[11px] h-7 gap-1"
                          >
                            <Printer className="h-3 w-3" />
                            <span>Print</span>
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}

        {/* TAB 7: PROFILE & PREFERENCES */}
        {activeTab === 'PROFILE' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-5 space-y-4">
              <h3 className="font-bold text-sm text-slate-900 border-b pb-2">Customer Profile</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Full Name</label>
                  <Input value={customer?.name || ''} readOnly className="bg-slate-50 text-slate-800" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Registered Phone</label>
                  <Input value={customer?.phone || ''} readOnly className="bg-slate-50 text-slate-800" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">City & Showroom</label>
                  <Input value={`${customer?.city || 'Halvad'}, Gujarat`} readOnly className="bg-slate-50 text-slate-800" />
                </div>
              </div>
            </Card>

            <Card className="p-5 space-y-4">
              <h3 className="font-bold text-sm text-slate-900 border-b pb-2">
                Communication Channels
              </h3>
              <p className="text-xs text-slate-500">
                Choose how you want to receive service ready alerts, OTP receipts, and warranty reminders.
              </p>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded bg-slate-50 border">
                  <div>
                    <span className="font-bold text-slate-800 block">WhatsApp Updates</span>
                    <span className="text-[11px] text-slate-500">Service progress photos and invoices</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.allowWhatsapp}
                    onChange={(e) =>
                      handleSavePreferences({ ...preferences, allowWhatsapp: e.target.checked })
                    }
                    className="h-4 w-4 accent-hero cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded bg-slate-50 border">
                  <div>
                    <span className="font-bold text-slate-800 block">SMS Alerts</span>
                    <span className="text-[11px] text-slate-500">Official payment receipts and OTPs</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.allowSms}
                    onChange={(e) =>
                      handleSavePreferences({ ...preferences, allowSms: e.target.checked })
                    }
                    className="h-4 w-4 accent-hero cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded bg-slate-50 border">
                  <div>
                    <span className="font-bold text-slate-800 block">Email Invoices</span>
                    <span className="text-[11px] text-slate-500">PDF copies of GST tax invoices</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.allowEmail}
                    onChange={(e) =>
                      handleSavePreferences({ ...preferences, allowEmail: e.target.checked })
                    }
                    className="h-4 w-4 accent-hero cursor-pointer"
                  />
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>

      {/* MODAL 1: Book Service */}
      <Modal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        title="Schedule Hero Workshop Service"
        description="Book periodic maintenance or running repairs at Shreeji Hero."
        size="md"
      >
        <form onSubmit={handleCreateBooking} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Select Owned Vehicle</label>
            <select
              value={bookingForm.vehicleId}
              onChange={(e) => {
                const sel = vehicles.find((v) => v.id === e.target.value);
                if (sel) {
                  setBookingForm({
                    ...bookingForm,
                    vehicleId: sel.id,
                    vehicleReg: sel.registrationNumber,
                    modelName: sel.modelName,
                  });
                }
              }}
              className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-xs text-slate-800"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.modelName} ({v.registrationNumber})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Service Type</label>
            <select
              value={bookingForm.serviceType}
              onChange={(e) => setBookingForm({ ...bookingForm, serviceType: e.target.value })}
              className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-xs text-slate-800"
            >
              <option value="PAID_SERVICE">Paid Periodic Service (General Maintenance)</option>
              <option value="FREE_SERVICE_1">1st Free Service (500-750 km / 60 days)</option>
              <option value="FREE_SERVICE_2">2nd Free Service (3000-3500 km / 100 days)</option>
              <option value="FREE_SERVICE_3">3rd Free Service (6000-6500 km / 200 days)</option>
              <option value="RUNNING_REPAIR">Running Repair (Brakes / Electrical / Battery)</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Preferred Appointment Date</label>
            <Input
              type="date"
              value={bookingForm.scheduledDate}
              onChange={(e) => setBookingForm({ ...bookingForm, scheduledDate: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Complaints / Specific Issues</label>
            <textarea
              value={bookingForm.remarks}
              onChange={(e) => setBookingForm({ ...bookingForm, remarks: e.target.value })}
              placeholder="e.g. Engine oil change, front brake noise, chain lubrication..."
              rows={3}
              className="w-full rounded-md border border-slate-200 p-2.5 text-xs text-slate-800"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsBookModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" className="font-semibold gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Confirm Appointment</span>
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: Support Ticket */}
      <Modal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        title="Contact Dealership Support"
        description="Submit inquiry or feedback directly to Shreeji Hero team."
        size="md"
      >
        <form onSubmit={handleSendSupport} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Inquiry Topic</label>
            <select
              value={supportForm.topic}
              onChange={(e) => setSupportForm({ ...supportForm, topic: e.target.value as any })}
              className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-xs text-slate-800"
            >
              <option value="SERVICE_QUERY">Workshop & Service Query</option>
              <option value="FINANCE_EMI">Finance & EMI Payment Query</option>
              <option value="WARRANTY_CLAIM">Warranty & Part Replacement</option>
              <option value="DOCUMENT_RC_INSURANCE">RC Book & Insurance Copy</option>
              <option value="FEEDBACK_COMPLAINT">Feedback / Complaint</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Message Description</label>
            <textarea
              value={supportForm.message}
              onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
              placeholder="Please explain how we can assist you..."
              rows={4}
              required
              className="w-full rounded-md border border-slate-200 p-2.5 text-xs text-slate-800"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsSupportModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" className="font-semibold gap-1">
              <Send className="h-3.5 w-3.5" />
              <span>Submit Ticket</span>
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL 3: Printable Tax Invoice */}
      <Modal
        isOpen={Boolean(selectedInvoice)}
        onClose={() => setSelectedInvoice(null)}
        title={`Tax Invoice #${selectedInvoice?.invoiceNumber || selectedInvoice?.jobCardNumber || 'INV-1001'}`}
        description="Official GST Tax Invoice from Shreeji Hero MotoCorp"
        size="lg"
      >
        {selectedInvoice && (
          <div className="space-y-4 text-xs">
            <div className="border border-slate-200 rounded-lg p-5 bg-white space-y-4">
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <span className="text-base font-black text-slate-900 block">SHREEJI HERO MOTOCORP</span>
                  <span className="text-[11px] text-slate-500 block">Halvad Showroom & Authorized Workshop</span>
                  <span className="text-[11px] text-slate-500 block">GSTIN: 24AAACS1234F1Z8</span>
                </div>
                <div className="text-right">
                  <Badge variant="hero" className="font-bold uppercase text-[10px]">
                    Tax Invoice
                  </Badge>
                  <span className="text-xs font-mono font-bold text-slate-800 block mt-1">
                    #{selectedInvoice.invoiceNumber || selectedInvoice.jobCardNumber}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[11px] border-b pb-4">
                <div>
                  <span className="text-slate-400 font-bold block uppercase">Billed To:</span>
                  <strong className="text-slate-900">{customer?.name || selectedInvoice.customerName}</strong>
                  <p className="text-slate-600">{customer?.phone}</p>
                  <p className="text-slate-600">{customer?.city}, Gujarat</p>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 font-bold block uppercase">Vehicle Details:</span>
                  <strong className="text-slate-900">{selectedInvoice.modelName || 'Hero Splendor Plus'}</strong>
                  <p className="text-slate-600">Reg: {selectedInvoice.vehicleReg || selectedInvoice.vinOrReg || 'GJ-36-AB-1234'}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between font-bold text-slate-800 border-b pb-1 text-xs">
                  <span>Description</span>
                  <span>Amount (₹)</span>
                </div>
                <div className="flex justify-between text-slate-600 text-xs">
                  <span>Genuine Parts & Periodic Maintenance</span>
                  <span>{formatINR(selectedInvoice.subtotal || selectedInvoice.totalAmount * 0.82)}</span>
                </div>
                <div className="flex justify-between text-slate-600 text-xs">
                  <span>GST Output Tax (18%)</span>
                  <span>{formatINR(selectedInvoice.gstAmount || selectedInvoice.totalAmount * 0.18)}</span>
                </div>
                <div className="flex justify-between font-black text-slate-900 border-t pt-2 text-sm">
                  <span>Total Amount Paid:</span>
                  <span>{formatINR(selectedInvoice.totalAmount)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedInvoice(null)}
              >
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => window.print()}
                className="gap-1.5 font-bold"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Official Copy</span>
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-400">
        © 2026 Shreeji Hero MotoCorp Dealership. All customer sessions are encrypted & protected.
      </footer>
    </div>
  );
}
