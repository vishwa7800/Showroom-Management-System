# PHASE 18 — USER ACCEPTANCE TESTING (UAT) MATRIX
**Shreeji Hero Showroom Management System (ERP & Customer Portal)**

---

## 1. ADMIN / DEALERSHIP OWNER WORKFLOW

| Step | Action Description | Expected Outcome | System State / API Endpoint | Status |
| :--- | :--- | :--- | :--- | :---: |
| 1.1 | **Owner Signup** (`/signup`) | Account registered with `ADMIN` role, active status, bcrypt password hash stored in `users.json` | `POST /api/auth/signup` -> 200 OK, `shreeji_hero_session` cookie issued | **PASS** |
| 1.2 | **Owner Logout** | Session cookie destroyed, `/api/auth/me` returns 401 | `POST /api/auth/logout` -> 200 OK | **PASS** |
| 1.3 | **Owner Re-Login** (`/login`) | Form requires `ADMIN` role selection; authenticates against stored bcrypt hash | `POST /api/auth/login` -> 200 OK, redirected to `/dashboard` | **PASS** |
| 1.4 | **Executive Dashboard** | Displays cross-branch monthly sales (₹48.2L), service revenue (₹12.4L), stock value (₹1.85Cr), and 3-branch KPI cards | `GET /api/reports/overview` -> 200 OK | **PASS** |
| 1.5 | **Staff Onboarding** (`/employees/create`) | Admin creates new employee with assigned role, branch, and credentials | `POST /api/employees` -> 201 Created, employee code generated | **PASS** |
| 1.6 | **Staff List & Status Toggle** (`/employees`) | New employee appears in employee list; Admin can activate/deactivate account | `PATCH /api/employees/[id]/status` -> 200 OK | **PASS** |
| 1.7 | **Dealership & Branch Settings** (`/settings`) | Access official Hero dealer credentials (`HM-GUJ-7721`), GSTIN, branch cards, tax rates, and audit logs | `GET /api/audit-logs` -> 200 OK | **PASS** |
| 1.8 | **Executive Reports & Export** (`/reports`) | View multi-branch performance comparisons and export CSV summaries | `GET /api/reports/export` -> 200 OK | **PASS** |

---

## 2. SALES EXECUTIVE WORKFLOW

| Step | Action Description | Expected Outcome | System State / API Endpoint | Status |
| :--- | :--- | :--- | :--- | :---: |
| 2.1 | **Sales Login** (`/login`) | Authenticates with `SALES_EXECUTIVE` role and branch `br_halvad` | `POST /api/auth/login` -> 200 OK | **PASS** |
| 2.2 | **Sales Dashboard** | Shows monthly target (₹18L), units sold (16/20 = 80%), active leads (24), and scheduled test rides | `GET /api/reports/targets` -> 200 OK | **PASS** |
| 2.3 | **Create Customer** (`/customers`) | Captures name, mobile (`+91 98765 43210`), address, and assigns customer code | `POST /api/customers` -> 201 Created | **PASS** |
| 2.4 | **Create Lead & Follow-Up** (`/leads`) | Captures interested Hero model (`Splendor Plus XTEC`), source, and schedules follow-up | `POST /api/leads` -> 201 Created, `POST /api/follow-ups` -> 201 Created | **PASS** |
| 2.5 | **Schedule & Complete Test Ride** (`/test-rides`) | Assigns demo bike (`GJ-36-TR-101`), records customer feedback and outcome | `POST /api/test-rides` -> 201 Created, `PATCH /api/test-rides/[id]/status` -> 200 OK | **PASS** |
| 2.6 | **Generate Quotation** (`/sales`) | Computes accurate on-road pricing (Ex-Showroom + RTO + Insurance + Accessories - Discount) | `POST /api/quotations` -> 201 Created | **PASS** |
| 2.7 | **Convert Quotation to Booking** | Converts quotation to Booking record with token amount (e.g. ₹5,000) | `POST /api/quotations/[id]/convert` -> 200 OK | **PASS** |
| 2.8 | **Manager Booking Approval** | Showroom Manager approves booking to advance to vehicle allocation | `POST /api/bookings/[id]/approve` -> 200 OK, status `CONFIRMED` | **PASS** |
| 2.9 | **Physical VIN Allocation** | Assigns available chassis number (`MBH4...`); unit marked `BOOKED` | `POST /api/bookings/[id]/allocate` -> 200 OK | **PASS** |
| 2.10 | **12-Point Pre-Delivery Inspection (PDI)** | Service advisor performs 12-point PDI checklist; status set to `PASSED` | `POST /api/bookings/[id]/pdi` -> 200 OK | **PASS** |
| 2.11 | **Payment Clearance & Delivery** | Full balance cleared; Gate pass generated; Unit marked `SOLD`; Handed to customer | `POST /api/bookings/[id]/deliver` -> 200 OK, Booking `DELIVERED` | **PASS** |
| 2.12 | **Customer 360 Verification** (`/customers/[id]`) | Customer profile displays newly purchased vehicle, invoice, and delivery timeline | `GET /api/customers/[id]` -> 200 OK | **PASS** |

---

## 3. FRONT DESK & RECEPTION WORKFLOW

| Step | Action Description | Expected Outcome | System State / API Endpoint | Status |
| :--- | :--- | :--- | :--- | :---: |
| 3.1 | **Front Desk Login** | Log in with `pooja@shreejihero.com` / `FRONT_DESK` role | `POST /api/auth/login` -> 200 OK | **PASS** |
| 3.2 | **Walk-In Registration** (`/leads`) | Captures walk-in guest, interest (New Purchase / Service inquiry), and lounge queue assignment | `POST /api/walk-ins` -> 201 Created | **PASS** |
| 3.3 | **Sales Consultant Assignment** | Assigns walk-in guest to available sales consultant (`Amit Verma`) | `PATCH /api/walk-ins/[id]/status` -> 200 OK | **PASS** |
| 3.4 | **Quick Appointment Booking** | Books test ride or service appointment slot for customer | `POST /api/service/bookings` -> 201 Created | **PASS** |

---

## 4. SERVICE ADVISOR & WORKSHOP MANAGER WORKFLOW

| Step | Action Description | Expected Outcome | System State / API Endpoint | Status |
| :--- | :--- | :--- | :--- | :---: |
| 4.1 | **Service Login** | Authenticate with `SERVICE_ADVISOR` or `SERVICE_MANAGER` role | `POST /api/auth/login` -> 200 OK | **PASS** |
| 4.2 | **Service Booking & Reception** (`/service`) | Vehicle received at reception; fuel level and odometer recorded | `POST /api/service/check-in` -> 201 Created | **PASS** |
| 4.3 | **Job Card Creation** | Generates Job Card (`JC-2026-081`) with customer complaints and estimated cost | `POST /api/service/job-cards` -> 201 Created | **PASS** |
| 4.4 | **Workshop Bay & Technician Assignment** | Assigns vehicle to Bay 2 and technician (`Ramesh Solanki`) | `POST /api/service/job-cards/[id]/assign` -> 200 OK | **PASS** |
| 4.5 | **Additional Work Estimate & Approval** | Technician requests brake pad replacement (₹850); Customer authorizes via portal/phone | `POST /api/service/job-cards/[id]/approval` -> 200 OK, Estimate updated | **PASS** |
| 4.6 | **Work in Progress & Spares Requisition** | Spares deducted from inventory (`SP-BRK-101`); work completed | `POST /api/inventory/spare-parts` -> 200 OK | **PASS** |
| 4.7 | **7-Point Quality Check (QC)** | Quality Inspector tests road readiness, torque, electricals; QC passed | `POST /api/service/job-cards/[id]/qc` -> 200 OK, `READY_FOR_DELIVERY` | **PASS** |
| 4.8 | **Service Invoice & Delivery Handover** | Generates Tax Invoice (`INV-SRV-901`); payment collected; Bay released | `POST /api/service/job-cards/[id]/deliver` -> 200 OK | **PASS** |

---

## 5. ACCOUNTANT & FINANCIAL WORKFLOW

| Step | Action Description | Expected Outcome | System State / API Endpoint | Status |
| :--- | :--- | :--- | :--- | :---: |
| 5.1 | **Accountant Login** | Log in with `neha@shreejihero.com` / `ACCOUNTANT` role | `POST /api/auth/login` -> 200 OK | **PASS** |
| 5.2 | **Invoice Ledger** (`/finance`) | Views pending, partially paid, and paid invoices across branches | `GET /api/finance/invoices` -> 200 OK | **PASS** |
| 5.3 | **Record Partial Payment** | Records partial payment (₹4,000 against ₹10,000 invoice); status `PARTIALLY_PAID`, remaining ₹6,000 | `POST /api/finance/payments` -> 201 Created | **PASS** |
| 5.4 | **Record Final Balance Payment** | Records remaining ₹6,000 payment; invoice marked `PAID`, remaining ₹0 | `POST /api/finance/payments` -> 200 OK, status `PAID` | **PASS** |
| 5.5 | **GST Report Calculation** | Calculates output GST liability (CGST 9% + SGST 9% on 18% services; 14% + 14% on 28% vehicles) | `GET /api/finance/gst` -> 200 OK | **PASS** |
| 5.6 | **Hero FinCorp / Bank Loan Disbursal** | Records loan approval and direct bank disbursement to dealership account | `POST /api/finance/loans/[id]/disburse` -> 200 OK | **PASS** |

---

## 6. INVENTORY & SPARE PARTS WORKFLOW

| Step | Action Description | Expected Outcome | System State / API Endpoint | Status |
| :--- | :--- | :--- | :--- | :---: |
| 6.1 | **Inventory Login** | Log in with `mohit@shreejihero.com` / `INVENTORY_MANAGER` role | `POST /api/auth/login` -> 200 OK | **PASS** |
| 6.2 | **Factory Consignment Inward** (`/inventory`) | Inwards new batch of vehicles with chassis, engine numbers, and color variants | `POST /api/inventory/inward` -> 201 Created | **PASS** |
| 6.3 | **Duplicate VIN Prevention** | Attempting to inward duplicate VIN/chassis is strictly rejected with 400 | `POST /api/inventory/inward` -> 400 Bad Request | **PASS** |
| 6.4 | **Low Stock Threshold Alert** | Stock falling below minimum threshold triggers `LOW_STOCK` banner & notification | `GET /api/inventory/alerts` -> 200 OK | **PASS** |
| 6.5 | **Inter-Branch Stock Transfer** | Initiates transfer from Halvad HQ to Dhangadhra branch; Gate pass generated | `POST /api/inventory/transfers` -> 201 Created, `PATCH .../transfers/[id]` -> 200 OK | **PASS** |

---

## 7. CUSTOMER SELF-SERVICE PORTAL WORKFLOW

| Step | Action Description | Expected Outcome | System State / API Endpoint | Status |
| :--- | :--- | :--- | :--- | :---: |
| 7.1 | **Customer Login** (`/portal/login`) | Phone login (`+91 98765 43210`) with OTP `123456`; issues `customer_session_token` | `POST /api/customer/auth/verify-otp` -> 200 OK | **PASS** |
| 7.2 | **Customer Dashboard** (`/portal`) | Displays registered Hero bikes, active service status, loyalty points, and upcoming reminders | `GET /api/customer/me` -> 200 OK | **PASS** |
| 7.3 | **Book Free/Paid Service** | Schedules appointment slot; appointment immediately visible in ERP Service Queue | `POST /api/customer/service/bookings` -> 201 Created | **PASS** |
| 7.4 | **Approve Additional Workshop Work** | Approves ₹850 repair estimate; ERP Job Card immediately updates estimate | `POST /api/customer/service/[id]/approval` -> 200 OK | **PASS** |
| 7.5 | **View Invoices & EMI Schedule** | Downloads digital GST Tax Invoice and views Hero FinCorp loan breakdown | `GET /api/customer/invoices` -> 200 OK, `GET /api/customer/finance` -> 200 OK | **PASS** |
| 7.6 | **Customer IDOR Isolation** | Attempt to view another customer's invoice or service job is rejected with 403/404 | Cryptographic isolation via `isCustomer: true` token | **PASS** |
| 7.7 | **ERP Route Block** | Customer attempting to access `/dashboard` or `/employees` is redirected to `/portal` | Next.js Middleware restriction enforced | **PASS** |
