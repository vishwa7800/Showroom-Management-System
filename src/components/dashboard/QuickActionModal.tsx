'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';

interface QuickActionModalProps {
  actionKey: string | null;
  onClose: () => void;
}

export function QuickActionModal({ actionKey, onClose }: QuickActionModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [interestedModel, setInterestedModel] = useState('Hero Splendor Plus XTEC');
  const [purpose, setPurpose] = useState('NEW_PURCHASE');
  const [notes, setNotes] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  if (!actionKey) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();

      switch (actionKey) {
        case 'REGISTER_WALK_IN':
          toast('Walk-In Registered', `${guestName || 'Guest'} added to Front Desk lounge queue.`, 'success');
          break;
        case 'ADD_LEAD':
          toast('Lead Added', `Lead for ${guestName || 'Customer'} created & follow-up scheduled.`, 'success');
          break;
        case 'LOG_FOLLOW_UP':
          toast('Follow-Up Logged', 'Follow-up conversation notes saved to customer record.', 'success');
          break;
        case 'SCHEDULE_TEST_RIDE':
          toast('Test Ride Reserved', `Demo ride for ${interestedModel} scheduled successfully.`, 'success');
          break;
        case 'CREATE_BOOKING':
          toast('Booking Initialized', `Booking token recorded for ${interestedModel}.`, 'success');
          break;
        case 'CREATE_JOB_CARD':
          toast('Job Card Created', 'New service job card generated with inspection checklist.', 'success');
          break;
        case 'CHECK_IN_VEHICLE':
          toast('Vehicle Checked-In', 'Vehicle odometer and fuel level recorded. Handed to inspection bay.', 'success');
          break;
        case 'REVIEW_DELAYS':
          toast('Delay Noted', 'Technician and parts department notified to expedite repair.', 'warning');
          break;
        case 'APPROVE_REPAIR':
          toast('Estimate Approved', 'Major repair estimate authorized for workshop execution.', 'success');
          break;
        case 'CREATE_INVOICE':
          toast('Invoice Generated', 'GST Tax Invoice created with CGST/SGST breakdown.', 'success');
          break;
        case 'RECORD_PAYMENT':
          toast('Payment Receipt Logged', `Payment of ₹${amount || '2,450'} via ${paymentMethod} recorded.`, 'success');
          break;
        case 'ADD_STOCK_INWARD':
          toast('Stock Received', 'Factory consignment inward logged in branch inventory.', 'success');
          break;
        case 'TRANSFER_STOCK':
          toast('Stock Transfer Initiated', 'Inter-branch stock gate pass generated.', 'info');
          break;
        case 'SET_SALES_TARGET':
          toast('Target Updated', 'Showroom monthly sales target updated across branches.', 'success');
          break;
        default:
          toast('Action Completed', 'Showroom operational record updated.', 'success');
      }
    }, 400);
  };

  const getTitleAndDesc = () => {
    switch (actionKey) {
      case 'REGISTER_WALK_IN':
        return {
          title: 'Register Showroom Walk-In Guest',
          desc: 'Fast customer check-in for front desk guest reception.',
        };
      case 'ADD_LEAD':
        return {
          title: 'Add New Sales Lead',
          desc: 'Capture customer interest, phone, and target Hero model.',
        };
      case 'LOG_FOLLOW_UP':
        return {
          title: 'Log Customer Follow-Up',
          desc: 'Record discussion notes and schedule the next interaction date.',
        };
      case 'SCHEDULE_TEST_RIDE':
        return {
          title: 'Schedule Bike Test Ride',
          desc: 'Book a demo bike slot and assign a sales executive.',
        };
      case 'CREATE_JOB_CARD':
        return {
          title: 'Create Workshop Job Card',
          desc: 'Log vehicle registration number, complaints, and initial estimate.',
        };
      case 'CHECK_IN_VEHICLE':
        return {
          title: 'Vehicle Service Check-In',
          desc: 'Record vehicle arrival, fuel status, and workshop bay handover.',
        };
      case 'RECORD_PAYMENT':
        return {
          title: 'Record Payment Receipt',
          desc: 'Log customer payment against sales invoice or service bill.',
        };
      case 'ADD_STOCK_INWARD':
        return {
          title: 'Receive Vehicle / Spares Stock',
          desc: 'Log factory batch arrival or parts consignment.',
        };
      case 'SET_SALES_TARGET':
        return {
          title: 'Configure Monthly Sales Target',
          desc: 'Set branch quota for new bike deliveries.',
        };
      default:
        return {
          title: 'Showroom Quick Action',
          desc: 'Perform authorized operational action.',
        };
    }
  };

  const { title, desc } = getTitleAndDesc();

  return (
    <Modal isOpen={true} onClose={onClose} title={title} description={desc} size="md">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {actionKey === 'REGISTER_WALK_IN' && (
          <>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Guest Full Name</label>
              <Input
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Mukeshbhai Patel"
                required
                autoFocus
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Contact Phone</label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 XXXXX"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Visit Purpose</label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-xs text-slate-800"
                >
                  <option value="NEW_PURCHASE">New Bike Purchase</option>
                  <option value="TEST_RIDE">Test Ride Request</option>
                  <option value="SERVICE">Service Check-In</option>
                  <option value="GENERAL_INQUIRY">General Inquiry</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Interested Model</label>
                <select
                  value={interestedModel}
                  onChange={(e) => setInterestedModel(e.target.value)}
                  className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-xs text-slate-800"
                >
                  <option value="Hero Splendor Plus XTEC">Splendor Plus XTEC</option>
                  <option value="Hero Passion Pro">Passion Pro</option>
                  <option value="Hero HF Deluxe">HF Deluxe</option>
                  <option value="Hero Xpulse 200 4V">Xpulse 200 4V</option>
                  <option value="Hero Xtreme 160R">Xtreme 160R</option>
                </select>
              </div>
            </div>
          </>
        )}

        {actionKey === 'ADD_LEAD' && (
          <>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Customer Name</label>
              <Input
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                required
                autoFocus
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Phone Number</label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 XXXXX"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Interested Bike Model</label>
              <select
                value={interestedModel}
                onChange={(e) => setInterestedModel(e.target.value)}
                className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-xs text-slate-800"
              >
                <option value="Hero Splendor Plus XTEC">Splendor Plus XTEC</option>
                <option value="Hero Passion Pro">Passion Pro</option>
                <option value="Hero HF Deluxe">HF Deluxe</option>
                <option value="Hero Xpulse 200 4V">Xpulse 200 4V</option>
                <option value="Hero Xtreme 160R">Xtreme 160R</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Customer Notes / Finance Requirement</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Exchange bonus interest, down payment budget, etc."
                className="w-full h-16 rounded-md border border-slate-200 p-2 text-xs focus:ring-1 focus:ring-hero"
              />
            </div>
          </>
        )}

        {actionKey === 'CREATE_JOB_CARD' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Vehicle Reg Number</label>
                <Input placeholder="e.g. GJ-36-AB-1234" required autoFocus />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Odometer (KM)</label>
                <Input placeholder="e.g. 14,500 km" required />
              </div>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Customer Complaints</label>
              <textarea
                placeholder="Describe engine sound, brake adjustment, oil change request..."
                className="w-full h-16 rounded-md border border-slate-200 p-2 text-xs focus:ring-1 focus:ring-hero"
                required
              />
            </div>
          </>
        )}

        {actionKey === 'RECORD_PAYMENT' && (
          <>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Customer / Invoice Ref</label>
              <Input placeholder="e.g. Rohit Verma (#INV-2024-1002)" required autoFocus />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Amount (₹)</label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="25000"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-xs text-slate-800"
                >
                  <option value="UPI">UPI / QR Code</option>
                  <option value="CASH">Cash</option>
                  <option value="CARD">Debit / Credit Card</option>
                  <option value="BANK_TRANSFER">NEFT / RTGS Bank Transfer</option>
                  <option value="FINANCIER">Hero FinCorp Disbursal</option>
                </select>
              </div>
            </div>
          </>
        )}

        {actionKey === 'SET_SALES_TARGET' && (
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Monthly Showroom Quota (Units)</label>
            <Input type="number" placeholder="e.g. 80" defaultValue="80" required autoFocus />
          </div>
        )}

        {/* Fallback general form if not custom */}
        {!['REGISTER_WALK_IN', 'ADD_LEAD', 'CREATE_JOB_CARD', 'RECORD_PAYMENT', 'SET_SALES_TARGET'].includes(actionKey) && (
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Operation Details</label>
            <textarea
              placeholder="Enter operational parameters and notes..."
              className="w-full h-20 rounded-md border border-slate-200 p-2 text-xs focus:ring-1 focus:ring-hero"
              required
            />
          </div>
        )}

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" isLoading={isSubmitting} className="font-semibold">
            Confirm & Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}
