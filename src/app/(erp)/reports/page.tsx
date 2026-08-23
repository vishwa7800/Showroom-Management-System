'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/context';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Users,
  Wrench,
  Boxes,
  Target,
  Download,
  Calendar,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Award,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
  Layers,
} from 'lucide-react';
import { formatINR, formatDate } from '@/lib/utils';

export default function ReportsPage() {
  const { user, activeBranchId, can } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<
    'OVERVIEW' | 'SALES' | 'SERVICE' | 'CUSTOMERS' | 'TARGETS' | 'BRANCHES' | 'EXPORTS'
  >('OVERVIEW');
  const [dateRange, setDateRange] = useState<'TODAY' | 'WEEK' | 'MONTH' | 'YEAR'>('MONTH');
  const [isLoading, setIsLoading] = useState(true);

  // Datasets
  const [overview, setOverview] = useState<any>(null);
  const [salesAnalytics, setSalesAnalytics] = useState<any>(null);
  const [serviceAnalytics, setServiceAnalytics] = useState<any>(null);
  const [customerAnalytics, setCustomerAnalytics] = useState<any>(null);
  const [targets, setTargets] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);

  // Target Edit Modal
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [targetForm, setTargetForm] = useState({
    month: '2024-05',
    employeeName: 'Amit Varma',
    employeeId: 'usr_sales_amit',
    targetType: 'VEHICLE_SALES_COUNT' as any,
    targetValue: 25,
  });

  const fetchReportsData = async () => {
    try {
      setIsLoading(true);
      const [ovRes, slRes, svRes, csRes, tgRes, brRes] = await Promise.all([
        fetch('/api/reports/overview'),
        fetch('/api/reports/sales'),
        fetch('/api/reports/service'),
        fetch('/api/reports/customers'),
        fetch('/api/reports/targets'),
        fetch('/api/reports/branches'),
      ]);

      const [ovData, slData, svData, csData, tgData, brData] = await Promise.all([
        ovRes.json(),
        slRes.json(),
        svRes.json(),
        csRes.json(),
        tgRes.json(),
        brRes.json(),
      ]);

      if (ovData.success) setOverview(ovData.overview);
      if (slData.success) setSalesAnalytics(slData.analytics);
      if (svData.success) setServiceAnalytics(svData.analytics);
      if (csData.success) setCustomerAnalytics(csData.analytics);
      if (tgData.success) setTargets(tgData.targets);
      if (brData.success) setBranches(brData.branches);
    } catch (e) {
      toast('Error', 'Failed to load intelligence reports data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, [activeBranchId, dateRange]);

  const handleExportDownload = async (reportType: 'SALES' | 'SPARES' | 'GENERAL') => {
    try {
      const res = await fetch('/api/reports/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportType }),
      });

      if (!res.ok) {
        toast('Export Failed', 'Unable to generate CSV export', 'error');
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `shreeji_hero_${reportType.toLowerCase()}_report.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      toast('Export Successful', `${reportType} CSV report downloaded.`, 'success');
    } catch (e) {
      toast('Error', 'Failed to download export file', 'error');
    }
  };

  const handleSaveTarget = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/reports/targets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          month: targetForm.month,
          branchId: activeBranchId || 'br_halvad',
          branchName: 'Halvad Branch',
          employeeId: targetForm.employeeId,
          employeeName: targetForm.employeeName,
          targetType: targetForm.targetType,
          targetValue: Number(targetForm.targetValue),
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast('Target Updated', `Sales target updated for ${targetForm.employeeName}.`, 'success');
        setIsTargetModalOpen(false);
        fetchReportsData();
      }
    } catch (e) {
      toast('Error', 'Failed to save sales target', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Reports, Analytics & Business Intelligence
            </h1>
            <Badge variant="hero" className="font-bold text-[10px] uppercase">
              Executive BI
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Dealership Performance, Sales Funnel, Workshop Load, Stock Turnover, and Cross-Branch Insights.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-md text-xs font-semibold text-slate-600">
            {(['TODAY', 'WEEK', 'MONTH', 'YEAR'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  dateRange === r ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'
                }`}
              >
                {r === 'TODAY' ? 'Today' : r === 'WEEK' ? 'This Week' : r === 'MONTH' ? 'This Month' : 'This Year'}
              </button>
            ))}
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => handleExportDownload('SALES')}
            className="text-xs h-9 gap-1.5 text-slate-700"
          >
            <Download className="h-3.5 w-3.5 text-hero" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold select-none bg-white px-4 pt-3 rounded-t-lg border-t border-x overflow-x-auto">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px whitespace-nowrap ${
            activeTab === 'OVERVIEW'
              ? 'border-hero text-hero'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          <span>Executive Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('SALES')}
          className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px whitespace-nowrap ${
            activeTab === 'SALES'
              ? 'border-hero text-hero'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          <span>Sales & Funnel Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('SERVICE')}
          className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px whitespace-nowrap ${
            activeTab === 'SERVICE'
              ? 'border-hero text-hero'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Wrench className="h-4 w-4" />
          <span>Workshop Intelligence</span>
        </button>

        <button
          onClick={() => setActiveTab('CUSTOMERS')}
          className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px whitespace-nowrap ${
            activeTab === 'CUSTOMERS'
              ? 'border-hero text-hero'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>CRM & Conversion</span>
        </button>

        <button
          onClick={() => setActiveTab('TARGETS')}
          className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px whitespace-nowrap ${
            activeTab === 'TARGETS'
              ? 'border-hero text-hero'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Target className="h-4 w-4" />
          <span>Staff Targets & KPIs ({targets.length})</span>
        </button>

        {can('dashboard.view_all') && (
          <button
            onClick={() => setActiveTab('BRANCHES')}
            className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px whitespace-nowrap ${
              activeTab === 'BRANCHES'
                ? 'border-hero text-hero'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>Branch Comparisons</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('EXPORTS')}
          className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px whitespace-nowrap ${
            activeTab === 'EXPORTS'
              ? 'border-hero text-hero'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>Data Extraction & CSV</span>
        </button>
      </div>

      {/* TAB 1: EXECUTIVE OVERVIEW */}
      {activeTab === 'OVERVIEW' && overview && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 border-l-4 border-l-hero">
              <span className="text-xs font-semibold text-slate-500 uppercase">Total Revenue</span>
              <p className="text-xl font-bold text-slate-900 mt-2">{formatINR(overview.totalRevenue)}</p>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
                Sales: {formatINR(overview.salesRevenue)} • Service: {formatINR(overview.serviceRevenue)}
              </span>
            </Card>

            <Card className="p-4 border-l-4 border-l-emerald-500">
              <span className="text-xs font-semibold text-slate-500 uppercase">Gross Profit (12.4%)</span>
              <p className="text-xl font-bold text-emerald-700 mt-2">{formatINR(overview.grossProfit)}</p>
              <span className="text-[10px] text-slate-500 font-medium block mt-1">
                Collections: {formatINR(overview.totalCollections)}
              </span>
            </Card>

            <Card className="p-4 border-l-4 border-l-indigo-500">
              <span className="text-xs font-semibold text-slate-500 uppercase">Lead Conversion Rate</span>
              <p className="text-xl font-bold text-indigo-700 mt-2">{overview.leadConversionRate}%</p>
              <span className="text-[10px] text-slate-500 font-medium block mt-1">
                Total Customer Base: {overview.customerCount}
              </span>
            </Card>

            <Card className="p-4 border-l-4 border-l-amber-500">
              <span className="text-xs font-semibold text-slate-500 uppercase">Service Completion SLA</span>
              <p className="text-xl font-bold text-slate-900 mt-2">{overview.serviceCompletionRate}%</p>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
                Customer CSAT: {overview.customerSatisfaction}%
              </span>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: SALES & CONVERSION FUNNEL */}
      {activeTab === 'SALES' && salesAnalytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Model-Wise Breakdown */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Hero Model-Wise Sales Distribution</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <tr>
                      <th className="text-left p-3">Hero Model</th>
                      <th className="text-center p-3">Units Sold</th>
                      <th className="text-right p-3">Revenue (₹)</th>
                      <th className="text-right p-3">Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {salesAnalytics.modelBreakdown.map((m: any) => (
                      <tr key={m.model}>
                        <td className="p-3 font-semibold text-slate-900">{m.model}</td>
                        <td className="p-3 text-center font-bold text-hero">{m.units}</td>
                        <td className="p-3 text-right font-semibold">{formatINR(m.revenue)}</td>
                        <td className="p-3 text-right text-slate-500 font-bold">{m.share}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* Visual Sales Funnel */}
            <Card className="p-5 flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 border-b pb-2">
                  Showroom Sales Conversion Funnel
                </h2>
                <div className="space-y-3 mt-4 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded flex justify-between items-center border">
                    <span className="font-semibold text-slate-700">1. Total Inquiries & Leads</span>
                    <strong className="text-slate-900 text-sm">{salesAnalytics.funnel.leads} Leads</strong>
                  </div>
                  <div className="bg-indigo-50 p-2.5 rounded flex justify-between items-center border border-indigo-100">
                    <span className="font-semibold text-indigo-800">2. Test Rides Conducted</span>
                    <strong className="text-indigo-900 text-sm">{salesAnalytics.funnel.testRides} (59.1%)</strong>
                  </div>
                  <div className="bg-amber-50 p-2.5 rounded flex justify-between items-center border border-amber-100">
                    <span className="font-semibold text-amber-800">3. Price Quotations Sent</span>
                    <strong className="text-amber-900 text-sm">{salesAnalytics.funnel.quotations}</strong>
                  </div>
                  <div className="bg-emerald-50 p-2.5 rounded flex justify-between items-center border border-emerald-100">
                    <span className="font-semibold text-emerald-800">4. Confirmed Bookings</span>
                    <strong className="text-emerald-900 text-sm">{salesAnalytics.funnel.bookings} Bookings</strong>
                  </div>
                  <div className="bg-red-50 p-2.5 rounded flex justify-between items-center border border-red-100">
                    <span className="font-semibold text-red-800">5. Vehicle Deliveries Completed</span>
                    <strong className="text-red-900 text-sm">{salesAnalytics.funnel.deliveries} Units Sold</strong>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 3: WORKSHOP OPERATIONS INTELLIGENCE */}
      {activeTab === 'SERVICE' && serviceAnalytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 border-l-4 border-l-hero">
              <span className="text-xs font-semibold text-slate-500 uppercase">Total Job Cards</span>
              <p className="text-xl font-bold text-slate-900 mt-2">{serviceAnalytics.totalJobs}</p>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
                Completed: {serviceAnalytics.completedJobs}
              </span>
            </Card>

            <Card className="p-4 border-l-4 border-l-emerald-500">
              <span className="text-xs font-semibold text-slate-500 uppercase">6-Bay Utilization</span>
              <p className="text-xl font-bold text-emerald-700 mt-2">{serviceAnalytics.bayUtilizationRate}%</p>
              <span className="text-[10px] text-slate-500 font-medium block mt-1">
                Active Bays Running
              </span>
            </Card>

            <Card className="p-4 border-l-4 border-l-indigo-500">
              <span className="text-xs font-semibold text-slate-500 uppercase">Avg Turnaround Time</span>
              <p className="text-xl font-bold text-indigo-700 mt-2">{serviceAnalytics.averageTurnaroundHours} Hours</p>
              <span className="text-[10px] text-slate-500 font-medium block mt-1">
                Within 4-Hour SLA Target
              </span>
            </Card>

            <Card className="p-4 border-l-4 border-l-amber-500">
              <span className="text-xs font-semibold text-slate-500 uppercase">Quality Check (QC) Pass</span>
              <p className="text-xl font-bold text-slate-900 mt-2">{serviceAnalytics.qcPassRate}%</p>
              <span className="text-[10px] text-red-600 font-semibold block mt-1">
                Delayed Jobs: {serviceAnalytics.delayedJobs}
              </span>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Technician Daily Throughput & Efficiency</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <tr>
                    <th className="text-left p-3">Technician Name</th>
                    <th className="text-center p-3">Active Bay Jobs</th>
                    <th className="text-center p-3">Jobs Completed Today</th>
                    <th className="text-right p-3">First-Time-Right Efficiency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {serviceAnalytics.technicianWorkload.map((t: any) => (
                    <tr key={t.name}>
                      <td className="p-3 font-semibold text-slate-900">{t.name}</td>
                      <td className="p-3 text-center font-bold text-hero">{t.activeJobs}</td>
                      <td className="p-3 text-center font-bold text-emerald-700">{t.completedToday}</td>
                      <td className="p-3 text-right font-bold text-slate-900">{t.efficiency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 4: CRM & CUSTOMERS */}
      {activeTab === 'CUSTOMERS' && customerAnalytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-5 space-y-3">
            <h2 className="text-sm font-bold text-slate-900 border-b pb-2">
              Lead Priority & Pipeline Distribution
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 rounded bg-red-50 text-red-800 border border-red-100">
                <span className="font-semibold">🔥 Hot Leads (Buy in 7 Days):</span>
                <strong className="text-sm">{customerAnalytics.hotLeads} Leads</strong>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-amber-50 text-amber-800 border border-amber-100">
                <span className="font-semibold">⚡ Warm Leads (Buy in 30 Days):</span>
                <strong className="text-sm">{customerAnalytics.warmLeads} Leads</strong>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-50 text-slate-700 border">
                <span className="font-semibold">❄️ Cold Inquiries:</span>
                <strong className="text-sm">{customerAnalytics.coldLeads} Leads</strong>
              </div>
            </div>
          </Card>

          <Card className="p-5 space-y-3">
            <h2 className="text-sm font-bold text-slate-900 border-b pb-2">
              Follow-Up & Test Ride Conversion Performance
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 rounded bg-emerald-50 text-emerald-800 border border-emerald-100">
                <span className="font-semibold">✓ Completed Follow-Up Calls:</span>
                <strong className="text-sm">{customerAnalytics.completedFollowUps}</strong>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-indigo-50 text-indigo-800 border border-indigo-100">
                <span className="font-semibold">🏍️ Test Ride to Booking Conversion:</span>
                <strong className="text-sm">{customerAnalytics.testRideConversionRate}%</strong>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-50 text-slate-700 border">
                <span className="font-semibold">⏳ Overdue Follow-Ups:</span>
                <strong className="text-sm text-red-600">{customerAnalytics.overdueFollowUps}</strong>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 5: STAFF TARGETS & KPIS */}
      {activeTab === 'TARGETS' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm">Monthly Showroom Targets & KPI Progress</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">
                Target vs Achieved tracking for Sales Executives and Dealership Revenue.
              </p>
            </div>
            {can('dashboard.view_all') && (
              <Button
                size="sm"
                onClick={() => setIsTargetModalOpen(true)}
                className="text-xs h-8 gap-1.5 font-semibold"
              >
                <Target className="h-3.5 w-3.5" />
                Set New Target
              </Button>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 text-xs">
              {targets.map((tgt) => (
                <div key={tgt.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">
                        {tgt.employeeName || tgt.branchName}
                      </span>
                      <span className="text-[11px] text-slate-500 ml-2">
                        ({tgt.targetType.replace(/_/g, ' ')}) • Month: {tgt.month}
                      </span>
                    </div>
                    <Badge
                      variant={tgt.percentage >= 80 ? 'success' : 'warning'}
                      className="text-[10px] font-bold"
                    >
                      {tgt.percentage}% Achieved
                    </Badge>
                  </div>

                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-hero h-full transition-all rounded-full"
                      style={{ width: `${Math.min(100, tgt.percentage)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>
                      Achieved:{' '}
                      <strong className="text-slate-800">
                        {tgt.targetType === 'VEHICLE_SALES_COUNT'
                          ? `${tgt.achievedValue} Bikes`
                          : formatINR(tgt.achievedValue)}
                      </strong>
                    </span>
                    <span>
                      Target Goal:{' '}
                      <strong className="text-slate-800">
                        {tgt.targetType === 'VEHICLE_SALES_COUNT'
                          ? `${tgt.targetValue} Bikes`
                          : formatINR(tgt.targetValue)}
                      </strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 6: CROSS-BRANCH COMPARISONS */}
      {activeTab === 'BRANCHES' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Cross-Branch Comparative Performance (Admin View)</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <tr>
                    <th className="text-left p-3.5">Showroom Branch</th>
                    <th className="text-right p-3.5">Units Sold</th>
                    <th className="text-right p-3.5">Vehicle Sales (₹)</th>
                    <th className="text-right p-3.5">Service Turnover (₹)</th>
                    <th className="text-center p-3.5">Lead Conversion</th>
                    <th className="text-right p-3.5">Inventory Valuation</th>
                    <th className="text-right p-3.5">CSAT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {branches.map((b) => (
                    <tr key={b.code} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900">{b.branch}</td>
                      <td className="p-3.5 text-right font-bold text-hero">{b.unitsSold}</td>
                      <td className="p-3.5 text-right font-semibold">{formatINR(b.salesRevenue)}</td>
                      <td className="p-3.5 text-right font-semibold">{formatINR(b.serviceRevenue)}</td>
                      <td className="p-3.5 text-center font-bold text-indigo-700">{b.leadConversion}</td>
                      <td className="p-3.5 text-right font-bold">{formatINR(b.inventoryValuation)}</td>
                      <td className="p-3.5 text-right font-bold text-emerald-700">{b.satisfaction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 7: DATA EXTRACTION & EXPORTS */}
      {activeTab === 'EXPORTS' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-hero" />
                <h3 className="font-bold text-sm text-slate-900">Vehicle Sales Register</h3>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Complete sales invoice ledger with customer names, VINs, tax breakups, and payment statuses.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => handleExportDownload('SALES')}
              className="w-full gap-1.5 text-xs font-semibold"
            >
              <Download className="h-3.5 w-3.5" />
              Download Sales CSV
            </Button>
          </Card>

          <Card className="p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <Boxes className="h-5 w-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">Spare Parts Stock Matrix</h3>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Spare parts SKU list, current quantities, minimum stock levels, MRPs, and vendor information.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleExportDownload('SPARES')}
              className="w-full gap-1.5 text-xs font-semibold text-slate-700"
            >
              <Download className="h-3.5 w-3.5" />
              Download Spares CSV
            </Button>
          </Card>

          <Card className="p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900">Dealership General Summary</h3>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Unified summary of sales, service, cash flows, and outstanding receivables.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleExportDownload('GENERAL')}
              className="w-full gap-1.5 text-xs font-semibold text-slate-700"
            >
              <Download className="h-3.5 w-3.5" />
              Download General CSV
            </Button>
          </Card>
        </div>
      )}

      {/* MODAL: Set Target */}
      <Modal
        isOpen={isTargetModalOpen}
        onClose={() => setIsTargetModalOpen(false)}
        title="Set Sales Executive Target"
        description="Allocate monthly performance goals for showroom staff."
        size="md"
      >
        <form onSubmit={handleSaveTarget} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Target Month</label>
            <Input
              value={targetForm.month}
              onChange={(e) => setTargetForm({ ...targetForm, month: e.target.value })}
              placeholder="e.g. 2024-05"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Sales Executive</label>
            <select
              value={targetForm.employeeName}
              onChange={(e) => {
                const id =
                  e.target.value === 'Amit Varma'
                    ? 'usr_sales_amit'
                    : e.target.value === 'Pooja Shah'
                    ? 'usr_sales_pooja'
                    : 'usr_sales_vikram';
                setTargetForm({
                  ...targetForm,
                  employeeName: e.target.value,
                  employeeId: id,
                });
              }}
              className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-xs text-slate-800"
            >
              <option value="Amit Varma">Amit Varma (Sales Executive)</option>
              <option value="Pooja Shah">Pooja Shah (Sales Executive)</option>
              <option value="Vikram Desai">Vikram Desai (Showroom Manager)</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Target Goal (Bike Units)</label>
            <Input
              type="number"
              value={targetForm.targetValue}
              onChange={(e) => setTargetForm({ ...targetForm, targetValue: Number(e.target.value) })}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsTargetModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" className="font-semibold">
              Save Target
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
