# PHASE 18 — DATA & PERSISTENCE AUDIT CLASSIFICATION
**Shreeji Hero Showroom Management System (ERP & Customer Portal)**

---

## 1. DATA AUDIT SUMMARY

This audit classifies all data sources across the ERP codebase to ensure production integrity and eliminate fake UI states.

| Data Category | Classification Type | Location / Store | Purpose & Behavior | Production State |
| :--- | :--- | :--- | :--- | :---: |
| **Dealership Employee Accounts** | **Class B: Live Production Data** | `src/lib/db/data/users.json` | Persistent user accounts (Owner signup + Admin created staff + 8 baseline role accounts) with bcrypt hashes. | **ACTIVE & PERSISTENT** |
| **Hero Motorcycle Catalog** | **Class A: Legitimate Seed Data** | `src/lib/db/mock-data.ts`, `src/lib/db/inventory-store.ts` | Official Hero model lines (Splendor+ XTEC, HF Deluxe, Glamour XTEC, Passion+, Xtreme 125R, Xpulse 200 4V, Destini Prime, Xoom 110). | **PERMANENT MASTER DATA** |
| **Hero Genuine Parts (HGP)** | **Class A: Legitimate Seed Data** | `src/lib/db/inventory-store.ts` | 40+ genuine spare parts with part numbers, category, HSN code, MRP, and reorder levels. | **PERMANENT MASTER DATA** |
| **Dealership Branches** | **Class A: Legitimate Seed Data** | `src/lib/db/mock-data.ts`, `src/app/(erp)/settings/page.tsx` | 3 authorized Gujarat dealership locations: Halvad HQ (3S), Dhangadhra, Jetpur. | **PERMANENT MASTER DATA** |
| **Customer Records** | **Class B: Live Production Data** | `src/lib/db/crm-store.ts` | Live CRM customers created via UI/API with Customer 360 histories. | **LIVE & MUTABLE** |
| **Sales Leads & Follow-ups** | **Class B: Live Production Data** | `src/lib/db/crm-store.ts` | Active customer leads, communication logs, and follow-up schedules. | **LIVE & MUTABLE** |
| **Quotations & Bookings** | **Class B: Live Production Data** | `src/lib/db/sales-store.ts` | On-road pricing quotations, booking tokens, approvals, and deliveries. | **LIVE & MUTABLE** |
| **Workshop Job Cards & QC** | **Class B: Live Production Data** | `src/lib/db/service-store.ts` | Active service job cards, bay assignments, inspection checklists, and QC records. | **LIVE & MUTABLE** |
| **Invoices & GST Payments** | **Class B: Live Production Data** | `src/lib/db/finance-store.ts` | Invoices, payment receipts, partial payments, and GST liability reports. | **LIVE & MUTABLE** |
| **Security Audit Logs** | **Class B: Live Production Data** | `src/lib/audit.ts` | Immutable trail recording actor, action, timestamp, entity, and change diff. | **LIVE & IMMUTABLE** |
| **Empty / Error States** | **Class C: Production UI Feedback** | All ERP UI components | Contextual empty state banners (e.g. "No customers found") with action triggers. | **PRODUCTION READY** |
| **Test Payloads** | **Class D: Automated Test Data** | `test_*.js` test files | Scenarios used exclusively by automated verification suites. | **TESTING ONLY** |

---

## 2. PERSISTENCE VERIFICATION TABLE

| Workflow / Entity | Mutation Mechanism | Storage Layer | Refresh Persistence Verified | Cross-Module Visibility |
| :--- | :--- | :--- | :---: | :---: |
| **Owner Registration** | `POST /api/auth/signup` | `src/lib/db/data/users.json` | **YES** (Survives restart) | Visible in Login, Auth Context, Audit Logs |
| **Employee Creation** | `POST /api/employees` | `src/lib/db/data/users.json` | **YES** (Survives restart) | Visible in `/employees`, Login, Role Navigation |
| **Customer Creation** | `POST /api/customers` | `src/lib/db/crm-store.ts` | **YES** | Visible in Customer 360, Leads, Quotations |
| **Lead Creation** | `POST /api/leads` | `src/lib/db/crm-store.ts` | **YES** | Visible in Sales Pipeline, Customer 360 |
| **Test Ride Booking** | `POST /api/test-rides` | `src/lib/db/crm-store.ts` | **YES** | Visible in Test Rides, Front Desk, Leads |
| **Quotation -> Booking** | `POST /api/quotations/[id]/convert` | `src/lib/db/sales-store.ts` | **YES** | Visible in Sales Bookings, Approval Queue |
| **Booking Approval** | `POST /api/bookings/[id]/approve` | `src/lib/db/sales-store.ts` | **YES** | Visible in Vehicle Allocation Queue |
| **Vehicle Allocation** | `POST /api/bookings/[id]/allocate` | `src/lib/db/sales-store.ts` + `inventory-store.ts` | **YES** | VIN marked `BOOKED` in Inventory |
| **Service Job Card** | `POST /api/service/job-cards` | `src/lib/db/service-store.ts` | **YES** | Visible in Workshop Bays, Customer Portal |
| **Additional Work Approval** | `POST /api/customer/service/[id]/approval` | `src/lib/db/service-store.ts` | **YES** | Estimate updated in ERP Job Card |
| **Invoice Partial Payment** | `POST /api/finance/payments` | `src/lib/db/finance-store.ts` | **YES** | Balance reduced; Status set to `PARTIALLY_PAID` |
| **Delivery Completion** | `POST /api/bookings/[id]/deliver` | `src/lib/db/sales-store.ts` + `crm-store.ts` | **YES** | Unit marked `SOLD`; Registered in Customer 360 |
