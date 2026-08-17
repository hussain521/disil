import { authHeaders, request } from './core';

/**
 * API functions for the "admin-misc" screen group: Admins management, Audit
 * log, Contracts (+ new contract), Vehicle types, Notifications. Mirrors the
 * matching functions in `services/api.ts` (mobile) exactly — see
 * `backend/routes/admin.js`, `backend/routes/audit.js`,
 * `backend/routes/contracts.js`, `backend/routes/vehicle-taxonomy.js`,
 * `backend/routes/notifications.js`.
 *
 * Kept as a single self-contained module with its own copies of shared
 * literal-union types (e.g. `AdminSubRole`) rather than importing from other
 * `lib/` files, matching the convention in `lib/api/adminAuth.ts` /
 * `lib/api/auth.ts`.
 */

// ─── Admins management ──────────────────────────────────────────────────────

export type AdminSubRole = 'super' | 'accounts' | 'documents' | 'operations' | 'review' | 'account_manager';

export const ALL_ADMIN_SUB_ROLES: AdminSubRole[] = [
  'super',
  'accounts',
  'documents',
  'operations',
  'review',
  'account_manager',
];

export interface AdminAccount {
  id: string;
  fullName: string;
  phone: string;
  subRoles: AdminSubRole[];
  isActive: boolean;
  createdAt: string;
}

export function adminListAdmins(token: string) {
  return request<{ admins: AdminAccount[] }>('/admin/admins', { headers: authHeaders(token) });
}

export function adminCreateAdmin(
  token: string,
  data: { fullName: string; phone: string; password: string; subRoles: AdminSubRole[] }
) {
  return request<AdminAccount>('/admin/admins', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export function adminUpdateAdminSubRoles(token: string, id: string, subRoles: AdminSubRole[]) {
  return request<{ id: string; fullName: string; subRoles: AdminSubRole[] }>(`/admin/admins/${id}/sub-roles`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ subRoles }),
  });
}

// ─── Audit log ───────────────────────────────────────────────────────────────

export type AuditEntry = {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  relatedId: string | null;
  actor: { id: string; fullName: string; role: string } | null;
  actorRole: string | null;
  amount: number | null;
  meta: any;
  summary: string | null;
  from: any;
  to: any;
  createdAt: string;
};

export function adminGetAuditLog(
  token: string,
  params?: {
    entityType?: string;
    entityId?: string;
    action?: string;
    actorId?: string;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
  }
) {
  const qs = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') qs.set(k, String(v));
  });
  const query = qs.toString() ? `?${qs.toString()}` : '';
  return request<{ entries: AuditEntry[]; total: number; page: number; pages: number }>(`/audit${query}`, {
    headers: authHeaders(token),
  });
}

// ─── Contracts ───────────────────────────────────────────────────────────────

export type ContractServiceCategory = 'domestic' | 'international' | 'fuel';
export type ContractCadence = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'on_demand';
export type ContractStatus = 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';

export type Contract = {
  id: string;
  contractCode: string | null;
  clientId: string;
  agentId: string | null;
  title: string;
  description: string | null;
  serviceCategory: ContractServiceCategory;
  vehicleType: string | null;
  pickup: any;
  dropoff: any;
  rateModel: 'per_trip' | 'per_km' | 'per_ton' | 'monthly_lump';
  rate: number;
  currency: string;
  cadence: ContractCadence;
  daysOfWeek: number[];
  dayOfMonth: number | null;
  timeOfDay: string;
  expectedTrucksPerRun: number;
  validFrom: string;
  validTo: string;
  status: ContractStatus;
  autoCreateOrders: boolean;
  nextRunAt: string | null;
  lastRunAt: string | null;
  monthlySettlement: boolean;
  lastSettledAt: string | null;
  generatedOrderIds: string[];
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export function getContracts(token: string, params?: { status?: string; page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.status) qs.set('status', params.status);
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  const query = qs.toString() ? `?${qs.toString()}` : '';
  return request<{ contracts: Contract[]; total: number; page: number; pages: number }>(`/contracts${query}`, {
    headers: authHeaders(token),
  });
}

export function createContract(
  token: string,
  body: Partial<Contract> & { clientId: string; title: string; rate: number; validFrom: string; validTo: string }
) {
  return request<{ contract: Contract }>('/contracts', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
}

export function setContractStatus(token: string, id: string, status: ContractStatus) {
  return request<{ contract: Contract }>(`/contracts/${id}/status`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ status }),
  });
}

export function runContractNow(token: string, id: string) {
  return request<{ order: { id: string }; contract: Contract }>(`/contracts/${id}/run-now`, {
    method: 'POST',
    headers: authHeaders(token),
  });
}

// ─── Client picker (for new-contract form) ─────────────────────────────────

export interface AdminUserLite {
  id: string;
  fullName: string;
  phone: string;
}

/** Minimal slice of `GET /admin/users` used only to populate the new-contract client picker. */
export function adminGetUsers(
  token: string,
  params?: { role?: string; q?: string; page?: number; limit?: number }
) {
  const qs = new URLSearchParams();
  if (params?.role) qs.set('role', params.role);
  if (params?.q) qs.set('q', params.q);
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  const query = qs.toString() ? `?${qs.toString()}` : '';
  return request<{ users: AdminUserLite[]; total: number; page: number; pages: number }>(`/admin/users${query}`, {
    headers: authHeaders(token),
  });
}

// ─── Vehicle taxonomy ────────────────────────────────────────────────────────

export interface VehicleTaxonomyLabel {
  key: string;
  ar: string;
  en: string;
  disabled?: boolean;
  noteAr?: string;
  noteEn?: string;
}

export interface VehicleTaxonomyData {
  categories: VehicleTaxonomyLabel[];
  vehicleSubtypes: {
    jumbo: VehicleTaxonomyLabel[];
    single: VehicleTaxonomyLabel[];
    truck: VehicleTaxonomyLabel[];
  };
  truckBodyTypes: VehicleTaxonomyLabel[];
  fleetOperations: VehicleTaxonomyLabel[];
  headTypes: VehicleTaxonomyLabel[];
  trailerTypes: VehicleTaxonomyLabel[];
}

export function getVehicleTaxonomy(token: string) {
  return request<{ taxonomy: VehicleTaxonomyData }>('/vehicle-taxonomy', {
    headers: authHeaders(token),
  });
}

export function updateVehicleTaxonomy(token: string, taxonomy: VehicleTaxonomyData) {
  return request<{ taxonomy: VehicleTaxonomyData }>('/vehicle-taxonomy', {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ taxonomy }),
  });
}

// ─── Notifications ───────────────────────────────────────────────────────────

export type NotificationType =
  | 'new_order'
  | 'order_assigned'
  | 'approval_request'
  | 'approval_response'
  | 'trip_started'
  | 'trip_update'
  | 'delivery_confirmed'
  | 'payment_received'
  | 'document_reviewed'
  | 'registration_pending_review'
  | 'account_activated'
  | 'account_rejected'
  | 'quote_broadcast'
  | 'quote_offer_received'
  | 'quote_offer_selected'
  | 'quote_priced'
  | 'deposit_received'
  | 'balance_received'
  | 'route_change_request'
  | 'route_change_approved'
  | 'agent_change_request'
  | 'agent_change_decided'
  | 'waybill_request'
  | 'waybill_approval_required'
  | 'waybill_delivered'
  | 'waybill_signed'
  | 'waybill_received'
  | 'trip_emergency'
  | 'trip_shortage'
  | 'complaint_submitted'
  | 'complaint_resolved'
  | 'rating_received'
  | 'driver_linked'
  | 'driver_unlinked'
  | 'truck_manager_change_request'
  | 'truck_manager_change_approved'
  | 'truck_manager_change_rejected'
  | 'order_offer_selected'
  | 'order_price_updated'
  | 'truck_resubmitted'
  | 'system'
  | string;

export type AppNotification = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  data: any;
  relatedId: string | null;
  read: boolean;
  readAt: string | null;
  createdAt: string;
};

export function getNotifications(token: string, params?: { limit?: number; unreadOnly?: boolean }) {
  const q = new URLSearchParams();
  if (params?.limit) q.set('limit', String(params.limit));
  if (params?.unreadOnly) q.set('unreadOnly', 'true');
  const qs = q.toString() ? `?${q.toString()}` : '';
  return request<{ notifications: AppNotification[]; unreadCount: number }>(`/notifications${qs}`, {
    headers: authHeaders(token),
  });
}

export function markNotificationRead(token: string, id: string) {
  return request<{ notification: AppNotification }>(`/notifications/${id}/read`, {
    method: 'PUT',
    headers: authHeaders(token),
  });
}

export function markAllNotificationsRead(token: string) {
  return request<{ modified: number }>('/notifications/read-all', {
    method: 'PUT',
    headers: authHeaders(token),
  });
}

export function deleteNotification(token: string, id: string) {
  return request<{ ok: true }>(`/notifications/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
}

export function clearAllNotifications(token: string) {
  return request<{ deleted: number }>('/notifications', {
    method: 'DELETE',
    headers: authHeaders(token),
  });
}

/**
 * Best-effort deep-link resolver for the admin portal only (subset of
 * `utils/notificationRoutes.ts` on mobile, scoped to admin-reachable web
 * routes). Returns `null` when there's no sensible admin page to link to.
 */
export function resolveAdminNotificationRoute(item: AppNotification): string | null {
  const orderId: string = item.data?.orderId || item.relatedId || '';
  const type = item.type as string;

  if (
    [
      'trip_update',
      'trip_started',
      'waybill_request',
      'cargo_confirmed',
      'trip_emergency',
      'arrived_delivery_point',
      'unloading_started',
      'driver_arrived_pickup',
      'driver_started_moving',
      'delivery_confirmed',
      'new_order',
      'order_created',
      'searching_vehicle',
      'order_offer_received',
      'order_offer_selected',
      'order_agent_assigned',
      'order_assigned',
      'order_price_updated',
      'deposit_received',
      'balance_received',
      'pending_balance',
      'payment_delay',
      'extra_charges',
      'invoice_issued',
      'payment_failed',
      'trip_cancelled',
      'route_change_request',
      'route_change_approved',
      'trip_shortage',
      'trip_reminder',
      'admin_schedule_overrun',
      'truck_released_from_order',
      'unusual_stop',
      'long_stop_alert',
      'gps_tampering',
      'driver_off_route',
      'trip_delay',
      'speed_alert',
      'order_timeout',
    ].includes(type)
  ) {
    if (orderId) return `/admin/orders/${orderId}`;
    return '/admin/orders';
  }

  if (['quote_broadcast', 'quote_priced', 'approval_request', 'agent_change_request'].includes(type)) {
    return '/admin/approvals';
  }

  if (['complaint_submitted', 'complaint_resolved'].includes(type)) {
    return '/admin/complaints';
  }

  if (['truck_pending_review', 'truck_approved', 'truck_resubmitted', 'driver_changed_on_truck'].includes(type)) {
    return '/admin/fleet';
  }

  if (
    [
      'document_reviewed',
      'account_activated',
      'account_rejected',
      'account_suspended',
      'suspicious_account',
      'vehicle_license_expiring',
      'driver_license_expiring',
      'driver_linked',
      'driver_unlinked',
    ].includes(type)
  ) {
    return '/admin/users';
  }

  if (['rating_received', 'rating_dropped'].includes(type)) {
    return '/admin/ratings';
  }

  if (['payment_received', 'refund_issued', 'trip_earnings'].includes(type)) {
    return '/admin/financial';
  }

  if (orderId) return `/admin/orders/${orderId}`;

  return null;
}
