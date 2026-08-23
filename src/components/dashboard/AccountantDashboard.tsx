'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatINR } from '@/lib/utils';
import { getAccountantDashboardData } from '@/lib/db/dashboard-data';
import {
  CreditCard,
  DollarSign,
  FileText,
  AlertCircle,
  TrendingUp,
  Plus,
  CheckCircle2,
  Building2,
  PhoneCall,
  Download,
} from 'lucide-react';

interface AccountantDashboardProps {
  onQuickAction: (actionKey: string) => void;
}

export function AccountantDashboard({ onQuickAction }: AccountantDashboardProps) {
  const data = getAccountantDashboardData();

  return (
    <div className="space-y-6">
      {/* Finance & Accounts Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Finance, Billing & Accounts Ledger
            </h1>
            <Badge variant="hero" className="font-bold text-[10px] uppercase">
              Dealership Accounts
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Cash & bank collection reconciliation, sales/service invoices, GST computation, and overdue debtor tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={() => onQuickAction('RECORD_PAYMENT')}
            className="gap-1.5 text-xs font-semibold h-9"
          >
            <CreditCard className="h-4 w-4" />
            Record Payment Receipt
          </Button>
          <Button
            size="sm"
            onClick={() => onQuickAction('CREATE_INVOICE')}
            variant="outline"
            className="gap-1.5 text-xs text-slate-700 h-9"
          >
            <FileText className="h-4 w-4 text-hero" />
            Create Tax Invoice
          </Button>
          <Button
            size="sm"
            onClick={() => onQuickAction('RECONCILE_PAYMENTS')}
            variant="outline"
            className="gap-1.5 text-xs text-slate-700 h-9"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Bank & Financer Reconcile
          </Button>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Today's Cash / Bank Collections
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {formatINR(data.kpis.todayCollections)}
              </h3>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                Reconciliation in progress
              </span>
            </div>
            <div className="h-11 w-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-hero">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Monthly Invoiced Revenue
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {formatINR(data.kpis.monthlyRevenue)}
              </h3>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {data.kpis.totalInvoicesCount} invoices generated
              </span>
            </div>
            <div className="h-11 w-11 rounded-lg bg-hero-50 text-hero flex items-center justify-center">
              <DollarSign className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Unpaid / Pending Balances
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {formatINR(data.kpis.unpaidInvoicesAmount)}
              </h3>
              <span className="text-[11px] text-amber-600 font-bold mt-1 block">
                {data.kpis.unpaidInvoicesCount} outstanding bills
              </span>
            </div>
            <div className="h-11 w-11 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Current Month GST Liability
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {formatINR(data.kpis.gstLiabilityMonth)}
              </h3>
              <span className="text-[11px] text-blue-600 font-semibold mt-1 block">
                CGST 14% + SGST 14% Computed
              </span>
            </div>
            <div className="h-11 w-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overdue Accounts Receivable Ledger */}
      <Card className="border-2 border-amber-200">
        <CardHeader className="bg-amber-50/50 flex flex-row items-center justify-between pb-3 border-b border-amber-100">
          <div>
            <CardTitle className="text-sm flex items-center gap-2 font-bold text-slate-900">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              Overdue Accounts Receivable & Pending Balances
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Follow up on outstanding customer balances and pending auto loan disbursements.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => onQuickAction('RECORD_PAYMENT')}
            className="text-xs h-8"
          >
            + Record Payment
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="text-left p-3.5">Invoice #</th>
                  <th className="text-left p-3.5">Customer Details</th>
                  <th className="text-left p-3.5">Bill Type</th>
                  <th className="text-right p-3.5">Total Amount</th>
                  <th className="text-right p-3.5">Balance Due</th>
                  <th className="text-center p-3.5">Overdue Days</th>
                  <th className="text-right p-3.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {data.overdueReceivables.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-bold font-mono text-hero">{inv.invoiceNumber}</td>
                    <td className="p-3.5">
                      <span className="font-bold text-slate-900 block">{inv.customerName}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{inv.phone}</span>
                    </td>
                    <td className="p-3.5">
                      <Badge variant="outline" className="font-semibold text-[10px]">
                        {inv.invoiceType.replace(/_/g, ' ')}
                      </Badge>
                      {inv.financierName && (
                        <span className="block text-[10px] text-slate-500 mt-0.5">
                          {inv.financierName}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right font-medium text-slate-700">
                      {formatINR(inv.totalAmount)}
                    </td>
                    <td className="p-3.5 text-right font-bold text-rose-600">
                      {formatINR(inv.balanceDue)}
                    </td>
                    <td className="p-3.5 text-center">
                      <Badge variant="danger" className="font-bold text-[10px]">
                        {inv.daysOverdue} Days Late
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right">
                      <Button
                        size="sm"
                        onClick={() => onQuickAction('RECORD_PAYMENT')}
                        className="text-[11px] h-7"
                      >
                        Settle Payment
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Financier Loan Disbursal Pipeline */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Auto Loan Financier Disbursals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {data.financierDisbursals.map((fin) => (
              <div key={fin.financier} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{fin.financier}</span>
                  <Badge variant="info" className="text-[9px]">
                    {fin.count} Loans
                  </Badge>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-200">
                  <span className="text-slate-500 text-[11px]">Pending Disbursal:</span>
                  <span className="font-bold text-slate-900 block text-sm mt-0.5">
                    {formatINR(fin.pendingAmount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
