# 📘 Shreeji Hero ERP: Complete Tech Stack, Architecture & Interview Master Guide

> **Confidential Personal Guide**: This comprehensive master document details every technology used, architectural choices, authentication flows, database management, secrets handling, and **25+ real-world technical interview questions with model answers** tailored directly to this project.

---

## 📌 Table of Contents

1. [🧭 High-Level Architecture Flow](#-high-level-architecture-flow)
2. [🛠️ Complete Technology Matrix (What is Used for What)](#-complete-technology-matrix-what-is-used-for-what)
3. [🔐 Deep-Dive 1: Role-Based Authentication & Authorization (RBAC)](#-deep-dive-1-role-based-authentication--authorization-rbac)
4. [🗄️ Deep-Dive 2: Database Management & Performance Handling](#-deep-dive-2-database-management--performance-handling)
5. [🔑 Deep-Dive 3: API Keys, Secrets & Environment Variable Management](#-deep-dive-3-api-keys-secrets--environment-variable-management)
6. [🌐 Deep-Dive 4: Unified vs Separated Portals & Cross-Portal Sync](#-deep-dive-4-unified-vs-separated-portals--cross-portal-sync)
7. [🔍 Process-by-Process Commercial Workflow](#-process-by-process-commercial-workflow)
8. [🎯 Top 28 Technical & Project Interview Questions (with Model Answers)](#-top-28-technical--project-interview-questions-with-model-answers)
   - [Category A: Full-Stack Architecture & Next.js 14](#category-a-full-stack-architecture--nextjs-14)
   - [Category B: Authentication, Security & RBAC](#category-b-authentication-security--rbac)
   - [Category C: Database, Prisma ORM & PostgreSQL](#category-c-database-prisma-orm--postgresql)
   - [Category D: Commercial Business Logic & System Design](#category-d-commercial-business-logic--system-design)
   - [Category E: Error Handling, Secrets & Deployment](#category-e-error-handling-secrets--deployment)
   - [Category F: Multi-Portal Architecture & Data Synchronization](#category-f-multi-portal-architecture--data-synchronization)

---

## 🧭 High-Level Architecture Flow

```text
[ Browser / Mobile Client ]
            │
            ▼  (HTTPS Requests carrying httpOnly JWT Cookie)
┌─────────────────────────────────────────────────────────┐
│ Next.js 14 Middleware (middleware.ts)                   │
│  - Intercepts requests before reaching page / API       │
│  - Verifies JWT Signature via 'jose' (HS256)            │
│  - Enforces Role-Based Access Control (RBAC)            │
└───────────────────────────┬─────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│ Frontend UI Components  │     │ Backend Route Handlers  │
│ (React 18 + Tailwind)   │     │ (src/app/api/* - 85 API)│
│ - 8 Staff Role Dashboards│    │ - Zod Request Validation│
│ - Customer Self-Service │     │ - Commercial ERP Logic  │
│ - Live 6-Bay Tracker    │     │ - Bcrypt Password Hash  │
└─────────────────────────┘     └───────────┬─────────────┘
                                            │
                                            ▼
                                ┌─────────────────────────┐
                                │ Prisma ORM 5.22         │
                                │ (Global Singleton)      │
                                └───────────┬─────────────┘
                                            │
                                            ▼  (Encrypted TLS via Connection Pooler)
                                ┌─────────────────────────┐
                                │ Supabase PostgreSQL 15  │
                                │ (25+ Relational Tables) │
                                └─────────────────────────┘
```

---

## 🛠️ Complete Technology Matrix (What is Used for What)

| # | Technology / Library | Category | What it does in this project | Why it was chosen |
|---|---|---|---|---|
| **1** | **Next.js 14 (App Router)** | Full-Stack Framework | Acts as the unified backbone for the whole application. Handles server-side rendering (SSR), static generation (SSG), client routing, and all **85 backend API endpoints** (`src/app/api/*`). | Eliminates separate Express/Django servers; provides native middleware, API routes, and optimized image/font pipelines in a single codebase. |
| **2** | **React 18** | UI Library | Builds interactive user interfaces, forms, modals, tabs, and reactive components using hooks (`useState`, `useEffect`, `useRouter`, `useCallback`). | Declarative component model with fast virtual DOM rendering and rich ecosystem. |
| **3** | **TypeScript 5.7** | Programming Language | Provides static typing across all frontend components, backend routes, database models, and API request/response payloads. | Prevents runtime bugs, typos, and type mismatches before code runs (`npx tsc --noEmit` = 0 errors). |
| **4** | **Tailwind CSS 3.4** | Styling & UI Design | Styles every page and component using utility classes. Configured with Hero MotoCorp brand colors (`Hero Red: #E53935`, `Carbon Slate: #0F172A`), dark mode, glassmorphism, and responsive layouts. | Extremely fast UI development with zero CSS bloat in production bundles. |
| **5** | **PostgreSQL (Supabase)** | Cloud SQL Database | Stores all persistent dealership records: 82+ users, branches, customers, vehicles, leads, bookings, job cards, GST invoices, inventory VINs, and audit logs. | ACID-compliant, highly reliable, scalable enterprise relational database hosted on AWS Mumbai (`ap-south-1`). |
| **6** | **Prisma ORM 5.22** | Database ORM | Translates TypeScript code into optimized SQL queries. Manages database schema migrations (`prisma/schema.prisma`), database seeding (`prisma/seed.ts`), and provides auto-generated type-safe database client (`prisma.*`). | Eliminates raw SQL syntax errors, prevents SQL injection attacks, and provides auto-complete for database queries in VS Code. |
| **7** | **Zod 3.24** | Schema & Input Validation | Validates incoming API request data (e.g. login forms, booking approvals, quotation pricing, vehicle VINs, payment amounts) before any database write. | Ensures corrupt or malicious input is rejected with clear error messages before touching the database. |
| **8** | **`jose` (JWT)** | Cryptographic Tokens | Creates, signs (HMAC-SHA256), and verifies JSON Web Tokens (JWT) for user and customer sessions stored in secure `httpOnly` cookies. | Lightweight, modern, edge-compatible cryptography library that works seamlessly in Next.js Edge Middleware. |
| **9** | **`bcryptjs`** | Password Encryption | Hashes staff and admin passwords using 10 cryptographic salt rounds before saving to database; verifies hashed passwords on login. | Irreversible one-way cryptographic hashing ensuring passwords are never stored in plain text. |
| **10** | **Lucide React** | Icon System | Provides scalable vector icons across all navigation sidebars, action buttons, status pills, and live workshop trackers (e.g. `Bike`, `Wrench`, `ShieldCheck`, `TrendingUp`, `Bell`). | Modern, consistent, lightweight SVG icon set designed for React. |
| **11** | **CVA (`class-variance-authority`) & `tailwind-merge`** | CSS Utility Helpers | Powers reusable UI component variants (e.g. Button `primary`, `outline`, `ghost`, `danger`) and merges conflicting Tailwind classes safely (`cn()` helper). | Keeps UI components modular, clean, and reusable without class clash issues. |
| **12** | **`date-fns 4.1`** | Date & Time Utilities | Formats dates for invoices (`16 May 2024`), calculates relative time (`3 hours ago`), tracks overdue follow-ups, and schedules loan EMI dues. | Lightweight, modular alternative to Moment.js with tree-shaking support. |

---

## 🔐 Deep-Dive 1: Role-Based Authentication & Authorization (RBAC)

### 1. The 8 Dealership Roles & Permissions Matrix
The system enforces strict Role-Based Access Control (RBAC) across 8 distinct staff roles:

```text
├── ADMIN (Franchise Owner / Dealership Principal) -> Full Cross-Branch Access
├── SHOWROOM_MANAGER                                -> Branch Approvals, Sales Targets, VIN Allocations
├── SALES_EXECUTIVE                                 -> Leads, On-Road Quotations, Deliveries, PDI
├── FRONT_DESK                                      -> Walk-in Registry, Visitor Intake, Inquiries
├── SERVICE_MANAGER                                 -> 6-Bay Workshop Tracker, Technician Allocation
├── SERVICE_ADVISOR                                 -> Job Cards, Customer Complaints, 7-Point QC Inspection
├── ACCOUNTANT                                      -> GST Invoicing, Multi-Mode Payments, Loan Disbursal
└── INVENTORY_MANAGER                               -> Consignment Inward, Spare Parts, Stock Transfers
```

### 2. Why `httpOnly` Cookies Over `localStorage`?
- **The Problem with `localStorage`**: Tokens stored in browser `localStorage` can be read by any JavaScript running on the page. If the application has a Cross-Site Scripting (XSS) vulnerability or malicious third-party script, attackers can steal the JWT token and impersonate users.
- **Our Implementation**: We store the JWT token in an **`httpOnly: true`**, **`SameSite: Lax`**, **`Secure: true`** cookie named `shreeji_hero_session`. Browser JavaScript **cannot** access this cookie, making XSS token theft impossible.

### 3. Server-Side Verification (Zero Trust)
Client-side role claims are never trusted blindly:
1. In `src/lib/auth/server.ts`, the helper `verifySessionToken()` decodes the JWT and validates the cryptographic HMAC signature against `process.env.JWT_SECRET`.
2. For privileged actions (approving loans, modifying employee status, deleting records), the backend queries Supabase PostgreSQL to verify the user's current database `role` and `isActive: true` status.
3. If an employee is deactivated in the database, their session is immediately rejected on the very next request.

### 4. Customer Portal Session Isolation & IDOR Defense
- Customers sign in with their mobile number + OTP on `/portal/login`.
- Upon verification, their JWT session has `isCustomer: true` and `role: CUSTOMER`.
- **Insecure Direct Object Reference (IDOR) Defense**: When a customer requests vehicle details or invoice downloads (`/api/customer/invoices`), the server checks:
  ```typescript
  if (invoice.customerId !== session.customerId) {
    return NextResponse.json({ error: 'Access Denied' }, { status: 403 });
  }
  ```
  Customer A can **never** view or tamper with Customer B's vehicles, estimates, or invoices.

---

## 🗄️ Deep-Dive 2: Database Management & Performance Handling

### 1. Supabase PostgreSQL Architecture
We connect to a hosted PostgreSQL 15 instance on Supabase (AWS Asia Pacific - Mumbai region `aws-0-ap-south-1`).

### 2. Dual Connection Strategy (Transaction Pooler vs Direct Migration)
In high-concurrency serverless environments (like Next.js on Vercel), opening direct PostgreSQL connections for every API request causes connection exhaustion (`Too many connections`).

To solve this, our configuration in `.env.local` and `prisma/schema.prisma` uses **two distinct URLs**:

1. **`DATABASE_URL` (Port 6543 - PgBouncer Transaction Pooler)**:
   - `postgresql://postgres.xxx:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true`
   - Used by application API routes at runtime.
   - Reuses a small pool of database connections across hundreds of concurrent Next.js requests.
2. **`DIRECT_URL` (Port 5432 - Direct Session Connection)**:
   - `postgresql://postgres.xxx:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres`
   - Used only for schema migrations and DDL commands (`npx prisma db push`).
   - PgBouncer does not support schema lock queries, so `DIRECT_URL` bypasses PgBouncer for migrations.

### 3. Global Prisma Singleton Pattern
In Next.js development mode, Hot Module Replacement (HMR) re-executes code files on every save. If not handled properly, each reload creates a new `PrismaClient` instance, exhausting database connections in minutes.

We solved this in `src/lib/prisma.ts` using the global singleton pattern:
```typescript
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### 4. Database Schema Structure (25+ Entities)
The schema models full dealership operations with relational integrity:
- **Tenancy**: `Branch` ➔ `User`, `VehicleUnit`, `Invoice`, `JobCard`
- **Sales Flow**: `Lead` ➔ `Quotation` ➔ `Booking` ➔ `VehicleUnit` ➔ `PDIChecklist` ➔ `Delivery`
- **Service Flow**: `CustomerVehicle` ➔ `JobCard` ➔ `JobCardItem` ➔ `Invoice` ➔ `Payment`
- **Inventory**: `VehicleUnit` (unique VIN & Chassis), `SparePart`, `StockMovement`

---

## 🔑 Deep-Dive 3: API Keys, Secrets & Environment Variable Management

### 1. Environment Variable Architecture
Next.js supports multiple `.env` files with strict precedence:
1. `.env.local` (Local overrides & secrets — **HIGHEST PRECEDENCE**, ignored in `.gitignore`)
2. `.env.production` / `.env.development` (Environment-specific defaults)
3. `.env` (Baseline defaults across all environments)

### 2. Client vs Server Secrets (`NEXT_PUBLIC_` Prefix)
- Variables without prefix (e.g. `DATABASE_URL`, `JWT_SECRET`, `DIRECT_URL`) are **strictly server-only**. Next.js strips them from browser bundles.
- Only variables prefixed with `NEXT_PUBLIC_` (e.g. `NEXT_PUBLIC_APP_NAME`) are embedded into the client-side JavaScript bundle for UI display.

### 3. Password URL-Encoding in Connection Strings
Special characters in database passwords break connection string URI parsers:
- An `@` symbol in the password (e.g., `Shreeji@2026`) confuses the parser between `username:password` and `@host`.
- **Solution**: URL-encode special characters in the password (e.g., `@` becomes `%40`, `#` becomes `%23`).

### 4. Audit Log Data Scrubbing
In `src/lib/audit.ts`, when recording administrative actions:
```typescript
const SENSITIVE_KEYS = ['password', 'hash', 'token', 'secret', 'otp'];
// Automatically redacts sensitive fields before persisting to Supabase AuditLog table
```

### 5. Production Error Sanitization
In all 85 API catch blocks, error messages are sanitized:
- In `development`: Full error message is logged for debugging.
- In `production`: Returns generic `{ error: "Internal Server Error" }` with `500` status to prevent leaking database hostnames, table structures, or system paths.

---

## 🌐 Deep-Dive 4: Unified vs Separated Portals & Cross-Portal Sync

### 1. Why Keep a Single Unified Landing Page (`/`)?
In our current architecture, both the **Customer Self-Service Portal** and the **Internal Showroom ERP** share the main showroom landing page (`/`). This design was chosen for four key strategic reasons:

1. **Unified Brand Authority & SEO**: Having one authoritative domain (e.g. `shreejihero.com`) consolidates Google SEO ranking, dealership trust, customer bike catalogue exploration, and service booking on a single domain.
2. **Single Monorepo / Unified Full-Stack Pipeline**: Both portals share the exact same Prisma database models, Zod validation schemas, and utility functions (`formatINR`, date calculations). One single build and deployment (`npm run build`) deploys the entire ecosystem.
3. **Frictionless Customer & Employee Onboarding**: New visitors can immediately explore bikes and click **"My Hero Portal"** to sign in with OTP, while authorized dealership staff click **"Employee Login"** to access role-protected ERP dashboards.
4. **Zero-Latency Shared Session Infrastructure**: Next.js Edge Middleware dynamically routes and guards users based on token type (`isCustomer` vs `role: ADMIN/MANAGER/SALES`), preventing cross-contamination while sharing the same high-speed edge compute.

---

### 2. How to Separate into Independent Portals / Subdomains
If an enterprise dealership wants to split this into completely independent websites or subdomains:

```text
               ┌────────────────────────────────────────────────────────┐
               │          Shared Supabase PostgreSQL 15 Database         │
               │   (Tables: Customer, Lead, Booking, JobCard, Invoice)  │
               └───────────────────────────┬────────────────────────────┘
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    ▼                                             ▼
┌───────────────────────────────────────┐     ┌───────────────────────────────────────┐
│     Customer Web & Mobile App         │     │         Showroom Staff ERP            │
│   (https://my.shreejihero.com)        │     │      (https://erp.shreejihero.com)    │
│  - Customer OTP Authentication        │     │  - Strict 8-Role Staff RBAC Login     │
│  - Bike Garage & Warranty             │     │  - 6-Bay Live Workshop Bay Tracker    │
│  - Service Booking Request Intake     │     │  - Token Booking Approvals & VIN Inward│
│  - Estimate One-Click Approvals       │     │  - GST Invoicing & Payment Collection │
└───────────────────────────────────────┘     └───────────────────────────────────────┘
```

There are two industry-standard ways to achieve this:

#### Option A: Subdomain Routing via Next.js Middleware (Recommended)
- **Customer Portal**: `https://my.shreejihero.com`
- **Staff ERP**: `https://erp.shreejihero.com`
- In `middleware.ts`, we inspect the `request.headers.get('host')`:
  ```typescript
  const host = req.headers.get('host');
  if (host === 'my.shreejihero.com') {
    return NextResponse.rewrite(new URL('/portal' + req.nextUrl.pathname, req.url));
  }
  if (host === 'erp.shreejihero.com') {
    return NextResponse.rewrite(new URL('/dashboard' + req.nextUrl.pathname, req.url));
  }
  ```
- **Benefit**: Retains single deployment and shared code while presenting separate, clean subdomains to the outside world.

#### Option B: Two Completely Decoupled Applications (Micro-Frontends)
- **App 1 (Customer Portal)**: Built in Next.js or React Native (Mobile App for Android & iOS).
- **App 2 (Dealership ERP)**: Built as a desktop-first Next.js web application.
- Both apps connect to the same central **Supabase PostgreSQL database** or a shared REST API gateway.

---

### 3. How Real-Time Data Synchronization Works Between Portals

When a customer submits a service booking or quotation request on their mobile phone, how does it instantly appear on the Showroom Manager's screen?

```text
[ Customer submits Service Booking on Mobile Portal ]
                       │
                       ▼ (POST /api/customer/service/bookings)
[ Next.js API writes to PostgreSQL `JobCard` Table with status: 'PENDING_APPROVAL' ]
                       │
         ┌─────────────┴─────────────┐
         ▼                           ▼
[ 1. PostgreSQL Trigger / Realtime ] [ 2. Audit & Notification Store ]
  Supabase CDC (Change Data Capture)    Creates `Notification` row for
  broadcasts WebSocket event.           assigned Branch Service Advisor.
         │                                   │
         ▼                                   ▼
[ Service Manager Dashboard ]         [ TopHeader Live Bell Icon ]
  Auto-updates the 6-bay queue          Shows red badge "(1) New Service Request"
  in real-time without browser refresh! with sound / visual alert.
```

1. **Shared PostgreSQL State**: Both portals query the same authoritative tables (`JobCard`, `Lead`, `Booking`).
2. **Instant Status Progression**:
   - Customer submits request ➔ `status = PENDING_SERVICE`.
   - Service Manager accepts ➔ `status = IN_SERVICE` and assigns Bay 2.
   - Customer mobile screen instantly reflects: *"Your bike is in Bay 2 with Technician Rajesh"*.
   - Technician requests extra brake shoe replacement ➔ Customer phone shows *"Estimate Approval Needed: ₹450"*.
   - Customer taps **"Approve"** ➔ Technician dashboard changes to **"Approved by Customer - Proceed to Requisition"**.

---

## 🔍 Process-by-Process Commercial Workflow

### 1. Lead-to-Delivery Sales Pipeline
```text
[Walk-in / Online Lead]
        │
        ▼ (Front Desk logs customer & bike interest)
[Lead Qualified: HOT / WARM / COLD]
        │
        ▼ (Sales Executive builds pricing quotation)
[On-Road Quotation Generated]
  = Ex-Showroom + RTO + Insurance + Accessories - Discount
        │
        ▼ (Customer pays token booking amount)
[Booking Created: PENDING_APPROVAL]
        │
        ▼ (Showroom Manager reviews & approves)
[Booking APPROVED]
        │
        ▼ (Inventory Manager allocates physical VIN unit)
[Physical VIN & Chassis Allocated]
        │
        ▼ (Service Advisor completes 12-point Pre-Delivery Inspection)
[12-Point PDI Verified]
        │
        ▼ (Accountant verifies payment receipt & GST invoice)
[GST Invoice Paid] ➔ [Vehicle Delivered to Customer]
```

### 2. Workshop 6-Bay Service Lifecycle
```text
[Customer Bike Check-In]
        │
        ▼ (Service Advisor logs complaints & odometer reading)
[Job Card Generated: #JC-8901]
        │
        ▼ (Assigned to Workshop Bay 1-6 & Technician)
[BAY IN_SERVICE]
        │
        ▼ (Technician identifies extra worn parts)
[Additional Estimate Sent to Customer Mobile Portal]
        │
        ▼ (Customer clicks 'Approve' on phone)
[Estimate Approved] ➔ [Spare Parts Requisitioned from Store]
        │
        ▼ (Technician completes repairs)
[7-Point Quality Check (QC Inspection)]
        │
        ▼ (Washing & Final Polish)
[READY_FOR_DELIVERY] ➔ [Gate Pass Issued & Customer Handover]
```

---

## 🎯 Top 25 Technical & Project Interview Questions (with Model Answers)

---

### Category A: Full-Stack Architecture & Next.js 14

#### Q1: Why did you choose Next.js 14 App Router instead of a separate React frontend + Express/Node.js backend?
> **Answer**:  
> "Using Next.js 14 App Router unified our entire stack into a single TypeScript codebase. It eliminated the latency and CORS configuration overhead of maintaining two separate servers. With App Router, we get Server Components for instantaneous first-page rendering and SEO, Next.js Edge Middleware for centralized auth gatekeeping, and Route Handlers (`src/app/api/*`) for all 85 REST API endpoints—all sharing the exact same TypeScript types and Zod validation schemas."

#### Q2: What is the difference between Server Components and Client Components in your project?
> **Answer**:  
> "In our project, pages default to Server Components for fast server-side data fetching and rendering with zero client-side JavaScript bundle overhead. We only add the `'use client'` directive to interactive components that manage state (`useState`), listen to events (`onClick`, `onChange`), access browser APIs, or trigger modals and toasts."

#### Q3: How do you handle code sharing and type safety across frontend and backend?
> **Answer**:  
> "We define all domain models, enums (e.g. `Role`, `BookingStatus`, `JobCardStatus`), and API response types in `src/types/index.ts`. Both our backend API routes and frontend UI components import the exact same types. If a database column or API response field changes, TypeScript compiler (`npx tsc --noEmit`) immediately flags all affected frontend components across the entire project."

---

### Category B: Authentication, Security & RBAC

#### Q4: How is Role-Based Access Control (RBAC) implemented and enforced?
> **Answer**:  
> "We enforce a zero-trust multi-tier security model:
> 1. **Edge Middleware (`middleware.ts`)**: Intercepts every incoming request, validates the JWT session cookie using `jose`, and blocks unauthorized route access.
> 2. **Server-Side API Route Guards (`src/lib/auth/server.ts`)**: In every API route, `verifySessionToken()` checks that the requesting user's database role has explicit permission for the requested action (e.g. only `ADMIN` and `SHOWROOM_MANAGER` can approve bookings).
> 3. **UI Navigation Filtering (`src/components/layout/Sidebar.tsx`)**: The frontend sidebar renders only the navigation links permitted for the user's specific role."

#### Q5: Why did you use `httpOnly` cookies for JWT storage instead of `localStorage`?
> **Answer**:  
> "`localStorage` is fully accessible to JavaScript, making it vulnerable to token theft via Cross-Site Scripting (XSS). By storing our JWT in an `httpOnly: true`, `SameSite: Lax`, `Secure: true` cookie, browser scripts cannot read the token, effectively immunizing our session tokens against XSS exfiltration."

#### Q6: How do you protect passwords in your database?
> **Answer**:  
> "We never store plaintext passwords. We use `bcryptjs` with 10 cryptographic salt rounds. When a user logs in, `bcrypt.compare()` verifies the candidate password against the stored bcrypt hash using constant-time comparison to prevent timing attacks."

#### Q7: What is IDOR and how did you prevent it in the Customer Portal?
> **Answer**:  
> "IDOR (Insecure Direct Object Reference) occurs when an application exposes a database record by ID (e.g. `/api/customer/invoices?id=inv_123`) without verifying ownership. We prevent IDOR by cryptographically extracting the authenticated `customerId` from the verified JWT cookie and ensuring all database queries filter strictly by `where: { id, customerId: session.customerId }`. Even if a malicious user guesses another customer's invoice ID, the query returns 404 or 403."

#### Q8: What happens if an employee's account is deactivated while they have an active session?
> **Answer**:  
> "For all state-mutating operations (approvals, payments, staff provisioning), our backend checks the database to confirm `isActive: true`. If an admin deactivates an employee in the database, the employee's very next API request will be rejected with `401 Unauthorized`, and their session cookie will be cleared."

---

### Category C: Database, Prisma ORM & PostgreSQL

#### Q9: Why did you choose Supabase PostgreSQL and Prisma ORM?
> **Answer**:  
> "Supabase gives us a managed, enterprise-grade PostgreSQL 15 database hosted in the AWS Mumbai region with high availability and automated backups. Prisma ORM provides 100% type-safe SQL queries, automated migration management via `prisma/schema.prisma`, and prevents SQL injection vulnerabilities by using parameterized queries under the hood."

#### Q10: Why do you have two database URLs (`DATABASE_URL` and `DIRECT_URL`)?
> **Answer**:  
> "`DATABASE_URL` connects through PgBouncer on port `6543` in transaction pooling mode. This allows thousands of serverless Next.js API calls to share a small pool of database connections without connection exhaustion. However, schema migrations (`prisma db push`) require direct session-level DDL execution, so `DIRECT_URL` connects directly to PostgreSQL on port `5432`."

#### Q11: How do you prevent database connection leaks during local Next.js development?
> **Answer**:  
> "During development, Next.js Hot Module Reloading clears Node modules on save, which would instantiate new `PrismaClient` instances and exhaust database connections. We implemented the global singleton pattern in `src/lib/prisma.ts` by caching the Prisma instance on `globalThis`, ensuring only a single connection pool is maintained across HMR cycles."

#### Q12: How do you handle database seeding and baseline data?
> **Answer**:  
> "We maintain an automated seed script (`prisma/seed.ts`). It uses `upsert` queries to idempotently seed the 3 authorized dealership branches (`SHR-HLV`, `SHR-DHN`, `SHR-JTP`) and the initial Super Admin account with a pre-hashed Bcrypt password."

---

### Category D: Commercial Business Logic & System Design

#### Q13: How does the on-road vehicle pricing engine work?
> **Answer**:  
> "The pricing engine in `src/lib/utils.ts` dynamically calculates the full commercial breakdown:
> - Base: `ExShowroomPrice`
> - Government Taxes: `RTOCharges` (based on state road tax slabs)
> - Mandatory Comprehensive Insurance: `InsuranceCharges`
> - Dealership Packages: `AccessoriesCharges`
> - Dealership Discounts: `Discount`
> - Total On-Road Price: `(ExShowroom + RTO + Insurance + Accessories) - Discount`
> It also breaks down GST into CGST (9%) and SGST (9%) for tax invoices."

#### Q14: How does your system prevent duplicate vehicle inventory (duplicate VINs)?
> **Answer**:  
> "Every physical Hero motorcycle has a unique 17-character VIN (Vehicle Identification Number) and Engine Number. In our Prisma schema, the `vin` and `engineNumber` columns have `@unique` database constraints. Additionally, our inward stock movement API validates incoming VINs before insertion; duplicate VIN entries are immediately rejected with a `409 Conflict` error."

#### Q15: How does the Live 6-Bay Workshop Tracker work?
> **Answer**:  
> "The workshop dashboard tracks 6 physical service bays. Each bay is associated with an active `JobCard` and assigned technician. As the motorcycle moves through service stages (`CHECKED_IN` ➔ `IN_SERVICE` ➔ `QC_INSPECTION` ➔ `WASHING` ➔ `READY_FOR_DELIVERY`), the status updates in PostgreSQL and reflects across both the Service Manager dashboard and the customer's self-service portal."

#### Q16: How does the Customer Portal handle additional service estimate approvals?
> **Answer**:  
> "When a workshop technician discovers additional worn parts (e.g. brake shoes or chain sprocket), the Service Advisor adds estimate line items with status `PENDING_CUSTOMER_APPROVAL`. The customer receives a notification on their mobile portal, where they can review the itemized cost and click 'Approve' or 'Reject'. Once approved, the job card updates to allow spare parts requisition."

#### Q17: How is multi-branch tenancy structured?
> **Answer**:  
> "All primary tables (`User`, `Customer`, `Booking`, `Invoice`, `JobCard`, `VehicleUnit`) contain a `branchId` foreign key referencing the `Branch` table. Dealership staff can only view and mutate records belonging to their assigned branch. Only the Franchise Principal (`ADMIN`) has cross-branch override permissions with a dynamic branch switcher."

---

### Category E: Error Handling, Secrets & Deployment

#### Q18: How do you manage API keys and secrets securely?
> **Answer**:  
> "All secrets (`DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `AUTH_SECRET`) are stored in `.env.local`, which is strictly excluded from Git via `.gitignore`. We never commit `.env` files containing production credentials. In code, secrets are accessed exclusively in server-side functions and never prefixed with `NEXT_PUBLIC_`."

#### Q19: How do you handle special characters like `@` or `#` in database passwords?
> **Answer**:  
> "Database connection strings follow standard URI syntax (`postgresql://user:password@host:port/db`). If a password contains an `@` symbol, URI parsers mistakenly interpret it as the host delimiter. We resolve this by percent-encoding special characters in the connection string (e.g., `@` is written as `%40`, `#` as `%23`)."

#### Q20: How are errors logged and handled in production?
> **Answer**:  
> "We implement centralized try-catch blocks across all 85 API routes. Internal database errors and stack traces are logged on the server for forensic debugging, but the HTTP response returned to the client is sanitized (e.g. `{ success: false, error: 'Unable to process transaction' }` with standard HTTP status codes 400, 401, 403, 404, 409, 500) to prevent information disclosure."

#### Q21: What is the Audit Log system and how does it protect sensitive data?
> **Answer**:  
> "Our audit logging system (`src/lib/audit.ts`) records all high-impact actions (user logins, role changes, discount approvals, payment collections, job card deliveries) with actor details, branch, timestamp, and IP address. Before saving to the `AuditLog` table, a data sanitizer automatically scrubs fields like `password`, `hash`, `token`, and `otp` to ensure no plain credentials ever appear in audit records."

#### Q22: How do you ensure high performance and fast page load times?
> **Answer**:  
> "We optimize performance across multiple layers:
> 1. **Next.js Route Optimization**: Static generation (SSG) for public landing pages and fast SSR for dynamic ERP dashboards.
> 2. **Prisma Selective Querying**: We select only the necessary columns (`select: { id: true, name: true }`) instead of fetching entire bloated entity trees.
> 3. **Connection Pooling**: PgBouncer transaction pooling eliminates connection handshake latency on repeated database queries.
> 4. **Tailwind CSS Purging**: Unused CSS is eliminated at build time, resulting in sub-35KB total CSS bundles."

#### Q23: How do you deploy this full-stack application to production?
> **Answer**:  
> "1. We connect the GitHub repository to **Vercel** (or an AWS/Docker VPS).
> 2. We configure production environment variables (`DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `NODE_ENV=production`) in Vercel project settings.
> 3. We run `npx prisma db push` against the live Supabase PostgreSQL database to ensure all 25+ tables and indexes are created.
> 4. `npm run build` compiles all 85+ routes into optimized production bundles with 100% type safety verification."

#### Q24: What automated test suites did you implement to verify project readiness?
> **Answer**:  
> "We built end-to-end automated test suites in Node.js totaling **287 passing test assertions**:
> - `test_phase23_postgres_runtime.js`: Verifies live Supabase PostgreSQL queries, transactions, and relational integrity.
> - `test_security.js` & `test_customer_security.js`: Validates RBAC permission matrix, token tampering rejection, and IDOR customer isolation.
> - `test_end_to_end_integration.js`: Tests the complete commercial workflow from lead creation to quotation, booking, invoicing, and service handover.
> - `npx tsc --noEmit`: Verifies 100% strict TypeScript compilation with 0 type errors."

#### Q25: If you had another 2 weeks, what future enhancements would you add?
> **Answer**:  
> "1. **Real-time WebSockets**: Implement Supabase Realtime / WebSockets for instantaneous workshop bay status updates without HTTP polling.
> 2. **WhatsApp Business Cloud API**: Automated vehicle service reminder messages, digital invoice PDFs, and pickup OTP delivery directly to customer WhatsApp.
> 3. **Payment Gateway Integration**: Direct Razorpay / UPI QR code generation on counter invoices with webhook reconciliation.
> 4. **AI-Powered Inventory Forecasting**: Predictive machine learning to forecast fast-moving spare parts and seasonal bike demand based on historical sales."

---

### Category F: Multi-Portal Architecture & Data Synchronization

#### Q26: Why did you keep both the Customer Portal and Showroom ERP accessible from a single unified landing page instead of creating two completely separate websites?
> **Answer**:  
> "We kept a unified entry point on `shreejihero.com` for four key architectural advantages:
> 1. **Brand Authority & SEO**: Having one public domain consolidates dealership credibility, organic search rankings, and makes it easy for bike buyers to browse the catalogue and access their vehicle garage without memorizing multiple URLs.
> 2. **Shared Codebase & Zero Duplication**: Both portals share the exact same Prisma database models, Zod validation schemas, and currency/date formatting utilities in a unified Next.js 14 monorepo.
> 3. **Edge Middleware Gatekeeping**: Next.js Edge Middleware dynamically inspects the user's cryptographic JWT cookie and enforces strict isolation—routing verified employees to their role-locked `/dashboard` and customers to `/portal`, while completely blocking cross-access.
> 4. **Simplified DevOps & Deployment**: A single `git push` updates and verifies the entire full-stack ecosystem with one unified CI/CD pipeline."

#### Q27: Is it possible to separate the Customer Portal and Showroom ERP into two completely independent websites/subdomains, and how would you architect it?
> **Answer**:  
> "Yes, absolutely. There are two primary architectural patterns to decouple them:
> 1. **Subdomain Rewrite Pattern (Next.js Multi-Zone)**: We configure `my.shreejihero.com` for customers and `erp.shreejihero.com` for staff. Next.js Edge Middleware intercepts the HTTP `Host` header and rewrites incoming requests to `/portal` or `/dashboard` under the hood while preserving separate subdomains in the user's browser.
> 2. **Decoupled Micro-Frontend Architecture**: We can spin up two completely distinct repositories/deployments—for instance, a Flutter/React Native mobile app for customers and a desktop-first Next.js web application for showroom staff. Both independent applications connect to the same central **Supabase PostgreSQL database** via our shared REST API layer."

#### Q28: When a customer submits a service booking or enquiry on the Customer Portal, how does it instantly appear and synchronize with the Showroom ERP portal?
> **Answer**:  
> "Data synchronization operates through a shared PostgreSQL data layer with event-driven notifications:
> 1. **Atomic Database Write**: When a customer books a service on the mobile portal, a POST request to `/api/customer/service/bookings` creates a new row in the `JobCard` table with `status: 'PENDING_APPROVAL'`.
> 2. **Change Data Capture (CDC) & WebSockets**: Supabase Realtime listens to PostgreSQL write-ahead logs (WAL) and instantly broadcasts a WebSocket event to the Showroom Manager's active browser session.
> 3. **Live State Mutation**: The Showroom Service Manager's 6-bay dashboard dynamically receives the event and updates the pending queue without requiring a manual page refresh.
> 4. **Bi-Directional Feedback Loop**: When the Service Advisor assigns a technician or requests an additional repair estimate, the status change is written to PostgreSQL, and the customer's mobile portal immediately updates to display: *'Your bike is currently in Bay 2 with Technician Rajesh - Estimate Approval Needed'*."

