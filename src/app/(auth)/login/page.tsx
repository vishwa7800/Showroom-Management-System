'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Bike, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { Role } from '@/types';

function LoginFormContent() {
  const searchParams = useSearchParams();
  const redirectPath = searchParams?.get('redirect') || '/dashboard';
  const { toast } = useToast();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | ''>('ADMIN');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const loginId = identifier.trim();
    if (!loginId || !password) {
      setErrorMessage('Please enter your email / employee code and password.');
      setIsLoading(false);
      return;
    }

    if (!selectedRole) {
      setErrorMessage('Please select your authorized employee role.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: loginId,
          email: loginId,
          password,
          role: selectedRole,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Invalid credentials. Please verify your email/code, password, and selected role.');
        setIsLoading(false);
        return;
      }

      toast('Welcome back!', `${data.user?.name || 'Employee'} (${data.user?.role?.replace(/_/g, ' ') || 'Authorized'})`, 'success');
      
      // Clear any stale local preferences
      try {
        localStorage.removeItem('shreeji_hero_active_user');
      } catch (e) {}

      // Hard redirect to dashboard to establish verified server session
      window.location.href = redirectPath || '/dashboard';
    } catch (err) {
      setErrorMessage('Network or server error during sign in. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-slate-100 relative overflow-hidden space-y-6">
      <div className="h-1.5 w-full bg-hero absolute top-0 left-0" />

      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-900">Employee Portal Sign In</h2>
        <p className="text-xs text-slate-500 mt-1">
          Enter your authorized credentials and showroom role to access ERP.
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2.5 text-xs animate-in fade-in">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-rose-600" />
          <span className="leading-snug">{errorMessage}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email or Employee Code */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            Email or Employee Code <span className="text-hero">*</span>
          </label>
          <div className="relative">
            <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
            <Input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. rajesh@shreejihero.com or EMP-1001"
              required
              autoComplete="username"
              className="pl-9 text-xs h-10"
            />
          </div>
        </div>

        {/* Showroom Role Selector */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            Employee Role <span className="text-hero">*</span>
          </label>
          <div className="relative">
            <UserCheck className="h-4 w-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as Role)}
              required
              className="w-full h-10 pl-9 pr-3 rounded-md bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-hero focus:border-hero transition-colors cursor-pointer appearance-none"
            >
              <option value="ADMIN">Admin / Owner</option>
              <option value="SHOWROOM_MANAGER">Showroom Manager</option>
              <option value="SALES_EXECUTIVE">Sales Executive</option>
              <option value="FRONT_DESK">Front Desk</option>
              <option value="SERVICE_MANAGER">Service Manager</option>
              <option value="SERVICE_ADVISOR">Service Advisor</option>
              <option value="ACCOUNTANT">Accountant</option>
              <option value="INVENTORY_MANAGER">Inventory Manager</option>
            </select>
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700">
              Password <span className="text-hero">*</span>
            </label>
            <button
              type="button"
              onClick={() => toast('Password Reset', 'Please contact your Showroom Administrator or IT Department to reset your password.', 'info')}
              className="text-[11px] font-semibold text-slate-500 hover:text-hero transition-colors"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your account password"
              required
              autoComplete="current-password"
              className="pl-9 pr-9 text-xs h-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Sign In Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 text-xs font-bold gap-2 bg-hero hover:bg-hero-700 text-white shadow-md shadow-hero/20 mt-2"
        >
          <span>{isLoading ? 'Authenticating...' : 'Sign In'}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      {/* Trust & Enterprise Badge */}
      <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
        <span>Secured with Server-Side Role Verification (RBAC)</span>
      </div>

      {/* Footer Navigation */}
      <div className="pt-4 border-t border-slate-100 flex flex-col items-center gap-2 text-xs">
        <p className="text-slate-500">
          New Dealership Admin?{' '}
          <Link href="/signup" className="font-bold text-hero hover:underline">
            Register Dealership / Owner
          </Link>
        </p>
        <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
          <Link href="/portal/login" className="hover:text-hero">
            Customer Self-Service Portal →
          </Link>
          <span>•</span>
          <Link href="/" className="hover:text-slate-600">
            Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 selection:bg-hero selection:text-white">
      <div className="text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2 mb-3 group">
          <div className="h-12 w-12 rounded-2xl bg-hero flex items-center justify-center text-white shadow-lg shadow-hero/30 group-hover:scale-105 transition-transform">
            <Bike className="h-7 w-7" />
          </div>
        </Link>
        <h1 className="text-2xl font-black text-white tracking-tight">Shreeji Hero MotoCorp</h1>
        <p className="text-xs font-bold text-hero tracking-widest uppercase mt-0.5">
          Showroom Management System
        </p>
      </div>

      <Suspense
        fallback={
          <div className="w-full max-w-md bg-white rounded-2xl p-8 text-center text-xs text-slate-500">
            Loading sign in...
          </div>
        }
      >
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
