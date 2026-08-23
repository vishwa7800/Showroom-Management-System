'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bike, Shield, Mail, Lock, User, Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';

export default function SignupPage() {
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match. Please confirm your password.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const fullName = name.trim() || email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

      // 1. Send to server API to sign session JWT & audit log
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'ADMIN',
          name: fullName,
          email: email.trim(),
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Registration failed.');
        setIsLoading(false);
        return;
      }

      toast('Account Created!', `Welcome, ${fullName}! Directing to your Owner Dashboard.`, 'success');

      // Clear any stale local preferences
      try {
        localStorage.removeItem('shreeji_hero_active_user');
      } catch (e) {}

      // Immediate redirect to Dashboard with verified server session
      window.location.href = '/dashboard';
    } catch (err) {
      setErrorMessage('Network or server error during sign up.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 selection:bg-hero selection:text-white">
      {/* Brand Header */}
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

      {/* Main Signup Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-slate-100 relative overflow-hidden space-y-6">
        <div className="h-1.5 w-full bg-hero absolute top-0 left-0" />

        <div className="text-center">
          <h2 className="text-lg font-bold text-slate-900">Sign Up for Admin / Owner</h2>
          <p className="text-xs text-slate-500 mt-1">
            Register your dealership franchise and manage showroom operations.
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2.5 text-xs animate-in fade-in">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-rose-600" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Indicator - Strictly Admin / Owner only */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Signup as:
            </label>
            <div className="py-2.5 px-3 bg-hero-50/60 border border-hero-200 rounded-lg flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-hero font-bold">
                <Shield className="h-4 w-4" />
                <span>Admin / Dealership Owner</span>
              </div>
              <Badge variant="hero" className="text-[10px] uppercase font-bold">
                Franchise Primary
              </Badge>
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">
              Note: Showroom Managers and staff accounts are created by the Owner from the dashboard.
            </span>
          </div>

          {/* Full Name */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Full Name <span className="text-hero">*</span>
            </label>
            <div className="relative">
              <User className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rajesh Sharma"
                required
                className="pl-9 text-xs h-10"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Email Address <span className="text-hero">*</span>
            </label>
            <div className="relative">
              <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@shreejihero.com"
                required
                className="pl-9 text-xs h-10"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Password <span className="text-hero">*</span>
            </label>
            <div className="relative">
              <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                required
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

          {/* Confirm Password */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Confirm Password <span className="text-hero">*</span>
            </label>
            <div className="relative">
              <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
              <Input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                required
                className="pl-9 text-xs h-10"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 text-xs font-bold gap-2 bg-hero hover:bg-hero-700 text-white shadow-md shadow-hero/20 mt-2"
          >
            <span>{isLoading ? 'Creating Account...' : 'Create Dealership Account'}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        {/* Footer Links */}
        <div className="pt-4 border-t border-slate-100 flex flex-col items-center gap-2 text-xs">
          <p className="text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-hero hover:underline">
              Sign In
            </Link>
          </p>
          <Link href="/" className="text-slate-400 hover:text-slate-600 font-semibold text-[11px]">
            ← Back to Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
}
