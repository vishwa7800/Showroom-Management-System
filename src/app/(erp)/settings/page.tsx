'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/context';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import {
  Building2,
  Shield,
  Settings as SettingsIcon,
  Phone,
  Mail,
  MapPin,
  Clock,
  FileText,
  Save,
  CheckCircle2,
  AlertCircle,
  History,
  Sliders,
  Bell,
  Lock,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function SettingsPage() {
  const { user, can } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'dealership' | 'branches' | 'system' | 'audit'>('dealership');
  const [isSaving, setIsSaving] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  // Form states for Dealership Profile
  const [dealershipName, setDealershipName] = useState('Shreeji Hero MotoCorp');
  const [dealerCode, setDealerCode] = useState('HM-GUJ-7721');
  const [gstin, setGstin] = useState('24AAACS1234F1Z5');
  const [pan, setPan] = useState('AAACS1234F');
  const [contactEmail, setContactEmail] = useState('support@shreejihero.com');
  const [contactPhone, setContactPhone] = useState('+91 2758 223344');
  const [headOffice, setHeadOffice] = useState('National Highway 8A, Near Circuit House, Halvad - 363330, Gujarat');

  // System options
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);
  const [autoSmsReminders, setAutoSmsReminders] = useState(true);
  const [autoStockAlerts, setAutoStockAlerts] = useState(true);
  const [defaultGSTRate, setDefaultGSTRate] = useState('18%');

  const fetchAuditLogs = async () => {
    try {
      setIsLoadingLogs(true);
      const res = await fetch('/api/audit-logs');
      const data = await res.json();
      if (data.success) {
        setAuditLogs(data.logs || []);
      }
    } catch (e) {
      // Ignore
    } finally {
      setIsLoadingLogs(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'audit') {
      fetchAuditLogs();
    }
  }, [activeTab]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast('Settings Saved', 'Dealership configuration updated successfully across all branches.', 'success');
    }, 400);
  };

  const BRANCH_CARDS = [
    {
      id: 'br_halvad',
      name: 'Halvad Showroom (HQ & 3S Center)',
      address: 'National Highway 8A, Near Circuit House, Halvad - 363330',
      phone: '+91 2758 223344',
      manager: 'Vikram Singh',
      timing: '9:00 AM - 8:00 PM (All Days)',
      isHQ: true,
      serviceBays: 6,
    },
    {
      id: 'br_dhangadhra',
      name: 'Dhangadhra Branch & Workshop',
      address: 'Station Road, Opp. APMC Yard, Dhangadhra - 363310',
      phone: '+91 2754 221133',
      manager: 'Suresh Parmar',
      timing: '9:30 AM - 7:30 PM (Sun Closed)',
      isHQ: false,
      serviceBays: 4,
    },
    {
      id: 'br_jetpur',
      name: 'Jetpur Rural Sales & Service Point',
      address: 'Bhadar Road, Near Bus Stand, Jetpur - 360370',
      phone: '+91 2823 224455',
      manager: 'Mahesh Solanki',
      timing: '9:30 AM - 7:30 PM (Sun Closed)',
      isHQ: false,
      serviceBays: 2,
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-hero" />
            <span>Showroom & Branch Settings</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure dealership details, branch locations, tax settings, and audit logs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="hero" className="font-semibold text-xs py-1 px-2.5">
            {user?.role.replace(/_/g, ' ') || 'Admin'} Access
          </Badge>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('dealership')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'dealership'
              ? 'border-hero text-hero font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Dealership Profile</span>
        </button>
        <button
          onClick={() => setActiveTab('branches')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'branches'
              ? 'border-hero text-hero font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <MapPin className="h-4 w-4" />
          <span>Branch Locations (3)</span>
        </button>
        <button
          onClick={() => setActiveTab('system')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'system'
              ? 'border-hero text-hero font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Sliders className="h-4 w-4" />
          <span>System & Tax Settings</span>
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'audit'
              ? 'border-hero text-hero font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <History className="h-4 w-4" />
          <span>Security & Audit Logs</span>
        </button>
      </div>

      {/* TAB 1: DEALERSHIP PROFILE */}
      {activeTab === 'dealership' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <Card>
            <CardHeader className="border-b border-slate-100 pb-3">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="h-4 w-4 text-hero" />
                <span>Official Hero Dealership Credentials</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Dealership Legal Name</label>
                  <Input
                    type="text"
                    value={dealershipName}
                    onChange={(e) => setDealershipName(e.target.value)}
                    required
                    className="h-9 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Hero MotoCorp Dealer Code</label>
                  <Input
                    type="text"
                    value={dealerCode}
                    onChange={(e) => setDealerCode(e.target.value)}
                    required
                    className="h-9 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">GSTIN Number</label>
                  <Input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    required
                    className="h-9 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">PAN Number</label>
                  <Input
                    type="text"
                    value={pan}
                    onChange={(e) => setPan(e.target.value)}
                    required
                    className="h-9 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Contact Email</label>
                  <Input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    required
                    className="h-9 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Contact Helpline</label>
                  <Input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    required
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Head Office Registered Address</label>
                <Input
                  type="text"
                  value={headOffice}
                  onChange={(e) => setHeadOffice(e.target.value)}
                  required
                  className="h-9 text-xs"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-hero hover:bg-hero-700 text-white gap-2 text-xs font-bold h-9"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? 'Saving...' : 'Save Dealership Profile'}</span>
            </Button>
          </div>
        </form>
      )}

      {/* TAB 2: BRANCH LOCATIONS */}
      {activeTab === 'branches' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {BRANCH_CARDS.map((branch) => (
            <Card key={branch.id} className="relative overflow-hidden border-slate-200">
              {branch.isHQ && <div className="h-1 w-full bg-hero absolute top-0 left-0" />}
              <CardContent className="p-5 space-y-3.5 text-xs">
                <div className="flex items-start justify-between">
                  <div className="font-bold text-slate-900 text-sm">{branch.name}</div>
                  {branch.isHQ && (
                    <Badge variant="hero" className="text-[10px] uppercase font-bold py-0.5 px-2">
                      Headquarters
                    </Badge>
                  )}
                </div>

                <div className="space-y-2 text-slate-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span>{branch.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                    <span>{branch.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                    <span>{branch.timing}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                    <span>Manager: <strong>{branch.manager}</strong></span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>Capacity: {branch.serviceBays} Workshop Bays</span>
                  <Badge variant="success" withDot className="text-[10px]">
                    Online
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 3: SYSTEM & TAX SETTINGS */}
      {activeTab === 'system' && (
        <Card>
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="text-sm font-bold text-slate-900">
              Tax, Reminders & Communication Gateways
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Standard Vehicle GST Rate</label>
                <select
                  value={defaultGSTRate}
                  onChange={(e) => setDefaultGSTRate(e.target.value)}
                  className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-xs text-slate-800"
                >
                  <option value="28%">28% (ICE Two-Wheelers: 14% CGST + 14% SGST)</option>
                  <option value="5%">5% (EV Two-Wheelers: 2.5% CGST + 2.5% SGST)</option>
                  <option value="18%">18% (Spare Parts & Labour Service)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Invoice Currency & Format</label>
                <Input type="text" value="INR (₹) - Indian Rupee with HSN/SAC Codes" disabled className="h-9 text-xs bg-slate-50" />
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block">WhatsApp Cloud API Gateway</span>
                  <span className="text-[11px] text-slate-400">Send service booking confirmations, job card updates, and digital invoices.</span>
                </div>
                <input
                  type="checkbox"
                  checked={whatsappNotifications}
                  onChange={(e) => setWhatsappNotifications(e.target.checked)}
                  className="h-4 w-4 rounded text-hero focus:ring-hero cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block">Automated SMS Reminders</span>
                  <span className="text-[11px] text-slate-400">Dispatch free service reminders, insurance renewal notices, and payment receipts.</span>
                </div>
                <input
                  type="checkbox"
                  checked={autoSmsReminders}
                  onChange={(e) => setAutoSmsReminders(e.target.checked)}
                  className="h-4 w-4 rounded text-hero focus:ring-hero cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block">Automated Low Stock Trigger</span>
                  <span className="text-[11px] text-slate-400">Notify Inventory Manager when physical vehicle units or fast-moving spares fall below threshold.</span>
                </div>
                <input
                  type="checkbox"
                  checked={autoStockAlerts}
                  onChange={(e) => setAutoStockAlerts(e.target.checked)}
                  className="h-4 w-4 rounded text-hero focus:ring-hero cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                onClick={() => toast('System Options Updated', 'Gateway & tax configurations saved.', 'success')}
                className="bg-hero hover:bg-hero-700 text-white text-xs font-bold h-8"
              >
                Save System Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <Card>
          <CardHeader className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Shield className="h-4 w-4 text-hero" />
              <span>Immutable System Audit Trail</span>
            </CardTitle>
            <Badge variant="outline" className="text-[11px]">
              {auditLogs.length} Events Logged
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            {isLoadingLogs ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading audit history...</div>
            ) : auditLogs.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No audit events recorded yet.</div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                {auditLogs.map((log: any) => (
                  <div key={log.id} className="p-4 flex items-start justify-between text-xs hover:bg-slate-50">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Badge variant="hero" className="text-[9px] uppercase font-bold px-1.5 py-0">
                          {log.action}
                        </Badge>
                        <span className="font-bold text-slate-800">{log.actorName || 'System'}</span>
                        <span className="text-slate-400">({log.actorRole || 'SYSTEM'})</span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-1">
                        {typeof log.changeDetails === 'string'
                          ? log.changeDetails
                          : JSON.stringify(log.changeDetails || '')}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                      {log.createdAt ? formatDate(log.createdAt) : 'Recent'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
