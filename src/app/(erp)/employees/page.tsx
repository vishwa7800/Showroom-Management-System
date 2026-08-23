'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/context';
import { UserProfile, Role, AccountStatus } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import {
  Plus,
  Shield,
  Mail,
  Phone,
  Building2,
  Lock,
  UserCheck,
  UserX,
  History,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function EmployeesPage() {
  const { user, can } = useAuth();
  const { toast } = useToast();

  const [employees, setEmployees] = useState<UserProfile[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add Employee Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'SALES_EXECUTIVE' as Role,
    branchId: 'br_halvad',
    department: 'Sales',
    designation: 'Sales Consultant',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Status toggle confirmation modal
  const [targetEmployee, setTargetEmployee] = useState<UserProfile | null>(null);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/employees');
      const data = await res.json();
      if (data.success) {
        setEmployees(data.employees);
      }
    } catch (e) {
      toast('Error', 'Failed to load employee directory', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch('/api/audit-logs');
      const data = await res.json();
      if (data.success) {
        setAuditLogs(data.logs);
      }
    } catch (e) {
      // Ignore
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchAuditLogs();
  }, []);

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast('Failed to create employee', data.error, 'error');
        setIsSubmitting(false);
        return;
      }

      toast('Employee Created', `${data.employee.name} (${data.employee.employeeCode}) onboarded.`, 'success');
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'SALES_EXECUTIVE',
        branchId: 'br_halvad',
        department: 'Sales',
        designation: 'Sales Consultant',
        password: '',
      });
      fetchEmployees();
      fetchAuditLogs();
    } catch (e) {
      toast('Error', 'Network error creating employee', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (emp: UserProfile) => {
    const nextStatus: AccountStatus = emp.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';

    try {
      const res = await fetch(`/api/employees/${emp.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast('Action blocked', data.error, 'error');
        return;
      }

      toast(
        nextStatus === 'ACTIVE' ? 'Account Activated' : 'Account Deactivated',
        `${emp.name}'s account is now ${nextStatus.toLowerCase()}.`,
        nextStatus === 'ACTIVE' ? 'success' : 'warning'
      );
      setTargetEmployee(null);
      fetchEmployees();
      fetchAuditLogs();
    } catch (e) {
      toast('Error', 'Failed to update account status', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Employee Management & Access Control
            </h1>
            <Badge variant="outline" className="text-xs font-semibold">
              RBAC Protected
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Server-enforced role permissions, branch assignments, and account activation lifecycle.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {can('audit.read') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                fetchAuditLogs();
                setIsAuditModalOpen(true);
              }}
              className="gap-1.5 text-xs text-slate-700"
            >
              <History className="h-3.5 w-3.5" />
              Security Audit Logs
            </Button>
          )}

          {can('employees.manage') && (
            <Button
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              className="gap-1.5 text-xs font-semibold"
            >
              <Plus className="h-3.5 w-3.5" />
              Add New Employee
            </Button>
          )}
        </div>
      </div>

      {/* Staff Directory Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Active Staff & Authorization Directory</CardTitle>
          <span className="text-xs text-slate-400 font-medium">
            {employees.length} Registered Accounts
          </span>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="text-left p-3.5">Employee</th>
                  <th className="text-left p-3.5">Assigned Role</th>
                  <th className="text-left p-3.5">Authorized Branch</th>
                  <th className="text-left p-3.5">Contact Details</th>
                  <th className="text-left p-3.5">Account Status</th>
                  <th className="text-right p-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700">
                          {emp.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{emp.name}</span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {emp.employeeCode}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <Badge variant="hero" className="font-medium text-[11px]">
                        {emp.role.replace(/_/g, ' ')}
                      </Badge>
                      <span className="block text-[11px] text-slate-400 mt-0.5">
                        {emp.designation}
                      </span>
                    </td>
                    <td className="p-3.5 font-medium text-slate-800">
                      {emp.branchName || (emp.role === 'ADMIN' ? 'All Branches (Cross-Branch)' : 'Halvad Branch')}
                    </td>
                    <td className="p-3.5">
                      <div className="space-y-0.5 text-[11px]">
                        <span className="block text-slate-700">{emp.email}</span>
                        <span className="block text-slate-400">{emp.phone}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      {emp.status === 'ACTIVE' ? (
                        <Badge variant="success" withDot>
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="danger" withDot>
                          Disabled
                        </Badge>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      {can('employees.manage') && emp.id !== user?.id && (
                        <Button
                          variant={emp.status === 'ACTIVE' ? 'ghost' : 'outline'}
                          size="sm"
                          onClick={() => setTargetEmployee(emp)}
                          className={
                            emp.status === 'ACTIVE'
                              ? 'text-xs text-rose-600 hover:bg-rose-50 h-7'
                              : 'text-xs text-emerald-600 hover:bg-emerald-50 h-7 border-emerald-200'
                          }
                        >
                          {emp.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Employee Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Onboard New Showroom Employee"
        description="Create an authorized employee account with server-side RBAC permissions."
        size="lg"
      >
        <form onSubmit={handleCreateEmployee} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Anand Patel"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. anand@shreejihero.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Phone Number</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 XXXXX"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Temporary Password</label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Leave blank for default (Hero@2026)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Showroom Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-xs text-slate-800 focus:ring-1 focus:ring-hero"
              >
                <option value="SALES_EXECUTIVE">Sales Executive</option>
                <option value="FRONT_DESK">Front Desk Executive</option>
                <option value="SERVICE_MANAGER">Service Manager</option>
                <option value="SERVICE_ADVISOR">Service Advisor</option>
                <option value="ACCOUNTANT">Accountant</option>
                <option value="INVENTORY_MANAGER">Inventory Manager</option>
                {user?.role === 'ADMIN' && (
                  <>
                    <option value="SHOWROOM_MANAGER">Showroom Manager</option>
                    <option value="ADMIN">Admin / Owner</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Assigned Branch</label>
              <select
                value={formData.branchId || 'br_halvad'}
                onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                className="w-full h-9 rounded-md border border-slate-200 px-3 bg-white text-xs text-slate-800 focus:ring-1 focus:ring-hero"
              >
                <option value="br_halvad">Halvad Branch</option>
                <option value="br_dhangadhra">Dhangadhra Branch</option>
                <option value="br_jetpur">Jetpur Branch</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmitting} className="font-semibold">
              Create Employee Account
            </Button>
          </div>
        </form>
      </Modal>

      {/* Account Deactivation / Activation Confirmation Modal */}
      {targetEmployee && (
        <Modal
          isOpen={true}
          onClose={() => setTargetEmployee(null)}
          title={targetEmployee.status === 'ACTIVE' ? 'Deactivate Employee' : 'Activate Employee'}
          size="sm"
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-amber-50 rounded-lg text-amber-800 flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0 text-amber-600" />
              <div>
                <p className="font-semibold">
                  {targetEmployee.status === 'ACTIVE'
                    ? `Deactivate ${targetEmployee.name}?`
                    : `Activate ${targetEmployee.name}?`}
                </p>
                <p className="mt-1 text-[11px] text-amber-700">
                  {targetEmployee.status === 'ACTIVE'
                    ? 'The employee will immediately lose access to ERP. Historical sales, job cards, and invoices are preserved.'
                    : 'The employee will regain access to ERP with their assigned permissions.'}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setTargetEmployee(null)}>
                Cancel
              </Button>
              <Button
                variant={targetEmployee.status === 'ACTIVE' ? 'danger' : 'success'}
                size="sm"
                onClick={() => handleToggleStatus(targetEmployee)}
              >
                Confirm {targetEmployee.status === 'ACTIVE' ? 'Deactivation' : 'Activation'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Security Audit Logs Modal */}
      <Modal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        title="Security & System Audit Logs"
        description="Immutable record of security events, authentication attempts, and permission changes."
        size="xl"
      >
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {auditLogs.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">No audit records found.</p>
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="py-2.5 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="hero" className="font-mono text-[10px]">
                        {log.action}
                      </Badge>
                      <span className="font-semibold text-slate-900">{log.entity}</span>
                      <span className="text-slate-400 font-mono text-[10px]">
                        ID: {log.entityId}
                      </span>
                    </div>
                    {log.changeDetails && (
                      <p className="text-[11px] text-slate-600 font-mono bg-slate-50 p-1.5 rounded">
                        {typeof log.changeDetails === 'string'
                          ? log.changeDetails
                          : JSON.stringify(log.changeDetails)}
                      </p>
                    )}
                    <span className="text-[10px] text-slate-400 block">
                      Actor: {log.actorName} ({log.actorRole}) • IP: {log.ipAddress}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 flex-shrink-0 font-medium">
                    {formatDate(log.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
