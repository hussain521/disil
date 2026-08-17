import { authHeaders, request } from './core';
import type { AuthUser } from './auth';

/**
 * Types + request functions for the admin-core screen group (Dashboard,
 * Orders, Order Detail, Users, User Detail, Profile). Mirrors the shapes and
 * signatures of the matching functions in `services/api.ts` (mobile) —
 * cross-checked against `backend/routes/{admin,orders,users,documents,financial}.js`.
 */

// ─── Shared / cross-cutting types ────────────────────────────────────────────

export type TruckStatus = 'available' | 'on_trip' | 'maintenance' | 'inactive';

export interface TruckParty {
  id: string;
  fullName: string;
  phone: string;
  rating?: number;
  companyName?: string | null;
  agentCode?: string | null;
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
  ownerDetails?: {
    name: string;
    phone?: string | null;
    notes?: string | null;
    nationalId?: string | null;
    address?: string | null;
    idFrontPhoto?: string | null;
    idBackPhoto?: string | null;
  } | null;
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

/** Mirrors `Truck` in `services/api.ts` — trimmed to fields the admin-core UI reads. */
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
  workPreferences?: string[];
  tractor?: TruckVehicleDetails | null;
  trailer?: TruckVehicleDetails | null;
  busy?: boolean;
  activeTrip?: ActiveTripInfo | null;
  operationalStatus?: 'available' | 'in_trip' | 'maintenance' | 'unavailable' | 'under_document_review';
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'created'
  | 'pending_admin_approval'
  | 'pending_truck_owner_approval'
  | 'pending_driver_approval'
  | 'approved'
  | 'driver_en_route_to_pickup'
  | 'picked_up'
  | 'in_transit'
  | 'arrived'
  | 'delivered'
  | 'payment_pending'
  | 'closed'
  | 'cancelled'
  | 'reassign_needed'
  | string;

export interface Order {
  id: string;
  orderCode?: string | null;
  clientId: string | null;
  createdByAgentId?: string | null;
  agentId: string | null;
  truckId: string | null;
  suggestedTruckId?: string | null;
  driverId: string | null;
  suggestedDriverId?: string | null;
  status: OrderStatus;
  pickup: { address: string; details?: string | null; lat?: number | null; lng?: number | null };
  delivery: { address: string; details?: string | null; lat?: number | null; lng?: number | null };
  cargo: {
    type: string;
    weight: number;
    description?: string | null;
    dimensions?: { length?: number | null; width?: number | null; height?: number | null } | null;
    packageDimensions?: { length?: number | null; width?: number | null; height?: number | null } | null;
  };
  distanceKm?: number | null;
  price?: number | null;
  priceType?: 'unit' | 'shipment' | 'agent_offer' | 'fixed' | null;
  adminFee?: number | null;
  advancePaid?: number;
  transportType?: 'local' | 'port' | 'international' | 'corporate' | null;
  milestones?: {
    key: string;
    label?: string;
    scheduledAt?: string | null;
    completedAt?: string | null;
    status?: string;
  }[];
  truckTypes?: string[];
  numTrucks?: number;
  loadingDate?: string | null;
  deliveryDate?: string | null;
  paymentMethod?: string | null;
  paymentScheduleType?: 'on_pickup' | 'on_delivery' | 'split_pickup_delivery' | null;
  roadExpensesParty?: 'client' | 'diziel' | 'vehicle' | null;
  roadExpenseTypes?: string[];
  insuranceRequired?: boolean;
  notes?: string | null;
  loadingDemurrageRules?: string | null;
  unloadingDemurrageRules?: string | null;
  cancelledBy?: string | null;
  cancelReason?: string | null;
  adminAssignedAt?: string | null;
  agentOffers?: {
    id?: string;
    agentId?: string;
    agentName?: string | null;
    agentCode?: string | null;
    providerPrice: number;
    notes?: string | null;
    status: 'submitted' | 'selected' | 'rejected' | 'withdrawn' | 'accepted';
    createdAt?: string;
    reviewedAt?: string | null;
    negotiationRound?: number;
    negotiationRounds?: number;
  }[];
  offerSummary?: {
    totalOffers: number;
    submittedOffers: number;
    hasNewOffers: boolean;
    maxNegotiationRounds: number;
    priceNegotiationEvents: number;
    hasNegotiation: boolean;
  };
  priceNegotiations?: {
    at?: string;
    action: string;
    byRole?: string | null;
    fromPrice?: number | null;
    toPrice?: number | null;
    reason?: string | null;
  }[];
  selectedOfferId?: string | null;
  routeChangeRequest?: {
    pending?: boolean;
    newAddress?: string | null;
    decision?: 'approved' | 'rejected' | null;
    requestedAt?: string | null;
  } | null;
  paymentStatus?: 'unpaid' | 'partial' | 'paid';
  paymentConfirmation?: {
    senderInfo: string;
    senderName?: string | null;
    referenceNumber?: string | null;
    paymentDetailType?: string | null;
    confirmedAt: string;
    confirmedBy?: string | null;
  } | null;
  createdAt?: string;
  updatedAt?: string;
  client?: { id: string; fullName: string; phone: string; companyName?: string | null };
  agent?: { id: string; fullName: string; phone: string };
  driverInfo?: { id: string; fullName: string; phone: string; rating?: number };
  suggestedDriverInfo?: { id: string; fullName: string; phone: string; rating?: number };
  truckInfo?: {
    id: string;
    plateNumber: string;
    type: string;
    capacity: number;
    truckCode?: string | null;
    owner?: TruckParty | null;
    agent?: TruckParty | null;
    driver?: TruckParty | null;
  };
  suggestedTruckInfo?: {
    id: string;
    plateNumber: string;
    type: string;
    capacity: number;
    truckCode?: string | null;
    owner?: TruckParty | null;
    agent?: TruckParty | null;
    driver?: TruckParty | null;
  };
  pricingFinal?: boolean;
  paymentBreakdown?: {
    orderValue: number;
    expenses: number;
    holidays: number;
    taxes: number;
    insurance: number;
    adminFees?: number;
    dizielFee?: number;
    total: number;
    paid: number;
    remaining: number;
    method?: string | null;
    paidAt?: string | null;
    recipient?: string | null;
  };
  waybillStatus?: 'none' | 'requested' | 'received' | null;
  truckPaymentStatus?: string | null;
  ratings?: {
    id: string;
    stars: number;
    comment?: string | null;
    subjectType: string;
    ratedBy?: { id: string; fullName: string; role: string } | null;
  }[];
}

export interface OrdersPage {
  orders: Order[];
  total: number;
  page: number;
  pages: number;
}

export function adminGetOrders(
  token: string,
  params?: { status?: string; driverId?: string; q?: string; page?: number; limit?: number }
) {
  const qs = new URLSearchParams();
  if (params?.status) qs.set('status', params.status);
  if (params?.driverId) qs.set('driverId', params.driverId);
  if (params?.q) qs.set('q', params.q);
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  const query = qs.toString() ? `?${qs.toString()}` : '';
  return request<OrdersPage>(`/admin/orders${query}`, { headers: authHeaders(token) });
}

export function adminGetOrder(token: string, id: string) {
  return request<Order>(`/admin/orders/${id}`, { headers: authHeaders(token) });
}

export function adminAssignOrder(
  token: string,
  orderId: string,
  truckId: string,
  driverId: string,
  price?: number,
  adminFee?: number
) {
  return request<Order>(`/admin/orders/${orderId}/assign`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ truckId, driverId, price, adminFee }),
  });
}

export function adminSetFee(token: string, orderId: string, adminFee: number, price?: number) {
  return request<Order>(`/admin/orders/${orderId}/set-fee`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ adminFee, price }),
  });
}

export function adminCancelOrder(token: string, orderId: string, reason?: string) {
  return request<Order>(`/admin/orders/${orderId}/cancel`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ reason }),
  });
}

export function releaseOrderTruck(token: string, orderId: string, reason?: string) {
  return request<Order>(`/admin/orders/${orderId}/release-truck`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ reason }),
  });
}

export function adminCloseOrder(token: string, orderId: string) {
  return request<Order>(`/admin/orders/${orderId}/close`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({}),
  });
}

export function adminPublishOrder(token: string, orderId: string) {
  return request<Order>(`/admin/orders/${orderId}/publish`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({}),
  });
}

export function adminForceApproveOrder(token: string, orderId: string) {
  return request<Order & { tripId: string }>(`/admin/orders/${orderId}/force-approve`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({}),
  });
}

export function adminSelectOrderOffer(token: string, orderId: string, offerId: string) {
  return request<Order>(`/admin/orders/${orderId}/offers/${offerId}/select`, {
    method: 'PUT',
    headers: authHeaders(token),
  });
}

/** Note: lives on `orders.js` (not `/admin/*`) — mirrors `adminSetOrderPaymentStatus` in `services/api.ts`. */
export function adminSetOrderPaymentStatus(
  token: string,
  orderId: string,
  paymentStatus: 'unpaid' | 'partial' | 'paid',
  senderInfo?: string,
  paymentDetailType?: string
) {
  return request<Order>(`/orders/${orderId}/payment-status`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ paymentStatus, senderInfo, paymentDetailType }),
  });
}

export function adminDecideRouteChange(token: string, orderId: string, decision: 'approved' | 'rejected') {
  return request<Order>(`/orders/${orderId}/route-change/decide`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ decision }),
  });
}

export function confirmOrderDeposit(
  token: string,
  orderId: string,
  data: { amount: number; method?: string; proofDocId?: string }
) {
  return request<Order>(`/orders/${orderId}/deposit/confirm`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export function confirmOrderBalance(token: string, orderId: string, data: { amount: number; method?: string }) {
  return request<Order>(`/orders/${orderId}/balance/confirm`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export interface LedgerEntry {
  id: string;
  accountUserId: string | null;
  accountRole: 'client' | 'driver' | 'truck_owner' | 'agent' | 'admin';
  direction: 'credit' | 'debit';
  amount: number;
  currency: string;
  category: string;
  description: string | null;
  orderId: string | null;
  status: 'open' | 'under_review' | 'settled' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface OrderStatement {
  orderId: string;
  client: { id: string; name: string } | null;
  agent: { id: string; name: string } | null;
  price: number;
  deposit: any;
  balance: any;
  certified: boolean;
  entries: LedgerEntry[];
}

export function getOrderStatement(token: string, orderId: string) {
  return request<OrderStatement>(`/financial/orders/${orderId}/statement`, { headers: authHeaders(token) });
}

export function adminGetTrucks(token: string) {
  return request<{ trucks: Truck[] }>('/admin/trucks', { headers: authHeaders(token) });
}

// ─── Dashboard / stats ────────────────────────────────────────────────────────

export interface AdminStats {
  totalOrders: number;
  pendingAdminReview: number;
  approvedUnassigned: number;
  active: number;
  delivered: number;
  totalUsers: number;
  totalTrucks: number;
  newOffers: number;
}


export interface RecentOfferItem {
  orderId: string;
  orderCode?: string | null;
  orderStatus: string;
  clientName?: string | null;
  pickup?: string | null;
  delivery?: string | null;
  offerId?: string | null;
  agentId?: string | null;
  agentName?: string | null;
  agentCode?: string | null;
  providerPrice: number;
  notes?: string | null;
  createdAt?: string;
  negotiationRounds: number;
}

export function adminGetRecentOffers(token: string, limit = 20) {
  return request<{ offers: RecentOfferItem[]; total: number }>(
    `/admin/offers/recent?limit=${limit}`,
    { headers: authHeaders(token) }
  );
}

export function adminGetStats(token: string) {
  return request<AdminStats>('/admin/stats', { headers: authHeaders(token) });
}

// ─── Users ────────────────────────────────────────────────────────────────────

export interface AdminUserRelation {
  id: string;
  fullName: string;
  phone: string;
}

export interface AdminUser {
  id: string;
  fullName: string;
  phone: string;
  role: string;
  isActive: boolean;
  licenseStatus: string;
  rating: number;
  createdAt?: string;
  profilePhoto?: string | null;
  agentCode?: string | null;
  truckOwnerCode?: string | null;
  driverCode?: string | null;
  clientCode?: string | null;
  truckCount?: number | null;
  orderCount?: number | null;
  accountStatus?: 'under_review' | 'accepted' | 'rejected' | 'active' | 'idle';
  rejectionReason?: string | null;
  companyType?: 'company' | 'individual' | null;
  companyName?: string | null;
  parentCompanyId?: {
    id: string;
    fullName: string;
    companyName?: string | null;
    phone: string;
  } | null;
  companyRole?: string | null;
  isLinkedToTruck?: boolean;
  assignedTruck?: {
    id: string;
    plateNumber: string;
    truckCode?: string | null;
    type: string;
    owner?: AdminUserRelation | null;
    agent?: AdminUserRelation | null;
  } | null;
}

export interface AdminTruckSummary {
  id: string;
  plateNumber: string;
  type: string;
  capacity: number;
  status: TruckStatus;
  truckCode?: string | null;
  headType?: 'fardany' | 'ras' | 'jambo' | null;
  trailerType?: 'dail' | 'maqtoura' | null;
  owner?: AdminUserRelation | null;
  agent?: AdminUserRelation | null;
  assignedDriver?: { id: string; fullName: string; phone: string; rating?: number } | null;
  busy?: boolean;
}

export type TripStatus =
  | 'pending'
  | 'en_route_to_pickup'
  | 'at_pickup'
  | 'in_transit'
  | 'at_delivery'
  | 'completed'
  | 'cancelled';

export interface AdminTripSummary {
  id: string;
  status: TripStatus;
  startedAt?: string | null;
  completedAt?: string | null;
  updatedAt?: string;
  order?: {
    id: string;
    orderCode?: string | null;
    status: string;
    pickup: { address: string; lat?: number | null; lng?: number | null };
    delivery: { address: string; lat?: number | null; lng?: number | null };
    cargo: { type: string; weight: number; description?: string | null };
    price?: number | null;
  } | null;
  truck?: { id: string; plateNumber: string; type: string; capacity: number } | null;
  driver?: { id: string; fullName: string; phone: string; rating?: number } | null;
}

export interface AdminUserDetail extends AdminUser {
  linkedAgent?: AdminUserRelation | null;
  linkedTruckOwner?: AdminUserRelation | null;
  clientType?: string | null;
  accountManager?: {
    name: string;
    phone?: string | null;
    email?: string | null;
    jobTitle?: string | null;
  } | null;
  stats: {
    truckCount: number;
    orderCount: number;
    tripCount: number;
    activeTripCount: number;
  };
  trucks: AdminTruckSummary[];
  orders: Order[];
  trips: AdminTripSummary[];
  currentTrip?: AdminTripSummary | null;
}

export function adminGetUsers(
  token: string,
  params?: {
    role?: string;
    companyType?: 'company' | 'individual';
    driverTruckStatus?: 'all' | 'linked' | 'unlinked' | 'approved_no_orders';
    q?: string;
    page?: number;
    limit?: number;
  }
) {
  const qs = new URLSearchParams();
  if (params?.role) qs.set('role', params.role);
  if (params?.companyType) qs.set('companyType', params.companyType);
  if (params?.driverTruckStatus && params.driverTruckStatus !== 'all') qs.set('driverTruckStatus', params.driverTruckStatus);
  if (params?.q) qs.set('q', params.q);
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  const query = qs.toString() ? `?${qs.toString()}` : '';
  return request<{ users: AdminUser[]; total: number; page: number; pages: number }>(`/admin/users${query}`, {
    headers: authHeaders(token),
  });
}

export function adminGetPendingReviewUsers(token: string, params?: { q?: string }) {
  const query = params?.q ? `?q=${encodeURIComponent(params.q)}` : '';
  return request<{ users: AdminUser[] }>(`/admin/users/pending-review${query}`, {
    headers: authHeaders(token),
  });
}

export function adminToggleUserActive(token: string, userId: string) {
  return request<{ id: string; isActive: boolean }>(`/admin/users/${userId}/toggle-active`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({}),
  });
}

export function adminActivateUser(token: string, userId: string) {
  return request<{ id: string; accountStatus: 'active'; isActive: boolean; missing?: string[] }>(
    `/admin/users/${userId}/activate`,
    { method: 'PUT', headers: authHeaders(token), body: JSON.stringify({}) }
  );
}

export function adminRejectUser(token: string, userId: string, reason: string) {
  return request<{ id: string; accountStatus: 'rejected'; rejectionReason: string }>(`/admin/users/${userId}/reject`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ reason }),
  });
}

export function adminGetUser(token: string, userId: string) {
  return request<AdminUserDetail>(`/admin/users/${userId}`, { headers: authHeaders(token) });
}

export function adminSetTruckVisibility(token: string, truckId: string, hidden: boolean) {
  return request<AdminTruckSummary>(`/admin/trucks/${truckId}/visibility`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ hidden }),
  });
}

export interface TruckComposeOptionUser {
  id: string;
  fullName: string;
  phone: string;
  truckOwnerCode?: string | null;
  linkedTruckOwnerId?: string | null;
  linkedTruckOwnerCode?: string | null;
}

export interface TruckComposeOptions {
  truckOwners: TruckComposeOptionUser[];
  drivers: TruckComposeOptionUser[];
  workPreferenceOptions: string[];
  tractorBrands: string[];
  trailerBrands: string[];
  headTypes: ('fardany' | 'ras' | 'jambo')[];
  trailerTypes: ('dail' | 'maqtoura')[];
}

export function adminGetTruckComposeOptions(token: string, userId: string) {
  return request<TruckComposeOptions>(`/admin/users/${userId}/trucks/compose-options`, {
    headers: authHeaders(token),
  });
}

export interface CreateFullTruckPayload {
  truckOwnerId?: string;
  driverId?: string;
  agentIsOwner?: boolean;
  headType: 'fardany' | 'ras' | 'jambo';
  trailerType?: 'dail' | 'maqtoura' | null;
  operationType: string;
  capacity: number;
  totalAxles?: number;
  safetyFeatures?: string[];
  workPreferences?: string[];
  truckNotes?: string;
  vehiclePhotos?: string[];
  tractor: TruckVehicleDetails;
  trailer?: TruckVehicleDetails | null;
  managementMode?: 'owner' | 'agent' | 'driver';
  ownershipDocPhoto?: string;
}

export type CreatedOwnerCredentials = {
  phone: string;
  temporaryPassword: string;
};

export function adminCreateTruckForUser(token: string, userId: string, data: CreateFullTruckPayload) {
  return request<Truck & { createdOwnerCredentials?: CreatedOwnerCredentials }>(`/admin/users/${userId}/trucks`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

// ─── Documents (used from User Detail) ───────────────────────────────────────

export type DocumentType =
  | 'photo'
  | 'professional_license'
  | 'professional_license_back'
  | 'national_id'
  | 'national_id_back'
  | 'drug_test'
  | 'drug_test_back'
  | 'criminal_record'
  | 'criminal_record_back'
  | 'passport'
  | 'passport_back'
  | 'visa'
  | 'visa_back'
  | 'birth_certificate'
  | 'birth_certificate_back'
  | 'guardian_poa'
  | 'guardian_poa_back'
  | 'manager_poa'
  | 'manager_poa_back'
  | 'commercial_reg'
  | 'commercial_reg_back'
  | 'tax_card'
  | 'tax_card_back'
  | 'manager_national_id'
  | 'manager_national_id_back'
  | 'truck_license'
  | 'vehicle_license_front'
  | 'vehicle_license_back'
  | 'truck_image'
  | 'insurance'
  | 'check_image'
  | 'other';

export type DocumentStatus = 'pending' | 'approved' | 'rejected';

export interface Document {
  id: string;
  userId: string;
  truckId?: string | null;
  type: DocumentType;
  fileUrl: string;
  originalName?: string | null;
  mimeType?: string | null;
  status: DocumentStatus;
  expiresAt?: string | null;
  rejectionReason?: string | null;
  reviewNotes?: string | null;
  reviewedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminDocument extends Document {
  user?: { id: string; fullName: string; phone: string; role: string } | null;
  truck?: { id: string; plateNumber: string; type: string } | null;
}

export function adminGetUserDocuments(token: string, userId: string) {
  return request<{ documents: AdminDocument[] }>(`/documents/user/${userId}`, {
    headers: authHeaders(token),
  });
}

export function adminReviewDocument(token: string, docId: string, decision: 'approve' | 'reject', reason?: string, notes?: string) {
  return request<{ document: AdminDocument }>(`/documents/${docId}/review`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ decision, reason, notes }),
  });
}

/** Resolves a possibly-relative document/photo URL (as returned by the API) against the API origin. */
export function resolveFileUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  return `${apiUrl.replace(/\/api\/?$/, '')}${url}`;
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export function updateProfile(
  token: string,
  data: { fullName?: string; profilePhoto?: string | null; preferredLanguage?: 'ar' | 'en' }
) {
  return request<AuthUser>('/users/profile', {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export function changePassword(token: string, currentPassword: string, newPassword: string) {
  return request<{ message: string }>('/users/change-password', {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}
