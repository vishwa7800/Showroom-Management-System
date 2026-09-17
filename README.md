# 🏍️Showroom Management System (SMS)

[![Next.js](https://img.shields.io/badge/Next.js-14.2.24-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-336791?style=flat-square&logo=postgresql)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)

An enterprise-grade, full-stack **Dealership Management System (ERP)** and **Customer Self-Service Portal** designed specifically for authorized **Hero MotoCorp** two-wheeler dealerships. Built with Next.js 14 App Router, TypeScript, Prisma ORM, and PostgreSQL (Supabase).

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features & Modules](#-key-features--modules)
  - [1. Role-Based Dealership ERP](#1-role-based-dealership-erp)
  - [2. Customer Self-Service Portal](#2-customer-self-service-portal)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Database Schema (Prisma & PostgreSQL)](#-database-schema-prisma--postgresql)
- [Security & RBAC Protection](#-security--rbac-protection)
- [Directory Structure](#-directory-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
- [Environment Variables (.env.local)](#-environment-variables-envlocal)

---

## 🌟 Overview

The **Showroom Management System** unifies all commercial, technical, and customer-facing operations across multiple authorized branches:

- **Halvad Main Branch (HQ)** — `SHR-HLV`
- **Dhangadhra Branch** — `SHR-DHN`
- **Jetpur Branch** — `SHR-JTP`

It eliminates paperwork and fragmented spreadsheets by consolidating Sales, CRM, Test Rides, Workshop & Service Bays, GST Invoicing, Inventory & VIN Tracking, Finance & Loans, and Customer Communication into a unified, high-performance platform.

---

## 🚀 Key Features & Modules

### 1. Role-Based Dealership ERP

The internal ERP provides 8 dedicated, permission-locked role dashboards:

| Role | Module Capabilities |
| :--- | :--- |
| **👑 Franchise Principal / Admin** | Executive financial metrics, cross-branch revenue targets, staff provisioning & deactivation, comprehensive audit logs, and global settings. |
| **🏢 Showroom Manager** | Booking approvals, physical VIN allocations, branch sales target monitoring, and inventory supervision. |
| **💼 Sales Executive** | Customer lead management (Hot / Warm / Cold), automated On-Road Quotation builder (Ex-Showroom + RTO + Insurance + Accessories - Discount), test ride scheduling, and 12-point PDI delivery handovers. |
| **🛎️ Front Desk / Reception** | Walk-in visitor registry, inquiry tracking, customer assignment, and test ride intake. |
| **🔧 Service Manager** | 6-Bay live workshop tracker, technician job allocation, service revenue analytics, and spare part usage reports. |
| **📋 Service Advisor** | Customer vehicle check-in, job card generation, complaint logging, additional repair estimates, and 7-point Quality Check (QC) inspection. |
| **💰 Accountant / Finance** | GST tax invoices (CGST 9% + SGST 9%), partial & multi-mode payment receipts (Cash, UPI, Bank Transfer, Cheque), Financier loan disbursals (Hero FinCorp, HDFC), and receivables ledger. |
| **📦 Inventory Manager** | Consignment inward with strict duplicate VIN/Chassis safeguards, spare parts stock thresholds, and inter-branch stock transfers. |

---

### 2. Customer Self-Service Portal

A dedicated, mobile-first customer portal allowing bike owners to manage their vehicle lifecycle:

- 📱 **Passwordless Mobile OTP Login**: Fast login using verified phone numbers.
- 🏍️ **My Hero Garage**: View registered bikes, engine numbers, VINs, and warranty validity.
- 🔴 **Live Workshop Tracker**: Real-time bay-by-bay progress tracking for active vehicle servicing (`CHECKED_IN` ➔ `IN_SERVICE` ➔ `QC_INSPECTION` ➔ `READY_FOR_DELIVERY`).
- ✍️ **Estimate Approvals**: One-click approval/rejection for additional repair estimates requested by workshop technicians.
- 🧾 **Digital Invoices & Receipts**: View and download itemized GST bills and payment records.
- 💳 **Loan & EMI Schedule**: Monitor financed loan balance, monthly installments, and upcoming dues.

---

## 🛠️ Architecture & Tech Stack

- **Frontend & Full-Stack Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Components & Route Handlers)
- **Language**: [TypeScript 5.7+](https://www.typescriptlang.org/) (100% strict type safety)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) with Custom Hero MotoCorp Design System (HSL color tokens, glassmorphism, responsive micro-animations)
- **Database**: [PostgreSQL](https://www.postgresql.org/) hosted on [Supabase](https://supabase.com/)
- **ORM & Data Layer**: [Prisma ORM 5.22](https://www.prisma.io/) (25+ relational models)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Schema Validation**: [Zod 3.24](https://zod.dev/)
- **Authentication**: Cryptographic JSON Web Tokens (JWT) signed via `jose`, stored in `httpOnly` `SameSite=Lax` secure cookies
- **Password Security**: [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js) with 10 salt rounds

---

## 🗄️ Database Schema (Prisma & PostgreSQL)

The schema in `prisma/schema.prisma` models complete enterprise operations across **25+ relational entities**:

```text
├── User (Staff & Roles)
├── Branch (Multi-location tenancy)
├── Customer (CRM profiles & KYC)
├── CustomerVehicle (Vehicle ownership ledger)
├── Lead (Sales pipeline & follow-ups)
├── TestRide (Demo booking & license verification)
├── Quotation (On-road pricing engine)
├── Booking (Token booking & manager approvals)
├── VehicleUnit (Physical stock, VIN, Chassis & Engine numbers)
├── PDIChecklist (12-point pre-delivery inspection)
├── Delivery (Handover & registration)
├── JobCard (Workshop service tickets)
├── JobCardItem (Labor & parts line items)
├── Invoice (GST tax invoices & billing)
├── Payment (Multi-method receipts & reconciliations)
├── SparePart (Parts inventory & min-stock thresholds)
├── StockMovement (Consignment inward & inter-branch transfer)
├── Notification (User & branch alerts)
└── AuditLog (Security & compliance trail with secret scrubbing)
```

---

## 🔒 Security & RBAC Protection

- **Server-Authoritative RBAC**: Role verification is strictly enforced on the server. Client-side role claims are validated against the database.
- **IDOR Protection**: Customers are cryptographically isolated (`isCustomer: true`); cross-customer record access is strictly forbidden (`403/404`).
- **Data Scrubbing**: Passwords, hashes, and JWT tokens are automatically stripped from audit logs before persistence.
- **Sanitized Error Responses**: Production error handlers return clean JSON without leaking filesystem paths, database connection strings, or stack traces.
- **Duplicate VIN Safeguard**: Inward stock movements strictly reject duplicate VIN or Chassis numbers to prevent inventory anomalies.

---

## 📁 Directory Structure

```text
shreeji-hero-sms/
├── prisma/
│   ├── schema.prisma              # 25+ relational PostgreSQL models
│   └── seed.ts                    # Production baseline seed script
├── public/                        # Static assets, branding logos & media
├── src/
│   ├── app/
│   │   ├── (auth)/                # Staff authentication (/login, /signup)
│   │   ├── (customer)/            # Customer Portal (/portal, /portal/login)
│   │   ├── (erp)/                 # Dealership ERP modules
│   │   │   ├── dashboard/         # Role-aware dashboard
│   │   │   ├── leads/             # Lead management & pipeline
│   │   │   ├── test-rides/        # Test ride booking & schedules
│   │   │   ├── sales/             # Quotations, bookings & delivery
│   │   │   ├── service/           # Workshop & 6-bay tracker
│   │   │   ├── inventory/         # Stock, spare parts & inward
│   │   │   ├── finance/           # Invoicing, payments & GST reports
│   │   │   ├── customers/         # CRM customer directory
│   │   │   ├── employees/         # Staff provisioning & status
│   │   │   ├── reports/           # Analytics & branch exports
│   │   │   ├── notifications/     # Real-time alerts
│   │   │   └── settings/          # Provider & branch configuration
│   │   ├── api/                   # 85 Next.js App Router API endpoints
│   │   ├── globals.css            # Tailwind design system & tokens
│   │   ├── layout.tsx             # Root layout with font optimization
│   │   └── page.tsx               # Public showroom landing page
│   ├── components/
│   │   ├── dashboard/             # 8 Role-specific dashboard views
│   │   ├── layout/                # AppShell, Sidebar, TopHeader
│   │   └── ui/                    # Design system components (Card, Button, Modal, etc.)
│   ├── hooks/                     # Custom React hooks
│   ├── lib/
│   │   ├── auth/                  # JWT token signing & cookies
│   │   ├── db/                    # Data stores, fixtures & Prisma singleton
│   │   ├── audit.ts               # Security audit logger
│   │   ├── constants.ts           # Dealership branches & vehicle catalogue
│   │   ├── permissions.ts         # Granular RBAC permission matrix
│   │   ├── prisma.ts              # Global PrismaClient singleton
│   │   └── utils.ts               # Currency formatting (INR), dates & classnames
│   ├── scripts/
│   │   └── migrate-users-to-postgres.ts # User migration script
│   ├── types/                     # TypeScript domain models & interfaces
│   └── middleware.ts              # Route protection & session validation
├── .env.example                   # Environment configuration template
├── .gitignore                     # Git ignore rules (protects backend & secrets)
├── next.config.mjs                # Next.js configuration
├── package.json                   # Project dependencies & scripts
├── tailwind.config.ts             # Tailwind design tokens & Hero branding
└── tsconfig.json                  # TypeScript compiler settings
```

---

## 🚦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.17.0 or higher recommended)
- A [Supabase](https://supabase.com/) PostgreSQL database instance (or local PostgreSQL)

---

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/shreeji-hero-sms.git
   cd shreeji-hero-sms
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env.local` file in the root directory (refer to [.env.example](.env.example)):
   ```bash
   cp .env.example .env.local
   ```
   Add your Supabase PostgreSQL connection string and a secure `JWT_SECRET`.

4. **Push database schema to Supabase / PostgreSQL**:
   ```bash
   npx prisma db push
   ```

5. **Seed baseline branches and initial admin account**:
   ```bash
   npx tsx prisma/seed.ts
   ```

6. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Environment Variables (`.env.local`)

| Variable | Description | Example |
| :--- | :--- | :--- |
| `NODE_ENV` | Application runtime environment | `development` / `production` |
| `APP_URL` | Base application URL | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_NAME` | Public brand title | `Shreeji Hero Showroom ERP` |
| `DATABASE_URL` | PostgreSQL pooler connection URL | `postgresql://postgres.[REF]:[PASS]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true` |
| `DIRECT_URL` | PostgreSQL direct connection URL (migrations) | `postgresql://postgres.[REF]:[PASS]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres` |
| `JWT_SECRET` | Cryptographic secret for signing JWT sessions (min 32 chars) | `your-high-entropy-random-secret-key-32-chars` |
| `AUTH_SECRET` | Auth secret key | `your-auth-secret-key` |
| `SESSION_COOKIE_NAME` | Name of the authentication cookie | `shreeji_hero_session` |

---



## 📄 License

This project is proprietary and confidential. Developed for **Shreeji Hero MotoCorp Authorized Dealership**. All rights reserved.
