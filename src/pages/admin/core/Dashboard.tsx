import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Compass,
  FileCheck,
  FileText,
  HandCoins,
  Inbox,
  Layers,
  Truck,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { StatCard, StatCardGrid } from '../../../components/StatCard';
import { adminGetStats, type AdminStats } from '../../../lib/api/adminCore';
import { useAdminAuth } from '../../../lib/auth';

/** Admin dashboard/stats screen */
export default function Dashboard() {
  const { t } = useTranslation();
  const { token } = useAdminAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    if (!token) return;
    const { data } = await adminGetStats(token);
    if (data) setStats(data);
  }, [token]);

  useEffect(() => {
    setLoading(true);
    loadStats().finally(() => setLoading(false));
  }, [loadStats]);

  const statCards: {
    key: keyof AdminStats;
    label: string;
    icon: LucideIcon;
    accentClassName: string;
    href: string;
    trend?: { value: string; direction: 'up' | 'down' | 'neutral' };
  }[] = [
    {
      key: 'newOffers',
      label: t('nav.items.newOffers'),
      icon: HandCoins,
      accentClassName: 'text-amber-400',
      href: '/admin/new-offers',
      trend: { value: '+14%', direction: 'up' },
    },
    {
      key: 'pendingAdminReview',
      label: t('status.pending_admin_review'),
      icon: Inbox,
      accentClassName: 'text-rose-400',
      href: '/admin/orders?filter=pending_admin_review',
      trend: { value: '!', direction: 'down' },
    },
    {
      key: 'approvedUnassigned',
      label: t('status.approved_unassigned'),
      icon: Clock,
      accentClassName: 'text-cyan-400',
      href: '/admin/orders?filter=approved_unassigned',
    },
    {
      key: 'active',
      label: t('status.active'),
      icon: Activity,
      accentClassName: 'text-emerald-400',
      href: '/admin/orders?filter=active',
      trend: { value: 'GPS', direction: 'up' },
    },
    {
      key: 'delivered',
      label: t('status.delivered'),
      icon: CheckCircle2,
      accentClassName: 'text-sky-400',
      href: '/admin/orders?filter=completed',
    },
    {
      key: 'totalOrders',
      label: t('nav.items.orders'),
      icon: FileText,
      accentClassName: 'text-purple-400',
      href: '/admin/orders',
    },
    {
      key: 'totalUsers',
      label: t('nav.items.users'),
      icon: Users,
      accentClassName: 'text-indigo-400',
      href: '/admin/users',
    },
    {
      key: 'totalTrucks',
      label: t('nav.items.fleet'),
      icon: Truck,
      accentClassName: 'text-teal-400',
      href: '/admin/fleet',
    },
  ];

  const quickActions = [
    { label: t('admin.dashboard.dispatchOrders'), href: '/admin/orders', icon: Layers, desc: t('admin.dashboard.dispatchOrdersDesc') },
    { label: t('admin.dashboard.liveTracking'), href: '/admin/track', icon: Compass, desc: t('admin.dashboard.liveTrackingDesc') },
    { label: t('admin.dashboard.verifyDocs'), href: '/admin/documents', icon: FileCheck, desc: t('admin.dashboard.verifyDocsDesc') },
    { label: t('admin.dashboard.newOffers'), href: '/admin/new-offers', icon: HandCoins, desc: t('admin.dashboard.newOffersDesc') },
  ];

  return (
    <div className="space-y-8 animation-fade-in">
      {/* Top Banner with greeting and system status */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl sm:rounded-3xl border border-admin-border bg-gradient-to-r from-admin-card via-admin-card to-admin-surface p-4 sm:p-6 shadow-subtle-dark">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {t('admin.dashboard.operationsActive')}
            </span>
          </div>
          <h1 className="mt-1 text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-admin-text">
            {t('admin.dashboard.title')}
          </h1>
          <p className="mt-1 text-xs text-admin-subtext leading-relaxed">
            {t('admin.dashboard.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/admin/track"
            className="flex w-full sm:w-auto justify-center items-center gap-2 rounded-xl bg-admin-accent px-4 py-2.5 text-xs font-bold text-white shadow-lg glow-accent-sm hover:bg-admin-accent-dark transition"
          >
            <Compass className="h-4 w-4" />
            <span>{t('admin.dashboard.openLiveMap')}</span>
          </Link>
        </div>
      </div>

      {/* Review Alert Bar */}
      {stats && stats.pendingAdminReview > 0 ? (
        <Link
          to="/admin/orders?filter=pending_admin_review"
          className="flex items-center gap-3.5 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-5 py-3.5 text-xs font-bold text-amber-300 transition hover:bg-amber-500/15"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div className="flex-1">
            {t('admin.dashboard.reviewAlert', { count: stats.pendingAdminReview })}
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 transition rtl:rotate-180" />
        </Link>
      ) : null}

      {/* KPI Cards Grid */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-admin-muted">
            {t('admin.dashboard.platformMetrics')}
          </h2>
          <span className="text-[11px] font-mono text-admin-muted">{t('admin.dashboard.realtimeUpdated')}</span>
        </div>

        {loading ? (
          <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-admin-border bg-admin-card p-8">
            <div className="flex flex-col items-center gap-3">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-admin-accent border-t-transparent" />
              <span className="text-xs font-semibold text-admin-muted">{t('common.loading')}</span>
            </div>
          </div>
        ) : (
          <StatCardGrid>
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link key={card.key} to={card.href} className="block">
                  <StatCard
                    label={card.label}
                    value={stats ? stats[card.key] ?? 0 : '—'}
                    icon={<Icon className="h-5 w-5" />}
                    accentClassName={card.accentClassName}
                    trend={card.trend}
                  />
                </Link>
              );
            })}
          </StatCardGrid>
        )}
      </div>

      {/* Quick Access Control Grid */}
      <div className="rounded-2xl sm:rounded-3xl border border-admin-border bg-admin-card p-4 sm:p-6 shadow-subtle-dark">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold tracking-tight text-admin-text">
              {t('admin.dashboard.quickActions')}
            </h2>
            <p className="text-xs text-admin-subtext">{t('admin.dashboard.quickActionsDesc')}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                to={action.href}
                className="group flex items-center gap-3.5 rounded-2xl border border-admin-border bg-admin-bg/60 p-4 transition-all duration-200 hover:border-admin-accent/40 hover:bg-admin-card-hover hover:shadow-xs"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-admin-surface text-admin-subtext group-hover:bg-admin-accent/15 group-hover:text-admin-accent transition duration-200">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-admin-text group-hover:text-admin-accent transition">
                    {action.label}
                  </div>
                  <div className="text-[11px] text-admin-muted truncate">{action.desc}</div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-admin-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition rtl:rotate-180" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
