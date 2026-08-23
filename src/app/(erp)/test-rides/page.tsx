'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/context';
import { TestRideRecord } from '@/lib/db/crm-store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import {
  Compass,
  Plus,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  UserCheck,
  Bike,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function TestRidesPage() {
  const { user, activeBranchId, can } = useAuth();
  const { toast } = useToast();

  const [testRides, setTestRides] = useState<TestRideRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Test Ride Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicleModel: 'Hero Xtreme 160R 4V',
    scheduledAt: '',
    remarks: '',
  });

  // Outcome modal
  const [selectedRide, setSelectedRide] = useState<TestRideRecord | null>(null);
  const [feedback, setFeedback] = useState('');

  const fetchTestRides = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/test-rides');
      const data = await res.json();
      if (data.success) {
        setTestRides(data.testRides);
      }
    } catch (e) {
      toast('Error', 'Failed to fetch test rides', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestRides();
  }, [activeBranchId]);

  const handleScheduleTestRide = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1. Ensure customer exists
      let customerId: string;
      const searchRes = await fetch(`/api/customers?search=${formData.phone}`);
      const searchData = await searchRes.json();

      if (searchData.customers?.[0]) {
        customerId = searchData.customers[0].id;
      } else {
        const custRes = await fetch('/api/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            address: 'Test Ride Visitor',
            city: 'Halvad',
            pincode: '363330',
            branchId: activeBranchId || 'br_halvad',
            source: 'WALK_IN',
          }),
        });
        const custData = await custRes.json();
        customerId = custData.customer.id;
      }

      // 2. Schedule Test Ride
      const res = await fetch('/api/test-rides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          vehicleModel: formData.vehicleModel,
          scheduledAt: formData.scheduledAt || new Date().toISOString(),
          remarks: formData.remarks,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast('Cannot Schedule', data.error, 'error');
        return;
      }

      toast(
        'Test Ride Scheduled',
        `Demo ride booked for ${formData.name} on ${formData.vehicleModel}.`,
        'success'
      );
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        phone: '',
        vehicleModel: 'Hero Xtreme 160R 4V',
        scheduledAt: '',
        remarks: '',
      });
      fetchTestRides();
    } catch (e) {
      toast('Error', 'Network error scheduling test ride', 'error');
    }
  };

  const handleUpdateOutcome = async (status: 'COMPLETED' | 'CANCELLED' | 'NO_SHOW') => {
    if (!selectedRide) return;

    try {
      const res = await fetch(`/api/test-rides/${selectedRide.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, feedback }),
      });
      const data = await res.json();
      if (data.success) {
        toast('Test Ride Updated', `Outcome marked as ${status}.`, 'success');
        setSelectedRide(null);
        setFeedback('');
        fetchTestRides();
      }
    } catch (e) {
      toast('Error', 'Failed to update test ride', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Test Ride Management & Experience Log
            </h1>
            <Badge variant="hero" className="font-bold text-[10px] uppercase">
              Demo Fleet
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track customer demo ride appointments, verify driver licenses, and log ride feedback.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {can('test_rides.create') && (
            <Button
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              className="gap-1.5 text-xs font-semibold h-9 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>+ Book Test Ride</span>
            </Button>
          )}
        </div>
      </div>

      {/* Test Rides Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Scheduled & Recent Demo Rides</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="text-left p-3.5">Customer & Phone</th>
                  <th className="text-left p-3.5">Demo Bike Model</th>
                  <th className="text-left p-3.5">Assigned Consultant</th>
                  <th className="text-left p-3.5">Scheduled Date & Time</th>
                  <th className="text-center p-3.5">Status</th>
                  <th className="text-right p-3.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {testRides.map((tr) => (
                  <tr key={tr.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5">
                      <span className="font-bold text-slate-900 block">{tr.customerName}</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {tr.customerPhone}
                      </span>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-900">{tr.vehicleModel}</td>
                    <td className="p-3.5">
                      <span className="flex items-center gap-1.5">
                        <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                        {tr.executiveName || 'Assigned Staff'}
                      </span>
                    </td>
                    <td className="p-3.5 font-medium text-slate-800">
                      {formatDate(tr.scheduledAt)}
                    </td>
                    <td className="p-3.5 text-center">
                      <Badge
                        variant={
                          tr.status === 'COMPLETED'
                            ? 'success'
                            : tr.status === 'CONFIRMED'
                            ? 'info'
                            : tr.status === 'CANCELLED'
                            ? 'danger'
                            : 'warning'
                        }
                        className="text-[10px] font-bold"
                      >
                        {tr.status}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right">
                      {tr.status !== 'COMPLETED' && tr.status !== 'CANCELLED' ? (
                        <Button
                          size="sm"
                          onClick={() => setSelectedRide(tr)}
                          className="text-[11px] h-7"
                        >
                          Complete Ride
                        </Button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Logged</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Test Ride Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Schedule Bike Demo Test Ride"
        description="Book a demo bike test ride and allocate a sales consultant."
        size="md"
      >
        <form onSubmit={handleScheduleTestRide} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Customer Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Neha Gupta"
                required
                autoFocus
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Phone Number</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 XXXXX"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Demo Model</label>
              <select
                value={formData.vehicleModel}
                onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-xs text-slate-800"
              >
                <option value="Hero Xtreme 160R 4V">Hero Xtreme 160R 4V</option>
                <option value="Hero Xpulse 200 4V">Hero Xpulse 200 4V</option>
                <option value="Hero Splendor Plus XTEC">Hero Splendor Plus XTEC</option>
                <option value="Hero Passion Pro">Hero Passion Pro</option>
                <option value="Hero Glamour XTEC">Hero Glamour XTEC</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Date & Time</label>
              <Input
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Remarks / Requirements</label>
            <textarea
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Driving license verified, customer wants to test pillion comfort..."
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
            <Button type="submit" size="sm" className="font-semibold">
              Confirm Test Ride
            </Button>
          </div>
        </form>
      </Modal>

      {/* Complete Test Ride Modal */}
      {selectedRide && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedRide(null)}
          title="Record Test Ride Outcome"
          description={`Demo for ${selectedRide.customerName} on ${selectedRide.vehicleModel}`}
          size="sm"
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Customer Feedback / Reaction</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Loved the braking and acceleration; interested in booking token..."
                className="w-full h-20 rounded-md border border-slate-200 p-2 text-xs focus:ring-1 focus:ring-hero"
                required
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateOutcome('NO_SHOW')}
                className="text-slate-600 text-[11px]"
              >
                No Show
              </Button>
              <Button
                size="sm"
                onClick={() => handleUpdateOutcome('COMPLETED')}
                className="font-semibold text-[11px]"
              >
                Mark Completed
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
