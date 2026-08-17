import { authHeaders, request } from './core';

/**
 * Mirrors the trip/order shapes returned by `backend/routes/trips.js`
 * (`formatTrip`) — see `services/api.ts` (mobile) for the reference types.
 */
export type TripStatus =
  | 'pending'
  | 'en_route_to_pickup'
  | 'at_pickup'
  | 'loaded'
  | 'in_transit'
  | 'at_delivery'
  | 'completed'
  | 'cancelled';

export interface TripLocation {
  lat: number;
  lng: number;
  recordedAt: string;
}

export interface DestinationChange {
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  newDeliveryAddress: string;
  newLat?: number | null;
  newLng?: number | null;
  reason?: string | null;
  additionalCost?: number | null;
  respondedAt?: string | null;
}

export interface PickupChecks {
  cargoPhotoUrl?: string | null;
  truckPhotoUrl?: string | null;
  weighbridgePhotoUrl?: string | null;
  cargoQuantityValue?: number | null;
  cargoQuantityUnit?: string | null;
  cargoQuantityConfirmed?: boolean;
  cargoNotes?: string | null;
  depositAmountReceived?: number;
  depositMethod?: string | null;
  depositConfirmedAt?: string | null;
  confirmedAt?: string | null;
  confirmedBy?: string | null;
}

export interface DeliveryChecks {
  cargoPhotoUrl?: string | null;
  truckPhotoUrl?: string | null;
  weighbridgePhotoUrl?: string | null;
  cargoQuantityValue?: number | null;
  cargoQuantityUnit?: string | null;
  cargoQuantityConfirmed?: boolean;
  cargoNotes?: string | null;
  unloadedShortageQty?: number;
  confirmedAt?: string | null;
  confirmedBy?: string | null;
}

export interface TripOrderMilestone {
  key: string;
  label?: string;
  scheduledAt?: string | null;
  completedAt?: string | null;
  status?: string;
}

export interface Trip {
  id: string;
  orderId: string;
  driverId: string;
  truckId: string;
  status: TripStatus;
  startedAt?: string | null;
  completedAt?: string | null;
  distance?: number | null;
  lastLocation?: TripLocation | null;
  locations?: TripLocation[];
  driverNotes?: string | null;
  waybillRequested?: boolean;
  waybillRequestedAt?: string | null;
  waybillReceived?: boolean;
  waybillReceivedAt?: string | null;
  waybillFileUrl?: string | null;
  waybillOriginalName?: string | null;
  waybillMimeType?: string | null;
  waybillDriverStatus?:
    | 'received_from_client'
    | 'signed_at_unloading'
    | 'delivered_to_client'
    | 'delivered_to_diziel'
    | 'unloaded_shortage'
    | 'unloaded_signed_match'
    | 'delivered_to_company'
    | null;
  waybillShortageComment?: string | null;
  waybillShortageQty?: number;
  waybillRecipientType?: 'client' | 'diziel' | null;
  waybillDeliveryNotes?: string | null;
  waybillApprovalStatus?: 'none' | 'pending' | 'approved' | 'rejected';
  newShipmentsAccepted?: boolean;
  newShipmentsAcceptedAt?: string | null;
  emergencyActive?: boolean;
  destinationChange?: DestinationChange | null;
  pickupChecks?: PickupChecks | null;
  deliveryChecks?: DeliveryChecks | null;
  createdAt?: string;
  updatedAt?: string;
  order?: {
    id: string;
    orderCode?: string | null;
    status: string;
    pickup: { address: string; lat?: number | null; lng?: number | null };
    delivery: { address: string; lat?: number | null; lng?: number | null };
    cargo: { type: string; weight: number; description?: string | null };
    price?: number | null;
    milestones?: TripOrderMilestone[];
    client?: { id: string; fullName: string; phone: string } | null;
  } | null;
  driver?: { id: string; fullName: string; phone: string; rating?: number } | null;
  truck?: { id: string; plateNumber: string; type: string; capacity: number } | null;
}

export function getTrips(
  token: string,
  params?: { status?: string; orderId?: string; truckId?: string; driverId?: string }
) {
  const qs = new URLSearchParams();
  if (params?.status) qs.set('status', params.status);
  if (params?.orderId) qs.set('orderId', params.orderId);
  if (params?.truckId) qs.set('truckId', params.truckId);
  if (params?.driverId) qs.set('driverId', params.driverId);
  const query = qs.toString() ? `?${qs.toString()}` : '';
  return request<{ trips: Trip[] }>(`/trips${query}`, { headers: authHeaders(token) });
}

export function getTripByOrder(token: string, orderId: string) {
  return request<Trip>(`/trips/order/${orderId}`, { headers: authHeaders(token) });
}

export interface RoutePolyline {
  polyline: string | null;
  distanceKm: number;
  durationMinutes: number | null;
  source: 'google' | 'haversine';
}

export function getDirectionsRoute(
  token: string,
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  waypoint?: { lat: number; lng: number } | null
) {
  const qs = new URLSearchParams({
    originLat: String(origin.lat),
    originLng: String(origin.lng),
    destLat: String(destination.lat),
    destLng: String(destination.lng),
  });
  if (waypoint && Number.isFinite(waypoint.lat) && Number.isFinite(waypoint.lng)) {
    qs.set('waypointLat', String(waypoint.lat));
    qs.set('waypointLng', String(waypoint.lng));
  }
  return request<RoutePolyline>(`/maps/route?${qs.toString()}`, {
    headers: authHeaders(token),
  });
}
