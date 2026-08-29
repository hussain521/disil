import { GoogleMap, Marker } from '@react-google-maps/api';
import { MapPin, Radio } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FilterTabs from '../../../components/FilterTabs';
import Modal from '../../../components/Modal';
import { formatPlateDisplay, respondToDestinationChange } from '../../../lib/api/adminOperations';
import { getTrips, type Trip } from '../../../lib/api/trips';
import { useAdminAuth } from '../../../lib/auth';
import { useGoogleMapsLoader } from '../../../lib/googleMaps';
import { useSocket } from '../../../lib/socket';

const ACTIVE_STATUSES: Trip['status'][] = ['pending', 'en_route_to_pickup', 'at_pickup', 'loaded', 'in_transit', 'at_delivery'];
const EGYPT_CENTER = { lat: 26.8206, lng: 30.8025 };
const POLL_INTERVAL_MS = 10000;

type FilterValue = 'active' | 'dest_changes' | 'all';

function statusColor(status: string): string {
  if (status === 'pending') return '#A78BFA';
  if (status === 'en_route_to_pickup') return '#FBBF24';
  if (status === 'at_pickup') return '#60A5FA';
  if (status === 'in_transit') return '#A78BFA';
  if (status === 'at_delivery') return '#F43F5E';
  if (status === 'completed') return '#10B981';
  return '#94A3B8';
}

function statusLabel(status: string): string {
  return status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

interface DriverLoc {
  lat: number;
  lng: number;
}

interface ApprovalModalState {
  open: boolean;
  tripId: string;
  cost: string;
}

export default function Track() {
  const { t } = useTranslation();
  const { token } = useAdminAuth();
  const { isLoaded, loadError } = useGoogleMapsLoader();
  const { socket, joinTrip, leaveTrip } = useSocket(token);

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterValue>('active');
  const [driverLocations, setDriverLocations] = useState<Record<string, DriverLoc>>({});
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const [approvalModal, setApprovalModal] = useState<ApprovalModalState>({ open: false, tripId: '', cost: '' });

  const mapRef = useRef<google.maps.Map | null>(null);
  const joinedRoomsRef = useRef<Set<string>>(new Set());

  const load = useCallback(
    async (silent = false) => {
      if (!token) return;
      if (!silent) setLoading(true);
      const { data } = await getTrips(token);
      if (data) {
        setTrips(data.trips);
        const active = data.trips.filter((trip) => ACTIVE_STATUSES.includes(trip.status));
        active.forEach((trip) => {
          if (!joinedRoomsRef.current.has(trip.id)) {
            joinTrip(trip.id);
            joinedRoomsRef.current.add(trip.id);
          }
        });
        setDriverLocations((prev) => {
          const next = { ...prev };
          active.forEach((trip) => {
            if (trip.lastLocation) next[trip.id] = { lat: trip.lastLocation.lat, lng: trip.lastLocation.lng };
          });
          return next;
        });
      }
      if (!silent) setLoading(false);
    },
    [token, joinTrip]
  );

  useEffect(() => {
    void load();
    const interval = setInterval(() => void load(true), POLL_INTERVAL_MS);
    const joinedRooms = joinedRoomsRef.current;
    return () => {
      clearInterval(interval);
      joinedRooms.forEach((tripId) => leaveTrip(tripId));
      joinedRooms.clear();
    };
  }, [token]);

  useEffect(() => {
    if (!socket) return;
    const onLocation = (payload: { tripId: string; lat: number; lng: number }) => {
      if (payload?.tripId && typeof payload.lat === 'number' && typeof payload.lng === 'number') {
        setDriverLocations((prev) => ({ ...prev, [payload.tripId]: { lat: payload.lat, lng: payload.lng } }));
      }
    };
    const onStatus = (payload: { tripId: string; status: Trip['status'] }) => {
      if (payload?.tripId) {
        setTrips((prev) => prev.map((trip) => (trip.id === payload.tripId ? { ...trip, status: payload.status } : trip)));
        void load(true);
      }
    };
    const onDestChangeRequested = (payload: { tripId: string; destinationChange: Trip['destinationChange'] }) => {
      if (!payload?.tripId) return;
      setTrips((prev) =>
        prev.map((trip) => (trip.id === payload.tripId ? { ...trip, destinationChange: payload.destinationChange } : trip))
      );
    };
    socket.on('trip:location', onLocation);
    socket.on('trip:status', onStatus);
    socket.on('trip:destination_change_requested', onDestChangeRequested);
    socket.on('connect', () => void load(true));
    return () => {
      socket.off('trip:location', onLocation);
      socket.off('trip:status', onStatus);
      socket.off('trip:destination_change_requested', onDestChangeRequested);
    };
  }, [socket, load]);

  const activeCount = useMemo(() => trips.filter((trip) => ACTIVE_STATUSES.includes(trip.status)).length, [trips]);
  const destChangeCount = useMemo(
    () => trips.filter((trip) => trip.destinationChange?.status === 'pending').length,
    [trips]
  );

  const displayTrips = trips.filter((trip) => {
    if (filter === 'active') return ACTIVE_STATUSES.includes(trip.status);
    if (filter === 'dest_changes') return trip.destinationChange?.status === 'pending';
    return true;
  });

  const markers = trips
    .filter((trip) => ACTIVE_STATUSES.includes(trip.status))
    .map((trip) => {
      const gps = driverLocations[trip.id];
      const pickupLat = trip.order?.pickup?.lat;
      const pickupLng = trip.order?.pickup?.lng;
      const lat = gps?.lat ?? (typeof pickupLat === 'number' ? pickupLat : null);
      const lng = gps?.lng ?? (typeof pickupLng === 'number' ? pickupLng : null);
      if (lat == null || lng == null) return null;
      return { trip, lat, lng, isLive: !!gps };
    })
    .filter((m): m is { trip: Trip; lat: number; lng: number; isLive: boolean } => m !== null);

  const submitApproval = async (tripId: string, costInput: string) => {
    if (!token) return;
    const additionalCost = parseFloat(costInput) || 0;
    setRespondingId(tripId);
    const { error } = await respondToDestinationChange(token, tripId, 'approve', additionalCost);
    setRespondingId(null);
    if (error) {
      window.alert(error);
      return;
    }
    void load(true);
  };

  const handleReject = async (tripId: string) => {
    if (!token) return;
    if (!window.confirm('Reject this destination change request?')) return;
    setRespondingId(tripId);
    const { error } = await respondToDestinationChange(token, tripId, 'reject', 0);
    setRespondingId(null);
    if (error) {
      window.alert(error);
      return;
    }
    void load(true);
  };

  const handleSelectTrip = (trip: Trip) => {
    setSelectedTripId(trip.id);
    const loc = driverLocations[trip.id];
    if (loc && mapRef.current) {
      mapRef.current.panTo(loc);
      mapRef.current.setZoom(12);
    }
  };

  return (
    <div className="flex flex-col gap-5 animation-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-rose-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
              {t('admin.track.liveTelemetry')}
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-admin-text">
            {t('admin.track.title')}
          </h1>
          <p className="mt-1 text-xs text-admin-subtext">
            {t('admin.track.subtitle')}
          </p>
        </div>
        <div className="flex gap-2">
          <span className="rounded-xl border border-admin-accent/30 bg-admin-accent/15 px-3.5 py-1.5 text-xs font-bold text-admin-accent glow-accent-sm">
            {t('admin.track.activeUnits', { count: activeCount })}
          </span>
          {destChangeCount > 0 ? (
            <span className="rounded-xl border border-amber-400/40 bg-amber-400/15 px-3.5 py-1.5 text-xs font-bold text-amber-400">
              {t('admin.track.destChanges', { count: destChangeCount })}
            </span>
          ) : null}
        </div>
      </div>

      <FilterTabs
        tabs={[
          { value: 'active', label: t('admin.track.tabs.active'), count: activeCount },
          { value: 'dest_changes', label: t('admin.track.tabs.dest_changes'), count: destChangeCount },
          { value: 'all', label: t('admin.track.tabs.all') },
        ]}
        active={filter}
        onChange={(v) => setFilter(v as FilterValue)}
      />

      <div
        className="flex min-h-[600px] lg:min-h-0 flex-1 flex-col lg:flex-row gap-4 rounded-3xl border border-admin-border bg-admin-card p-3 sm:p-4 shadow-subtle-dark lg:h-[36rem]"
      >
        {/* Map Container */}
        <div className="relative h-72 sm:h-96 lg:h-auto min-w-0 flex-[1.4] overflow-hidden rounded-2xl border border-admin-border bg-black/40">
          {loadError ? (
            <div className="flex h-full items-center justify-center text-xs text-admin-muted">
              Failed to initialize Google Maps interface.
            </div>
          ) : !isLoaded ? (
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-xs text-admin-muted">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-admin-accent border-t-transparent" />
                <span>Loading satellite radar…</span>
              </div>
            </div>
          ) : (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={EGYPT_CENTER}
              zoom={6}
              onLoad={(map) => {
                mapRef.current = map;
              }}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
                styles: [
                  { elementType: 'geometry', stylers: [{ color: '#111827' }] },
                  { elementType: 'labels.text.stroke', stylers: [{ color: '#111827' }] },
                  { elementType: 'labels.text.fill', stylers: [{ color: '#9ca3af' }] },
                  {
                    featureType: 'road',
                    elementType: 'geometry',
                    stylers: [{ color: '#1f2937' }],
                  },
                  {
                    featureType: 'water',
                    elementType: 'geometry',
                    stylers: [{ color: '#0b0f17' }],
                  },
                ],
              }}
            >
              {markers.map(({ trip, lat, lng, isLive }) => (
                <Marker
                  key={trip.id}
                  position={{ lat, lng }}
                  onClick={() => handleSelectTrip(trip)}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 14,
                    fillColor: trip.id === selectedTripId ? '#F43F5E' : isLive ? '#10B981' : '#64748B',
                    fillOpacity: 1,
                    strokeColor: '#FFFFFF',
                    strokeWeight: 2,
                  }}
                />
              ))}
            </GoogleMap>
          )}
          {isLoaded && markers.length === 0 ? (
            <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-admin-border bg-admin-card/90 px-4 py-1.5 text-xs font-semibold text-admin-text backdrop-blur-md">
              {activeCount > 0 ? 'Waiting for telemetry signals…' : 'No active trips in transit'}
            </div>
          ) : null}
        </div>

        {/* Trips Live Feed Sidebar */}
        <aside className="flex w-full lg:w-96 flex-shrink-0 flex-col overflow-hidden rounded-2xl border border-admin-border bg-admin-bg/60">
          <div className="border-b border-admin-border p-3.5 text-xs font-bold uppercase tracking-wider text-admin-muted">
            {t('admin.track.liveUnitsFeed', { count: displayTrips.length })}
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-xs text-admin-muted">Loading telemetry…</div>
            ) : displayTrips.length === 0 ? (
              <div className="p-8 text-center text-xs text-admin-muted">{t('admin.track.noShipments')}</div>
            ) : (
              <ul className="divide-y divide-admin-border">
                {displayTrips.map((trip) => {
                  const loc = driverLocations[trip.id];
                  const color = statusColor(trip.status);
                  const hasPendingChange = trip.destinationChange?.status === 'pending';
                  const isSelected = selectedTripId === trip.id;

                  return (
                    <li
                      key={trip.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleSelectTrip(trip)}
                      className={`cursor-pointer p-3.5 transition ${
                        isSelected
                          ? 'bg-admin-accent/15 border-l-4 border-admin-accent'
                          : 'hover:bg-admin-card-hover'
                      } ${hasPendingChange ? 'border-l-4 border-amber-400 bg-amber-500/5' : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 flex-shrink-0 rounded-full" style={{ backgroundColor: color }} />
                        <span className="text-xs font-bold text-admin-text">{statusLabel(trip.status)}</span>
                        <span className="truncate text-xs text-admin-subtext">{trip.driver?.fullName ?? '—'}</span>
                        <span className="ml-auto flex-shrink-0 text-xs font-mono font-bold text-admin-accent">
                          {formatPlateDisplay(trip.truck?.plateNumber)}
                        </span>
                      </div>
                      {trip.order ? (
                        <p className="mt-1 truncate text-xs text-admin-subtext">
                          {trip.order.pickup?.address} → {trip.order.delivery?.address}
                        </p>
                      ) : null}
                      {loc ? (
                        <p className="mt-1 flex items-center gap-1 font-mono text-[11px] text-admin-muted">
                          <MapPin className="h-3 w-3 shrink-0 text-admin-accent" />
                          {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
                        </p>
                      ) : null}

                      {hasPendingChange ? (
                        <div className="mt-2.5 rounded-xl border border-amber-400/30 bg-amber-400/10 p-2.5">
                          <p className="text-xs font-bold text-amber-400">Destination Change Requested</p>
                          <p className="mt-1 text-xs text-admin-text font-medium">
                            New: {trip.destinationChange?.newDeliveryAddress}
                          </p>
                          <div className="mt-2 flex gap-2">
                            <button
                              type="button"
                              disabled={respondingId === trip.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setApprovalModal({ open: true, tripId: trip.id, cost: '' });
                              }}
                              className="flex-1 rounded-lg bg-emerald-500 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-600 disabled:opacity-60"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              disabled={respondingId === trip.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                void handleReject(trip.id);
                              }}
                              className="flex-1 rounded-lg border border-rose-500/40 bg-rose-500/15 py-1.5 text-xs font-bold text-rose-400 transition hover:bg-rose-500/25 disabled:opacity-60"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </aside>
      </div>

      <Modal
        open={approvalModal.open}
        onClose={() => setApprovalModal((s) => ({ ...s, open: false }))}
        title="Approve Destination Change"
        size="sm"
        footer={
          <>
            <button
              type="button"
              onClick={() => setApprovalModal((s) => ({ ...s, open: false }))}
              className="rounded-xl px-3.5 py-2 text-xs font-bold text-admin-muted hover:bg-admin-card-hover"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={async () => {
                const { tripId, cost } = approvalModal;
                setApprovalModal((s) => ({ ...s, open: false }));
                await submitApproval(tripId, cost);
              }}
              className="rounded-xl bg-admin-accent px-4 py-2 text-xs font-bold text-white hover:bg-admin-accent-dark shadow-sm"
            >
              Confirm Approval
            </button>
          </>
        }
      >
        <label className="block text-xs font-bold uppercase tracking-wider text-admin-muted">
          Additional Fare Adjustment (EGP)
        </label>
        <input
          type="number"
          min={0}
          value={approvalModal.cost}
          onChange={(e) => setApprovalModal((s) => ({ ...s, cost: e.target.value }))}
          placeholder="0"
          className="mt-1.5 w-full rounded-xl border border-admin-border bg-admin-bg px-3.5 py-2 text-xs text-admin-text focus:border-admin-accent focus:outline-none"
        />
      </Modal>
    </div>
  );
}
