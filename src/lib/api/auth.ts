import { authHeaders, request } from './core';

export type AdminSubRole = 'super' | 'accounts' | 'documents' | 'operations' | 'review' | 'account_manager';

/**
 * Mirrors `userPublic()` in `backend/routes/auth.js` — the shape returned by
 * `POST /auth/login` (`user`) and `GET /auth/me`.
 */
export interface AuthUser {
  id: string;
  fullName: string;
  phone: string;
  role: 'client' | 'driver' | 'truck_owner' | 'agent' | 'admin';
  adminSubRoles?: AdminSubRole[];
  profilePhoto?: string | null;
  licenseStatus?: 'none' | 'pending' | 'approved' | 'rejected';
  rating?: number;
  createdAt?: string;
  preferredLanguage?: 'ar' | 'en';
  registrationStep?: number;
  onboardingComplete?: boolean;
  accountStatus?: 'under_review' | 'accepted' | 'rejected' | 'active' | 'idle';
  rejectionReason?: string | null;
  agentCode?: string | null;
  truckOwnerCode?: string | null;
  driverCode?: string | null;
  clientCode?: string | null;
  companyType?: 'company' | 'individual' | null;
  clientTier?: 'one_time' | 'trusted' | 'long_contract' | null;
  isMinor?: boolean;
  internationalShippingEnabled?: boolean;
  linkedAgentId?: string | null;
  linkedAgentCode?: string | null;
  linkedTruckOwnerId?: string | null;
  linkedTruckOwnerCode?: string | null;
  truckLinkRequest?: {
    tractorPlate?: string | null;
    truckId?: string | null;
    status?: 'pending' | 'approved' | 'rejected' | null;
    requestedAt?: string | null;
  } | null;
  pendingAgentChange?: {
    requestedAgentCode?: string | null;
    status?: 'pending' | 'approved' | 'rejected' | null;
    requestedAt?: string | null;
  } | null;
  paymentMethods?: { type?: string; accountNumber?: string | null }[];
  delegationConfig?: {
    canDriverAccept?: boolean;
    approvalAuthority?: string | null;
    settlementAuthority?: string | null;
  } | null;
  parentCompanyId?: string | null;
  companyRole?: string | null;
  companyPermissions?: string[];
  nationalId?: string | null;
  homeAddress?: string | null;
  nationalIdFrontPhoto?: string | null;
  nationalIdBackPhoto?: string | null;
}

export interface AuthPayload {
  token: string;
  user: AuthUser;
}

export function login(role: 'admin' | 'client', phone: string, password: string) {
  return request<AuthPayload>('/auth/login', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ phone, password, role }),
  });
}

export function getMe(token: string) {
  return request<AuthUser>('/auth/me', {
    headers: authHeaders(token),
  });
}
