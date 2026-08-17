import { GoogleMap, Marker } from '@react-google-maps/api';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  MapPin, 
  Search, 
  RefreshCw, 
  SlidersHorizontal, 
  Truck, 
  Building2, 
  LogOut, 
  ArrowUpRight, 
  ShieldCheck, 
  ChevronRight,
  ChevronLeft,
  Layers,
  Radio,
  User,
  Phone,
  Weight,
  Box
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ThemeToggle from '../../components/ThemeToggle';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { useGoogleMapsLoader } from '../../lib/googleMaps';
import { useCompanyAuth } from '../../lib/auth';
import { getDirectionsRoute, getTrips, type Trip } from '../../lib/api/trips';
import { useSocket } from '../../lib/socket';
import { ACTIVE_TRIP_STATUSES, formatPlateDisplay, StatusBadge, tripStatusColor, TruckIcon } from './shared';

const CAIRO_CENTER = { lat: 30.0444, lng: 31.2357 };
const POLL_INTERVAL_MS = 10000;

interface DriverLoc {
  lat: number;
  lng: number;
}

interface SelectedEta {
  tripId: string;
  minutes: number;
  km: number;
}

export default function FleetTrack() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const { token, user, logout } = useCompanyAuth();
  const navigate = useNavigate();
  const { isLoaded, loadError } = useGoogleMapsLoader();
  const { socket, joinTrip, leaveTrip } = useSocket(token);

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [driverLocations, setDriverLocations] = useState<Record<string, DriverLoc>>({});
  const [selectedEta, setSelectedEta] = useState<SelectedEta | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const mapRef = useRef<google.maps.Map | null>(null);
  const joinedRoomsRef = useRef<Set<string>>(new Set());

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      const effectiveToken = token || 'demo_token';
      const { data } = await getTrips(effectiveToken);
      if (data && Array.isArray(data.trips)) {
        setTrips(data.trips);
        const active = data.trips.filter((trip) => ACTIVE_TRIP_STATUSES.includes(trip.status));
        active.forEach((trip) => {
          if (!joinedRoomsRef.current.has(trip.id)) {
            joinTrip(trip.id);
            joinedRoomsRef.current.add(trip.id);
          }
        });
        setDriverLocations((prev) => {
          const next = { ...prev };
          active.forEach((trip) => {
            if (trip.lastLocation && !next[trip.id]) {
              next[trip.id] = { lat: trip.lastLocation.lat, lng: trip.lastLocation.lng };
            }
          });
          return next;
        });
      } else {
        // Fallback mock trips if backend server is not running
        setTrips((prev) => (prev.length ? prev : [
          {
            id: 'trip-1',
            orderId: 'ORD-101',
            driverId: 'drv-1',
            truckId: 'trk-1',
            status: 'in_transit',
            lastLocation: { lat: 30.0444, lng: 31.2357, recordedAt: new Date().toISOString() },
            driver: { id: 'drv-1', fullName: 'أحمد محمد', phone: '01012345678', rating: 4.8 },
            truck: { id: 'trk-1', plateNumber: 'أ ب ج 1234', type: 'Flatbed', capacity: 20 },
            order: {
              id: 'ORD-101',
              orderCode: 'ORD-101',
              status: 'in_transit',
              pickup: { address: 'ميناء الإسكندرية (رصيف ٥٤)', lat: 31.2001, lng: 29.9187 },
              delivery: { address: 'السادس من أكتوبر، المنطقة الصناعية', lat: 29.9723, lng: 30.9388 },
              cargo: { type: 'حديد وصلب وتصنيع', weight: 25, description: 'مواد بناء وتشييد' },
            },
          },
          {
            id: 'trip-2',
            orderId: 'ORD-102',
            driverId: 'drv-2',
            truckId: 'trk-2',
            status: 'en_route_to_pickup',
            lastLocation: { lat: 30.1288, lng: 31.3415, recordedAt: new Date().toISOString() },
            driver: { id: 'drv-2', fullName: 'محمود السيد', phone: '01123456789', rating: 4.9 },
            truck: { id: 'trk-2', plateNumber: 'س ص ع 5678', type: 'Curtainsider', capacity: 15 },
            order: {
              id: 'ORD-102',
              orderCode: 'ORD-102',
              status: 'driver_en_route_to_pickup',
              pickup: { address: 'العاشر من رمضان (مصنع الأهرام)', lat: 30.3012, lng: 31.7456 },
              delivery: { address: 'العين السخنة، ميناء السويس', lat: 29.6012, lng: 32.3167 },
              cargo: { type: 'مواد غذائية معبأة', weight: 12, description: 'بضائع جافة' },
            },
          },
          {
            id: 'trip-3',
            orderId: 'ORD-103',
            driverId: 'drv-3',
            truckId: 'trk-3',
            status: 'at_delivery',
            lastLocation: { lat: 29.9755, lng: 31.1378, recordedAt: new Date().toISOString() },
            driver: { id: 'drv-3', fullName: 'سيد إبراهيم', phone: '01234567890', rating: 4.7 },
            truck: { id: 'trk-3', plateNumber: 'ط ي ك 9988', type: 'Refrigerated', capacity: 18 },
            order: {
              id: 'ORD-103',
              orderCode: 'ORD-103',
              status: 'at_delivery',
              pickup: { address: 'طنطا، الغربية', lat: 30.7865, lng: 31.0004 },
              delivery: { address: 'المعادي، القاهرة', lat: 29.9755, lng: 31.1378 },
              cargo: { type: 'منتجات ألبان مبردة', weight: 14, description: 'حفظ تحت ٤ درجات' },
            },
          }
        ]));
        setDriverLocations((prev) => ({
          'trip-1': { lat: 30.0444, lng: 31.2357 },
          'trip-2': { lat: 30.1288, lng: 31.3415 },
          'trip-3': { lat: 29.9755, lng: 31.1378 },
          ...prev,
        }));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    socket.on('trip:location', onLocation);
    socket.on('trip:status', onStatus);
    socket.on('connect', () => void load(true));
    return () => {
      socket.off('trip:location', onLocation);
      socket.off('trip:status', onStatus);
    };
  }, [socket, load]);

  const activeTrips = trips.filter((trip) => ACTIVE_TRIP_STATUSES.includes(trip.status));
  const selectedTrip = trips.find((trip) => trip.id === selectedTripId) ?? null;

  // Filtered trips by search and status
  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const matchSearch =
        !searchQuery.trim() ||
        trip.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.driver?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.truck?.plateNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.order?.pickup?.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.order?.delivery?.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.order?.cargo?.type?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && ACTIVE_TRIP_STATUSES.includes(trip.status)) ||
        trip.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [trips, searchQuery, statusFilter]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!selectedTrip || !token) {
        setSelectedEta(null);
        return;
      }
      const loc = driverLocations[selectedTrip.id];
      const dest = selectedTrip.order?.delivery;
      if (!loc || dest?.lat == null || dest?.lng == null) {
        setSelectedEta(null);
        return;
      }
      const { data } = await getDirectionsRoute(token, { lat: loc.lat, lng: loc.lng }, { lat: dest.lat, lng: dest.lng });
      if (cancelled) return;
      if (data?.durationMinutes != null) {
        setSelectedEta({ tripId: selectedTrip.id, minutes: data.durationMinutes, km: data.distanceKm ?? 0 });
      } else {
        setSelectedEta(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedTrip, driverLocations, token]);

  const handleSelectTrip = (trip: Trip) => {
    setSelectedTripId(trip.id);
    const loc = driverLocations[trip.id];
    if (loc && mapRef.current) {
      mapRef.current.panTo(loc);
      mapRef.current.setZoom(13);
    }
  };

  const markers = activeTrips
    .filter((trip) => driverLocations[trip.id])
    .map((trip) => ({ trip, loc: driverLocations[trip.id]! }));

  const companyName = user?.fullName || (isRtl ? 'شركة الشحن المؤسسية' : 'Enterprise Logistics');

  return (
    <div className="flex h-screen w-full flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Top Navbar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800/80 bg-slate-900/90 px-3 sm:px-6 backdrop-blur-md z-30">
        <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 shadow-md shadow-amber-500/20 font-bold">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-white tracking-tight leading-none truncate">
                {t('company.fleetTrack.title', 'Live Fleet Radar')}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-400 shrink-0">
                <Radio className="h-2.5 w-2.5 animate-pulse text-amber-400" />
                {t('company.tripDetail.live', 'Live GPS')}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 truncate max-w-[140px] sm:max-w-md">
              {companyName}
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="flex md:hidden items-center gap-1 rounded-xl border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-xs font-bold text-amber-400 transition hover:bg-amber-500/20"
            title={sidebarCollapsed ? "Show List" : "Show Map"}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>{sidebarCollapsed ? t('common.list', 'List') : t('common.map', 'Map')}</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-1.5 text-xs text-slate-300">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{t('company.fleetTrack.activeTrips', { count: activeTrips.length })}</span>
          </div>

          <button
            type="button"
            onClick={() => void load()}
            title={t('common.refresh', 'Refresh telemetry')}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/60 text-slate-400 transition hover:border-slate-700 hover:text-white"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          <LanguageSwitcher variant="marketing" />
          <ThemeToggle variant="company" />

          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/company/login');
            }}
            title={t('topbar.logout', 'Sign Out')}
            className="flex items-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-400 transition hover:bg-rose-500/20 hover:border-rose-500/40"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden md:inline">{t('topbar.logout', 'Sign Out')}</span>
          </button>
        </div>
      </header>

      {/* Main Content View (Map + Sidebar) */}
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {/* Left/Main: Map View */}
        <div className="relative min-w-0 flex-1 bg-slate-900">
          {loadError ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center text-slate-400">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <TruckIcon className="h-10 w-10 text-rose-400" />
              </div>
              <p className="font-semibold text-white">{t('company.fleetTrack.failedMaps', 'Unable to load Google Maps')}</p>
              <p className="text-xs text-slate-500 max-w-sm">
                {t('company.fleetTrack.mapsCheckKey', 'Please verify your Google Maps API key and network connection.')}
              </p>
            </div>
          ) : !isLoaded ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 bg-slate-950 text-slate-400">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
              <p className="text-xs font-medium text-slate-300">{t('common.loadingMap', 'Initializing GPS Telemetry Engine...')}</p>
            </div>
          ) : (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={CAIRO_CENTER}
              zoom={7}
              onLoad={(map) => {
                mapRef.current = map;
              }}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
                zoomControl: true,
                styles: [
                  { elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
                  { elementType: 'labels.text.stroke', stylers: [{ color: '#0f172a' }] },
                  { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
                  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#cbd5e1' }] },
                  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#64748b' }] },
                  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#334155' }] },
                  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#1e293b' }] },
                  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
                  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#475569' }] },
                  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
                ],
              }}
            >
              {markers.map(({ trip, loc }) => {
                const isSelected = trip.id === selectedTripId;
                const statusCol = tripStatusColor(trip.status);
                return (
                  <Marker
                    key={trip.id}
                    position={loc}
                    onClick={() => handleSelectTrip(trip)}
                    icon={{
                      path: google.maps.SymbolPath.CIRCLE,
                      scale: isSelected ? 14 : 10,
                      fillColor: isSelected ? '#F59E0B' : statusCol,
                      fillOpacity: 1,
                      strokeColor: '#0F172A',
                      strokeWeight: 2.5,
                    }}
                  />
                );
              })}
            </GoogleMap>
          )}

          {/* Map Overlay Badge */}
          {isLoaded && (
            <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 z-10 flex items-center gap-2 rounded-2xl border border-slate-800/80 bg-slate-950/80 px-4 py-2 text-xs font-semibold text-slate-200 shadow-xl backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                {markers.length > 0
                  ? t('company.fleetTrack.signalsActive', { count: markers.length, defaultValue: `${markers.length} live units streaming` })
                  : t('company.fleetTrack.waitingDrivers', 'Awaiting live driver telemetry…')}
              </span>
            </div>
          )}

          {/* Quick Selected Trip Card Float on Map */}
          {selectedTrip && (
            <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-md z-10 animate-fade-in-up rounded-2xl border border-slate-800 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-xl">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold"
                    style={{
                      backgroundColor: `${tripStatusColor(selectedTrip.status)}20`,
                      color: tripStatusColor(selectedTrip.status),
                      border: `1px solid ${tripStatusColor(selectedTrip.status)}40`,
                    }}
                  >
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{selectedTrip.driver?.fullName || 'Driver'}</span>
                      <span className="text-xs font-normal text-slate-400 font-mono">
                        ({formatPlateDisplay(selectedTrip.truck?.plateNumber)})
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      {selectedTrip.order?.orderCode || selectedTrip.orderId} · {selectedTrip.truck?.type}
                    </p>
                  </div>
                </div>

                <StatusBadge status={selectedTrip.status} />
              </div>

              {selectedEta && (
                <div className="mt-3 flex items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-300">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{t('company.fleetTrack.eta', { hours: (selectedEta.minutes / 60).toFixed(1), km: selectedEta.km.toFixed(0) })}</span>
                  </span>
                  <span className="text-[11px] font-mono opacity-80">{selectedEta.km.toFixed(1)} KM</span>
                </div>
              )}

              <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-800 pt-3">
                <div className="flex items-center gap-1 text-xs text-slate-400 truncate">
                  <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{selectedTrip.order?.delivery?.address || 'Destination'}</span>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/company/track/${selectedTrip.orderId}`)}
                  className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-slate-950 transition hover:bg-amber-400"
                >
                  <span>{t('common.viewDetails', 'View Trip')}</span>
                  {isRtl ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Modern Sidebar Feed */}
        <aside
          className={`relative flex flex-col border-l rtl:border-l-0 rtl:border-r border-slate-800/80 bg-slate-900/95 backdrop-blur-xl transition-all duration-300 z-20 ${
            sidebarCollapsed ? 'w-0 overflow-hidden md:w-16' : 'w-full sm:w-96 md:w-[26rem]'
          }`}
        >
          {/* Sidebar Toggle Handle */}
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -left-3.5 top-6 rtl:-left-auto rtl:-right-3.5 hidden md:flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-300 shadow-md transition hover:bg-slate-700 hover:text-white z-30"
          >
            {sidebarCollapsed ? (
              isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
            ) : (
              isRtl ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />
            )}
          </button>

          {!sidebarCollapsed && (
            <>
              {/* Search & Filter Header */}
              <div className="border-b border-slate-800/80 p-4 space-y-3 shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {t('company.fleetTrack.trips', 'Shipments Dispatch Feed')}
                    </h2>
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                      {filteredTrips.length}
                    </span>
                  </div>

                  <span className="text-[11px] font-medium text-slate-500">
                    {activeTrips.length} {t('common.active', 'Active')}
                  </span>
                </div>

                {/* Search Input */}
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('common.searchPlaceholder', isRtl ? 'بحث بالسائق، اللوحة، الطلب...' : 'Search driver, plate, destination...')}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2 pl-9 pr-3 rtl:pl-3 rtl:pr-9 text-xs font-medium text-white placeholder-slate-500 transition focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setStatusFilter('all')}
                    className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                      statusFilter === 'all'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800/70 text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {t('common.all', 'All')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('active')}
                    className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                      statusFilter === 'active'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800/70 text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {t('common.active', 'Active')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('in_transit')}
                    className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                      statusFilter === 'in_transit'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800/70 text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {t('status.in_transit', 'In Transit')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('at_pickup')}
                    className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                      statusFilter === 'at_pickup'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800/70 text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {t('status.at_pickup', 'At Pickup')}
                  </button>
                </div>
              </div>

              {/* Trips List Feed */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                {loading ? (
                  <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent mb-3" />
                    <p className="text-xs">{t('common.loading', 'Loading live trips…')}</p>
                  </div>
                ) : filteredTrips.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 p-8 text-center text-slate-500">
                    <Truck className="h-8 w-8 text-slate-600 mb-2" />
                    <p className="text-xs font-semibold text-slate-400">{t('company.fleetTrack.noTrips', 'No matching shipments found')}</p>
                    <p className="text-[11px] text-slate-600 mt-1">
                      {searchQuery ? t('common.clearFilters', 'Try resetting filters or search terms.') : t('company.fleetTrack.waitingDispatches', 'New dispatches will appear automatically.')}
                    </p>
                  </div>
                ) : (
                  filteredTrips.map((trip) => {
                    const loc = driverLocations[trip.id];
                    const isSelected = selectedTripId === trip.id;
                    const statusCol = tripStatusColor(trip.status);

                    return (
                      <div
                        key={trip.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleSelectTrip(trip)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSelectTrip(trip);
                        }}
                        className={`group relative w-full cursor-pointer rounded-2xl border p-3.5 text-left rtl:text-right transition-all duration-200 ${
                          isSelected
                            ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/30'
                            : 'border-slate-800/80 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-950/90'
                        }`}
                      >
                        {/* Top Line: Driver, Truck Plate & Badge */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold"
                              style={{
                                backgroundColor: `${statusCol}20`,
                                color: statusCol,
                                border: `1px solid ${statusCol}40`,
                              }}
                            >
                              <Truck className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                                {trip.driver?.fullName || 'Driver'}
                              </p>
                              <p className="truncate text-[11px] font-mono text-slate-400">
                                {formatPlateDisplay(trip.truck?.plateNumber)} · {trip.truck?.type}
                              </p>
                            </div>
                          </div>

                          <StatusBadge status={trip.status} />
                        </div>

                        {/* Route Summary */}
                        {trip.order && (
                          <div className="mt-3 space-y-1 rounded-xl bg-slate-900/60 p-2 text-xs border border-slate-800/50">
                            <div className="flex items-center gap-1.5 text-slate-300 truncate">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                              <span className="truncate">{trip.order.pickup?.address || 'Pickup'}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-300 truncate">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" />
                              <span className="truncate">{trip.order.delivery?.address || 'Delivery'}</span>
                            </div>
                          </div>
                        )}

                        {/* Cargo & Coordinates Footer */}
                        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800/40">
                          {trip.order?.cargo ? (
                            <span className="flex items-center gap-1 text-slate-400 truncate">
                              <Box className="h-3 w-3 shrink-0 text-slate-500" />
                              <span className="truncate">{trip.order.cargo.type} ({trip.order.cargo.weight}t)</span>
                            </span>
                          ) : (
                            <span>{trip.orderId}</span>
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/company/track/${trip.orderId}`);
                            }}
                            className="inline-flex items-center gap-1 font-bold text-amber-400 hover:text-amber-300 group-hover:underline"
                          >
                            <span>{t('company.fleetTrack.viewDetails', 'Details')}</span>
                            {isRtl ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
