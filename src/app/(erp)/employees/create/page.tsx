'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  Mail,
  Phone,
  BadgeAlert,
  Shield,
  Building,
  Lock,
  Eye,
  EyeOff,
  Check,
  Calendar,
  Briefcase,
  ChevronRight,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { Role } from '@/types';

export default function CreateEmployeePage() {
  const router = useRouter();
  const { toast } = useToast();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [role, setRole] = useState<Role | ''>('SALES_EXECUTIVE');
  const [department, setDepartment] = useState('Sales');
  const [sendCredentials, setSendCredentials] = useState(true);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [dateOfJoining, setDateOfJoining] = useState(new Date().toISOString().split('T')[0]);
  const [designation, setDesignation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Password validation checks
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasMinLength = password.length >= 8;

  const strengthScore = [hasUppercase, hasLowercase, hasNumber, hasSpecial, hasMinLength].filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName || !email || !phone || !role) {
      setErrorMessage('Please fill in all required fields marked with *.');
      return;
    }

    if (password && password !== confirmPassword) {
      setErrorMessage("Passwords don't match.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          email,
          phone: `+91 ${phone.replace(/[^0-9]/g, '')}`,
          role,
          department,
          designation: designation || undefined,
          password: password || undefined,
          branchId: 'br_halvad',
          branchName: 'Halvad Branch',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to create employee account.');
        setIsLoading(false);
        return;
      }

      toast('Employee Created!', `Account for ${fullName} (${data.employee?.employeeCode || 'New'}) was created successfully.`, 'success');
      router.push('/employees');
      router.refresh();
    } catch (err) {
      setErrorMessage('Network or server error creating employee.');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto selection:bg-indigo-600 selection:text-white">
      {/* Top Breadcrumb & Title matching Image 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <Link href="/dashboard" className="hover:text-indigo-600 transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <Link href="/employees" className="hover:text-indigo-600 transition-colors">
              Employees
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-800 font-semibold">Create Employee</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Create Employee Account
          </h1>
        </div>
      </div>

      {/* Error Alert Box */}
      {errorMessage && (
        <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2.5 text-xs animate-in fade-in">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-rose-600" />
          <span className="leading-snug">{errorMessage}</span>
        </div>
      )}

      {/* Main Two-Column Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ========================================================= */}
          {/* LEFT COLUMN: EMPLOYEE INFORMATION                        */}
          {/* ========================================================= */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-6 space-y-5">
            <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
              <div className="h-9 w-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Employee Information</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Add new employee details and account credentials
                </p>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter employee full name"
                  required
                  className="pl-9 text-xs h-10 border-slate-200"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  required
                  className="pl-9 text-xs h-10 border-slate-200"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="h-10 px-3 rounded-md border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 flex-shrink-0">
                  <span>🇮🇳</span>
                  <span>+91</span>
                </div>
                <div className="relative flex-1">
                  <Phone className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    required
                    className="pl-9 text-xs h-10 border-slate-200"
                  />
                </div>
              </div>
            </div>

            {/* Employee ID */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Employee ID
              </label>
              <div className="relative">
                <BadgeAlert className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                <Input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="Enter employee ID (optional)"
                  className="pl-9 text-xs h-10 border-slate-200"
                />
              </div>
            </div>

            {/* Role Dropdown */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Role <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Shield className="h-4 w-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  required
                  className="w-full h-10 rounded-md border border-slate-200 pl-9 pr-3 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="SALES_EXECUTIVE">Sales Executive</option>
                  <option value="SHOWROOM_MANAGER">Showroom Manager</option>
                  <option value="FRONT_DESK">Front Desk</option>
                  <option value="SERVICE_MANAGER">Service Manager</option>
                  <option value="SERVICE_ADVISOR">Service Advisor</option>
                  <option value="ACCOUNTANT">Accountant</option>
                  <option value="INVENTORY_MANAGER">Inventory Manager</option>
                  <option value="ADMIN">Admin / Owner</option>
                </select>
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Department
              </label>
              <div className="relative">
                <Building className="h-4 w-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full h-10 rounded-md border border-slate-200 pl-9 pr-3 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="Sales">Sales Department</option>
                  <option value="Workshop">Workshop & Service Floor</option>
                  <option value="Accounts & Finance">Accounts & Billing</option>
                  <option value="Inventory & Parts">Inventory & Spare Parts</option>
                  <option value="Front Desk">Front Desk & Reception</option>
                  <option value="Management">Executive Management</option>
                </select>
              </div>
            </div>

            {/* Send Login Credentials Toggle Switch */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Send Login Credentials</span>
                <span className="text-[11px] text-slate-400 block">
                  Employee will receive email with login details
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSendCredentials(!sendCredentials)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  sendCredentials ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    sendCredentials ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: ACCOUNT CREDENTIALS & EXTRA INFO            */}
          {/* ========================================================= */}
          <div className="space-y-6">
            {/* Account Credentials Card */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-6 space-y-5">
              <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
                <div className="h-9 w-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Account Credentials</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Set password for the employee account
                  </p>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="pr-9 text-xs h-10 border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Password Strength Meter Bar */}
                <div className="mt-2 flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        strengthScore >= level
                          ? strengthScore >= 4
                            ? 'bg-emerald-500'
                            : strengthScore >= 3
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                          : 'bg-slate-100'
                      }`}
                    />
                  ))}
                  <span className="text-[10px] font-medium text-slate-400 pl-1 whitespace-nowrap">
                    Password strength
                  </span>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="pr-9 text-xs h-10 border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Password Requirement Checklist */}
              <div className="p-3.5 bg-slate-50/70 rounded-lg border border-slate-100 space-y-2 text-xs">
                <span className="text-[11px] font-medium text-slate-500 block">
                  Passwords must be at least 8 characters long and include:
                </span>
                <div className="space-y-1.5 text-[11px]">
                  <div className={`flex items-center gap-2 ${hasUppercase ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                    <Check className="h-3.5 w-3.5" />
                    <span>At least one uppercase letter</span>
                  </div>
                  <div className={`flex items-center gap-2 ${hasLowercase ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                    <Check className="h-3.5 w-3.5" />
                    <span>At least one lowercase letter</span>
                  </div>
                  <div className={`flex items-center gap-2 ${hasNumber ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                    <Check className="h-3.5 w-3.5" />
                    <span>At least one number</span>
                  </div>
                  <div className={`flex items-center gap-2 ${hasSpecial ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                    <Check className="h-3.5 w-3.5" />
                    <span>At least one special character</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information Card */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-6 space-y-5">
              <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
                <div className="h-9 w-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Additional Information</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    More details about the employee (optional)
                  </p>
                </div>
              </div>

              {/* Date of Joining */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Date of Joining
                </label>
                <div className="relative">
                  <Input
                    type="date"
                    value={dateOfJoining}
                    onChange={(e) => setDateOfJoining(e.target.value)}
                    className="text-xs h-10 border-slate-200"
                  />
                </div>
              </div>

              {/* Designation */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Designation
                </label>
                <div className="relative">
                  <Briefcase className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                  <Input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="Enter designation (e.g. Senior Sales Consultant)"
                    className="pl-9 text-xs h-10 border-slate-200"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <Link href="/employees">
            <Button
              type="button"
              variant="outline"
              className="text-xs h-10 px-5 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isLoading}
            className="text-xs h-10 px-6 font-bold bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-md shadow-indigo-600/20"
          >
            <Plus className="h-4 w-4" />
            <span>{isLoading ? 'Creating Account...' : '+ Create Employee'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
