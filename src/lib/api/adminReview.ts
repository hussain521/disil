import { authHeaders, request } from './core';

/**
 * Typed API client for the admin-review screen group (Documents, Approvals
 * queue, Complaints, Ratings, Categories). Mirrors the relevant functions in
 * `services/api.ts` (mobile) 1:1 — see the referenced backend routes for each
 * function for the authoritative shapes.
 */

// ─── Documents (backend/routes/documents.js) ─────────────────────────────────

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
  | string;

export type DocumentStatus = 'pending' | 'approved' | 'rejected';

export interface AdminDocument {
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
  user?: { id: string; fullName: string; phone: string; role: string } | null;
  truck?: { id: string; plateNumber: string; type: string } | null;
}

/** `GET /documents/pending` — paginated, filterable by `type`/`role`. */
export function adminGetPendingDocuments(
  token: string,
  params?: { type?: string; role?: string; page?: number; limit?: number }
) {
  const qs = new URLSearchParams();
  if (params?.type) qs.set('type', params.type);
  if (params?.role) qs.set('role', params.role);
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  const query = qs.toString() ? `?${qs.toString()}` : '';
  return request<{ documents: AdminDocument[]; total: number; page: number; pages: number }>(
    `/documents/pending${query}`,
    { headers: authHeaders(token) }
  );
}

/** `GET /documents/user/:userId` — all documents for a single user (any status). */
export function adminGetUserDocuments(token: string, userId: string) {
  return request<{ documents: AdminDocument[] }>(`/documents/user/${userId}`, {
    headers: authHeaders(token),
  });
}

/** `PUT /documents/:id/review` — `reason` required when `decision === 'reject'`. */
export function adminReviewDocument(
  token: string,
  docId: string,
  decision: 'approve' | 'reject',
  reason?: string,
  notes?: string
) {
  return request<{ document: AdminDocument }>(`/documents/${docId}/review`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ decision, reason, notes }),
  });
}

// ─── Approvals queue (backend/routes/admin.js) ───────────────────────────────

export interface TruckApprovalItem {
  id: string;
  truckCode: string;
  plateNumber: string | null;
  headType: string;
  type: string;
  agentId: string | null;
  agentName: string | null;
  agentPhone: string | null;
  licenseFrontPhoto: string | null;
  licenseBackPhoto: string | null;
  trailerLicenseFrontPhoto: string | null;
  trailerLicenseBackPhoto: string | null;
  createdAt: string;
}

export interface ApprovalQueue {
  counts: {
    registrations: number;
    documents: number;
    agentChanges: number;
    routeChanges: number;
    priceEdits: number;
    financialAdjustments: number;
    truckApprovals: number;
    managerChanges: number;
    total: number;
  };
  registrations: { id: string; fullName: string; phone: string; role: string; createdAt: string }[];
  documents: {
    id: string;
    type: string;
    userId: string | null;
    userName: string | null;
    userRole: string | null;
    createdAt: string;
  }[];
  agentChanges: {
    id: string;
    fullName: string;
    phone: string;
    role: string;
    requestedCode: string | null;
    reason: string | null;
    requestedAt: string | null;
  }[];
  routeChanges: {
    orderId: string;
    clientName: string | null;
    newAddress: string | null;
    reason: string | null;
    additionalCost: number;
    requestedAt: string | null;
  }[];
  priceEdits: {
    orderId: string;
    clientName: string | null;
    currentPrice: number;
    proposedPrice: number | null;
    reason: string | null;
    requestedBy: string | null;
    requestedAt: string | null;
  }[];
  financialAdjustments: {
    id: string;
    accountUserId: string | null;
    accountUserName: string | null;
    accountRole: string;
    category: string;
    direction: 'credit' | 'debit';
    amount: number;
    reason: string | null;
    createdAt: string;
  }[];
  truckApprovals: TruckApprovalItem[];
  managerChanges: {
    truckId: string;
    truckCode: string;
    plateNumber: string;
    ownerId: string | null;
    ownerName: string | null;
    ownerPhone: string | null;
    currentMode: 'owner' | 'agent' | 'driver';
    requestedMode: 'owner' | 'agent' | 'driver' | null;
    reason: string | null;
    requestedAt: string | null;
  }[];
}

/** `GET /admin/approvals/queue` — unified pending-approval queue across subsystems. */
export function adminGetApprovalsQueue(token: string) {
  return request<ApprovalQueue>('/admin/approvals/queue', { headers: authHeaders(token) });
}

/** `PUT /admin/trucks/:id/approve` */
export function adminApproveTruck(token: string, truckId: string) {
  return request<{ message: string; messageCode?: string; truckCode: string }>(`/admin/trucks/${truckId}/approve`, {
    method: 'PUT',
    headers: authHeaders(token),
  });
}

/** `PUT /admin/trucks/:id/reject` */
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

/** `PUT /admin/trucks/:id/manager-change/decide` */
export function adminDecideManagerChange(
  token: string,
  truckId: string,
  data: { decision: 'approved' | 'rejected'; reason?: string }
) {
  return request<{
    ok: boolean;
    decision: 'approved' | 'rejected';
    truckId: string;
    managementMode: string;
    managedByUserId: string | null;
  }>(`/admin/trucks/${truckId}/manager-change/decide`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

/** `PUT /orders/:orderId/route-change/decide` */
export function adminDecideRouteChange(token: string, orderId: string, decision: 'approved' | 'rejected') {
  return request<any>(`/orders/${orderId}/route-change/decide`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ decision }),
  });
}

export interface PriceEditRequest {
  pending: boolean;
  proposedPrice: number | null;
  reason: string | null;
  requestedBy: string | null;
  requestedAt: string | null;
  decision: 'approved' | 'rejected' | null;
  decidedAt: string | null;
  decidedBy: string | null;
  decisionReason: string | null;
}

/** `PUT /orders/:orderId/price-edit/decide` */
export function decidePriceEdit(
  token: string,
  orderId: string,
  data: { decision: 'approved' | 'rejected'; decisionReason?: string }
) {
  return request<{ priceEditRequest: PriceEditRequest; price: number }>(`/orders/${orderId}/price-edit/decide`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

interface LedgerEntry {
  id: string;
  [key: string]: unknown;
}

/** `POST /financial/entries/:entryId/approve` */
export function adminApproveEntry(token: string, entryId: string) {
  return request<{ entry: LedgerEntry }>(`/financial/entries/${entryId}/approve`, {
    method: 'POST',
    headers: authHeaders(token),
  });
}

/** `POST /financial/entries/:entryId/reject` */
export function adminRejectEntry(token: string, entryId: string, reason?: string) {
  return request<{ entry: LedgerEntry }>(`/financial/entries/${entryId}/reject`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ reason }),
  });
}

// ─── Complaints (backend/routes/complaints.js) ───────────────────────────────

export type ComplaintStatus = 'open' | 'in_review' | 'resolved' | 'closed';

export type Complaint = {
  id: string;
  submittedBy: string | { id: string; fullName: string; role: string; phone?: string };
  orderId: string | null;
  subject: string;
  description: string;
  status: ComplaintStatus;
  resolvedBy: string | { id: string; fullName: string } | null;
  resolution: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

/** `GET /complaints` (admin) — optionally filtered by status; returns per-status counts. */
export function adminGetComplaints(token: string, params?: { status?: ComplaintStatus }) {
  const q = new URLSearchParams();
  if (params?.status) q.set('status', params.status);
  const qs = q.toString() ? `?${q.toString()}` : '';
  return request<{ complaints: Complaint[]; counts: Record<ComplaintStatus, number> }>(`/complaints${qs}`, {
    headers: authHeaders(token),
  });
}

/** `PUT /complaints/:id/status` */
export function adminUpdateComplaintStatus(
  token: string,
  id: string,
  data: { status: ComplaintStatus; resolution?: string }
) {
  return request<{ complaint: Complaint }>(`/complaints/${id}/status`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

// ─── Ratings (backend/routes/ratings.js) ─────────────────────────────────────

/** Leaderboard endpoint only supports these three subject types (`GET /ratings/leaderboard`). */
export type RatingSubjectType = 'driver' | 'truck' | 'agent';

export interface RatingLeaderboardRow {
  subjectId: string;
  label: string;
  avg: number;
  count: number;
}

/** `GET /ratings/leaderboard?subjectType=` */
export function adminGetRatingsLeaderboard(token: string, subjectType: RatingSubjectType = 'driver') {
  return request<{ subjectType: RatingSubjectType; leaderboard: RatingLeaderboardRow[] }>(
    `/ratings/leaderboard?subjectType=${subjectType}`,
    { headers: authHeaders(token) }
  );
}

// ─── Service categories (backend/routes/admin.js) ────────────────────────────

export type ServiceCategory = {
  id?: string;
  key: string;
  nameAr: string;
  nameEn: string;
  isActive?: boolean;
  subcategories?: { id?: string; key: string; nameAr: string; nameEn: string }[];
};

/** `GET /admin/service-categories` */
export function adminGetServiceCategories(token: string) {
  return request<{ categories: ServiceCategory[] }>('/admin/service-categories', {
    headers: authHeaders(token),
  });
}

/** `POST /admin/service-categories` */
export function adminCreateServiceCategory(
  token: string,
  body: { key: string; nameAr: string; nameEn: string; subcategories?: ServiceCategory['subcategories'] }
) {
  return request<{ category: ServiceCategory }>('/admin/service-categories', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
}

/** `PUT /admin/service-categories/:id` */
export function adminUpdateServiceCategory(
  token: string,
  id: string,
  body: Partial<{ nameAr: string; nameEn: string; isActive: boolean; subcategories: ServiceCategory['subcategories'] }>
) {
  return request<{ category: ServiceCategory }>(`/admin/service-categories/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
}

/** `DELETE /admin/service-categories/:id` */
export function adminDeleteServiceCategory(token: string, id: string) {
  return request<{ ok: boolean }>(`/admin/service-categories/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
}
