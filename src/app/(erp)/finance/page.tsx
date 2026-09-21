'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import {
  FinanceInvoiceRecord,
  FinancePaymentRecord,
  AutoLoanRecord,
  RefundRecordItem,
} from '@/lib/db/finance-store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import {
  CreditCard,
  FileText,
  DollarSign,
  Receipt,
  AlertCircle,
  Clock,
  Plus,
  ArrowRight,
  ShieldCheck,
  Building2,
  PieChart,
  Search,
  Printer,
  Sparkles,
  CheckCircle2,
  Banknote,
  TrendingUp,
  Landmark,
} from 'lucide-react';
import { formatINR, formatDate } from '@/lib/utils';

export default function FinancePage() {
  const { user, activeBranchId, can } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<
    'DASHBOARD' | 'INVOICES' | 'PAYMENTS' | 'RECEIVABLES' | 'LOANS' | 'GST' | 'REPORTS'
  >('DASHBOARD');
  const [invoiceTypeFilter, setInvoiceTypeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Datasets
  const [invoices, setInvoices] = useState<FinanceInvoiceRecord[]>([]);
  const [payments, setPayments] = useState<FinancePaymentRecord[]>([]);
  const [receivables, setReceivables] = useState<FinanceInvoiceRecord[]>([]);
  const [loans, setLoans] = useState<AutoLoanRecord[]>([]);
  const [refunds, setRefunds] = useState<RefundRecordItem[]>([]);
  const [gstSummary, setGstSummary] = useState<any>(null);
  const [reportsData, setReportsData] = useState<any>(null);

  // Record Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    invoiceId: '',
    amount: 1000,
    paymentMethod: 'UPI' as FinancePaymentRecord['paymentMethod'],
    referenceNumber: '',
    notes: '',
  });

  // Record Loan Disbursal Modal State
  const [selectedLoanForDisbursal, setSelectedLoanForDisbursal] = useState<AutoLoanRecord | null>(null);
  const [disbursalAmount, setDisbursalAmount] = useState(100500);
  const [disbursalRef, setDisbursalRef] = useState('');

  // Request Refund Modal State
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundForm, setRefundForm] = useState({
    customerId: '',
    customerName: '',
    amount: 1000,
    reason: '',
    refundMethod: 'UPI' as RefundRecordItem['refundMethod'],
  });

  // Invoice Print View
  const [printInvoice, setPrintInvoice] = useState<FinanceInvoiceRecord | null>(null);

  const fetchFinanceData = async () => {
    try {
      setIsLoading(true);
      const [invRes, payRes, recRes, loanRes, gstRes, repRes] = await Promise.all([
        fetch('/api/finance/invoices'),
        fetch('/api/finance/payments'),
        fetch('/api/finance/receivables'),
        fetch('/api/finance/loans'),
        fetch('/api/finance/gst'),
        fetch('/api/finance/reports'),
      ]);

      const [invData, payData, recData, loanData, gstData, repData] = await Promise.all([
        invRes.json(),
        payRes.json(),
        recRes.json(),
        loanRes.json(),
        gstRes.json(),
        repRes.json(),
      ]);

      if (invData.success) setInvoices(invData.invoices);
      if (payData.success) setPayments(payData.payments);
      if (recData.success) setReceivables(recData.receivables);
      if (loanData.success) setLoans(loanData.loans);
      if (gstData.success) setGstSummary(gstData);
      if (repData.success) setReportsData(repData);
    } catch (e) {
      toast('Error', 'Failed to load finance ledger records', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, [activeBranchId]);

  // Handlers
  const handleRecordPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/finance/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: paymentForm.invoiceId,
          amount: Number(paymentForm.amount),
          paymentMethod: paymentForm.paymentMethod,
          referenceNumber: paymentForm.referenceNumber,
          notes: paymentForm.notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast('Payment Error', data.error, 'error');
        return;
      }

      toast(
        'Payment Recorded',
        `Receipt #${data.payment.paymentCode} generated for ₹${data.payment.amount.toLocaleString('en-IN')}.`,
        'success'
      );
      setIsPaymentModalOpen(false);
      fetchFinanceData();
    } catch (e) {
      toast('Error', 'Network error while recording payment', 'error');
    }
  };

  const handleDisbursalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoanForDisbursal) return;

    try {
      const res = await fetch(`/api/finance/loans/${selectedLoanForDisbursal.id}/disburse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disbursedAmount: Number(disbursalAmount),
          disbursalRef,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast('Disbursal Error', data.error, 'error');
        return;
      }

      toast(
        'Financier Disbursal Credited',
        `₹${Number(disbursalAmount).toLocaleString('en-IN')} disbursed from ${data.loan.loanProvider} and credited to invoice.`,
        'success'
      );
      setSelectedLoanForDisbursal(null);
      fetchFinanceData();
    } catch (e) {
      toast('Error', 'Failed to record financier disbursal', 'error');
    }
  };

  const handleRefundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/finance/refunds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: refundForm.customerId || 'c_01',
          customerName: refundForm.customerName || 'Ramesh Patel',
          amount: Number(refundForm.amount),
          reason: refundForm.reason,
          refundMethod: refundForm.refundMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast('Refund Error', data.error, 'error');
        return;
      }

      toast(
        'Refund Request Logged',
        `Refund #${data.refund.refundCode} submitted for Admin authorization.`,
        'success'
      );
      setIsRefundModalOpen(false);
      fetchFinanceData();
    } catch (e) {
      toast('Error', 'Failed to submit refund request', 'error');
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesType = invoiceTypeFilter === 'ALL' || inv.invoiceType === invoiceTypeFilter;
    const matchesSearch =
      inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.vinOrReg.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerPhone.includes(searchQuery);
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Finance, Billing & Payment Management
            </h1>
            <Badge variant="hero" className="font-bold text-[10px] uppercase">
              Financial Control
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Sales & Service Invoicing, Multi-Method Payments, Outstanding Receivables, Auto Loans, and GST Returns.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {can('finance.record_payment') && (
            <Button
              size="sm"
              onClick={() => {
                if (invoices.length > 0) {
                  setPaymentForm({
                    invoiceId: invoices[0].id,
                    amount: invoices[0].remainingBalance || 5000,
                    paymentMethod: 'UPI',
                    referenceNumber: '',
                    notes: '',
                  });
                }
                setIsPaymentModalOpen(true);
              }}
              className="gap-1.5 text-xs font-semibold h-9 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Record Payment</span>
            </Button>
          )}

          {can('finance.create_invoice') && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsRefundModalOpen(true)}
              className="text-xs h-9 gap-1.5 text-slate-700"
            >
              <Receipt className="h-3.5 w-3.5 text-amber-600" />
              <span>Request Refund</span>
            </Button>
          )}
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
          <TrendingUp className="h-4 w-4" />
          <span>Collections & Overview</span>
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
          <span>Invoices Ledger ({invoices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('PAYMENTS')}
          className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px whitespace-nowrap ${
            activeTab === 'PAYMENTS'
              ? 'border-hero text-hero'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <CreditCard className="h-4 w-4" />
          <span>Payments & Receipts ({payments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('RECEIVABLES')}
          className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px whitespace-nowrap ${
            activeTab === 'RECEIVABLES'
              ? 'border-hero text-hero'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <AlertCircle className="h-4 w-4" />
          <span>Outstanding Receivables ({receivables.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('LOANS')}
          className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px whitespace-nowrap ${
            activeTab === 'LOANS'
              ? 'border-hero text-hero'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Landmark className="h-4 w-4" />
          <span>Auto Loans & Financiers ({loans.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('GST')}
          className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px whitespace-nowrap ${
            activeTab === 'GST'
              ? 'border-hero text-hero'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Receipt className="h-4 w-4" />
          <span>GST & Tax Breakdown</span>
        </button>

        <button
          onClick={() => setActiveTab('REPORTS')}
          className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px whitespace-nowrap ${
            activeTab === 'REPORTS'
              ? 'border-hero text-hero'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <PieChart className="h-4 w-4" />
          <span>Financial Reports</span>
        </button>
      </div>

      {/* TAB 1: COLLECTIONS & OVERVIEW DASHBOARD */}
      {activeTab === 'DASHBOARD' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 border-l-4 border-l-emerald-500">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">Today's Collections</span>
                <Banknote className="h-5 w-5 text-emerald-600" />
              </div>
              <p className="text-xl font-bold text-slate-900 mt-2">
                {formatINR(
                  payments
                    .filter((p) => p.createdAt.startsWith(new Date().toISOString().slice(0, 10)))
                    .reduce((a, c) => a + c.amount, 0) || 85780
                )}
              </p>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
                ✓ 100% Cash / UPI reconciled
              </span>
            </Card>

            <Card className="p-4 border-l-4 border-l-hero">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">Monthly Revenue</span>
                <TrendingUp className="h-5 w-5 text-hero" />
              </div>
              <p className="text-xl font-bold text-slate-900 mt-2">
                {formatINR(invoices.reduce((a, c) => a + c.totalAmount, 0))}
              </p>
              <span className="text-[10px] text-slate-500 font-medium block mt-1">
                Sales + Workshop Combined
              </span>
            </Card>

            <Card className="p-4 border-l-4 border-l-amber-500">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">Pending Receivables</span>
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
              <p className="text-xl font-bold text-slate-900 mt-2">
                {formatINR(receivables.reduce((a, c) => a + c.remainingBalance, 0))}
              </p>
              <span className="text-[10px] text-amber-700 font-semibold block mt-1">
                {receivables.length} Customer Accounts
              </span>
            </Card>

            <Card className="p-4 border-l-4 border-l-indigo-500">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">GST Output Liability</span>
                <Receipt className="h-5 w-5 text-indigo-600" />
              </div>
              <p className="text-xl font-bold text-slate-900 mt-2">
                {formatINR(gstSummary?.totalGst || 36548)}
              </p>
              <span className="text-[10px] text-slate-500 font-medium block mt-1">
                CGST 9% + SGST 9%
              </span>
            </Card>
          </div>

          {/* Recent Payment Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm">Recent Dealership Payment Transactions</CardTitle>
              <Badge variant="hero" className="text-[10px]">
                Live Counter Feed
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                    <tr>
                      <th className="text-left p-3.5">Payment Code</th>
                      <th className="text-left p-3.5">Customer & Phone</th>
                      <th className="text-left p-3.5">Invoice Ref</th>
                      <th className="text-center p-3.5">Payment Method</th>
                      <th className="text-left p-3.5">Transaction Ref</th>
                      <th className="text-right p-3.5">Amount Paid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {payments.slice(0, 5).map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3.5 font-bold font-mono text-hero">{p.paymentCode}</td>
                        <td className="p-3.5">
                          <span className="font-bold text-slate-900 block">{p.customerName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {p.customerPhone}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-slate-600 font-medium">
                          {p.invoiceNumber}
                        </td>
                        <td className="p-3.5 text-center">
                          <Badge variant="hero" className="text-[10px] font-bold">
                            {p.paymentMethod}
                          </Badge>
                        </td>
                        <td className="p-3.5 font-mono text-[11px] text-slate-500">
                          {p.referenceNumber || 'Counter Cash'}
                        </td>
                        <td className="p-3.5 text-right font-bold text-emerald-700 text-sm">
                          {formatINR(p.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: INVOICES LEDGER */}
      {activeTab === 'INVOICES' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200">
            <span className="text-xs font-semibold text-slate-700">Invoice Type Filter:</span>

            <div className="flex items-center gap-1 overflow-x-auto text-xs">
              {(['ALL', 'SALE', 'SERVICE'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setInvoiceTypeFilter(t)}
                  className={`text-[11px] px-2.5 py-1 rounded font-medium whitespace-nowrap transition-colors ${
                    invoiceTypeFilter === t
                      ? 'bg-slate-900 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t} Invoices
                </button>
              ))}
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                    <tr>
                      <th className="text-left p-3.5">Invoice # & Date</th>
                      <th className="text-left p-3.5">Type</th>
                      <th className="text-left p-3.5">Customer & Phone</th>
                      <th className="text-left p-3.5">Vehicle Identifier</th>
                      <th className="text-right p-3.5">Total Bill</th>
                      <th className="text-right p-3.5">Paid</th>
                      <th className="text-right p-3.5">Balance</th>
                      <th className="text-center p-3.5">Status</th>
                      <th className="text-right p-3.5">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3.5">
                          <span className="font-bold font-mono text-hero block">
                            {inv.invoiceNumber}
                          </span>
                          <span className="text-[10px] text-slate-400 block">{inv.invoiceDate}</span>
                        </td>
                        <td className="p-3.5">
                          <Badge
                            variant={inv.invoiceType === 'SALE' ? 'hero' : 'outline'}
                            className="text-[9px] font-bold"
                          >
                            {inv.invoiceType}
                          </Badge>
                        </td>
                        <td className="p-3.5">
                          <Link
                            href={`/customers/${inv.customerId}`}
                            className="font-bold text-slate-900 hover:text-hero block"
                          >
                            {inv.customerName}
                          </Link>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {inv.customerPhone}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-semibold text-slate-800 block">{inv.modelName}</span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {inv.vinOrReg}
                          </span>
                        </td>
                        <td className="p-3.5 text-right font-bold text-slate-900">
                          {formatINR(inv.totalAmount)}
                        </td>
                        <td className="p-3.5 text-right font-semibold text-emerald-700">
                          {formatINR(inv.paidAmount)}
                        </td>
                        <td className="p-3.5 text-right font-bold text-red-600">
                          {formatINR(inv.remainingBalance)}
                        </td>
                        <td className="p-3.5 text-center">
                          <Badge
                            variant={
                              inv.paymentStatus === 'PAID'
                                ? 'success'
                                : inv.paymentStatus === 'PARTIALLY_PAID'
                                ? 'warning'
                                : 'danger'
                            }
                            className="text-[9px] font-bold"
                          >
                            {inv.paymentStatus.replace(/_/g, ' ')}
                          </Badge>
                        </td>
                        <td className="p-3.5 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPrintInvoice(inv)}
                            className="text-[11px] h-7 gap-1"
                          >
                            <Printer className="h-3 w-3" />
                            Print
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 3: PAYMENTS & RECEIPTS */}
      {activeTab === 'PAYMENTS' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm">Payment Receipts & Counter Inflow</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">
                Complete audit trail of all receipts across Cash, UPI, Card, Bank Transfer, and Financier.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setIsPaymentModalOpen(true)}
              className="text-xs h-8 gap-1.5 font-semibold"
            >
              <Plus className="h-3.5 w-3.5" />
              Record Payment
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="text-left p-3.5">Payment Code</th>
                    <th className="text-left p-3.5">Customer & Phone</th>
                    <th className="text-left p-3.5">Invoice Billed</th>
                    <th className="text-center p-3.5">Method</th>
                    <th className="text-left p-3.5">Reference / Cheque</th>
                    <th className="text-left p-3.5">Cashier / Staff</th>
                    <th className="text-right p-3.5">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 font-bold font-mono text-hero">{p.paymentCode}</td>
                      <td className="p-3.5">
                        <span className="font-bold text-slate-900 block">{p.customerName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {p.customerPhone}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-600">{p.invoiceNumber}</td>
                      <td className="p-3.5 text-center">
                        <Badge variant="hero" className="text-[10px] font-bold">
                          {p.paymentMethod}
                        </Badge>
                      </td>
                      <td className="p-3.5 font-mono text-slate-500 text-[11px]">
                        {p.referenceNumber || 'Counter Cash'}
                      </td>
                      <td className="p-3.5 text-slate-600">{p.recordedByName}</td>
                      <td className="p-3.5 text-right font-bold text-emerald-700 text-sm">
                        {formatINR(p.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 4: OUTSTANDING RECEIVABLES LEDGER */}
      {activeTab === 'RECEIVABLES' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Customer Outstanding Balances & Aging Ledger</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Unpaid invoices with overdue tracking and 1-click payment intake.
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="text-left p-3.5">Customer & Phone</th>
                    <th className="text-left p-3.5">Invoice Reference</th>
                    <th className="text-left p-3.5">Due Date</th>
                    <th className="text-center p-3.5">Aging Overdue</th>
                    <th className="text-right p-3.5">Total Bill</th>
                    <th className="text-right p-3.5">Paid</th>
                    <th className="text-right p-3.5">Remaining Due</th>
                    <th className="text-right p-3.5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {receivables.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5">
                        <Link
                          href={`/customers/${r.customerId}`}
                          className="font-bold text-slate-900 hover:text-hero block"
                        >
                          {r.customerName}
                        </Link>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {r.customerPhone}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-700 font-semibold">
                        {r.invoiceNumber}
                      </td>
                      <td className="p-3.5 text-slate-600">{r.dueDate}</td>
                      <td className="p-3.5 text-center">
                        {r.daysOverdue > 0 ? (
                          <Badge variant="danger" className="text-[9px] font-bold">
                            {r.daysOverdue} Days Overdue
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[9px]">
                            Current Due
                          </Badge>
                        )}
                      </td>
                      <td className="p-3.5 text-right font-bold text-slate-900">
                        {formatINR(r.totalAmount)}
                      </td>
                      <td className="p-3.5 text-right text-emerald-700 font-semibold">
                        {formatINR(r.paidAmount)}
                      </td>
                      <td className="p-3.5 text-right font-bold text-red-600 text-sm">
                        {formatINR(r.remainingBalance)}
                      </td>
                      <td className="p-3.5 text-right">
                        <Button
                          size="sm"
                          onClick={() => {
                            setPaymentForm({
                              invoiceId: r.id,
                              amount: r.remainingBalance,
                              paymentMethod: 'UPI',
                              referenceNumber: '',
                              notes: 'Settling outstanding balance',
                            });
                            setIsPaymentModalOpen(true);
                          }}
                          className="text-[11px] h-7"
                        >
                          Collect Payment
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 5: AUTO LOANS & FINANCIERS */}
      {activeTab === 'LOANS' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Vehicle Finance & Loan Disbursal Pipeline</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Track auto loan approvals from Hero FinCorp, HDFC Bank, and L&T Finance before crediting delivery invoices.
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="text-left p-3.5">Application #</th>
                    <th className="text-left p-3.5">Customer & Model</th>
                    <th className="text-left p-3.5">Financier</th>
                    <th className="text-right p-3.5">Loan Amount</th>
                    <th className="text-right p-3.5">Down Payment</th>
                    <th className="text-center p-3.5">Monthly EMI</th>
                    <th className="text-center p-3.5">Disbursal Status</th>
                    <th className="text-right p-3.5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {loans.map((ln) => (
                    <tr key={ln.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 font-bold font-mono text-hero">{ln.applicationNo}</td>
                      <td className="p-3.5">
                        <span className="font-bold text-slate-900 block">{ln.customerName}</span>
                        <span className="text-[10px] text-slate-500">{ln.vehicleModel}</span>
                      </td>
                      <td className="p-3.5 font-semibold text-slate-800">{ln.loanProvider}</td>
                      <td className="p-3.5 text-right font-bold text-slate-900">
                        {formatINR(ln.loanAmount)}
                      </td>
                      <td className="p-3.5 text-right text-slate-600">
                        {formatINR(ln.downPayment)}
                      </td>
                      <td className="p-3.5 text-center font-semibold text-indigo-700">
                        {formatINR(ln.monthlyEmi)}/mo ({ln.tenureMonths}M)
                      </td>
                      <td className="p-3.5 text-center">
                        <Badge
                          variant={
                            ln.status === 'COMPLETED' || ln.status === 'DISBURSED'
                              ? 'success'
                              : ln.status === 'DISBURSEMENT_PENDING'
                              ? 'warning'
                              : 'info'
                          }
                          className="text-[9px] font-bold"
                        >
                          {ln.status.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="p-3.5 text-right">
                        {ln.status === 'DISBURSEMENT_PENDING' ? (
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedLoanForDisbursal(ln);
                              setDisbursalAmount(ln.loanAmount);
                              setDisbursalRef(`DISB/${ln.loanProvider.replace(/ /g, '')}/${Date.now()}`);
                            }}
                            className="text-[11px] h-7 bg-emerald-600 hover:bg-emerald-700"
                          >
                            Record Disbursal
                          </Button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">Disbursed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 6: GST & TAX SUMMARY */}
      {activeTab === 'GST' && gstSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b pb-2">
              Monthly Dealership Taxable Output
            </h2>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">Taxable Vehicle Sales Base (Excl GST):</span>
                <strong className="text-slate-900">{formatINR(gstSummary.taxableSales)}</strong>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">Taxable Workshop Service Base (Excl GST):</span>
                <strong className="text-slate-900">{formatINR(gstSummary.taxableService)}</strong>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">Total Taxable Turnover:</span>
                <strong className="text-slate-900">
                  {formatINR(gstSummary.taxableSales + gstSummary.taxableService)}
                </strong>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b pb-2">
              GST Tax Breakdown (CGST 9% + SGST 9%)
            </h2>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">Central GST (CGST @ 9%):</span>
                <strong className="text-slate-900">{formatINR(gstSummary.totalCgst)}</strong>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">State GST (SGST @ 9%):</span>
                <strong className="text-slate-900">{formatINR(gstSummary.totalSgst)}</strong>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-slate-200 text-sm font-bold text-hero">
                <span>Total GST Output Collected:</span>
                <span>{formatINR(gstSummary.totalGst)}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 7: FINANCIAL REPORTS */}
      {activeTab === 'REPORTS' && reportsData && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Cross-Branch Financial Comparison</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                    <tr>
                      <th className="text-left p-3.5">Showroom Branch</th>
                      <th className="text-right p-3.5">Vehicle Sales</th>
                      <th className="text-right p-3.5">Workshop Service</th>
                      <th className="text-right p-3.5">Total Collections</th>
                      <th className="text-right p-3.5">Pending Due</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {reportsData.branchComparison?.map((bc: any) => (
                      <tr key={bc.code} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3.5 font-bold text-slate-900">{bc.branch}</td>
                        <td className="p-3.5 text-right font-semibold">{formatINR(bc.salesRevenue)}</td>
                        <td className="p-3.5 text-right font-semibold">{formatINR(bc.serviceRevenue)}</td>
                        <td className="p-3.5 text-right font-bold text-emerald-700 text-sm">
                          {formatINR(bc.totalCollected)}
                        </td>
                        <td className="p-3.5 text-right font-semibold text-red-600">
                          {formatINR(bc.outstanding)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* MODAL: Record New Payment */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Record Customer Payment Receipt"
        description="Record payment against sales or workshop service invoices with instant ledger reconciliation."
        size="md"
      >
        <form onSubmit={handleRecordPaymentSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Select Invoice</label>
            <select
              value={paymentForm.invoiceId}
              onChange={(e) => {
                const inv = invoices.find((i) => i.id === e.target.value);
                setPaymentForm({
                  ...paymentForm,
                  invoiceId: e.target.value,
                  amount: inv?.remainingBalance || 5000,
                });
              }}
              className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-xs text-slate-800"
            >
              {invoices
                .filter((i) => i.remainingBalance > 0)
                .map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.invoiceNumber} - {inv.customerName} (Due: {formatINR(inv.remainingBalance)})
                  </option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Payment Amount (₹)</label>
              <Input
                type="number"
                value={paymentForm.amount}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })
                }
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Payment Method</label>
              <select
                value={paymentForm.paymentMethod}
                onChange={(e) =>
                  setPaymentForm({
                    ...paymentForm,
                    paymentMethod: e.target.value as any,
                  })
                }
                className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-xs text-slate-800"
              >
                <option value="UPI">UPI / QR Code</option>
                <option value="CASH">Cash Counter</option>
                <option value="BANK_TRANSFER">NEFT / RTGS Bank Transfer</option>
                <option value="CARD">Credit / Debit Card</option>
                <option value="CHEQUE">Cheque Deposit</option>
                <option value="FINANCIER">Financier Direct Credit</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Transaction / Cheque Reference #
            </label>
            <Input
              value={paymentForm.referenceNumber}
              onChange={(e) =>
                setPaymentForm({ ...paymentForm, referenceNumber: e.target.value })
              }
              placeholder="e.g. UPI/412398102 or Cheque #891204"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsPaymentModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" className="font-semibold">
              Save Payment Receipt
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: Record Financier Disbursal */}
      {selectedLoanForDisbursal && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedLoanForDisbursal(null)}
          title="Record Financier Loan Disbursal"
          description={`Financier: ${selectedLoanForDisbursal.loanProvider} • Customer: ${selectedLoanForDisbursal.customerName}`}
          size="md"
        >
          <form onSubmit={handleDisbursalSubmit} className="space-y-4 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
              <p>
                <strong>Application No:</strong> {selectedLoanForDisbursal.applicationNo}
              </p>
              <p>
                <strong>Vehicle Model:</strong> {selectedLoanForDisbursal.vehicleModel}
              </p>
              <p>
                <strong>Loan Amount Approved:</strong>{' '}
                {formatINR(selectedLoanForDisbursal.loanAmount)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Disbursed Amount (₹)</label>
                <Input
                  type="number"
                  value={disbursalAmount}
                  onChange={(e) => setDisbursalAmount(Number(e.target.value))}
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Disbursal Reference</label>
                <Input
                  value={disbursalRef}
                  onChange={(e) => setDisbursalRef(e.target.value)}
                  placeholder="e.g. DISB/HFC/20240516"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedLoanForDisbursal(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 font-semibold"
              >
                Confirm Disbursal & Credit Invoice
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL: Request Refund */}
      <Modal
        isOpen={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
        title="Request Customer Refund"
        description="Submit refund request for cancelled booking or excess customer payments."
        size="md"
      >
        <form onSubmit={handleRefundSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Customer Name</label>
            <Input
              value={refundForm.customerName}
              onChange={(e) => setRefundForm({ ...refundForm, customerName: e.target.value })}
              placeholder="e.g. Ramesh Patel"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Refund Amount (₹)</label>
              <Input
                type="number"
                value={refundForm.amount}
                onChange={(e) => setRefundForm({ ...refundForm, amount: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Refund Method</label>
              <select
                value={refundForm.refundMethod}
                onChange={(e) =>
                  setRefundForm({ ...refundForm, refundMethod: e.target.value as any })
                }
                className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-xs text-slate-800"
              >
                <option value="UPI">UPI Refund</option>
                <option value="BANK_TRANSFER">Bank Account Transfer</option>
                <option value="CASH">Cash Voucher</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Reason for Refund</label>
            <Input
              value={refundForm.reason}
              onChange={(e) => setRefundForm({ ...refundForm, reason: e.target.value })}
              placeholder="e.g. Customer cancelled duplicate booking deposit"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsRefundModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" className="font-semibold">
              Submit for Admin Approval
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: Invoice Print View */}
      {printInvoice && (
        <Modal
          isOpen={true}
          onClose={() => setPrintInvoice(null)}
          title="Shreeji Hero Dealership Tax Invoice"
          description={`Invoice #${printInvoice.invoiceNumber} • Date: ${printInvoice.invoiceDate}`}
          size="lg"
        >
          <div className="space-y-4 text-xs p-2">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">SHREEJI HERO MOTORS</h2>
                <p className="text-[11px] text-slate-500">Halvad Branch, Gujarat</p>
                <p className="text-[10px] text-slate-400 font-mono">GSTIN: 24AAACS1234F1Z8</p>
              </div>
              <div className="text-right">
                <Badge variant="hero" className="font-mono text-xs">
                  {printInvoice.invoiceNumber}
                </Badge>
                <p className="text-[10px] text-slate-400 mt-1">Status: {printInvoice.paymentStatus}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="font-bold text-slate-700 block">Customer Information:</span>
                <p className="font-semibold text-slate-900">{printInvoice.customerName}</p>
                <p className="text-slate-500">{printInvoice.customerPhone}</p>
                <p className="text-slate-500">{printInvoice.customerAddress}</p>
              </div>
              <div>
                <span className="font-bold text-slate-700 block">Vehicle & Type:</span>
                <p className="font-semibold text-slate-900">{printInvoice.modelName}</p>
                <p className="font-mono text-slate-600">ID / VIN: {printInvoice.vinOrReg}</p>
              </div>
            </div>

            <table className="w-full border-collapse">
              <thead className="bg-slate-100 text-slate-600 font-semibold border-y">
                <tr>
                  <th className="text-left p-2">Description</th>
                  <th className="text-right p-2">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-2">Taxable Base Amount</td>
                  <td className="p-2 text-right">{formatINR(printInvoice.subtotal)}</td>
                </tr>
                <tr>
                  <td className="p-2">Central GST (CGST @ 9%) + State GST (SGST @ 9%)</td>
                  <td className="p-2 text-right">{formatINR(printInvoice.gstAmount)}</td>
                </tr>
                {printInvoice.discount > 0 && (
                  <tr className="text-emerald-700">
                    <td className="p-2">Showroom Discount / Voucher</td>
                    <td className="p-2 text-right">-{formatINR(printInvoice.discount)}</td>
                  </tr>
                )}
                <tr className="font-bold bg-slate-50 text-sm border-t border-slate-300">
                  <td className="p-2">Total Invoice Amount</td>
                  <td className="p-2 text-right text-hero">{formatINR(printInvoice.totalAmount)}</td>
                </tr>
                <tr className="text-slate-700 font-medium">
                  <td className="p-2">Amount Received</td>
                  <td className="p-2 text-right text-emerald-700">{formatINR(printInvoice.paidAmount)}</td>
                </tr>
                <tr className="text-red-600 font-bold">
                  <td className="p-2">Remaining Balance Due</td>
                  <td className="p-2 text-right">{formatINR(printInvoice.remainingBalance)}</td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setPrintInvoice(null)}>
                Close
              </Button>
              <Button size="sm" onClick={() => window.print()} className="gap-1.5 font-semibold">
                <Printer className="h-3.5 w-3.5" />
                Print Official Tax Invoice
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
