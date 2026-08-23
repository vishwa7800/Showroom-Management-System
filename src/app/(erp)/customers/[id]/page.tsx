'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { QuickActionModal } from '@/components/dashboard/QuickActionModal';
import {
  Users,
  Phone,
  Mail,
  MapPin,
  Bike,
  Wrench,
  Calendar,
  Clock,
  ArrowLeft,
  Flame,
  CheckCircle2,
  FileText,
  CreditCard,
  MessageSquare,
  ShieldCheck,
  Plus,
  Compass,
} from 'lucide-react';
import { formatDate, formatINR } from '@/lib/utils';

export default function CustomerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { user } = useAuth();
  const { toast } = useToast();

  const [customerData, setCustomerData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'TIMELINE' | 'VEHICLES' | 'LEADS' | 'SERVICE'>('TIMELINE');
  const [activeActionModal, setActiveActionModal] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/customers/${id}`);
      const data = await res.json();
      if (data.success) {
        setCustomerData(data);
      } else {
        toast('Error', data.error || 'Failed to load customer profile', 'error');
      }
    } catch (e) {
      toast('Error', 'Network error loading profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProfile();
  }, [id]);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-xs text-slate-400">
        Loading Customer 360 profile...
      </div>
    );
  }

  if (!customerData || !customerData.customer) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-sm font-bold text-slate-700">Customer profile not found</h2>
        <Button size="sm" onClick={() => router.push('/customers')} className="text-xs">
          Back to Customer Directory
        </Button>
      </div>
    );
  }

  const { customer, timeline, vehicles, leads, followUps, testRides, serviceHistory } = customerData;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/customers')}
            className="h-8 gap-1 text-xs text-slate-700"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Directory
          </Button>
          <Badge variant="outline" className="font-mono text-xs font-semibold">
            {customer.customerCode}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setActiveActionModal('LOG_FOLLOW_UP')}
            variant="outline"
            className="text-xs h-8 gap-1.5 text-slate-700"
          >
            <Phone className="h-3.5 w-3.5 text-emerald-600" />
            Log Follow-Up
          </Button>
          <Button
            size="sm"
            onClick={() => setActiveActionModal('SCHEDULE_TEST_RIDE')}
            variant="outline"
            className="text-xs h-8 gap-1.5 text-slate-700"
          >
            <Compass className="h-3.5 w-3.5 text-hero" />
            Schedule Test Ride
          </Button>
          <Button
            size="sm"
            onClick={() => setActiveActionModal('ADD_LEAD')}
            className="text-xs h-8 gap-1.5 font-semibold"
          >
            <Plus className="h-3.5 w-3.5" />
            New Sales Lead
          </Button>
        </div>
      </div>

      {/* Customer 360 Header Profile Card */}
      <Card className="border border-slate-200">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-2xl bg-hero text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-hero/20 flex-shrink-0">
                {customer.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-bold text-slate-900">{customer.name}</h1>
                  <Badge variant="success" withDot className="text-[10px]">
                    {customer.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    {customer.phone}
                  </span>
                  {customer.email && (
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      {customer.email}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {customer.city}, {customer.state} ({customer.pincode})
                  </span>
                </div>
                {customer.notes && (
                  <p className="text-xs text-slate-500 italic mt-1 max-w-xl">
                    "{customer.notes}"
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-row md:flex-col items-start md:items-end justify-between md:justify-center border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 gap-1 text-xs text-slate-500">
              <span>Source: <strong className="text-slate-800">{customer.source}</strong></span>
              <span>Preferred: <strong className="text-slate-800">{customer.preferredContact}</strong></span>
              <span className="text-[11px] text-slate-400">Customer since: {formatDate(customer.createdAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold select-none">
        <button
          onClick={() => setActiveTab('TIMELINE')}
          className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px ${
            activeTab === 'TIMELINE'
              ? 'border-hero text-hero'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>CRM Timeline ({timeline.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('VEHICLES')}
          className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px ${
            activeTab === 'VEHICLES'
              ? 'border-hero text-hero'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Bike className="h-4 w-4" />
          <span>Owned Vehicles ({vehicles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('LEADS')}
          className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px ${
            activeTab === 'LEADS'
              ? 'border-hero text-hero'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Flame className="h-4 w-4" />
          <span>Active Leads & Quotes ({leads.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('SERVICE')}
          className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px ${
            activeTab === 'SERVICE'
              ? 'border-hero text-hero'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Wrench className="h-4 w-4" />
          <span>Service & Invoices ({serviceHistory.length})</span>
        </button>
      </div>

      {/* TAB CONTENT 1: Timeline */}
      {activeTab === 'TIMELINE' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Customer Interaction & Milestones Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            {timeline.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No timeline events recorded.</p>
            ) : (
              <div className="relative pl-6 border-l-2 border-slate-200 space-y-6 text-xs">
                {timeline.map((event: any) => (
                  <div key={event.id} className="relative group">
                    <div className="absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-hero border-2 border-white shadow-xs" />
                    <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">{event.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {formatDate(event.createdAt)}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-snug">{event.description}</p>
                      <span className="text-[10px] text-slate-400 block pt-1">
                        Logged by: {event.actorName}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* TAB CONTENT 2: Owned Vehicles */}
      {activeTab === 'VEHICLES' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Registered Hero Vehicles</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 text-xs">
              {vehicles.map((v: any) => (
                <div key={v.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{v.modelName}</span>
                      <Badge variant="hero" className="font-mono text-[10px]">
                        {v.registrationNumber}
                      </Badge>
                    </div>
                    <p className="text-slate-600">
                      Variant: {v.variantName} • Color: {v.color}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      VIN: {v.vinNumber} | Engine: {v.engineNumber}
                    </p>
                  </div>
                  <div className="text-right text-[11px] text-slate-500 space-y-0.5">
                    <p>Purchased: <strong className="text-slate-800">{v.purchaseDate}</strong></p>
                    <p className="flex items-center gap-1 text-emerald-600 font-medium">
                      <ShieldCheck className="h-3.5 w-3.5" /> Warranty Valid Till: {v.warrantyUntil}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB CONTENT 3: Leads */}
      {activeTab === 'LEADS' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Sales Leads & Quotes Pipeline</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 text-xs">
              {leads.map((l: any) => (
                <div key={l.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{l.modelName}</span>
                      <Badge variant="outline" className="font-mono text-[10px]">
                        {l.leadCode}
                      </Badge>
                      <Badge
                        variant={l.priority === 'HOT' ? 'danger' : 'warning'}
                        className="text-[10px] font-bold"
                      >
                        {l.priority}
                      </Badge>
                    </div>
                    <p className="text-slate-600">{l.notes}</p>
                    <span className="text-[10px] text-slate-400 block">
                      Assigned: {l.assignedToName} • Target Date: {l.expectedPurchaseDate || 'N/A'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 block">
                      {formatINR(l.estimatedValue || 75000)}
                    </span>
                    <Badge variant="hero" className="text-[10px] mt-1 font-bold">
                      Stage: {l.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB CONTENT 4: Service History */}
      {activeTab === 'SERVICE' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Workshop Service History & Job Cards</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 text-xs">
              {serviceHistory.map((sh: any) => (
                <div key={sh.id} className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono text-hero">{sh.jobCardNumber}</span>
                      <span className="font-semibold text-slate-900">{sh.serviceType}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Advisor: {sh.advisorName} • Completed on: {sh.date}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 block">{formatINR(sh.amount)}</span>
                    <Badge variant="success" className="text-[9px] mt-0.5">
                      {sh.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Action Modal Renderer */}
      {activeActionModal && (
        <QuickActionModal
          actionKey={activeActionModal}
          onClose={() => {
            setActiveActionModal(null);
            fetchProfile();
          }}
        />
      )}
    </div>
  );
}
