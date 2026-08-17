import { useEffect, useMemo, useState } from 'react';
import { getMySubRoles, type AdminSubRole } from './api/adminAuth';
import { useAdminAuth } from './auth';

/**
 * Ported 1:1 from `utils/adminAccess.ts` (mobile), adapted to the web's
 * screen keys (route path segments under `/admin/*`, e.g. `orders`,
 * `order-management`, `payment-details`). The mobile app's `'index'` screen
 * key becomes `'dashboard'` here since that's the actual `/admin` route.
 *
 * Screens absent from every sub-role's tab list (e.g. `search`, `admins`,
 * `audit`, `contracts`, `vehicle-types`, `notifications`, `quotes`) are only
 * reachable by `super` admins (`allowedTabs === null`) — this matches mobile
 * behavior exactly.
 */
export const SUB_ROLE_TABS: Record<AdminSubRole, string[]> = {
  super: [],
  accounts: ['financial', 'payment-details', 'pricing', 'dashboards'],
  documents: ['documents', 'approvals'],
  operations: ['orders', 'new-offers', 'track', 'fleet', 'order-management', 'waybills'],
  review: ['users', 'approvals', 'ratings', 'complaints', 'categories'],
  account_manager: ['orders', 'new-offers', 'users'],
};

/** Always-allowed screen keys, regardless of sub-role (mirrors mobile's `'index'`/`'profile'`). */
const ALWAYS_ALLOWED_SCREENS = new Set(['dashboard', 'profile']);

/**
 * Returns `null` when the admin has full access (has the `super` sub-role),
 * otherwise the set of screen keys they're allowed to see.
 */
export function getAdminAllowedTabs(subRoles: AdminSubRole[]): Set<string> | null {
  if (subRoles.includes('super')) return null;
  const allowed = new Set<string>(ALWAYS_ALLOWED_SCREENS);
  for (const role of subRoles) {
    for (const tab of SUB_ROLE_TABS[role] ?? []) {
      allowed.add(tab);
    }
  }
  return allowed;
}

export function canAccessAdminScreen(screen: string, allowedTabs: Set<string> | null): boolean {
  if (allowedTabs === null) return true;
  if (ALWAYS_ALLOWED_SCREENS.has(screen)) return true;
  return allowedTabs.has(screen);
}

/**
 * Resolves the current admin's sub-roles (preferring `user.adminSubRoles`
 * from the login/`/auth/me` payload, falling back to `GET
 * /admin/me/sub-roles`) and the resulting allowed-tabs set. Mirrors
 * `useAdminSubRoles` in `utils/adminAccess.ts` (mobile).
 */
export function useAdminSubRoles() {
  const { token, user } = useAdminAuth();

  const [resolvedSubRoles, setResolvedSubRoles] = useState<AdminSubRole[] | null>(() =>
    Array.isArray(user?.adminSubRoles) && user.adminSubRoles.length ? (user.adminSubRoles as AdminSubRole[]) : null
  );

  useEffect(() => {
    if (Array.isArray(user?.adminSubRoles) && user.adminSubRoles.length) {
      setResolvedSubRoles(user.adminSubRoles as AdminSubRole[]);
      return;
    }
    if (!token || user?.role !== 'admin') {
      setResolvedSubRoles(null);
      return;
    }

    let cancelled = false;

    (async () => {
      const { data } = await getMySubRoles(token);
      if (cancelled) return;
      setResolvedSubRoles(Array.isArray(data?.subRoles) ? data.subRoles : []);
    })();

    return () => {
      cancelled = true;
    };
  }, [token, user?.adminSubRoles, user?.role]);

  const subRoles = resolvedSubRoles ?? [];
  const allowedTabs = useMemo(() => getAdminAllowedTabs(subRoles), [subRoles]);

  return { subRoles, allowedTabs };
}
