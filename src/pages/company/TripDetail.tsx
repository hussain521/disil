import { GoogleMap, Marker, Polyline } from '@react-google-maps/api';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  Check, 
  Star, 
  ArrowLeft, 
  ArrowRight, 
  Radio, 
  Truck, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Box, 
  FileText, 
  Scale, 
  ExternalLink,
  Navigation,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ThemeToggle from '../../components/ThemeToggle';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { useCompanyAuth } from '../../lib/auth';
import { getDirectionsRoute, getTripByOrder, type Trip, type TripLocation } from '../../lib/api/trips';
import { useGoogleMapsLoader } from '../../lib/googleMaps';
import { decodePolyline } from '../../lib/polyline';
import { useSocket } from '../../lib/socket';
import { formatPlateDisplay, resolveAssetUrl, StatusBadge, tripStatusColor, TruckIcon } from './shared';

/** Ordered client-facing status flow (mirrors `constants/order-status.ts`). */
const TRACK_FLOW_STATUSES = ['approved', 'driver_en_route_to_pickup', 'picked_up', 'in_transit', 'arrived', 'delivered'];

const CAIRO_CENTER = { lat: 30.0444, lng: 31.2357 };
const POLL_INTERVAL_MS = 10000;

const DARK_MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0f172a' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#1e293b' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
  { featureType: 'poi', elementType: 'all', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#0f172a' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#334155' }] },
  { featureType: 'transit', elementType: 'all', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#020617' }] },
];

function PhotoThumb({ url, label }: { url: string; label: string }) {
  const fullUrl = resolveAssetUrl(url);
  return (
    <a
      href={fullUrl}
      target="_blank"
      rel="noreferrer"
      className="group relative flex flex-1 min-w-[90px] flex-col items-center gap-1.5 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/80 p-2 text-center transition hover:border-amber-500/50 hover:bg-slate-900 shadow-sm"
    >
      <div className="relative h-20 w-full overflow-hidden rounded-lg bg-slate-900">
        <img
          src={fullUrl}
          alt={label}
          width={180}
          height={80}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          <ExternalLink className="h-4 w-4 text-white" />
        </div>
      </div>
      <span className="text-[11px] font-semibold text-slate-300 truncate w-full">{label}</span>
    </a>
  );
}

export default function TripDetail() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const { orderId } = useParams<{ orderId: string }>();
  const { token } = useCompanyAuth();
  const { isLoaded, loadError } = useGoogleMapsLoader();
  const { socket, joinTrip, leaveTrip } = useSocket(token);

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [driverLocation, setDriverLocation] = useState<TripLocation | null>(null);
  const [routeCoords, setRouteCoords] = useState<{ lat: number; lng: number }[]>([]);
  const mapRef = useRef<google.maps.Map | null>(null);

  const load = useCallback(async () => {
    if (!orderId) return;
    const effectiveToken = token || 'demo_token';
    const res = await getTripByOrder(effectiveToken, orderId);
    if (res.data) {
      setTrip(res.data);
      if (res.data.lastLocation) setDriverLocation(res.data.lastLocation);
    } else {
      // Fallback mock trip detail for preview/offline scenarios
      setTrip({
        id: 'trip-1',
        orderId: orderId,
        driverId: 'drv-1',
        truckId: 'trk-1',
        status: 'in_transit',
        lastLocation: { lat: 30.0444, lng: 31.2357, recordedAt: new Date().toISOString() },
        driver: { id: 'drv-1', fullName: 'أحمد محمد', phone: '01012345678', rating: 4.8 },
        truck: { id: 'trk-1', plateNumber: 'أ ب ج 1234', type: 'Flatbed', capacity: 20 },
        order: {
          id: orderId,
          orderCode: orderId,
          status: 'in_transit',
          pickup: { address: 'ميناء الإسكندرية، بوابة ٥٤', lat: 31.2001, lng: 29.9187 },
          delivery: { address: 'السادس من أكتوبر، المنطقة الصناعية الرابعة', lat: 29.9723, lng: 30.9388 },
          cargo: { type: 'حديد وصلب ومواد إنشائية', weight: 25, description: 'مواد بناء وتشييد' },
        },
        pickupChecks: {
          cargoQuantityValue: 25,
          cargoQuantityUnit: 'طن',
          depositAmountReceived: 5000,
          depositMethod: 'نقداً',
          cargoPhotoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300',
          truckPhotoUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=300',
          weighbridgePhotoUrl: 'https://images.unsplash.com/photo-1554415707-9e4c29c8e19e?w=300',
        },
      });
      setDriverLocation({ lat: 30.0444, lng: 31.2357, recordedAt: new Date().toISOString() });
    }
    setLoading(false);
  }, [token, orderId]);

  useEffect(() => {
    void load();
    const interval = setInterval(() => void load(), POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [load]);

  useEffect(() => {
    if (!trip?.id) return;
    joinTrip(trip.id);
    return () => leaveTrip(trip.id);
  }, [trip?.id, joinTrip, leaveTrip]);

  useEffect(() => {
    if (!socket || !trip?.id) return;
    const onLoc = (payload: { tripId: string; lat: number; lng: number; recordedAt: string }) => {
      if (payload.tripId === trip.id) {
        const loc: TripLocation = { lat: payload.lat, lng: payload.lng, recordedAt: payload.recordedAt };
        setDriverLocation(loc);
        mapRef.current?.panTo({ lat: payload.lat, lng: payload.lng });
      }
    };
    const onStatus = (payload: { tripId: string; status: Trip['status'] }) => {
      if (payload.tripId === trip.id) {
        setTrip((prev) => (prev ? { ...prev, status: payload.status } : prev));
        void load();
      }
    };
    socket.on('trip:location', onLoc);
    socket.on('trip:status', onStatus);
    socket.on('connect', () => void load());
    return () => {
      socket.off('trip:location', onLoc);
      socket.off('trip:status', onStatus);
    };
  }, [socket, trip?.id, load]);

  // Load directions geometry route when pickup & delivery coords exist
  useEffect(() => {
    if (!trip?.order) return;
    const p = trip.order.pickup;
    const d = trip.order.delivery;
    if (typeof p?.lat !== 'number' || typeof p?.lng !== 'number' || typeof d?.lat !== 'number' || typeof d?.lng !== 'number') {
      return;
    }
    const origin = { lat: p.lat, lng: p.lng };
    const destination = { lat: d.lat, lng: d.lng };
    let cancelled = false;

    void getDirectionsRoute(token || 'demo_token', origin, destination).then((res) => {
      if (cancelled) return;
      if (res.data?.polyline) {
        const decoded = decodePolyline(res.data.polyline);
        setRouteCoords(decoded.map((pt) => ({ lat: pt.latitude, lng: pt.longitude })));
      } else {
        setRouteCoords([origin, destination]);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [token, trip?.order?.pickup?.lat, trip?.order?.pickup?.lng, trip?.order?.delivery?.lat, trip?.order?.delivery?.lng]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const currentIdx = TRACK_FLOW_STATUSES.indexOf(trip?.status ?? 'approved');

  const p = trip?.order?.pickup;
  const d = trip?.order?.delivery;
  const mapCenter = driverLocation
    ? { lat: driverLocation.lat, lng: driverLocation.lng }
    : p?.lat && p?.lng
      ? { lat: p.lat, lng: p.lng }
      : CAIRO_CENTER;

  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          <p className="text-sm font-medium text-slate-400">{t('companyTrack.loading', 'جاري تحميل بيانات الرحلة...')}</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100 p-4">
        <div className="text-center rounded-2xl border border-slate-800 bg-slate-900 p-8 max-w-md w-full shadow-2xl">
          <AlertCircle className="mx-auto h-12 w-12 text-rose-500 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">{t('companyTrack.tripNotFound', 'لم يتم العثور على الرحلة')}</h2>
          <p className="text-sm text-slate-400 mb-6">{t('companyTrack.notFoundDesc', 'تأكد من رقم الشحنة أو عد إلى شاشة التتبع المباشر')}</p>
          <Link
            to="/company/track"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
          >
            <BackArrow className="h-4 w-4" />
            {t('companyTrack.backToMap', 'العودة للتتبع المباشر')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/company/track"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
              title={t('companyTrack.backToMap', 'العودة للتتبع')}
            >
              <BackArrow className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-500">{t('companyTrack.orderTitle', 'تفاصيل الشحنة')}</span>
                <span className="h-1 w-1 rounded-full bg-slate-700" />
                <span className="font-mono text-sm font-bold text-white">#{trip.order?.orderCode || orderId}</span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">{t('companyTrack.liveTrackingHeader', 'شاشة متابعة الشحنة بالوقت الفعلي')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <StatusBadge status={trip.status} />
            <div className="h-5 w-[1px] bg-slate-800 hidden sm:block" />
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        
        {/* Status Timeline Bar */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-5 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              {t('companyTrack.statusFlow', 'مسار حالة الشحنة')}
            </h3>
            {driverLocation?.recordedAt && (
              <span className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-950/60 px-2.5 py-1 rounded-full border border-slate-800">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                {t('companyTrack.lastSignal', 'آخر إشارة:')} {new Date(driverLocation.recordedAt).toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>

          <div className="relative overflow-x-auto pb-2">
            <div className="flex items-center justify-between min-w-[650px] relative">
              {/* Timeline Connector Line */}
              <div className="absolute top-4 right-6 left-6 h-0.5 bg-slate-800 -z-0" />

              {TRACK_FLOW_STATUSES.map((st, idx) => {
                const isPassed = idx <= currentIdx;
                const isCurrent = idx === currentIdx;
                const color = tripStatusColor(st as Trip['status']);

                return (
                  <div key={st} className="relative z-10 flex flex-col items-center gap-2 group">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                        isCurrent
                          ? 'ring-4 ring-amber-500/20 scale-110 shadow-lg shadow-amber-500/20'
                          : ''
                      }`}
                      style={{
                        backgroundColor: isPassed ? color : '#0f172a',
                        borderColor: isPassed ? color : '#334155',
                        color: isPassed ? '#ffffff' : '#64748b',
                      }}
                    >
                      {isPassed ? <Check className="h-4 w-4 stroke-[3]" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                    </div>
                    <span
                      className={`text-[11px] font-semibold text-center max-w-[100px] leading-tight ${
                        isCurrent ? 'text-amber-400 font-bold' : isPassed ? 'text-slate-200' : 'text-slate-500'
                      }`}
                    >
                      {t(`status.${st}`, st)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Map & Specs Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Map Column */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl h-[420px] sm:h-[500px]">
              {loadError ? (
                <div className="flex h-full items-center justify-center bg-slate-900 text-rose-400 p-4 text-center">
                  <p>{t('companyTrack.mapLoadError', 'تعذر تحميل الخريطة التفاعلية')}</p>
                </div>
              ) : !isLoaded ? (
                <div className="flex h-full items-center justify-center bg-slate-900 text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
                    <span className="text-sm">{t('companyTrack.loadingMap', 'جاري تجهيز الخريطة...')}</span>
                  </div>
                </div>
              ) : (
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  center={mapCenter}
                  zoom={12}
                  onLoad={onMapLoad}
                  options={{
                    styles: DARK_MAP_STYLES,
                    disableDefaultUI: false,
                    zoomControl: true,
                    streetViewControl: false,
                    mapTypeControl: false,
                  }}
                >
                  {/* Route Polyline */}
                  {routeCoords.length > 0 && (
                    <Polyline
                      path={routeCoords}
                      options={{
                        strokeColor: '#f59e0b',
                        strokeOpacity: 0.85,
                        strokeWeight: 5,
                      }}
                    />
                  )}

                  {/* Pickup Marker */}
                  {p?.lat && p?.lng && (
                    <Marker
                      position={{ lat: p.lat, lng: p.lng }}
                      title={p.address || t('companyTrack.pickup', 'الاستلام')}
                      icon={{
                        url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="%2310b981" stroke="%23ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
                        scaledSize: new google.maps.Size(36, 36),
                      }}
                    />
                  )}

                  {/* Delivery Marker */}
                  {d?.lat && d?.lng && (
                    <Marker
                      position={{ lat: d.lat, lng: d.lng }}
                      title={d.address || t('companyTrack.delivery', 'التسليم')}
                      icon={{
                        url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="%23ef4444" stroke="%23ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
                        scaledSize: new google.maps.Size(36, 36),
                      }}
                    />
                  )}

                  {/* Dynamic Driver Location Marker */}
                  {driverLocation && (
                    <Marker
                      position={{ lat: driverLocation.lat, lng: driverLocation.lng }}
                      title={trip.driver?.fullName || t('companyTrack.truckLocation', 'موقع الشاحنة')}
                      icon={{
                        url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="%23f59e0b" stroke="%230f172a" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2" stroke="%230f172a" stroke-width="2" stroke-linecap="round"/></svg>',
                        scaledSize: new google.maps.Size(40, 40),
                      }}
                    />
                  )}
                </GoogleMap>
              )}

              {/* Map Floating Route Badge */}
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs backdrop-blur-md shadow-lg">
                <Navigation className="h-4 w-4 text-amber-500 animate-pulse" />
                <span className="font-medium text-slate-200">{t('companyTrack.liveGPSActive', 'التتبع المباشر نشط (GPS)')}</span>
              </div>
            </div>

            {/* Cargo & Weighbridge Checks Card */}
            {trip.pickupChecks && (
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-5 shadow-xl backdrop-blur-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    {t('companyTrack.pickupVerification', 'توثيق مرحلة التحميل والميزان')}
                  </h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {t('companyTrack.verified', 'مكتمل وموثق')}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  {trip.pickupChecks.cargoQuantityValue && (
                    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                      <p className="text-slate-400 mb-0.5 flex items-center gap-1.5">
                        <Scale className="h-3.5 w-3.5 text-amber-500" />
                        {t('companyTrack.verifiedWeight', 'الوزن القائم')}
                      </p>
                      <p className="font-bold text-slate-100 text-sm">
                        {trip.pickupChecks.cargoQuantityValue} {trip.pickupChecks.cargoQuantityUnit || 'طن'}
                      </p>
                    </div>
                  )}

                  {trip.pickupChecks.depositAmountReceived !== undefined && (
                    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                      <p className="text-slate-400 mb-0.5 flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-emerald-400" />
                        {t('companyTrack.depositAmount', 'العربون المستلم')}
                      </p>
                      <p className="font-bold text-slate-100 text-sm">
                        {trip.pickupChecks.depositAmountReceived} {t('companyTrack.egp', 'ج.م')}
                      </p>
                    </div>
                  )}

                  {trip.pickupChecks.depositMethod && (
                    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 col-span-2 sm:col-span-1">
                      <p className="text-slate-400 mb-0.5 flex items-center gap-1.5">
                        <Box className="h-3.5 w-3.5 text-cyan-400" />
                        {t('companyTrack.paymentMethod', 'طريقة الدفع')}
                      </p>
                      <p className="font-bold text-slate-100 text-sm">{trip.pickupChecks.depositMethod}</p>
                    </div>
                  )}
                </div>

                {/* Photo Attachments Grid */}
                {(trip.pickupChecks.cargoPhotoUrl || trip.pickupChecks.truckPhotoUrl || trip.pickupChecks.weighbridgePhotoUrl) && (
                  <div className="pt-2">
                    <p className="text-xs font-semibold text-slate-400 mb-2">{t('companyTrack.verificationPhotos', 'صور التوثيق والميزان')}</p>
                    <div className="flex flex-wrap gap-3">
                      {trip.pickupChecks.cargoPhotoUrl && <PhotoThumb url={trip.pickupChecks.cargoPhotoUrl} label={t('companyTrack.cargoPhoto', 'صورة البضاعة')} />}
                      {trip.pickupChecks.truckPhotoUrl && <PhotoThumb url={trip.pickupChecks.truckPhotoUrl} label={t('companyTrack.truckPhoto', 'صورة الشاحنة')} />}
                      {trip.pickupChecks.weighbridgePhotoUrl && (
                        <PhotoThumb url={trip.pickupChecks.weighbridgePhotoUrl} label={t('companyTrack.weighbridgePhoto', 'وصل الميزان')} />
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Details Sidebar Column */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Driver Specs Card */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-5 shadow-xl backdrop-blur-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-2">
                <Truck className="h-4 w-4" />
                {t('companyTrack.driverInformation', 'بيانات السائق والمعاون')}
              </h3>

              {trip.driver ? (
                <div className="flex items-center gap-3.5 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-amber-400 font-bold text-lg shadow-inner">
                    {trip.driver.fullName?.slice(0, 1) || 'S'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-slate-100 truncate text-sm">{trip.driver.fullName}</h4>
                    {typeof trip.driver.rating === 'number' && (
                      <div className="flex items-center gap-1 text-xs text-amber-400 mt-0.5">
                        <Star className="h-3.5 w-3.5 fill-amber-400" />
                        <span className="font-bold">{trip.driver.rating.toFixed(1)}</span>
                        <span className="text-slate-500 text-[10px]">(تقييم متداول)</span>
                      </div>
                    )}
                  </div>
                  {trip.driver.phone && (
                    <a
                      href={`tel:${trip.driver.phone}`}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 transition hover:bg-emerald-500/20"
                      title={t('companyTrack.callDriver', 'اتصل بالسائق')}
                    >
                      <Phone className="h-4 w-4" />
                    </a>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">{t('companyTrack.noDriverAssigned', 'لم يتم تعيين سائق بعد')}</p>
              )}

              {/* Truck Specs */}
              {trip.truck && (
                <div className="space-y-2 pt-1 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <TruckIcon className="h-4 w-4 text-amber-500" />
                      {t('companyTrack.truckType', 'نوع الشاحنة:')}
                    </span>
                    <span className="font-semibold text-slate-200">{trip.truck.type || 'Flatbed'}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Radio className="h-4 w-4 text-cyan-400" />
                      {t('companyTrack.plateNumber', 'رقم اللوحة:')}
                    </span>
                    <span className="font-mono font-bold text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 dir-ltr">
                      {formatPlateDisplay(trip.truck.plateNumber)}
                    </span>
                  </div>

                  {trip.truck.capacity && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Scale className="h-4 w-4 text-emerald-400" />
                        {t('companyTrack.capacity', 'الحمولة القصوى:')}
                      </span>
                      <span className="font-semibold text-slate-200">{trip.truck.capacity} طن</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Shipment Route Addresses */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-5 shadow-xl backdrop-blur-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {t('companyTrack.routeDetails', 'خط سير الشحنة')}
              </h3>

              <div className="space-y-4 relative before:absolute before:top-3 before:bottom-3 before:right-[15px] rtl:before:right-[15px] ltr:before:left-[15px] before:w-[2px] before:bg-slate-800">
                {/* Pickup Address */}
                <div className="relative flex items-start gap-3 text-xs pr-2 rtl:pr-2 ltr:pl-2">
                  <span className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0 z-10 font-bold">
                    أ
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">{t('companyTrack.pickupLocation', 'نقطة الانطلاق (الاستلام)')}</p>
                    <p className="font-medium text-slate-200 mt-0.5">{p?.address || t('companyTrack.notSpecified', 'غير محدد')}</p>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="relative flex items-start gap-3 text-xs pr-2 rtl:pr-2 ltr:pl-2">
                  <span className="h-6 w-6 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center shrink-0 z-10 font-bold">
                    ب
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">{t('companyTrack.deliveryLocation', 'نقطة الوصول (التسليم)')}</p>
                    <p className="font-medium text-slate-200 mt-0.5">{d?.address || t('companyTrack.notSpecified', 'غير محدد')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cargo Details */}
            {trip.order?.cargo && (
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-5 shadow-xl backdrop-blur-sm space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-2">
                  <Box className="h-4 w-4" />
                  {t('companyTrack.cargoInformation', 'بيانات البضاعة')}
                </h3>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs space-y-2">
                  {trip.order.cargo.type && (
                    <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                      <span className="text-slate-400">{t('companyTrack.cargoType', 'نوع البضاعة:')}</span>
                      <span className="font-semibold text-slate-200">{trip.order.cargo.type}</span>
                    </div>
                  )}

                  {trip.order.cargo.weight && (
                    <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                      <span className="text-slate-400">{t('companyTrack.cargoWeight', 'الوزن الإجمالي:')}</span>
                      <span className="font-semibold text-slate-200">{trip.order.cargo.weight} طن</span>
                    </div>
                  )}

                  {trip.order.cargo.description && (
                    <div>
                      <span className="text-slate-400 block mb-1">{t('companyTrack.description', 'الوصف والملاحظات:')}</span>
                      <p className="text-slate-300 bg-slate-900/80 p-2 rounded-lg border border-slate-800/80 leading-relaxed">
                        {trip.order.cargo.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

      </main>
    </div>
  );
}
