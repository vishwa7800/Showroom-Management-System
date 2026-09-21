// Shreeji Hero Showroom ERP - User & Credential Repository with Persistent JSON Storage
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { Role, AccountStatus, UserProfile } from '@/types';

export interface UserRecord extends UserProfile {
  passwordHash: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Generate pre-hashed passwords using bcrypt with 10 salt rounds
const HASH_ADMIN = bcrypt.hashSync('Admin@123', 10);
const HASH_MANAGER = bcrypt.hashSync('Manager@123', 10);
const HASH_SALES = bcrypt.hashSync('Sales@123', 10);
const HASH_FRONT_DESK = bcrypt.hashSync('FrontDesk@123', 10);
const HASH_SERVICE_MGR = bcrypt.hashSync('ServiceMgr@123', 10);
const HASH_SERVICE_ADV = bcrypt.hashSync('ServiceAdv@123', 10);
const HASH_ACCOUNTANT = bcrypt.hashSync('Accountant@123', 10);
const HASH_INVENTORY = bcrypt.hashSync('Inventory@123', 10);
const HASH_DISABLED = bcrypt.hashSync('Disabled@123', 10);

const INITIAL_BASE_USERS: UserRecord[] = [
  {
    id: 'usr_admin',
    employeeCode: 'EMP-1001',
    name: 'Rajesh Sharma',
    email: 'rajesh@shreejihero.com',
    passwordHash: HASH_ADMIN,
    phone: '+91 98765 43210',
    role: 'ADMIN',
    branchId: null,
    branchName: 'All Branches (HQ)',
    department: 'Executive',
    designation: 'Managing Director & Dealer Principal',
    status: 'ACTIVE',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2024-05-15T10:00:00.000Z',
  },
  {
    id: 'usr_manager_hlv',
    employeeCode: 'EMP-1002',
    name: 'Vikram Singh',
    email: 'vikram@shreejihero.com',
    passwordHash: HASH_MANAGER,
    phone: '+91 98765 43211',
    role: 'SHOWROOM_MANAGER',
    branchId: 'br_halvad',
    branchName: 'Halvad Branch',
    department: 'Operations',
    designation: 'General Showroom Manager',
    status: 'ACTIVE',
    createdAt: '2023-01-10T00:00:00.000Z',
    updatedAt: '2024-05-15T10:00:00.000Z',
  },
  {
    id: 'usr_sales_amit',
    employeeCode: 'EMP-1003',
    name: 'Amit Verma',
    email: 'amit@shreejihero.com',
    passwordHash: HASH_SALES,
    phone: '+91 98765 43212',
    role: 'SALES_EXECUTIVE',
    branchId: 'br_halvad',
    branchName: 'Halvad Branch',
    department: 'Sales',
    designation: 'Senior Sales Consultant',
    status: 'ACTIVE',
    createdAt: '2023-02-01T00:00:00.000Z',
    updatedAt: '2024-05-15T10:00:00.000Z',
  },
  {
    id: 'usr_reception_pooja',
    employeeCode: 'EMP-1004',
    name: 'Pooja Sharma',
    email: 'pooja@shreejihero.com',
    passwordHash: HASH_FRONT_DESK,
    phone: '+91 98765 43213',
    role: 'FRONT_DESK',
    branchId: 'br_halvad',
    branchName: 'Halvad Branch',
    department: 'Front Desk',
    designation: 'Front Desk & Guest Executive',
    status: 'ACTIVE',
    createdAt: '2023-02-15T00:00:00.000Z',
    updatedAt: '2024-05-15T10:00:00.000Z',
  },
  {
    id: 'usr_srv_mgr_sandeep',
    employeeCode: 'EMP-1005',
    name: 'Sandeep Kumar',
    email: 'sandeep@shreejihero.com',
    passwordHash: HASH_SERVICE_MGR,
    phone: '+91 98765 43214',
    role: 'SERVICE_MANAGER',
    branchId: 'br_halvad',
    branchName: 'Halvad Branch',
    department: 'Workshop',
    designation: 'Workshop & Service Floor Manager',
    status: 'ACTIVE',
    createdAt: '2023-03-01T00:00:00.000Z',
    updatedAt: '2024-05-15T10:00:00.000Z',
  },
  {
    id: 'usr_srv_adv_kiran',
    employeeCode: 'EMP-1006',
    name: 'Kiran Solanki',
    email: 'kiran@shreejihero.com',
    passwordHash: HASH_SERVICE_ADV,
    phone: '+91 98765 43215',
    role: 'SERVICE_ADVISOR',
    branchId: 'br_halvad',
    branchName: 'Halvad Branch',
    department: 'Workshop',
    designation: 'Customer Service Advisor',
    status: 'ACTIVE',
    createdAt: '2023-03-10T00:00:00.000Z',
    updatedAt: '2024-05-15T10:00:00.000Z',
  },
  {
    id: 'usr_accountant_neha',
    employeeCode: 'EMP-1007',
    name: 'Neha Gupta',
    email: 'neha@shreejihero.com',
    passwordHash: HASH_ACCOUNTANT,
    phone: '+91 98765 43216',
    role: 'ACCOUNTANT',
    branchId: 'br_halvad',
    branchName: 'Halvad Branch',
    department: 'Finance',
    designation: 'Chief Dealership Accountant',
    status: 'ACTIVE',
    createdAt: '2023-04-01T00:00:00.000Z',
    updatedAt: '2024-05-15T10:00:00.000Z',
  },
  {
    id: 'usr_inv_mohit',
    employeeCode: 'EMP-1008',
    name: 'Mohit Verma',
    email: 'mohit@shreejihero.com',
    passwordHash: HASH_INVENTORY,
    phone: '+91 98765 43217',
    role: 'INVENTORY_MANAGER',
    branchId: 'br_halvad',
    branchName: 'Halvad Branch',
    department: 'Inventory & Spares',
    designation: 'Inventory & Spares Head',
    status: 'ACTIVE',
    createdAt: '2023-04-15T00:00:00.000Z',
    updatedAt: '2024-05-15T10:00:00.000Z',
  },
  {
    id: 'usr_disabled_test',
    employeeCode: 'EMP-1099',
    name: 'Ex-Employee Inactive',
    email: 'disabled@shreejihero.com',
    passwordHash: HASH_DISABLED,
    phone: '+91 98765 43299',
    role: 'SALES_EXECUTIVE',
    branchId: 'br_halvad',
    branchName: 'Halvad Branch',
    department: 'Sales',
    designation: 'Former Sales Executive',
    status: 'DISABLED',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

const DATA_DIR = path.join(process.cwd(), 'src', 'lib', 'db', 'data');
const DATA_FILE = path.join(DATA_DIR, 'users.json');

// Global in-memory cache to ensure process-wide consistency in Next.js
declare global {
  var __shreeji_users_db: UserRecord[] | undefined;
}

function loadUsersFromDisk(): UserRecord[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_BASE_USERS, null, 2), 'utf-8');
      globalThis.__shreeji_users_db = [...INITIAL_BASE_USERS];
      return globalThis.__shreeji_users_db;
    }

    const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed: UserRecord[] = JSON.parse(fileContent);

    // Merge in any base users that might be missing from an older disk file
    const existingEmails = new Set(parsed.map((u) => u.email.toLowerCase()));
    let needsResave = false;

    for (const baseUser of INITIAL_BASE_USERS) {
      if (!existingEmails.has(baseUser.email.toLowerCase())) {
        parsed.push(baseUser);
        needsResave = true;
      }
    }

    if (needsResave) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
    }

    globalThis.__shreeji_users_db = parsed;
    return parsed;
  } catch (err) {
    console.error('Error reading persistent users file, falling back to memory', err);
    if (!globalThis.__shreeji_users_db) {
      globalThis.__shreeji_users_db = [...INITIAL_BASE_USERS];
    }
    return globalThis.__shreeji_users_db;
  }
}

function saveUsersToDisk(users: UserRecord[]): void {
  try {
    globalThis.__shreeji_users_db = users;
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing persistent users file', err);
  }
}

function getStore(): UserRecord[] {
  return loadUsersFromDisk();
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const normalized = email.trim().toLowerCase();
  const users = getStore();
  const user = users.find((u) => u.email.toLowerCase() === normalized);
  return user || null;
}

export async function findUserByIdentifier(identifier: string): Promise<UserRecord | null> {
  const q = identifier.trim().toLowerCase();
  const users = getStore();
  const user = users.find(
    (u) =>
      u.email.toLowerCase() === q ||
      u.employeeCode.toLowerCase() === q ||
      u.name.toLowerCase() === q
  );
  return user || null;
}

export async function findUserById(id: string): Promise<UserRecord | null> {
  const users = getStore();
  const user = users.find((u) => u.id === id);
  return user || null;
}

export async function getAllUsers(filter?: {
  branchId?: string | null;
  role?: Role;
  status?: AccountStatus;
}): Promise<Omit<UserRecord, 'passwordHash'>[]> {
  let result = [...getStore()];

  if (filter?.branchId) {
    result = result.filter((u) => u.branchId === filter.branchId || u.branchId === null);
  }
  if (filter?.role) {
    result = result.filter((u) => u.role === filter.role);
  }
  if (filter?.status) {
    result = result.filter((u) => u.status === filter.status);
  }

  // Never return passwordHash in queries
  return result.map(({ passwordHash, ...safeUser }) => safeUser);
}

export async function createUser(data: {
  name: string;
  email: string;
  phone: string;
  role: Role;
  branchId: string | null;
  branchName?: string;
  department?: string;
  designation?: string;
  password?: string;
}): Promise<Omit<UserRecord, 'passwordHash'>> {
  const normalizedEmail = data.email.trim().toLowerCase();
  const existing = await findUserByEmail(normalizedEmail);
  if (existing) {
    throw new Error('An employee with this email already exists.');
  }

  const users = getStore();
  const employeeCode = `EMP-${1000 + users.length + 1}`;
  const password = data.password || 'Hero@2026';
  const passwordHash = await bcrypt.hash(password, 10);

  const newUser: UserRecord = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    employeeCode,
    name: data.name.trim(),
    email: normalizedEmail,
    passwordHash,
    phone: data.phone.trim(),
    role: data.role,
    branchId: data.branchId,
    branchName: data.branchName || (data.branchId === 'br_dhangadhra' ? 'Dhangadhra Branch' : data.branchId === 'br_jetpur' ? 'Jetpur Branch' : data.branchId ? 'Halvad Branch' : 'All Branches (HQ)'),
    department: data.department || 'General',
    designation: data.designation || data.role.replace(/_/g, ' '),
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsersToDisk(users);

  const { passwordHash: _, ...safeUser } = newUser;
  return safeUser;
}

export async function updateUserStatus(
  userId: string,
  newStatus: AccountStatus
): Promise<Omit<UserRecord, 'passwordHash'>> {
  const users = getStore();
  const user = users.find((u) => u.id === userId);
  if (!user) {
    throw new Error('Employee not found');
  }

  user.status = newStatus;
  user.updatedAt = new Date().toISOString();
  saveUsersToDisk(users);

  const { passwordHash: _, ...safeUser } = user;
  return safeUser;
}

export async function updateLastLogin(userId: string): Promise<void> {
  const users = getStore();
  const user = users.find((u) => u.id === userId);
  if (user) {
    user.lastLoginAt = new Date().toISOString();
    saveUsersToDisk(users);
  }
}
