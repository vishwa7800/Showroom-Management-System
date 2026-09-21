'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfile, Role, Branch } from '@/types';
import { BRANCHES } from '@/lib/constants';
import { hasPermission, hasBranchAccess, PermissionKey } from '@/lib/permissions';

interface AuthContextType {
  user: UserProfile | null;
  activeBranchId: string | null;
  activeBranch: Branch | null;
  branches: Branch[];
  can: (permission: PermissionKey) => boolean;
  canAccessBranch: (branchId: string | null) => boolean;
  switchRole: (role: Role) => Promise<void>;
  switchBranch: (branchId: string | null) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeBranchId, setActiveBranchId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch real authenticated session on mount from server
  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      try {
        const res = await fetch('/api/auth/me', {
          headers: { 'Cache-Control': 'no-cache' },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user && isMounted) {
            setCurrentUser(data.user);
            setActiveBranchId(
              data.user.role === 'ADMIN'
                ? data.user.branchId || 'br_halvad'
                : data.user.branchId
            );
          } else if (isMounted) {
            setCurrentUser(null);
            setActiveBranchId(null);
          }
        } else if (isMounted) {
          setCurrentUser(null);
          setActiveBranchId(null);
        }
      } catch (err) {
        if (isMounted) {
          setCurrentUser(null);
          setActiveBranchId(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const activeBranch = BRANCHES.find((b) => b.id === activeBranchId || b.code === activeBranchId) || null;

  const can = (permission: PermissionKey): boolean => {
    if (!currentUser) return false;
    return hasPermission(currentUser.role, permission);
  };

  const canAccessBranch = (targetBranchId: string | null): boolean => {
    if (!currentUser) return false;
    return hasBranchAccess(currentUser.role, currentUser.branchId, targetBranchId);
  };

  // Development API fallback (if needed for headless testing, updates backend session)
  const switchRole = async (role: Role) => {
    try {
      const res = await fetch('/api/auth/dev-switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setActiveBranchId(data.user.role === 'ADMIN' ? 'br_halvad' : data.user.branchId);
        router.refresh();
      }
    } catch (e) {
      console.error('Failed to switch dev role', e);
    }
  };

  const switchBranch = (branchId: string | null) => {
    // Only Admin can switch branches; ordinary employees can only view their own assigned branch
    if (currentUser?.role === 'ADMIN') {
      setActiveBranchId(branchId);
    } else if (currentUser?.branchId === branchId) {
      setActiveBranchId(branchId);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      // Ignore
    }
    setCurrentUser(null);
    setActiveBranchId(null);
    try {
      localStorage.removeItem('shreeji_hero_active_user');
      localStorage.removeItem('shreeji_hero_users_db');
    } catch (e) { }
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        activeBranchId,
        activeBranch,
        branches: BRANCHES,
        can,
        canAccessBranch,
        switchRole,
        switchBranch,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
