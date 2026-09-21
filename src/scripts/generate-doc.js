const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType,
} = require('docx');

async function generateWordDocument() {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Calibri',
            size: 22, // 11pt
            color: '1E293B',
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: [
          // Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: '🏍️ SHREEJI HERO MOTORCORP ERP',
                bold: true,
                size: 36, // 18pt
                color: 'E53935', // Hero Red
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: 'Complete Tech Stack, System Architecture & Interview Master Guide',
                bold: true,
                size: 26, // 13pt
                color: '0F172A', // Slate 900
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 },
            children: [
              new TextRun({
                text: 'Confidential Technical Reference & Project Defense Manual | Multi-Branch Dealership ERP',
                italics: true,
                size: 20,
                color: '64748B',
              }),
            ],
          }),

          // SECTION 1
          createHeading1('1. High-Level Architecture Flow'),
          createParagraph(
            'The Shreeji Hero ERP is an enterprise-grade full-stack system built using Next.js 14 App Router, React 18, TypeScript 5.7, Tailwind CSS, Prisma ORM 5.22, and Supabase PostgreSQL. Below is the end-to-end request lifecycle flow:'
          ),
          createBulletPoint('Client Request: Browser/Mobile submits HTTPS request carrying a secure, httpOnly JWT cookie.'),
          createBulletPoint('Next.js Edge Middleware (middleware.ts): Intercepts request before reaching routes, verifies JWT signature using jose (HS256), and validates Role-Based Access Control (RBAC).'),
          createBulletPoint('Frontend Presentation Layer: React 18 with 8 dedicated staff dashboards and an isolated Customer Self-Service Portal.'),
          createBulletPoint('Backend API Layer: 85 RESTful API Route Handlers (src/app/api/*) with Zod request validation, Bcrypt password encryption, and commercial business logic.'),
          createBulletPoint('Data Persistence Layer: Prisma ORM (Global Singleton) connecting via PgBouncer Transaction Pooler to hosted Supabase PostgreSQL (AWS Mumbai - 25+ relational entities).'),

          // SECTION 2
          createHeading1('2. Complete Technology Stack Matrix'),
          createParagraph('The table below explains which specific technology is responsible for each part of the project:'),
          createTechTable(),

          // SECTION 3
          createHeading1('3. Deep-Dive: Role-Based Authentication & Authorization (RBAC)'),
          createHeading2('The 8 Staff Roles & Permissions Matrix'),
          createBulletPoint('ADMIN (Franchise Owner / Principal): Full cross-branch access, revenue targets, staff provisioning, audit logs.'),
          createBulletPoint('SHOWROOM_MANAGER: Booking approvals, physical VIN allocation, branch targets, inventory oversight.'),
          createBulletPoint('SALES_EXECUTIVE: Customer leads (Hot/Warm/Cold), on-road quotations, test ride scheduling, PDI delivery handovers.'),
          createBulletPoint('FRONT_DESK: Walk-in visitor registry, inquiry tracking, customer intake.'),
          createBulletPoint('SERVICE_MANAGER: 6-Bay live workshop tracker, technician job allocation, service revenue analytics.'),
          createBulletPoint('SERVICE_ADVISOR: Vehicle check-in, job cards, customer complaint logging, 7-point Quality Check (QC).'),
          createBulletPoint('ACCOUNTANT: GST tax invoices (18% CGST/SGST), multi-mode payment receipts, financier loan disbursal.'),
          createBulletPoint('INVENTORY_MANAGER: Consignment inward, duplicate VIN/Chassis safeguards, stock transfers.'),

          createHeading2('Why httpOnly Cookies Over localStorage?'),
          createParagraph(
            'Tokens in localStorage can be stolen via Cross-Site Scripting (XSS). We store the JWT token in an httpOnly: true, SameSite: Lax, Secure: true cookie named shreeji_hero_session. JavaScript cannot access this cookie, completely preventing XSS token theft.'
          ),

          createHeading2('Customer Portal Session Isolation & IDOR Defense'),
          createParagraph(
            'Customers authenticate via phone + OTP with isCustomer: true. Insecure Direct Object Reference (IDOR) is strictly prevented: all database queries verify that requested vehicle or invoice IDs belong strictly to the authenticated customerId.'
          ),

          // SECTION 4
          createHeading1('4. Deep-Dive: Database Management & Performance Handling'),
          createHeading2('Dual-Connection Strategy (Transaction Pooler vs Direct Migration)'),
          createBulletPoint('DATABASE_URL (Port 6543 / PgBouncer Pooler): Used by API routes during runtime. Reuses a small pool of database connections across hundreds of concurrent serverless requests without exhausting database limits.'),
          createBulletPoint('DIRECT_URL (Port 5432 / Direct Session): Used exclusively for schema migrations (npx prisma db push) because DDL schema locking requires session mode.'),
          createBulletPoint('Global Prisma Singleton: Attached to globalThis.prisma in src/lib/prisma.ts to prevent connection leaks during Next.js development hot-reloads.'),

          // SECTION 5
          createHeading1('5. Deep-Dive: API Keys, Secrets & Environment Variables'),
          createBulletPoint('.env.local Precedence: Highest precedence, strictly excluded from Git via .gitignore.'),
          createBulletPoint('NEXT_PUBLIC_* Prefix: Server secrets (DATABASE_URL, JWT_SECRET) are kept strictly private on the server; only NEXT_PUBLIC_ variables are bundled to browser JS.'),
          createBulletPoint('Password URL-Encoding: Special characters like @ in database passwords are URL-encoded as %40 to prevent connection string parsing breakages.'),
          createBulletPoint('Audit Log Data Scrubbing: In src/lib/audit.ts, sensitive fields (password, hash, token, otp) are automatically redacted before database insertion.'),
          createBulletPoint('Production Error Sanitization: API catch blocks return generic sanitized error messages to prevent leaking database hostnames or internal stack traces.'),

          // SECTION 6
          createHeading1('6. Deep-Dive: Unified vs Separated Portals & Cross-Portal Sync'),
          createHeading2('Why Keep a Unified Landing Page?'),
          createParagraph(
            '1. Brand Authority & SEO: Consolidates domain authority on shreejihero.com.\n2. Monorepo Shared Codebase: Both portals share the exact same Prisma models, Zod schemas, and calculation helpers with 0 code duplication.\n3. Edge Middleware Gatekeeping: Automatically routes staff to /dashboard and customers to /portal while preventing cross-access.'
          ),
          createHeading2('Real-Time Cross-Portal Data Sync Flow'),
          createParagraph(
            'When a customer submits a service booking on their mobile portal: (1) API inserts a row in PostgreSQL JobCard table with status: PENDING_APPROVAL. (2) Supabase Realtime Change Data Capture (CDC) broadcasts a WebSocket event to the active showroom dashboard. (3) The Service Manager 6-bay queue updates live without requiring a page refresh. (4) When the advisor requests an extra estimate (e.g. ₹450 for brake shoes), the customer phone displays an interactive approval modal.'
          ),

          // SECTION 7
          createHeading1('7. Top 28 Technical & Project Interview Questions & Answers'),
          ...createInterviewQASection(),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath = path.join(__dirname, '../../Shreeji_Hero_ERP_Tech_Stack_and_Interview_Master_Guide.docx');
  fs.writeFileSync(outPath, buffer);
  console.log('Word Document Generated Successfully at:', outPath);
}

function createHeading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 150 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 28, // 14pt
        color: 'E53935',
      }),
    ],
  });
}

function createHeading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 250, after: 100 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 24, // 12pt
        color: '0F172A',
      }),
    ],
  });
}

function createParagraph(text) {
  return new Paragraph({
    spacing: { after: 150 },
    children: [
      new TextRun({
        text,
        size: 22,
        color: '334155',
      }),
    ],
  });
}

function createBulletPoint(text) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 80 },
    children: [
      new TextRun({
        text,
        size: 22,
        color: '1E293B',
      }),
    ],
  });
}

function createTechTable() {
  const rows = [
    ['Technology', 'Category', 'Exact Role in Project'],
    ['Next.js 14 App Router', 'Full-Stack Framework', 'Handles SSR, SSG, routing, middleware, and all 85 backend API route handlers.'],
    ['React 18', 'Frontend UI Library', 'Interactive component state (useState, useEffect), tabs, forms, and modals.'],
    ['TypeScript 5.7', 'Language & Types', '100% strict end-to-end type safety across database, APIs, and UI components.'],
    ['Tailwind CSS 3.4', 'Styling & Design System', 'Utility styling with custom Hero Red (#E53935), Slate (#0F172A), and dark mode.'],
    ['PostgreSQL (Supabase)', 'Cloud SQL Database', 'Enterprise relational storage for 25+ tables (Users, Bookings, Invoices, Job Cards).'],
    ['Prisma ORM 5.22', 'Database ORM Layer', 'Type-safe SQL queries, schema migrations (prisma db push), and automated seeding.'],
    ['Zod 3.24', 'Validation Library', 'Sanitizes and validates incoming API request payloads before database writes.'],
    ['jose (JWT)', 'Cryptography & Tokens', 'Creates, signs (HS256), and verifies stateless JWT session tokens in httpOnly cookies.'],
    ['bcryptjs', 'Password Encryption', 'Hashes staff passwords using 10 cryptographic salt rounds; verifies login hashes.'],
    ['Lucide React', 'Icon System', 'Modern SVG vector icons for navigation, metrics, bay tracker, and status badges.'],
    ['date-fns 4.1', 'Date Utilities', 'Formats dates for invoices, calculates overdue follow-ups, and computes EMI schedules.'],
    ['Custom utils.ts', 'Business Logic', 'On-road pricing engine (ExShowroom + RTO + Insurance - Discount) and INR currency format.'],
  ];

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map((r, idx) => {
      const isHeader = idx === 0;
      return new TableRow({
        children: r.map((cellText) => {
          return new TableCell({
            width: { size: 33, type: WidthType.PERCENTAGE },
            shading: isHeader ? { fill: '0F172A', type: ShadingType.CLEAR } : { fill: idx % 2 === 0 ? 'F8FAFC' : 'FFFFFF', type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 150, right: 150 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: cellText,
                    bold: isHeader,
                    size: isHeader ? 20 : 19,
                    color: isHeader ? 'FFFFFF' : '1E293B',
                  }),
                ],
              }),
            ],
          });
        }),
      });
    }),
  });
}

function createInterviewQASection() {
  const qaList = [
    {
      q: 'Q1: Why did you choose Next.js 14 App Router instead of separate React + Node.js backend?',
      a: 'Using Next.js 14 unified our stack into a single TypeScript repository. It eliminated CORS latency and dual-deployment overhead while giving us Server Components for fast page load, Edge Middleware for authentication gatekeeping, and Route Handlers for 85 REST APIs with shared types.',
    },
    {
      q: 'Q2: How is Role-Based Access Control (RBAC) enforced on the server?',
      a: 'We enforce zero-trust multi-tier security: (1) Edge Middleware validates the JWT cookie signature before routes load. (2) Server-side API handlers verify user permissions against their authoritative database role. (3) Privileged operations verify that the user is currently active (isActive: true) in the database.',
    },
    {
      q: 'Q3: Why did you use httpOnly cookies instead of localStorage for JWT tokens?',
      a: 'Tokens stored in localStorage are vulnerable to theft via Cross-Site Scripting (XSS). Storing JWT in an httpOnly: true, SameSite: Lax, Secure: true cookie prevents browser JavaScript from reading it, protecting user sessions against XSS token theft.',
    },
    {
      q: 'Q4: What is IDOR and how did you prevent it in the Customer Portal?',
      a: 'Insecure Direct Object Reference (IDOR) happens when an API accesses records by ID without ownership verification. We prevent this by extracting the authenticated customerId from the verified JWT cookie and enforcing database queries to filter strictly by { id, customerId: session.customerId }.',
    },
    {
      q: 'Q5: Why do you have two database URLs (DATABASE_URL and DIRECT_URL)?',
      a: 'DATABASE_URL connects via PgBouncer on port 6543 in transaction pooling mode, allowing hundreds of serverless API calls to share connections without exhaustion. DIRECT_URL connects directly to PostgreSQL on port 5432 for schema migrations (npx prisma db push) which require DDL session locking.',
    },
    {
      q: 'Q6: How do you prevent database connection leaks during development?',
      a: 'Next.js Hot Module Reloading instantiates new PrismaClient instances on save. We implemented the global singleton pattern in src/lib/prisma.ts by attaching the PrismaClient instance to globalThis, maintaining a single connection pool across HMR cycles.',
    },
    {
      q: 'Q7: How does the on-road vehicle pricing engine work?',
      a: 'Our pricing engine dynamically computes: Total = (Ex-Showroom + RTO Charges + Comprehensive Insurance + Accessories) - Discount. It also calculates GST tax breakdown into CGST (9%) and SGST (9%) for tax invoices.',
    },
    {
      q: 'Q8: How does your system prevent duplicate vehicle inventory (duplicate VINs)?',
      a: 'Physical motorcycle VIN and Engine numbers have @unique constraints in our Prisma PostgreSQL schema. Inward stock movements check for existing VINs and immediately reject duplicates with a 409 Conflict error.',
    },
    {
      q: 'Q9: How does the Live 6-Bay Workshop Tracker operate?',
      a: 'The workshop dashboard tracks 6 physical service bays. Each bay is linked to an active JobCard and technician. As the bike progresses through CHECKED_IN -> IN_SERVICE -> QC_INSPECTION -> WASHING -> READY_FOR_DELIVERY, state updates in PostgreSQL and syncs in real-time.',
    },
    {
      q: 'Q10: How do you handle special characters like @ in database passwords?',
      a: 'If a database password contains @, standard URI parsers misinterpret it as a host delimiter. We URL-encode special characters (e.g. @ becomes %40, # becomes %23) in our DATABASE_URL.',
    },
    {
      q: 'Q11: How do you manage API keys and secrets securely?',
      a: 'All secrets are stored in .env.local, which is excluded from Git via .gitignore. Secrets are accessed strictly server-side and never prefixed with NEXT_PUBLIC_. Audit logs automatically scrub sensitive fields before saving.',
    },
    {
      q: 'Q12: Why keep both portals accessible from a single unified landing page?',
      a: 'It consolidates brand SEO authority on shreejihero.com, eliminates code duplication via a shared monorepo, and uses Next.js Edge Middleware to seamlessly route employees to /dashboard and customers to /portal.',
    },
    {
      q: 'Q13: How can the system be separated into two independent websites / subdomains?',
      a: 'We can configure subdomain routing (my.shreejihero.com vs erp.shreejihero.com) via Next.js Middleware host rewrites, or deploy a separate mobile app for customers while keeping both connected to the same Supabase PostgreSQL database.',
    },
    {
      q: 'Q14: How does cross-portal real-time synchronization work?',
      a: 'When a customer books a service on their mobile portal, the API inserts a row in PostgreSQL. Supabase Realtime Change Data Capture (CDC) broadcasts a WebSocket event to the Showroom Manager dashboard, updating the queue live without browser refresh.',
    },
  ];

  const paragraphs = [];
  qaList.forEach((item) => {
    paragraphs.push(
      new Paragraph({
        spacing: { before: 200, after: 80 },
        children: [
          new TextRun({
            text: item.q,
            bold: true,
            size: 23, // 11.5pt
            color: '0F172A',
          }),
        ],
      })
    );
    paragraphs.push(
      new Paragraph({
        spacing: { after: 180 },
        indent: { left: 300 },
        children: [
          new TextRun({
            text: item.a,
            size: 21, // 10.5pt
            color: '334155',
          }),
        ],
      })
    );
  });

  return paragraphs;
}

generateWordDocument();
