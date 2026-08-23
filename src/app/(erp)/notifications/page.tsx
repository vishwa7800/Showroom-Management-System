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
  Bell,
  CheckCheck,
  Clock,
  Send,
  MessageSquare,
  Phone,
  Mail,
  AlertTriangle,
  Flame,
  Wrench,
  ShoppingBag,
  Coins,
  Boxes,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

export default function NotificationsPage() {
  const { user, activeBranchId } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'ALERTS' | 'REMINDERS' | 'TEMPLATES'>('ALERTS');
  const [moduleFilter, setModuleFilter] = useState('ALL');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Template test modal
  const [isCommModalOpen, setIsCommModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [testPhone, setTestPhone] = useState('+91 98765 43210');

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [notifRes, remRes, tmplRes] = await Promise.all([
        fetch(`/api/notifications?module=${moduleFilter}`),
        fetch('/api/reminders'),
        fetch('/api/communication/templates?customerName=Ramesh%20Patel&vehicleModel=Hero%20Splendor%20Plus&bookingCode=BK-1001&amount=82500'),
      ]);

      const [notifData, remData, tmplData] = await Promise.all([
        notifRes.json(),
        remRes.json(),
        tmplRes.json(),
      ]);

      if (notifData.success) setNotifications(notifData.notifications);
      if (remData.success) setReminders(remData.reminders);
      if (tmplData.success) setTemplates(tmplData.templates);
    } catch (e) {
      toast('Error', 'Failed to load notifications data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [moduleFilter, activeBranchId]);

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch('/api/notifications/read-all', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        toast('Marked Read', `All ${data.count} notifications marked as read.`, 'success');
        fetchData();
      }
    } catch (e) {
      toast('Error', 'Failed to mark notifications as read', 'error');
    }
  };

  const handleMarkSingleRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
      fetchData();
    } catch (e) {
      // fallback
    }
  };

  const handleSendTestMessage = (e: React.FormEvent) => {
    e.preventDefault();
    toast(
      'Message Dispatched',
      `${selectedTemplate.channel} dispatched to ${testPhone}.`,
      'success'
    );
    setIsCommModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Notifications & Customer Engagement Center
            </h1>
            <Badge variant="hero" className="font-bold text-[10px] uppercase">
              Role Alerts
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-Time Business Event Triggers, Automated Reminders, and Multi-Channel Customer Messaging.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleMarkAllRead}
            className="text-xs h-9 gap-1.5 font-semibold text-slate-700"
          >
            <CheckCheck className="h-3.5 w-3.5 text-hero" />
            <span>Mark All as Read</span>
          </Button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold select-none bg-white px-4 pt-3 rounded-t-lg border-t border-x overflow-x-auto">
        <button
          onClick={() => setActiveTab('ALERTS')}
          className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px whitespace-nowrap ${
            activeTab === 'ALERTS'
              ? 'border-hero text-hero'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Bell className="h-4 w-4" />
          <span>Internal Alerts ({notifications.filter((n) => !n.isRead).length} Unread)</span>
        </button>

        <button
          onClick={() => setActiveTab('REMINDERS')}
          className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px whitespace-nowrap ${
            activeTab === 'REMINDERS'
              ? 'border-hero text-hero'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>Automated Reminders ({reminders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('TEMPLATES')}
          className={`pb-3 flex items-center gap-2 transition-colors border-b-2 -mb-px whitespace-nowrap ${
            activeTab === 'TEMPLATES'
              ? 'border-hero text-hero'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>Customer Messaging Templates ({templates.length})</span>
        </button>
      </div>

      {/* TAB 1: INTERNAL ALERTS */}
      {activeTab === 'ALERTS' && (
        <div className="space-y-4">
          {/* Module Filter Pills */}
          <div className="flex flex-wrap gap-2 text-xs">
            {(['ALL', 'SALES', 'SERVICE', 'FINANCE', 'INVENTORY', 'CRM'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setModuleFilter(m)}
                className={`px-3 py-1.5 rounded-full font-semibold transition-colors ${
                  moduleFilter === m
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3">
            {notifications.length === 0 ? (
              <Card className="p-8 text-center text-xs text-slate-400">
                No active notifications in this category.
              </Card>
            ) : (
              notifications.map((n) => (
                <Card
                  key={n.id}
                  className={`p-4 transition-colors flex items-start justify-between gap-4 ${
                    !n.isRead ? 'border-l-4 border-l-hero bg-hero-50/10' : ''
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          n.priority === 'CRITICAL'
                            ? 'danger'
                            : n.priority === 'IMPORTANT'
                            ? 'warning'
                            : 'outline'
                        }
                        className="text-[9px] uppercase font-bold"
                      >
                        {n.priority}
                      </Badge>
                      <Badge variant="outline" className="text-[9px] uppercase font-bold text-slate-500">
                        {n.module}
                      </Badge>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(n.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{n.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      href={n.linkUrl || '/dashboard'}
                      onClick={() => handleMarkSingleRead(n.id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-hero hover:underline bg-hero-50 px-2.5 py-1.5 rounded-md border border-hero-200"
                    >
                      <span>Open Record</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: AUTOMATED REMINDERS */}
      {activeTab === 'REMINDERS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reminders.map((r) => (
            <Card key={r.id} className="p-4 border-l-4 border-l-amber-500 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Badge variant="warning" className="text-[9px] uppercase font-bold">
                    {r.type.replace(/_/g, ' ')}
                  </Badge>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(r.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{r.title}</h3>
                <p className="text-xs text-slate-600 mt-1">{r.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                <Link
                  href={r.linkUrl}
                  className="text-xs font-bold text-hero hover:underline flex items-center gap-1"
                >
                  <span>Resolve Reminder</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 3: CUSTOMER MESSAGING TEMPLATES */}
      {activeTab === 'TEMPLATES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((tmpl) => (
            <Card key={tmpl.id} className="p-4 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">{tmpl.title}</span>
                  <Badge
                    variant={tmpl.channel === 'WHATSAPP' ? 'success' : 'outline'}
                    className="text-[9px] uppercase font-bold"
                  >
                    {tmpl.channel}
                  </Badge>
                </div>
                <div className="bg-slate-50 p-3 rounded text-xs text-slate-700 font-sans border border-slate-100 leading-relaxed">
                  {tmpl.content}
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedTemplate(tmpl);
                    setIsCommModalOpen(true);
                  }}
                  className="text-xs h-8 gap-1.5 font-semibold"
                >
                  <Send className="h-3 w-3" />
                  <span>Send to Customer</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* MODAL: Trigger Customer Message */}
      <Modal
        isOpen={isCommModalOpen}
        onClose={() => setIsCommModalOpen(false)}
        title="Dispatch Customer Message"
        description="Send personalized update via WhatsApp or SMS."
        size="md"
      >
        {selectedTemplate && (
          <form onSubmit={handleSendTestMessage} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Recipient Phone Number
              </label>
              <Input
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="+91 98765 43210"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Message Content ({selectedTemplate.channel})
              </label>
              <textarea
                value={selectedTemplate.content}
                readOnly
                rows={4}
                className="w-full rounded-md border border-slate-200 p-2.5 bg-slate-50 text-xs text-slate-800"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsCommModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" className="font-semibold gap-1.5">
                <Send className="h-3 w-3" />
                <span>Confirm & Send</span>
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
