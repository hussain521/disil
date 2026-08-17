import { useTranslation } from 'react-i18next';
import type { CSSProperties } from 'react';
import { API_URL } from '../../lib/api/core';
import type { TripStatus } from '../../lib/api/trips';

/** Trip statuses considered "active" (mirrors `FleetTrackScreen.tsx`'s `ACTIVE_STATUSES`). */
export const ACTIVE_TRIP_STATUSES: TripStatus[] = ['en_route_to_pickup', 'at_pickup', 'loaded', 'in_transit', 'at_delivery'];

/** Base URL for relative asset paths (uploads) returned by the API, e.g. check photos. */
export const ASSET_BASE = API_URL.replace(/\/api\/?$/, '');

export function resolveAssetUrl(url: string): string {
  return url.startsWith('http') ? url : `${ASSET_BASE}${url}`;
}

/** Plain-ASCII plate formatter (mirrors `utils/plate.ts`'s digit isolation, without the Arabic letter-spacing). */
export function formatPlateDisplay(plateNumber: string | null | undefined): string {
  if (!plateNumber) return '—';
  return plateNumber
    .split('/')
    .map((part) => part.trim().replace(/\s+/g, ' '))
    .join(' / ');
}

export function tripStatusColor(status: TripStatus): string {
  switch (status) {
    case 'en_route_to_pickup':
      return '#F59E0B'; // Amber
    case 'at_pickup':
      return '#3B82F6'; // Blue
    case 'loaded':
      return '#6366F1'; // Indigo
    case 'in_transit':
      return '#0EA5E9'; // Sky
    case 'at_delivery':
      return '#EC4899'; // Pink
    case 'completed':
      return '#10B981'; // Emerald
    case 'cancelled':
      return '#EF4444'; // Red
    default:
      return '#64748B'; // Slate
  }
}

export function tripStatusLabel(status: TripStatus): string {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'en_route_to_pickup':
      return 'En route to pickup';
    case 'at_pickup':
      return 'At pickup';
    case 'loaded':
      return 'Loaded';
    case 'in_transit':
      return 'In transit';
    case 'at_delivery':
      return 'At delivery';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
}

export function orderStatusLabel(status: string): string {
  return status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function StatusBadge({ status, className }: { status: TripStatus; className?: string }) {
  const { t } = useTranslation();
  const color = tripStatusColor(status);
  const isPulse = ACTIVE_TRIP_STATUSES.includes(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur-xs transition-all ${className ?? ''}`}
      style={{
        color: color,
        borderColor: `${color}40`,
        backgroundColor: `${color}18`,
      }}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full shrink-0 ${isPulse ? 'animate-ping' : ''}`}
        style={{ backgroundColor: color }}
      />
      {t(`status.${status}`, { defaultValue: t(`company.status.${status}`, { defaultValue: tripStatusLabel(status) }) })}
    </span>
  );
}

export function TruckIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 7a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v9H3V7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M14 10h3.5a1 1 0 0 1 .8.4l2.2 2.9a1 1 0 0 1 .2.6V16h-3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="17.5" r="1.7" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17" cy="17.5" r="1.7" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
