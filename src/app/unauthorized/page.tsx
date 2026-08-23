'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center space-y-6">
        <div className="mx-auto h-16 w-16 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
            403 Forbidden
          </span>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Access Denied
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            You do not have permission to access this showroom module. This area is restricted to authorized roles only.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button size="sm" className="w-full gap-1.5 font-semibold text-xs h-9">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs h-9 text-slate-600">
              <LogOut className="h-4 w-4" />
              Switch Account
            </Button>
          </Link>
        </div>

        <div className="border-t border-slate-100 pt-4 text-[11px] text-slate-400">
          Shreeji Hero Showroom ERP • Security & Access Control
        </div>
      </div>
    </div>
  );
}
