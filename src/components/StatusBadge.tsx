import { useTranslation } from 'react-i18next';

export type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const TONE_CLASSES: Record<StatusTone, { badge: string; dot: string }> = {
  success: {
    badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25',
    dot: 'bg-emerald-600 dark:bg-emerald-400',
  },
  warning: {
    badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25',
    dot: 'bg-amber-600 dark:bg-amber-400',
  },
  danger: {
    badge: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25',
    dot: 'bg-rose-600 dark:bg-rose-400',
  },
  info: {
    badge: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/25',
    dot: 'bg-cyan-600 dark:bg-cyan-400',
  },
  neutral: {
    badge: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/25',
    dot: 'bg-gray-600 dark:bg-gray-400',
  },
};

const KEYWORD_TONES: { pattern: RegExp; tone: StatusTone }[] = [
  { pattern: /(reject|cancel|fail|deactivat|overdue|error)/i, tone: 'danger' },
  { pattern: /(pending|review|waiting|process)/i, tone: 'warning' },
  { pattern: /(approv|complet|deliver|active|accept|success|paid|resolved)/i, tone: 'success' },
  { pattern: /(progress|transit|assign|shipped|ongoing)/i, tone: 'info' },
];

export function toneForStatus(status: string): StatusTone {
  const found = KEYWORD_TONES.find(({ pattern }) => pattern.test(status));
  return found?.tone ?? 'neutral';
}

function humanize(status: string): string {
  return status
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export interface StatusBadgeProps {
  status: string;
  label?: string;
  tone?: StatusTone;
  className?: string;
}

/**
 * Modern illuminated status badge with pulse indicator:
 * - Rounded pill design with semantic border and glowing tone
 */
export default function StatusBadge({ status, label, tone, className = '' }: StatusBadgeProps) {
  const { t } = useTranslation();
  const resolvedTone = tone ?? toneForStatus(status);
  const toneStyle = TONE_CLASSES[resolvedTone];
  const cleanStatus = status?.toLowerCase().replace(/\s+/g, '_');
  const translatedStatus = t(`status.${cleanStatus}`, label ?? humanize(status));

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-tight whitespace-nowrap shadow-2xs transition ${toneStyle.badge} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${toneStyle.dot}`} />
      {translatedStatus}
    </span>
  );
}
