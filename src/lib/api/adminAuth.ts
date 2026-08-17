import { authHeaders, request } from './core';

/**
 * Mirrors `AdminSubRole` in `services/api.ts` / `utils/adminAccess.ts` on
 * mobile. Kept as its own literal union here (rather than importing from
 * `./auth`) so this file has no dependency on other `lib/` modules — the two
 * unions are structurally identical and interchangeable.
 */
export type AdminSubRole = 'super' | 'accounts' | 'documents' | 'operations' | 'review' | 'account_manager';

/** `GET /admin/me/sub-roles` — the current admin's own sub-roles, used for sidebar/nav gating. */
export function getMySubRoles(token: string) {
  return request<{ subRoles: AdminSubRole[] }>('/admin/me/sub-roles', {
    headers: authHeaders(token),
  });
}
