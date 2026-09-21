'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { CustomerRecord } from '@/lib/db/crm-store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Bike,
  Calendar,
  ArrowRight,
  UserCheck,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function CustomersPage() {
  const { user, activeBranchId, can } = useAuth();
  const { toast } = useToast();

  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // New Customer Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    altPhone: '',
    email: '',
    address: '',
    city: 'Halvad',
    pincode: '363330',
    preferredContact: 'PHONE' as 'PHONE' | 'WHATSAPP' | 'EMAIL',
    source: 'WALK_IN',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  const fetchCustomers = async (search?: string) => {
    try {
      setIsLoading(true);
      const url = new URL('/api/customers', window.location.origin);
      if (search) url.searchParams.set('search', search);
      if (activeBranchId) url.searchParams.set('branchId', activeBranchId);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setCustomers(data.customers);
      }
    } catch (e) {
      toast('Error', 'Failed to load customers directory', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(searchQuery);
  }, [searchQuery, activeBranchId]);

  // Real-time duplicate phone check as user types
  const handlePhoneChange = (val: string) => {
    setFormData((prev) => ({ ...prev, phone: val }));
    const clean = val.replace(/[^0-9]/g, '').slice(-10);
    if (clean.length === 10) {
      const match = customers.find(
        (c) => c.phone.replace(/[^0-9]/g, '').slice(-10) === clean
      );
      if (match) {
        setDuplicateWarning(
          `⚠️ Duplicate detected: ${match.name} is already registered with this phone number (${match.customerCode}).`
        );
      } else {
        setDuplicateWarning(null);
      }
    } else {
      setDuplicateWarning(null);
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          branchId: activeBranchId || 'br_halvad',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast('Cannot Create Customer', data.error, 'error');
        setIsSubmitting(false);
        return;
      }

      toast(
        'Customer Created',
        `${data.customer.name} registered (${data.customer.customerCode}).`,
        'success'
      );
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        phone: '',
        altPhone: '',
        email: '',
        address: '',
        city: 'Halvad',
        pincode: '363330',
        preferredContact: 'PHONE',
        source: 'WALK_IN',
        notes: '',
      });
      setDuplicateWarning(null);
      fetchCustomers();
    } catch (e) {
      toast('Error', 'Network error creating customer', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Customer CRM 360 & Profiles
            </h1>
            <Badge variant="hero" className="font-bold text-[10px] uppercase">
              Unified CRM Directory
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete vehicle ownership history, active sales leads, service records, and interaction timelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {can('customers.create') && (
            <Button
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              className="gap-1.5 text-xs font-semibold h-9 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>+ Add New Customer</span>
            </Button>
          )}
        </div>
      </div>

      {/* Customer Directory Stats Bar */}
      <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg text-xs">
        <span className="text-slate-600 font-medium">Customer CRM Directory</span>
        <span className="font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-md">{customers.length} Profiles Registered</span>
      </div>

      {/* Customer Directory Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-sm">Registered Customer Accounts</CardTitle>
          <span className="text-xs text-slate-400 font-medium">
            Showing all matching dealership records
          </span>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading customer CRM records...</div>
          ) : customers.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-700">No customers found</p>
              <p className="text-xs text-slate-400">Try a different search term or add a new customer.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="text-left p-3.5">Customer & Code</th>
                    <th className="text-left p-3.5">Contact Details</th>
                    <th className="text-left p-3.5">City & Location</th>
                    <th className="text-left p-3.5">Lead Source</th>
                    <th className="text-center p-3.5">Status</th>
                    <th className="text-right p-3.5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-hero-50 border border-hero-200 text-hero flex items-center justify-center font-bold text-xs">
                            {c.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <Link
                              href={`/customers/${c.id}`}
                              className="font-bold text-slate-900 hover:text-hero transition-colors block text-sm"
                            >
                              {c.name}
                            </Link>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {c.customerCode}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="space-y-0.5 text-[11px]">
                          <span className="font-semibold text-slate-900 block flex items-center gap-1.5">
                            <Phone className="h-3 w-3 text-slate-400" />
                            {c.phone}
                          </span>
                          {c.email && (
                            <span className="text-slate-400 block flex items-center gap-1.5">
                              <Mail className="h-3 w-3 text-slate-300" />
                              {c.email}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="font-medium text-slate-800 block">{c.city}</span>
                        <span className="text-[10px] text-slate-400 truncate max-w-xs block">
                          {c.address}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <Badge variant="outline" className="text-[10px] font-semibold">
                          {c.source.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="p-3.5 text-center">
                        <Badge variant="success" withDot className="text-[10px]">
                          Active
                        </Badge>
                      </td>
                      <td className="p-3.5 text-right">
                        <Link href={`/customers/${c.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-8 gap-1 text-slate-700 hover:text-hero hover:border-hero"
                          >
                            <span>Open 360 View</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add New Customer Modal with Duplicate Detection Warning */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Customer Profile"
        description="Capture verified customer details for CRM tracking, sales leads, and workshop job cards."
        size="lg"
      >
        <form onSubmit={handleCreateCustomer} className="space-y-4 text-xs">
          {duplicateWarning && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs leading-snug">
              {duplicateWarning}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Full Name <span className="text-hero">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Mukeshbhai Patel"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Primary Mobile Number <span className="text-hero">*</span>
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="+91 98765 XXXXX"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Alternate Phone</label>
              <Input
                value={formData.altPhone}
                onChange={(e) => setFormData({ ...formData, altPhone: e.target.value })}
                placeholder="Optional secondary number"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="mukesh@gmail.com"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Street Address <span className="text-hero">*</span>
            </label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g. Block C-204, Radha Krishna Complex, Main Highway"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">City / Taluka</label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Pincode</label>
              <Input
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Lead Source</label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-xs text-slate-800"
              >
                <option value="WALK_IN">Showroom Walk-in</option>
                <option value="PHONE_INQUIRY">Phone Call Inquiry</option>
                <option value="WEBSITE">Website / Digital Lead</option>
                <option value="REFERRAL">Customer Referral</option>
                <option value="EVENT">Dealership Canopy Event</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">CRM Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Vehicle requirements, family preferences, or trade-in expectations..."
              className="w-full h-16 rounded-md border border-slate-200 p-2 text-xs focus:ring-1 focus:ring-hero"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmitting} className="font-semibold">
              Save Customer
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
