// Shreeji Hero Showroom ERP - Audit Logging System

export interface AuditLogEntry {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  branchId?: string | null;
  action: string;
  entity: string;
  entityId?: string;
  changeDetails?: string;
  ipAddress?: string;
  createdAt: string;
}

// In-memory persistent audit log for the current process (and Prisma bridge)
let auditLogs: AuditLogEntry[] = [
  {
    id: 'aud_seed_01',
    actorId: 'usr_admin',
    actorName: 'Rajesh Sharma',
    actorRole: 'ADMIN',
    branchId: null,
    action: 'SYSTEM_INIT',
    entity: 'System',
    entityId: 'SMS-V1',
    changeDetails: 'System initialized with baseline security policies.',
    ipAddress: '127.0.0.1',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

export async function createAuditLog(params: {
  actorId: string;
  actorName: string;
  actorRole: string;
  branchId?: string | null;
  action: string;
  entity: string;
  entityId?: string;
  changeDetails?: Record<string, any> | string;
  ipAddress?: string;
}): Promise<AuditLogEntry> {
  // Sanitize changeDetails to ensure passwords or secrets are never logged
  let sanitizedDetails = '';
  if (typeof params.changeDetails === 'object') {
    const clone = { ...params.changeDetails };
    if ('password' in clone) delete clone.password;
    if ('passwordHash' in clone) delete clone.passwordHash;
    if ('token' in clone) delete clone.token;
    sanitizedDetails = JSON.stringify(clone);
  } else if (typeof params.changeDetails === 'string') {
    sanitizedDetails = params.changeDetails;
  }

  const newLog: AuditLogEntry = {
    id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    actorId: params.actorId,
    actorName: params.actorName,
    actorRole: params.actorRole,
    branchId: params.branchId || null,
    action: params.action,
    entity: params.entity,
    entityId: params.entityId || 'N/A',
    changeDetails: sanitizedDetails,
    ipAddress: params.ipAddress || '127.0.0.1',
    createdAt: new Date().toISOString(),
  };

  auditLogs.unshift(newLog);
  // Keep max 500 in-memory logs
  if (auditLogs.length > 500) {
    auditLogs = auditLogs.slice(0, 500);
  }

  return newLog;
}

export function getAuditLogs(filter?: {
  branchId?: string | null;
  actorId?: string;
  limit?: number;
}): AuditLogEntry[] {
  let filtered = [...auditLogs];

  if (filter?.branchId) {
    filtered = filtered.filter((l) => l.branchId === filter.branchId || l.branchId === null);
  }
  if (filter?.actorId) {
    filtered = filtered.filter((l) => l.actorId === filter.actorId);
  }
  if (filter?.limit) {
    filtered = filtered.slice(0, filter.limit);
  }

  return filtered;
}
