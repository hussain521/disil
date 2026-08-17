import { authHeaders, request } from './core';

/**
 * Typed API client for the accounts admin screens (Financial, Dashboards,
 * Payment Details, Pricing, Quotes). Mirrors the matching functions in
 * `services/api.ts` (mobile) — see `backend/routes/financial.js`,
 * `backend/routes/pricing.js`, and `backend/routes/quotes.js` for the
 * underlying endpoints.
 */

// ─── Financial ────────────────────────────────────────────────────────────────

export type FinancialPeriod = 'daily' | 'weekly' | 'monthly';

export interface FinancialSummaryTotals {
  revenue: number;
  driverPay: number;
  truckCost: number;
  depreciation: number;
  profit: number;
  tax: number;
  agentCommission: number;
  adjustments: number;
}

export interface FinancialSummary {
  period: string;
  since: string;
  totals: FinancialSummaryTotals;
  rows: any[];
}

export interface LedgerEntry {
  id: string;
  accountUserId: string | null;
  accountRole: 'client' | 'driver' | 'truck_owner' | 'agent' | 'admin';
  agentAccountKind?: 'accepted_offer' | 'app_requested' | null;
  direction: 'credit' | 'debit';
  amount: number;
  currency: string;
  category: string;
  description: string | null;
  orderId: string | null;
  tripId: string | null;
  paymentId: string | null;
  status: 'open' | 'under_review' | 'settled' | 'rejected';
  createdByRole: string | null;
  createdByUserId: string | null;
  reason: string | null;
  approval: { required: boolean; approvedBy?: string | null; approvedAt?: string | null; rejectionReason?: string | null };
  settledAt: string | null;
  meta?: any;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialBucket {
  credit: number;
  debit: number;
  count: number;
}

export interface UserWallet {
  id: string;
  kind: 'wallet' | 'bank';
  provider: string | null;
  accountName: string | null;
  accountNumber: string;
  iban: string | null;
  isDefault: boolean;
  verified: boolean;
  createdAt: string;
}

export interface FinancialCenter {
  role: string;
  walletBalance: number;
  wallets: UserWallet[];
  summary: {
    buckets: {
      settled?: FinancialBucket;
      open?: FinancialBucket;
      under_review?: FinancialBucket;
      rejected?: FinancialBucket;
      openOperations?: FinancialBucket;
      completedOperations?: FinancialBucket;
      pendingTransferConfirmation?: FinancialBucket;
    };
    netBalance: number;
    openOperationsTotal?: number;
    completedOperationsTotal?: number;
    walletDifference?: number;
  };
  entries: LedgerEntry[];
  openOperationsTotal?: number;
  completedOperationsTotal?: number;
  walletDifference?: number;
}

/** `GET /financial/reports/summary?period=` — period KPI totals for the admin financial screen. */
export function adminGetFinancialSummary(token: string, period: FinancialPeriod = 'daily') {
  return request<FinancialSummary>(`/financial/reports/summary?period=${period}`, {
    headers: authHeaders(token),
  });
}

/** `GET /financial/me` — the current (admin) user's own ledger/wallet view; used here for pending under-review entries. */
export function getMyFinancialCenter(token: string, params?: { status?: string; agentKind?: string; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.status) qs.set('status', params.status);
  if (params?.agentKind) qs.set('agentKind', params.agentKind);
  if (params?.limit) qs.set('limit', String(params.limit));
  const query = qs.toString() ? `?${qs.toString()}` : '';
  return request<FinancialCenter>(`/financial/me${query}`, {
    headers: authHeaders(token),
  });
}

/** `POST /financial/entries/:id/approve` — approve an under-review ledger entry. */
export function adminApproveEntry(token: string, entryId: string) {
  return request<{ entry: LedgerEntry }>(`/financial/entries/${entryId}/approve`, {
    method: 'POST',
    headers: authHeaders(token),
  });
}

/** `POST /financial/entries/:id/reject` — reject an under-review ledger entry. */
export function adminRejectEntry(token: string, entryId: string, reason?: string) {
  return request<{ entry: LedgerEntry }>(`/financial/entries/${entryId}/reject`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ reason }),
  });
}

/** `POST /financial/entries/:id/settle` — mark an open ledger entry as settled. */
export function adminSettleEntry(token: string, entryId: string) {
  return request<{ entry: LedgerEntry }>(`/financial/entries/${entryId}/settle`, {
    method: 'POST',
    headers: authHeaders(token),
  });
}

// ─── Dashboards / analytics ────────────────────────────────────────────────────

export interface DashboardsOverview {
  period: FinancialPeriod;
  from: string;
  payments: {
    count: number;
    total: number;
    recent: {
      orderId: string;
      price: number;
      paymentStatus: string;
      confirmedAt: string | null;
      client: { id: string; fullName: string; phone: string } | null;
    }[];
  };
  profitByCategory: Record<string, { settled: number; open: number; under_review: number; rejected: number }>;
  commissions: {
    agentId: string | null;
    agentName: string;
    agentPhone: string | null;
    kind: 'accepted_offer' | 'app_requested' | null;
    total: number;
    count: number;
  }[];
}

/** `GET /admin/dashboards/overview?period=` — profit-by-category + commissions + recent payments. */
export function adminGetDashboardsOverview(token: string, period: FinancialPeriod = 'monthly') {
  return request<DashboardsOverview>(`/admin/dashboards/overview?period=${period}`, {
    headers: authHeaders(token),
  });
}

// ─── Payment details (company payment methods) ─────────────────────────────────

export interface PaymentDetail {
  id: string;
  label: string;
  type: 'bank' | 'ewallet' | 'instapay' | 'vodafone_cash';
  accountName?: string;
  accountNumber: string;
  bankName?: string | null;
  notes?: string | null;
  isDefault: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** `GET /admin/payment-details` — all company payment methods. */
export function adminGetPaymentDetails(token: string) {
  return request<{ paymentDetails: PaymentDetail[] }>('/admin/payment-details', {
    headers: authHeaders(token),
  });
}

/** `POST /admin/payment-details` — add a new company payment method. */
export function adminCreatePaymentDetail(
  token: string,
  data: {
    label: string;
    type: PaymentDetail['type'];
    accountName?: string;
    accountNumber: string;
    bankName?: string;
    notes?: string;
    isDefault?: boolean;
  }
) {
  return request<PaymentDetail>('/admin/payment-details', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

/** `PUT /admin/payment-details/:id` — update (or set default/active on) a payment method. */
export function adminUpdatePaymentDetail(
  token: string,
  id: string,
  data: Partial<{
    label: string;
    type: PaymentDetail['type'];
    accountName: string;
    accountNumber: string;
    bankName: string | null;
    notes: string | null;
    isDefault: boolean;
    isActive: boolean;
  }>
) {
  return request<PaymentDetail>(`/admin/payment-details/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

/** `DELETE /admin/payment-details/:id` — remove a company payment method. */
export function adminDeletePaymentDetail(token: string, id: string) {
  return request<{ success: boolean }>(`/admin/payment-details/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
}

// ─── Pricing tiers ──────────────────────────────────────────────────────────────

export interface PricingTier {
  _id?: string;
  upToKm: number;
  pricePerKm: number;
  weight?: number;
  withVAT?: boolean;
  label?: string;
}

export interface PricingTiersResponse {
  config: { dizielMarginPct: number; vatPct: number };
  withVAT: PricingTier[];
  withoutVAT: PricingTier[];
}

/** `GET /pricing/tiers` — km/weight pricing tiers (with/without VAT) + Diziel margin/VAT config. */
export function getPricingTiers(token: string) {
  return request<PricingTiersResponse>('/pricing/tiers', { headers: authHeaders(token) });
}

/** `PUT /pricing/tiers` — replace the with/without-VAT tier tables. */
export function updatePricingTiers(token: string, body: { withVAT?: PricingTier[]; withoutVAT?: PricingTier[] }) {
  return request<{ withVAT: PricingTier[]; withoutVAT: PricingTier[] }>('/pricing/tiers', {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
}

/** `PUT /pricing/config` — update Diziel margin % / VAT % config. */
export function updatePricingConfig(token: string, body: { dizielMarginPct?: number; vatPct?: number }) {
  return request<{ dizielMarginPct: number; vatPct: number }>('/pricing/config', {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
}

// ─── Quotes ─────────────────────────────────────────────────────────────────────

export type QuoteStatus = 'pending' | 'pricing' | 'sent_to_client' | 'accepted' | 'rejected' | 'cancelled' | 'expired';

export type ClientType = 'individual' | 'contractor' | 'company' | 'agent';

export interface QuoteRoadExpenses {
  tollCards?: number;
  armyStrip?: number;
  provinceCards?: number;
  agriCards?: number;
  portPermits?: number;
  portExpenses?: number;
}

export interface Quote {
  id: string;
  requestedBy: string | null;
  requesterRole: 'client' | 'agent';
  clientType: ClientType;
  truckCount: number;
  truckTypes: string[];
  cargo: {
    type: string;
    description?: string | null;
    quantity?: number | null;
    weight: number;
    specifications?: string | null;
  };
  pickup: { address: string; lat?: number | null; lng?: number | null };
  delivery: { address: string; lat?: number | null; lng?: number | null };
  distanceKm?: number | null;
  tripDurationDays?: number | null;
  roadExpenses: QuoteRoadExpenses;
  loadingExpenses: number;
  unloadingExpenses: number;
  insurance: {
    required: boolean;
    policyNumber?: string | null;
    insurer?: string | null;
    value?: number | null;
  };
  freeStorageDays: number;
  holidayFees: { loadingStay: number; unloadingStay: number };
  advance: { amount: number; paymentMethod?: string | null };
  paymentSchedule?: string | null;
  paymentMethod?: string | null;
  taxParty?: string | null;
  waybillDeliveryLocation?: string | null;
  allowedShortage: { percentage: number; unit?: string | null; unitPrice: number };
  routePath: string[];
  notes?: string | null;
  providerPrice?: number | null;
  dizielPrice?: number | null;
  commission?: number | null;
  commissionRate?: number | null;
  vatAmount?: number | null;
  vatApplicable?: boolean;
  finalPrice?: number | null;
  status: QuoteStatus;
  pricedBy?: string | null;
  pricedAt?: string | null;
  clientResponse?: 'accepted' | 'rejected' | null;
  clientResponseAt?: string | null;
  clientRejectionReason?: string | null;
  orderId?: string | null;
  expiresAt?: string | null;
  adminNotes?: string | null;
  createdAt?: string;
  updatedAt?: string;
  requester?: { id: string; fullName: string; phone: string; role: string; companyName?: string | null };
  quoteCode?: string | null;
  serviceCategory?: 'local' | 'port' | 'long_contract' | 'international' | null;
  scheduledFor?: string | null;
  clientTier?: 'one_time' | 'trusted' | 'long_contract' | null;
  customExpenseLines?: {
    label: string;
    amount: number;
    party?: 'client' | 'diziel' | null;
    addedByAdmin?: boolean;
  }[];
}

export interface QuotesPage {
  quotes: Quote[];
  total: number;
  page: number;
  pages: number;
}

/** `GET /quotes` (admin-scoped) — quote list + optional status filter. */
export function adminGetQuotes(token: string, params?: { status?: string; page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.status) qs.set('status', params.status);
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  const query = qs.toString() ? `?${qs.toString()}` : '';
  return request<QuotesPage>(`/quotes${query}`, { headers: authHeaders(token) });
}

/** `PUT /quotes/:id/price` — set Diziel/provider price (+ notes) and send the quote to the client. */
export function adminPriceQuote(
  token: string,
  quoteId: string,
  dizielPrice: number,
  providerPrice?: number,
  adminNotes?: string
) {
  return request<Quote>(`/quotes/${quoteId}/price`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ dizielPrice, providerPrice, adminNotes }),
  });
}
