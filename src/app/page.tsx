import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Bike,
  TrendingUp,
  Wrench,
  Package,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export default function LandingHomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-hero selection:text-white">
      {/* ------------------------------------------------------------- */}
      {/* TOP NAVIGATION BAR                                            */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 lg:px-12 py-3.5 flex items-center justify-between transition-all shadow-sm">
        {/* Brand Logo matching wireframe */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-9 w-9 rounded-xl bg-hero flex items-center justify-center text-white shadow-md shadow-hero/20 group-hover:scale-105 transition-transform">
            <Bike className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-black tracking-tight text-hero">Hero</span>
            <span className="hidden sm:inline-block text-xs font-bold text-slate-700 border-l border-slate-200 pl-2">
              Showroom Management System
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
          <Link href="#home" className="text-hero transition-colors">
            Home
          </Link>
          <Link href="#about" className="hover:text-hero transition-colors">
            About
          </Link>
          <Link href="/portal/login" className="hover:text-hero transition-colors">
            Customer Portal
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8 px-4 font-bold border-slate-200 hover:border-slate-800 text-slate-800 rounded-full"
            >
              Login
            </Button>
          </Link>

          <Link href="/signup">
            <Button
              size="sm"
              className="text-xs h-8 px-4 font-bold bg-hero hover:bg-hero-700 text-white rounded-full shadow-md shadow-hero/20"
            >
              Sign Up
            </Button>
          </Link>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 1. HERO SECTION (MATCHING WIREFRAME & UI DESIGN)             */}
      {/* ------------------------------------------------------------- */}
      <section id="home" className="relative pt-8 pb-16 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full">
        {/* Subtle background red speed-accent gradient */}
        <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-hero-50/50 rounded-full blur-3xl" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
          {/* Left Column: Heading, Subtitle & Action Buttons */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="space-y-2">
              <span className="text-xl sm:text-2xl font-medium text-slate-600 tracking-tight block">
                Welcome to
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                <span className="text-hero">Hero Showroom</span> <br className="hidden sm:inline" />
                <span className="text-slate-900">Management System</span>
              </h1>
            </div>

            <p className="text-sm sm:text-base text-slate-500 max-w-lg leading-relaxed font-normal">
              A complete solution to manage your showroom operations, sales, services, inventory and more.
            </p>

            {/* Action Buttons matching wireframe */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/login">
                <Button
                  size="default"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-11 px-8 rounded-xl shadow-lg shadow-slate-900/10"
                >
                  Login
                </Button>
              </Link>

              <Link href="/signup">
                <Button
                  size="default"
                  className="bg-hero hover:bg-hero-700 text-white font-bold text-xs h-11 px-8 rounded-xl shadow-lg shadow-hero/25"
                >
                  Sign Up
                </Button>
              </Link>
            </div>

            {/* Mini Trust Badges */}
            <div className="pt-4 flex items-center gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Enterprise RBAC</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Bike className="h-4 w-4 text-hero" />
                <span>Hero MotoCorp Authorized</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Motorcycle Showcase */}
          <div className="lg:col-span-6 flex justify-center items-center relative">
            <div className="relative w-full max-w-lg aspect-4/3 flex items-center justify-center">
              <Image
                src="/images/hero_showcase_bike.jpg"
                alt="Hero Splendor Plus Red Motorcycle"
                width={600}
                height={450}
                priority
                className="object-contain drop-shadow-2xl hover:scale-102 transition-transform duration-300"
              />
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 4 FEATURE CARDS (MATCHING WIREFRAME BOTTOM ROW)             */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12 pt-6">
          {/* Card 1: Manage Sales */}
          <Card className="p-5 bg-white rounded-2xl border border-slate-100 shadow-md hover:shadow-xl transition-all duration-200 group flex flex-col justify-between space-y-3">
            <div className="h-11 w-11 rounded-xl bg-hero-50 border border-hero-100 flex items-center justify-center text-hero group-hover:scale-110 transition-transform">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900">Manage Sales</h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Track leads, bookings and sales efficiently.
              </p>
            </div>
          </Card>

          {/* Card 2: Service Center */}
          <Card className="p-5 bg-white rounded-2xl border border-slate-100 shadow-md hover:shadow-xl transition-all duration-200 group flex flex-col justify-between space-y-3">
            <div className="h-11 w-11 rounded-xl bg-hero-50 border border-hero-100 flex items-center justify-center text-hero group-hover:scale-110 transition-transform">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900">Service Center</h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Manage service requests and mechanics.
              </p>
            </div>
          </Card>

          {/* Card 3: Inventory */}
          <Card className="p-5 bg-white rounded-2xl border border-slate-100 shadow-md hover:shadow-xl transition-all duration-200 group flex flex-col justify-between space-y-3">
            <div className="h-11 w-11 rounded-xl bg-hero-50 border border-hero-100 flex items-center justify-center text-hero group-hover:scale-110 transition-transform">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900">Inventory</h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Track bike inventory and spare parts.
              </p>
            </div>
          </Card>

          {/* Card 4: Reports & Analytics */}
          <Card className="p-5 bg-white rounded-2xl border border-slate-100 shadow-md hover:shadow-xl transition-all duration-200 group flex flex-col justify-between space-y-3">
            <div className="h-11 w-11 rounded-xl bg-hero-50 border border-hero-100 flex items-center justify-center text-hero group-hover:scale-110 transition-transform">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900">Reports & Analytics</h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Get insights and grow your showroom.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. ABOUT SHOWROOM MANAGEMENT SYSTEM SECTION                  */}
      {/* ------------------------------------------------------------- */}
      <section id="about" className="py-16 bg-slate-50 border-t border-slate-100 px-4 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="hero" className="font-bold text-[10px] uppercase tracking-wider">
              About The Platform
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Built Specifically for Hero MotoCorp Dealerships
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Designed from the ground up to unify multi-branch dealership operations, customer lifecycle CRM, workshop bay throughput, and GST financial accounting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="font-bold text-sm text-slate-900">Multi-Branch Architecture</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Real-time synchronization across Halvad HQ, Dhangadhra, and Jetpur branch locations with strict data tenancy and stock transfers.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="h-10 w-10 rounded-xl bg-hero text-white flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="font-bold text-sm text-slate-900">Role-Specific Dashboards</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tailored interfaces for 8 distinct dealership positions: Owner, Showroom Manager, Sales Executive, Front Desk, Service Manager, Service Advisor, Accountant, and Inventory Manager.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="font-bold text-sm text-slate-900">End-to-End Traceability</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                From initial customer inquiry to test ride, quotation, booking, 12-point PDI, GST invoicing, and 6-bay workshop servicing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. CUSTOMER SELF-SERVICE PORTAL CTA BANNER                   */}
      {/* ------------------------------------------------------------- */}
      <section className="py-12 bg-slate-900 text-white px-4 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-800/80 p-8 rounded-3xl border border-slate-700">
          <div className="space-y-2 max-w-xl">
            <Badge variant="hero" className="text-[10px] font-bold uppercase">
              For Bike Owners
            </Badge>
            <h2 className="text-2xl font-bold tracking-tight">
              Customer Self-Service Portal
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you a Hero two-wheeler customer? Track your active workshop service in real time, view EMI loan schedule, approve estimates with 1 click, and download official GST tax invoices.
            </p>
          </div>

          <Link href="/portal/login">
            <Button className="bg-hero hover:bg-hero-700 text-white text-xs h-11 px-6 font-bold rounded-xl gap-2 shadow-lg shadow-hero/30">
              <span>Open Customer Portal</span>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FOOTER                                                        */}
      {/* ------------------------------------------------------------- */}
      <footer className="bg-slate-950 text-slate-400 py-10 px-4 sm:px-8 lg:px-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-hero flex items-center justify-center text-white">
              <Bike className="h-3.5 w-3.5" />
            </div>
            <span className="font-bold text-white">Shreeji Hero MotoCorp</span>
            <span className="text-[11px] text-slate-500">© 2026 Dealership ERP System</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/login" className="hover:text-white">
              Employee Login
            </Link>
            <Link href="/signup" className="hover:text-white">
              Admin Sign Up
            </Link>
            <Link href="/portal/login" className="hover:text-white">
              Customer Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
