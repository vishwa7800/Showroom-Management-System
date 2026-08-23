'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bike, ShieldCheck, ArrowRight, KeyRound, Phone, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import Link from 'next/link';

export default function CustomerLoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [identifier, setIdentifier] = useState('+91 98765 43210');
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/customer/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast('Login Failed', data.error || 'Customer not found', 'error');
        return;
      }

      setCustomerId(data.customerId);
      setCustomerName(data.customerName);
      setStep('OTP');
      setOtp('123456'); // Pre-fill demo OTP for fast user experience
      toast('OTP Sent', `Verification code dispatched for ${data.customerName}.`, 'success');
    } catch (err) {
      toast('Error', 'Failed to request verification code', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/customer/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast('Verification Failed', data.error || 'Invalid OTP', 'error');
        return;
      }

      toast('Welcome!', `Logged in successfully as ${data.customer.name}.`, 'success');
      router.push('/portal');
      router.refresh();
    } catch (err) {
      toast('Error', 'Failed to verify code', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 selection:bg-hero selection:text-white">
      {/* Brand Header with Link to Home */}
      <div className="text-center mb-6">
        <Link href="/" className="inline-flex flex-col items-center group">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-hero shadow-lg shadow-hero/30 mb-3 group-hover:scale-105 transition-transform">
            <Bike className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight group-hover:text-hero-50 transition-colors">
            Shreeji Hero MotoCorp
          </h1>
          <p className="text-xs font-bold text-hero tracking-widest uppercase mt-1">
            Customer Self-Service Portal
          </p>
        </Link>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-slate-100 relative overflow-hidden">
        <div className="h-1.5 w-full bg-hero absolute top-0 left-0" />

        {step === 'PHONE' ? (
          <form onSubmit={handleRequestOtp} className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Customer Sign In</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Access your owned Hero bikes, service tracking, invoices, and loan schedule.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Registered Mobile Number or Customer ID
              </label>
              <div className="relative">
                <Phone className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                <Input
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. +91 98765 43210 or SHR-1001"
                  className="pl-9 text-xs h-10"
                  required
                />
              </div>
              <span className="text-[11px] text-slate-400 block mt-1">
                Demo Accounts: <strong className="text-slate-700">+91 98765 43210</strong> (Ramesh Patel) or <strong className="text-slate-700">+91 98765 43211</strong> (Priya Shah)
              </span>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-10 text-xs font-bold gap-2">
              <span>{isLoading ? 'Checking Account...' : 'Get Verification Code (OTP)'}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Enter Verification Code</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Enter the 6-digit OTP dispatched to verify <strong>{customerName}</strong>.
              </p>
            </div>

            <div className="p-3 bg-hero-50/50 rounded-lg border border-hero-100 flex items-center justify-between text-xs">
              <span className="text-slate-700 font-medium">Demo Testing Code:</span>
              <Badge variant="hero" className="font-mono font-bold tracking-widest text-xs">
                123456
              </Badge>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">6-Digit Code</label>
              <div className="relative">
                <KeyRound className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                <Input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="pl-9 text-center font-mono font-bold tracking-widest text-sm h-10"
                  required
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('PHONE')}
                className="flex-1 text-xs h-10 font-semibold"
              >
                Change Number
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1 text-xs h-10 font-bold gap-2">
                <span>{isLoading ? 'Verifying...' : 'Verify & Enter'}</span>
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            </div>
          </form>
        )}

        {/* Footer Navigation */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col items-center gap-3 text-xs">
          <Link
            href="/"
            className="text-slate-600 hover:text-hero font-bold flex items-center gap-1.5 transition-colors"
          >
            <span>← Back to Home / Showroom</span>
          </Link>
          <span className="text-slate-400 text-[11px] flex items-center gap-1.5 font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Official Shreeji Hero Customer Verification • 256-Bit Encrypted
          </span>
        </div>
      </div>
    </div>
  );
}
