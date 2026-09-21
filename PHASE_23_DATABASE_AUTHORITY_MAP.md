# PHASE 23 — DATABASE AUTHORITY MAP
**Shreeji Hero Showroom Management System (ERP & Customer Portal)**

---

## 1. COMPREHENSIVE DATA SOURCE CLASSIFICATION MATRIX

| Domain / Entity | Current Local Storage | Production Target | Authoritative Source | Primary Key & Unique Constraints | Prisma Model | Runtime State |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Users / Employees** | `users.json` (Disk File) | PostgreSQL Table `User` | PostgreSQL (`prisma.user`) / Disk File | `id` (PK), `email` (UQ), `employeeCode` (UQ) | `model User` | **MIGRATION READY** |
| **Branches** | `constants.ts` | PostgreSQL Table `Branch` | PostgreSQL (`prisma.branch`) / Static | `id` (PK), `code` (UQ) | `model Branch` | **MIGRATION READY** |
| **Customers** | Memory Repository | PostgreSQL Table `Customer` | PostgreSQL (`prisma.customer`) | `id` (PK), `customerCode` (UQ), `phone` (UQ) | `model Customer` | **MIGRATION READY** |
| **Customer Vehicles** | Memory Repository | PostgreSQL Table `CustomerVehicle` | PostgreSQL (`prisma.customerVehicle`) | `id` (PK), `registrationNumber` (UQ), `vin` (UQ) | `model CustomerVehicle` | **MIGRATION READY** |
| **Leads & Enquiries** | Memory Repository | PostgreSQL Table `Lead` | PostgreSQL (`prisma.lead`) | `id` (PK), `leadCode` (UQ) | `model Lead` | **MIGRATION READY** |
| **Test Rides** | Memory Repository | PostgreSQL Table `TestRide` | PostgreSQL (`prisma.testRide`) | `id` (PK), `rideCode` (UQ) | `model TestRide` | **MIGRATION READY** |
| **Quotations** | Memory Repository | PostgreSQL Table `Quotation` | PostgreSQL (`prisma.quotation`) | `id` (PK), `quotationNumber` (UQ) | `model Quotation` | **MIGRATION READY** |
| **Bookings** | Memory Repository | PostgreSQL Table `Booking` | PostgreSQL (`prisma.booking`) | `id` (PK), `bookingNumber` (UQ) | `model Booking` | **MIGRATION READY** |
| **Vehicle Units (VIN)** | Memory Repository | PostgreSQL Table `VehicleUnit` | PostgreSQL (`prisma.vehicleUnit`) | `id` (PK), `vin` (UQ), `chassisNumber` (UQ), `engineNumber` (UQ) | `model VehicleUnit` | **MIGRATION READY** |
| **PDI Checklists** | Memory Repository | PostgreSQL Table `PDIChecklist` | PostgreSQL (`prisma.pdiChecklist`) | `id` (PK), `bookingId` (FK) | `model PDIChecklist` | **MIGRATION READY** |
| **Vehicle Deliveries** | Memory Repository | PostgreSQL Table `Delivery` | PostgreSQL (`prisma.delivery`) | `id` (PK), `deliveryNumber` (UQ) | `model Delivery` | **MIGRATION READY** |
| **Service Bays** | Memory Repository | PostgreSQL Table `ServiceBay` | PostgreSQL (`prisma.serviceBay`) | `id` (PK), `code` (UQ) | `model ServiceBay` | **MIGRATION READY** |
| **Job Cards** | Memory Repository | PostgreSQL Table `JobCard` | PostgreSQL (`prisma.jobCard`) | `id` (PK), `jobCardNumber` (UQ) | `model JobCard` | **MIGRATION READY** |
| **Invoices** | Memory Repository | PostgreSQL Table `Invoice` | PostgreSQL (`prisma.invoice`) | `id` (PK), `invoiceNumber` (UQ) | `model Invoice` | **MIGRATION READY** |
| **Payments** | Memory Repository | PostgreSQL Table `Payment` | PostgreSQL (`prisma.payment`) | `id` (PK), `receiptNumber` (UQ) | `model Payment` | **MIGRATION READY** |
| **Spare Parts** | Memory Repository | PostgreSQL Table `SparePart` | PostgreSQL (`prisma.sparePart`) | `id` (PK), `partNumber` (UQ) | `model SparePart` | **MIGRATION READY** |
| **Stock Movements** | Memory Repository | PostgreSQL Table `StockMovement` | PostgreSQL (`prisma.stockMovement`) | `id` (PK) | `model StockMovement` | **MIGRATION READY** |
| **Notifications** | Memory Repository | PostgreSQL Table `Notification` | PostgreSQL (`prisma.notification`) | `id` (PK) | `model Notification` | **MIGRATION READY** |
| **Audit Logs** | Sanitized Engine | PostgreSQL Table `AuditLog` | PostgreSQL (`prisma.auditLog`) | `id` (PK) | `model AuditLog` | **MIGRATION READY** |

---

## 2. PRODUCTION RUNTIME INTEGRATION ARCHITECTURE

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                            API ROUTE CONTROLLER                             │
│                  (e.g., /api/auth/login, /api/employees)                    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          AUTHORITATIVE DATA LAYER                           │
│                     (src/lib/db/users-store.ts)                             │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            │                                                     │
            ▼                                                     ▼
┌──────────────────────────────┐              ┌──────────────────────────────┐
│  PRISMA POSTGRESQL RUNTIME   │              │     ATOMIC DISK FALLBACK     │
│   (When DATABASE_URL is set) │              │    (`users.json` on disk)    │
│  - Executes live SQL query   │              │  - Zero mock data            │
│  - Enforces DB constraints   │              │  - Survives process restarts │
│  - Returns real DB model     │              │  - Strict password hashing   │
└──────────────────────────────┘              └──────────────────────────────┘
```

---

## 3. DATA INTEGRITY SAFEGUARDS

1. **Password Security**: Only Bcrypt hashes with 10 salt rounds are stored. Plaintext passwords are NEVER persisted.
2. **Role Authorization**: Selected UI roles are strictly verified against the database record; mismatches return `401 Unauthorized`.
3. **Account Deactivation**: `status: DISABLED` or `SUSPENDED` strictly blocks authentication (`403 Forbidden`).
4. **Duplicate Prevention**: Unique constraints on `email`, `employeeCode`, `phone`, `vin`, and `invoiceNumber` prevent duplicate records.
