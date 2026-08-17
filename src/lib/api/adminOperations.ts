import { API_URL, authHeaders, request } from './core';
import type { DestinationChange, Trip } from './trips';

/**
 * Typed client for every admin-operations API call used by the mobile
 * screens under `app/(admin)/{order-management,track,fleet,search,
 * truck-detail,waybills}.tsx`. Field shapes mirror the exact response
 * bodies returned by `backend/routes/{admin,trucks,trips}.js` (cross-checked
 * against `services/api.ts`, the mobile reference client).
 */

export const ASSET_BASE = API_URL.replace(/\/api\/?$/, '');

export function resolveAssetUrl(url?: string | null): string | null {
  if (!url) return null;
  return url.startsWith('http') ? url : `${ASSET_BASE}${url}`;
}

/** Plain-ASCII plate formatter (mirrors `utils/plate.ts`'s digit isolation, without Arabic letter-spacing). */
export function formatPlateDisplay(plateNumber: string | null | undefined): string {
  if (!plateNumber) return '—';
  return plateNumber
    .split('/')
    .map((part) => part.trim().replace(/\s+/g, ' '))
    .join(' / ');
}

// ─── Order Management ────────────────────────────────────────────────────────

export interface OrderManagementSummary {
  newOrders: number;
  pendingAssignment?: number;
  active: number;
  delivered: number;
  cancelled: number;
  reassign: number;
}

export function adminGetOrderManagementSummary(token: string) {
  return request<OrderManagementSummary>('/admin/orders/management/summary', { headers: authHeaders(token) });
}

// ─── Trucks / Fleet ───────────────────────────────────────────────────────────

export type TruckStatus = 'available' | 'on_trip' | 'maintenance' | 'inactive';

export interface TruckParty {
  id: string;
  fullName: string;
  phone: string;
  rating?: number;
  companyName?: string | null;
  agentCode?: string | null;
  walletBalance?: number;
}

export interface TruckOwnerDetails {
  name: string;
  phone?: string | null;
  notes?: string | null;
  nationalId?: string | null;
  address?: string | null;
  idFrontPhoto?: string | null;
  idBackPhoto?: string | null;
}

export interface TruckVehicleDetails {
  plateNumber: string;
  engineNumber?: string | null;
  chassisNumber?: string | null;
  color?: string | null;
  brand?: string | null;
  model?: string | null;
  axles?: number;
  length?: number | null;
  inspectionDate?: string | null;
  licenseStartDate?: string | null;
  licenseEndDate?: string | null;
  licenseFrontPhoto?: string | null;
  licenseBackPhoto?: string | null;
  ownerDetails?: TruckOwnerDetails | null;
}

export interface ActiveTripInfo {
  orderId: string;
  orderCode: string;
  orderStatus: string;
  tripStatus?: string | null;
  workStatus: 'loading' | 'unloading' | 'in_transit' | 'en_route_to_pickup' | 'waiting' | 'on_trip';
  workStatusAr: string;
  workStatusLabel: string;
  description?: string;
  pickupAddress?: string | null;
  deliveryAddress?: string | null;
}

export interface PendingLinkRequest {
  driverId: string;
  driverName: string;
  driverPhone: string;
  tractorPlate?: string | null;
}

export interface Truck {
  id: string;
  ownerId: string;
  agentId?: string | null;
  plateNumber: string;
  type: string;
  operationType?: string;
  capacity: number;
  status: TruckStatus;
  assignedDriverId?: string | null;
  model?: string | null;
  year?: number | null;
  imageUrl?: string | null;
  notes?: string | null;
  vehiclePhotos?: string[];
  createdAt?: string;
  updatedAt?: string;
  owner?: TruckParty;
  agent?: TruckParty;
  assignedDriver?: TruckParty;
  driver?: TruckParty;
  truckCode?: string;
  headType?: 'fardany' | 'ras' | 'jambo';
  trailerType?: 'dail' | 'maqtoura' | null;
  totalAxles?: number;
  safetyFeatures?: string[];
  workPreferences?: string[];
  tractor?: TruckVehicleDetails | null;
  trailer?: TruckVehicleDetails | null;
  busy?: boolean;
  activeTrip?: ActiveTripInfo | null;
  // Phase 2/9 taxonomy + search facets
  category?: 'jumbo' | 'single' | 'truck' | null;
  subType?: string | null;
  bodyType?: string | null;
  maxLoad?: number | null;
  maxHeight?: number | null;
  length?: number | null;
  axleCount?: number | null;
  operational?: boolean;
  rating?: number;
  ratingCount?: number;
  // Admin approval workflow
  approvalStatus?: 'pending_review' | 'approved' | 'rejected';
  approvalRejectionReason?: string | null;
  rejectedDocuments?: string[];
  documentApprovals?: Record<string, 'approved' | 'rejected'>;
  approvedAt?: string | null;
  rejectedAt?: string | null;
  pendingLinkRequest?: PendingLinkRequest | null;
}

export type TruckSearchParams = {
  q?: string;
  category?: 'jumbo' | 'single' | 'truck';
  subType?: string;
  bodyType?: string;
  type?: string;
  headType?: 'fardany' | 'ras' | 'jambo';
  trailerType?: 'dail' | 'maqtoura';
  minLength?: number;
  maxLength?: number;
  minAxles?: number;
  maxAxles?: number;
  weightMin?: number;
  weightMax?: number;
  maxHeight?: number;
  ownerName?: string;
  agentName?: string;
  plate?: string;
  truckCode?: string;
  operational?: boolean;
  status?: TruckStatus;
};

export function searchTrucks(token: string, params: TruckSearchParams = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === ('' as unknown)) return;
    qs.append(key, typeof value === 'boolean' ? String(value) : String(value));
  });
  const suffix = qs.toString() ? `?${qs.toString()}` : '';
  return request<{ trucks: Truck[] }>(`/trucks${suffix}`, { headers: authHeaders(token) });
}

export function getTruck(token: string, id: string) {
  return request<Truck>(`/trucks/${id}`, { headers: authHeaders(token) });
}

export interface FleetOverviewTruck {
  id: string;
  plateNumber: string;
  type: string;
  capacity: number;
  status: string;
  truckCode: string | null;
  approvalStatus?: 'pending_review' | 'approved' | 'rejected';
  busy: boolean;
  activeTrip?: ActiveTripInfo | null;
  owner: { id: string; fullName: string; phone: string; walletBalance: number } | null;
  agent: { id: string; fullName: string; phone: string } | null;
  driver: { id: string; fullName: string; phone: string; rating: number } | null;
}

export interface FleetOverview {
  total: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  trucks: FleetOverviewTruck[];
}

export function adminGetFleetOverview(
  token: string,
  params?: { type?: string; status?: string; approvalStatus?: string; q?: string }
) {
  const qs = new URLSearchParams();
  if (params?.type) qs.set('type', params.type);
  if (params?.status) qs.set('status', params.status);
  if (params?.approvalStatus) qs.set('approvalStatus', params.approvalStatus);
  if (params?.q) qs.set('q', params.q);
  const query = qs.toString() ? `?${qs.toString()}` : '';
  return request<FleetOverview>(`/admin/fleet/overview${query}`, { headers: authHeaders(token) });
}

export function adminApproveTruck(token: string, truckId: string) {
  return request<{ message: string; messageCode?: string; truckCode: string }>(`/admin/trucks/${truckId}/approve`, {
    method: 'PUT',
    headers: authHeaders(token),
  });
}

export function adminRejectTruck(
  token: string,
  truckId: string,
  reason: string,
  rejectedDocuments?: string[],
  documentApprovals?: Record<string, 'approved' | 'rejected'>
) {
  return request<{ message: string; messageCode?: string; truckCode: string }>(`/admin/trucks/${truckId}/reject`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ reason, rejectedDocuments, documentApprovals }),
  });
}

/**
 * Ported for completeness (mirrors `TruckDetailScreen.tsx`'s driver
 * link-request / resubmit actions), but note both backend routes
 * (`PUT /trucks/link-requests/:driverId`, `POST /trucks/:id/resubmit`)
 * are `requireRole('agent', 'truck_owner')`-gated — the admin portal never
 * has permission to call them, which is why the mobile screen only renders
 * those buttons when `roleSegment !== 'admin'`. Not wired into any admin UI.
 */
export function decideTruckLinkRequest(token: string, driverId: string, decision: 'approved' | 'rejected') {
  return request<{ ok: boolean; decision: string; truckId?: string }>(`/trucks/link-requests/${driverId}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ decision }),
  });
}

export function resubmitTruckForReview(token: string, truckId: string) {
  return request<Truck>(`/trucks/${truckId}/resubmit`, {
    method: 'POST',
    headers: authHeaders(token),
  });
}

// ─── Trips: destination-change approvals & waybills ─────────────────────────

export function respondToDestinationChange(
  token: string,
  tripId: string,
  decision: 'approve' | 'reject',
  additionalCost?: number
) {
  return request<{ destinationChange: DestinationChange }>(`/trips/${tripId}/destination-change/respond`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ decision, additionalCost }),
  });
}

export function requestTripWaybill(token: string, tripId: string) {
  return request<Trip>(`/trips/${tripId}/waybill/request`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({}),
  });
}

export function adminApproveWaybill(token: string, tripId: string, decision: 'approve' | 'reject', notes?: string) {
  return request<{ ok: boolean; waybillApprovalStatus: string; waybillDriverStatus: string }>(
    `/admin/trips/${tripId}/waybill-approval`,
    {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify({ decision, notes }),
    },
  );
}

export function adminSetWaybillDeliveredToDiziel(token: string, tripId: string) {
  return request<{ ok: boolean; waybillDriverStatus: string }>(`/admin/trips/${tripId}/waybill-driver-status`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ status: 'delivered_to_diziel' }),
  });
}

export function adminSetWaybillDeliveredToCompany(token: string, tripId: string) {
  return request<{ ok: boolean; waybillDriverStatus: string }>(`/admin/trips/${tripId}/waybill-driver-status`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ status: 'delivered_to_company' }),
  });
}
