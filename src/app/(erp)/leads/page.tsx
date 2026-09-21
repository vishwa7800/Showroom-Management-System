'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { LeadRecord, FollowUpRecord } from '@/lib/db/crm-store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import {
  Flame,
  Plus,
  PhoneCall,
  Search,
  Filter,
  Kanban,
  Table as TableIcon,
  UserCheck,
  Compass,
  Bike,
  Clock,
  ArrowRight,
  CheckCircle2,
  Calendar,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';
import { formatINR, formatDate } from '@/lib/utils';

const PIPELINE_STAGES: { key: LeadRecord['status']; label: string; color: string }[] = [
  { key: 'NEW', label: 'New Inward', color: 'bg-slate-100 text-slate-700' },
  { key: 'CONTACTED', label: 'Contacted', color: 'bg-blue-50 text-blue-700' },
  { key: 'INTERESTED', label: 'Interested', color: 'bg-amber-50 text-amber-700' },
  { key: 'TEST_RIDE', label: 'Test Ride', color: 'bg-purple-50 text-purple-700' },
  { key: 'QUOTATION', label: 'Quotation', color: 'bg-indigo-50 text-indigo-700' },
  { key: 'NEGOTIATION', label: 'Negotiation', color: 'bg-orange-50 text-orange-700' },
  { key: 'BOOKED', label: 'Booked Token', color: 'bg-emerald-50 text-emerald-700' },
];

export default function LeadsPage() {
  const { user, activeBranchId, can } = useAuth();
  const { toast } = useToast();

  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [followUps, setFollowUps] = useState<FollowUpRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'PIPELINE' | 'TABLE' | 'FOLLOW_UPS'>('PIPELINE');
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | 'HOT' | 'WARM' | 'COLD'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // New Lead Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    phone: '',
    modelName: 'Hero Splendor Plus XTEC',
    priority: 'HOT' as 'HOT' | 'WARM' | 'COLD',
    estimatedValue: 79500,
    expectedPurchaseDate: '',
    notes: '',
  });

  // Assign Lead Modal
  const [selectedLeadForAssign, setSelectedLeadForAssign] = useState<LeadRecord | null>(null);
  const [targetExecId, setTargetExecId] = useState('usr_sales_amit');

  // Follow-Up Response Modal
  const [selectedFollowUp, setSelectedFollowUp] = useState<FollowUpRecord | null>(null);
  const [followUpResponse, setFollowUpResponse] = useState('');
  const [nextDate, setNextDate] = useState('');

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/leads');
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads);
      }
    } catch (e) {
      toast('Error', 'Failed to fetch leads', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFollowUps = async () => {
    try {
      const res = await fetch('/api/follow-ups');
      const data = await res.json();
      if (data.success) {
        setFollowUps(data.followUps);
      }
    } catch (e) {
      // Ignore
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchFollowUps();
  }, [activeBranchId]);

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1. Create or retrieve customer
      const custRes = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newLeadForm.name,
          phone: newLeadForm.phone,
          address: 'Lead Capture',
          city: 'Halvad',
          pincode: '363330',
          branchId: activeBranchId || 'br_halvad',
          source: 'WALK_IN',
        }),
      });

      let customerId: string;
      if (custRes.ok) {
        const custData = await custRes.json();
        customerId = custData.customer.id;
      } else {
        // Find existing
        const searchRes = await fetch(`/api/customers?search=${newLeadForm.phone}`);
        const searchData = await searchRes.json();
        if (searchData.customers?.[0]) {
          customerId = searchData.customers[0].id;
        } else {
          toast('Error', 'Could not link customer', 'error');
          return;
        }
      }

      // 2. Create Lead
      const leadRes = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          modelName: newLeadForm.modelName,
          priority: newLeadForm.priority,
          estimatedValue: Number(newLeadForm.estimatedValue),
          expectedPurchaseDate: newLeadForm.expectedPurchaseDate,
          notes: newLeadForm.notes,
        }),
      });

      const leadData = await leadRes.json();

      if (!leadRes.ok) {
        toast('Failed to create lead', leadData.error, 'error');
        return;
      }

      toast('Lead Created', `Lead #${leadData.lead.leadCode} added to CRM pipeline.`, 'success');
      setIsAddModalOpen(false);
      setNewLeadForm({
        name: '',
        phone: '',
        modelName: 'Hero Splendor Plus XTEC',
        priority: 'HOT',
        estimatedValue: 79500,
        expectedPurchaseDate: '',
        notes: '',
      });
      fetchLeads();
      fetchFollowUps();
    } catch (e) {
      toast('Error', 'Network error creating lead', 'error');
    }
  };

  const handleAdvanceStage = async (leadId: string, nextStatus: LeadRecord['status']) => {
    try {
      const res = await fetch(`/api/leads/${leadId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast('Stage Updated', `Lead moved to ${nextStatus.replace(/_/g, ' ')}.`, 'success');
        fetchLeads();
      }
    } catch (e) {
      toast('Error', 'Failed to update lead status', 'error');
    }
  };

  const handleAssignLead = async () => {
    if (!selectedLeadForAssign) return;

    try {
      const res = await fetch(`/api/leads/${selectedLeadForAssign.id}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedToId: targetExecId }),
      });
      const data = await res.json();
      if (data.success) {
        toast('Lead Assigned', `Lead reassigned to Sales Consultant.`, 'success');
        setSelectedLeadForAssign(null);
        fetchLeads();
      }
    } catch (e) {
      toast('Error', 'Failed to assign lead', 'error');
    }
  };

  const handleCompleteFollowUp = async () => {
    if (!selectedFollowUp) return;

    try {
      const res = await fetch(`/api/follow-ups/${selectedFollowUp.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerResponse: followUpResponse,
          nextFollowUpDate: nextDate || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast('Follow-Up Saved', 'Customer response logged & next callback scheduled.', 'success');
        setSelectedFollowUp(null);
        setFollowUpResponse('');
        setNextDate('');
        fetchFollowUps();
      }
    } catch (e) {
      toast('Error', 'Failed to save follow-up response', 'error');
    }
  };

  const filteredLeads = leads.filter((l) => {
    const matchesPriority = priorityFilter === 'ALL' || l.priority === priorityFilter;
    const matchesSearch =
      l.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.customerPhone.includes(searchQuery) ||
      l.modelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.leadCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Sales Leads & CRM Pipeline
            </h1>
            <Badge variant="hero" className="font-bold text-[10px] uppercase">
              Pipeline Management
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Visual sales stages, prospect qualification, executive assignment, and scheduled callbacks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {can('leads.create') && (
            <Button
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              className="gap-1.5 text-xs font-semibold h-9 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Lead</span>
            </Button>
          )}
        </div>
      </div>

      {/* Controls & Tab View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-3 rounded-lg border border-slate-200">
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-md text-xs font-semibold">
            <button
              onClick={() => setActiveTab('PIPELINE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
                activeTab === 'PIPELINE' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Kanban className="h-3.5 w-3.5" />
              Visual Pipeline
            </button>
            <button
              onClick={() => setActiveTab('TABLE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
                activeTab === 'TABLE' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <TableIcon className="h-3.5 w-3.5" />
              Table View ({leads.length})
            </button>
            <button
              onClick={() => setActiveTab('FOLLOW_UPS')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
                activeTab === 'FOLLOW_UPS' ? 'bg-white shadow-xs text-hero font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              Follow-Up Hub ({followUps.filter((f) => f.status === 'PENDING').length})
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter leads..."
              className="h-8 pl-8 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-hero w-44"
            />
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 text-[11px] font-semibold uppercase">Priority:</span>
            {(['ALL', 'HOT', 'WARM', 'COLD'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`text-[11px] px-2 py-1 rounded font-medium transition-colors ${
                  priorityFilter === p
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* VIEW 1: Visual Kanban CRM Pipeline */}
      {activeTab === 'PIPELINE' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3 overflow-x-auto pb-4 items-start">
          {PIPELINE_STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.status === stage.key);
            return (
              <div
                key={stage.key}
                className="bg-slate-100/70 border border-slate-200 rounded-lg p-3 flex flex-col min-w-[220px]"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2.5">
                  <span className="font-bold text-xs text-slate-800 uppercase tracking-tight">
                    {stage.label}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                    {stageLeads.length}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1 min-h-[140px]">
                  {stageLeads.length === 0 ? (
                    <div className="h-24 border border-dashed border-slate-300 rounded flex items-center justify-center text-[11px] text-slate-400">
                      No leads
                    </div>
                  ) : (
                    stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs hover:shadow-card transition-all space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <Badge
                            variant={lead.priority === 'HOT' ? 'danger' : 'warning'}
                            className="text-[9px] font-bold"
                          >
                            {lead.priority}
                          </Badge>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {lead.leadCode}
                          </span>
                        </div>

                        <div>
                          <Link
                            href={`/customers/${lead.customerId}`}
                            className="font-bold text-slate-900 hover:text-hero block"
                          >
                            {lead.customerName}
                          </Link>
                          <span className="text-[11px] text-slate-500 font-medium block">
                            {lead.modelName}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                          <span>{lead.assignedToName || 'Unassigned'}</span>
                          <span className="font-bold text-slate-800">
                            {formatINR(lead.estimatedValue || 75000)}
                          </span>
                        </div>

                        {/* Quick Advance Button */}
                        <div className="flex items-center justify-between gap-1 pt-1">
                          {can('leads.assign') && (
                            <button
                              type="button"
                              onClick={() => setSelectedLeadForAssign(lead)}
                              className="text-[10px] text-slate-500 hover:text-slate-900 font-medium"
                            >
                              Assign
                            </button>
                          )}

                          {stage.key !== 'BOOKED' && (
                            <button
                              type="button"
                              onClick={() => {
                                const nextIndex =
                                  PIPELINE_STAGES.findIndex((s) => s.key === stage.key) + 1;
                                if (nextIndex < PIPELINE_STAGES.length) {
                                  handleAdvanceStage(lead.id, PIPELINE_STAGES[nextIndex].key);
                                }
                              }}
                              className="text-[10px] text-hero font-bold flex items-center gap-0.5 hover:underline ml-auto"
                            >
                              <span>Next Stage</span>
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: Table View */}
      {activeTab === 'TABLE' && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="text-left p-3.5">Lead Code</th>
                    <th className="text-left p-3.5">Customer & Phone</th>
                    <th className="text-left p-3.5">Target Model</th>
                    <th className="text-center p-3.5">Priority</th>
                    <th className="text-left p-3.5">Assigned Consultant</th>
                    <th className="text-center p-3.5">Pipeline Stage</th>
                    <th className="text-right p-3.5">Estimated Value</th>
                    <th className="text-right p-3.5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredLeads.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 font-bold font-mono text-hero">{l.leadCode}</td>
                      <td className="p-3.5">
                        <Link
                          href={`/customers/${l.customerId}`}
                          className="font-bold text-slate-900 hover:text-hero block"
                        >
                          {l.customerName}
                        </Link>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {l.customerPhone}
                        </span>
                      </td>
                      <td className="p-3.5 font-medium text-slate-800">{l.modelName}</td>
                      <td className="p-3.5 text-center">
                        <Badge
                          variant={l.priority === 'HOT' ? 'danger' : 'warning'}
                          className="text-[10px] font-bold"
                        >
                          {l.priority}
                        </Badge>
                      </td>
                      <td className="p-3.5 font-medium">
                        {l.assignedToName ? (
                          <span className="flex items-center gap-1">
                            <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                            {l.assignedToName}
                          </span>
                        ) : (
                          <Badge variant="danger" className="text-[9px]">
                            UNASSIGNED
                          </Badge>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        <Badge variant="hero" className="text-[10px] font-bold">
                          {l.status.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="p-3.5 text-right font-bold text-slate-900">
                        {formatINR(l.estimatedValue || 75000)}
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {can('leads.assign') && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedLeadForAssign(l)}
                              className="text-[10px] h-7 px-2"
                            >
                              Assign
                            </Button>
                          )}
                          <Link href={`/customers/${l.customerId}`}>
                            <Button size="sm" variant="ghost" className="text-[10px] h-7 px-2 text-hero">
                              360 View
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* VIEW 3: Follow-Up Hub */}
      {activeTab === 'FOLLOW_UPS' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm">Actionable Follow-Up Callbacks</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">
                Log conversation outcomes, handle customer questions, and schedule next milestones.
              </p>
            </div>
            <Badge variant="hero" className="text-[10px]">
              {followUps.filter((f) => f.status === 'PENDING').length} Pending Calls
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 text-xs">
              {followUps.map((fu) => (
                <div
                  key={fu.id}
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{fu.customerName}</span>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {fu.customerPhone}
                      </Badge>
                      <Badge
                        variant={fu.status === 'COMPLETED' ? 'success' : 'warning'}
                        className="text-[9px]"
                      >
                        {fu.status}
                      </Badge>
                    </div>
                    <p className="text-slate-600">
                      <span className="font-semibold text-hero">Interested: </span> {fu.interestedModel} • <span className="font-semibold">Scheduled Note: </span> {fu.notes}
                    </p>
                    {fu.customerResponse && (
                      <p className="text-emerald-700 bg-emerald-50 p-1.5 rounded border border-emerald-200">
                        Response: {fu.customerResponse}
                      </p>
                    )}
                    <span className="text-[10px] text-slate-400 block">
                      Assigned: {fu.assignedToName} • Scheduled: {formatDate(fu.scheduledAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a
                      href={`tel:${fu.customerPhone}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-emerald-600 text-white font-semibold shadow-xs"
                    >
                      <PhoneCall className="h-3 w-3" />
                      Call
                    </a>
                    {fu.status === 'PENDING' && (
                      <Button
                        size="sm"
                        onClick={() => setSelectedFollowUp(fu)}
                        className="text-xs h-8"
                      >
                        Complete Follow-up
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add New Lead Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Capture New Sales Lead"
        description="Record customer vehicle inquiry and initialize CRM pipeline stage."
        size="lg"
      >
        <form onSubmit={handleCreateLead} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Customer Full Name</label>
              <Input
                value={newLeadForm.name}
                onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                placeholder="e.g. Ramesh Patel"
                required
                autoFocus
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mobile Number</label>
              <Input
                value={newLeadForm.phone}
                onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                placeholder="+91 98765 XXXXX"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Target Hero Bike</label>
              <select
                value={newLeadForm.modelName}
                onChange={(e) => setNewLeadForm({ ...newLeadForm, modelName: e.target.value })}
                className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-xs text-slate-800"
              >
                <option value="Hero Splendor Plus XTEC">Hero Splendor Plus XTEC</option>
                <option value="Hero Passion Pro">Hero Passion Pro</option>
                <option value="Hero HF Deluxe">Hero HF Deluxe</option>
                <option value="Hero Xpulse 200 4V">Hero Xpulse 200 4V</option>
                <option value="Hero Xtreme 160R 4V">Hero Xtreme 160R 4V</option>
                <option value="Hero Glamour XTEC">Hero Glamour XTEC</option>
                <option value="Hero Pleasure Plus XTEC">Hero Pleasure Plus XTEC</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Priority Rating</label>
              <select
                value={newLeadForm.priority}
                onChange={(e) =>
                  setNewLeadForm({
                    ...newLeadForm,
                    priority: e.target.value as 'HOT' | 'WARM' | 'COLD',
                  })
                }
                className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-xs text-slate-800"
              >
                <option value="HOT">HOT (Immediate Purchase)</option>
                <option value="WARM">WARM (Within 1 Month)</option>
                <option value="COLD">COLD (Just Inquiring)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Target Purchase Date</label>
              <Input
                type="date"
                value={newLeadForm.expectedPurchaseDate}
                onChange={(e) =>
                  setNewLeadForm({ ...newLeadForm, expectedPurchaseDate: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Customer Discussion Notes</label>
            <textarea
              value={newLeadForm.notes}
              onChange={(e) => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
              placeholder="Exchange bonus interest, down payment budget, preferred color..."
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
              Create Lead
            </Button>
          </div>
        </form>
      </Modal>

      {/* Assign Lead to Executive Modal with Workload Check */}
      {selectedLeadForAssign && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedLeadForAssign(null)}
          title="Assign Lead to Sales Executive"
          description={`Routing lead #${selectedLeadForAssign.leadCode} (${selectedLeadForAssign.customerName})`}
          size="sm"
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Select Sales Consultant
              </label>
              <select
                value={targetExecId}
                onChange={(e) => setTargetExecId(e.target.value)}
                className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-xs text-slate-800"
              >
                <option value="usr_sales_amit">Amit Verma (Active Leads: 8 • Workload: Normal)</option>
                <option value="usr_sales_rahul">Rahul Joshi (Active Leads: 6 • Workload: Available)</option>
                <option value="usr_sales_priya">Priya Dave (Active Leads: 4 • Workload: Free)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedLeadForAssign(null)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleAssignLead}>
                Confirm Assignment
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Complete Follow-Up Modal */}
      {selectedFollowUp && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedFollowUp(null)}
          title="Log Customer Follow-Up Outcome"
          description={`Customer: ${selectedFollowUp.customerName} (${selectedFollowUp.customerPhone})`}
          size="md"
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Customer Response / Conversation Notes <span className="text-hero">*</span>
              </label>
              <textarea
                value={followUpResponse}
                onChange={(e) => setFollowUpResponse(e.target.value)}
                placeholder="e.g. Customer visited bank for loan documents; will finalize token on Saturday..."
                className="w-full h-20 rounded-md border border-slate-200 p-2 text-xs focus:ring-1 focus:ring-hero"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Schedule Next Follow-Up (Optional)
              </label>
              <Input
                type="datetime-local"
                value={nextDate}
                onChange={(e) => setNextDate(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedFollowUp(null)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleCompleteFollowUp}>
                Save Follow-Up
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
