import { ReactNode } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { resolveVariant, useAdminTheme, type UiVariant } from '../lib/adminTheme';

export interface StatCardProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  hint?: ReactNode;
  trend?: { value: string; direction?: 'up' | 'down' | 'neutral' };
  accentClassName?: string;
  className?: string;
  variant?: UiVariant;
}

const TREND_CLASSES: Record<NonNullable<StatCardProps['trend']>['direction'] & string, { text: string; bg: string }> = {
  up: { text: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  down: { text: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
  neutral: { text: 'text-admin-muted', bg: 'bg-slate-500/10 border-slate-500/20' },
};

/**
 * Modern elevated KPI StatCard:
 * - Subtle glassmorphic background & glow accents
 * - Clean responsive typography
 * - Trend badges with micro-indicators
 */
export function StatCard({
  label,
  value,
  icon,
  hint,
  trend,
  accentClassName,
  className = '',
  variant,
}: StatCardProps) {
  const isAdmin = resolveVariant(variant, useAdminTheme().isAdminTheme) === 'admin';
  const accent = accentClassName ?? (isAdmin ? 'text-admin-accent' : 'text-brand-primary');

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 ${
        isAdmin
          ? 'border-admin-border bg-admin-card hover:border-admin-accent/40 hover:bg-admin-card-hover shadow-subtle-dark'
          : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-brand-primary/40 dark:hover:border-blue-500/40 shadow-subtle-light'
      } ${className}`}
    >
      {/* Glow highlight in corner */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-admin-accent/5 blur-2xl group-hover:bg-admin-accent/15 transition duration-500" />

      <div className="flex items-start justify-between gap-3">
        <span
          className={`text-xs font-bold uppercase tracking-wider ${
            isAdmin ? 'text-admin-muted' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {label}
        </span>
        {icon ? (
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition duration-300 ${
              isAdmin
                ? 'bg-admin-surface text-admin-text group-hover:scale-110 group-hover:bg-admin-accent/15 group-hover:text-admin-accent'
                : 'bg-gray-100 dark:bg-gray-800 text-brand-primary dark:text-blue-400 group-hover:scale-110'
            }`}
          >
            <span className={accent}>{icon}</span>
          </div>
        ) : null}
      </div>

      <div
        className={`mt-3 text-3xl font-extrabold tracking-tight ${
          isAdmin ? 'text-admin-text' : 'text-gray-900 dark:text-gray-100'
        }`}
      >
        {value}
      </div>

      {trend ? (
        <div className="mt-2.5 flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-bold ${
              TREND_CLASSES[trend.direction ?? 'neutral'].bg
            } ${TREND_CLASSES[trend.direction ?? 'neutral'].text}`}
          >
            {trend.direction === 'up' && <TrendingUp className="h-3 w-3" />}
            {trend.direction === 'down' && <TrendingDown className="h-3 w-3" />}
            {trend.value}
          </span>
          {hint ? (
            <span className={`text-xs ${isAdmin ? 'text-admin-muted' : 'text-gray-500 dark:text-gray-400'}`}>
              {hint}
            </span>
          ) : null}
        </div>
      ) : hint ? (
        <div className={`mt-2 text-xs font-medium ${isAdmin ? 'text-admin-muted' : 'text-gray-500 dark:text-gray-400'}`}>
          {hint}
        </div>
      ) : null}
    </div>
  );
}

export interface StatCardGridProps {
  children: ReactNode;
  className?: string;
}

export function StatCardGrid({ children, className = '' }: StatCardGridProps) {
  return <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>{children}</div>;
}

export default StatCard;
