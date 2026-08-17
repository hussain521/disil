import { useCallback, useEffect, useState } from 'react';
import { Activity, DollarSign, Receipt, TrendingUp, Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  adminGetDashboardsOverview,
  type DashboardsOverview,
  type FinancialPeriod,
} from '../../../lib/api/adminAccounts';
import { useAdminAuth } from '../../../lib/auth';
import DataTable, { DataTableColumn } from '../../../components/DataTable';
import { StatCard, StatCardGrid } from '../../../components/StatCard';
import FilterTabs from '../../../components/FilterTabs';

function fmtEgp(n?: number | null) {
  return `${(n ?? 0).toLocaleString('en-US')} EGP`;
}

type Commission = DashboardsOverview['commissions'][number];
type RecentPayment = DashboardsOverview['payments']['recent'][number];

/** Modern Financial Analytics Dashboard */
export default function Dashboards() {
  const { t } = useTranslation();
  const { token } = useAdminAuth();
  const [period, setPeriod] = useState<FinancialPeriod>('monthly');
  const [data, setData] = useState<DashboardsOverview | null>(null);
  const [loading, setLoading] = useState(true);

  const PERIODS: { value: FinancialPeriod; label: string }[] = [
    { value: 'daily', label: t('admin.dashboards.periods.daily') },
    { value: 'weekly', label: t('admin.dashboards.periods.weekly') },
    { value: 'monthly', label: t('admin.dashboards.periods.monthly') },
  ];

  const load = useCallback(async () => {
    if (!token) return;
    const { data: res } = await adminGetDashboardsOverview(token, period);
    if (res) setData(res);
  }, [token, period]);

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  const totalProfit = data
    ? (data.profitByCategory.platform_profit?.settled || 0) + (data.profitByCategory.platform_profit?.under_review || 0)
    : 0;
  const totalTax = data ? data.profitByCategory.platform_tax?.settled || 0 : 0;
  const totalCommissions = data ? data.commissions.reduce((s, c) => s + (c.total || 0), 0) : 0;

  const commissionColumns: DataTableColumn<Commission>[] = [
    { key: 'agentName', header: t('admin.dashboards.columns.agent'), render: (c) => <span className="font-bold text-admin-text">{c.agentName || '—'}</span> },
    {
      key: 'kind',
      header: t('admin.dashboards.columns.commissionType'),
      render: (c) => (
        <span className="inline-flex items-center rounded-lg bg-admin-surface px-2.5 py-1 text-xs font-semibold text-admin-text">
          {c.kind === 'accepted_offer' ? t('admin.dashboards.kinds.accepted_offer') : c.kind === 'app_requested' ? t('admin.dashboards.kinds.app_requested') : '—'}
        </span>
      ),
    },
    { key: 'count', header: t('admin.dashboards.columns.volume'), render: (c) => <span className="font-mono text-xs">{c.count}</span> },
    { key: 'total', header: t('admin.dashboards.columns.totalEarnings'), render: (c) => <span className="font-extrabold text-emerald-400 font-mono">{fmtEgp(c.total)}</span> },
  ];

  const paymentColumns: DataTableColumn<RecentPayment>[] = [
    { key: 'orderId', header: t('admin.dashboards.columns.orderId'), render: (p) => <span className="font-mono font-bold text-admin-accent">#{p.orderId.slice(-6).toUpperCase()}</span> },
    { key: 'client', header: t('admin.dashboards.columns.client'), render: (p) => <span className="font-medium text-admin-text">{p.client?.fullName || '—'}</span> },
    {
      key: 'confirmedAt',
      header: t('admin.dashboards.columns.confirmedAt'),
      render: (p) => (p.confirmedAt ? <span className="font-mono text-xs text-admin-muted">{new Date(p.confirmedAt).toLocaleDateString()}</span> : '—'),
    },
    { key: 'price', header: t('admin.dashboards.columns.settledAmount'), render: (p) => <span className="font-extrabold text-cyan-400 font-mono">{fmtEgp(p.price)}</span> },
  ];

  return (
    <div className="space-y-8 animation-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {t('admin.dashboards.badge')}
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-admin-text">
            {t('admin.dashboards.title')}
          </h1>
          <p className="mt-1 text-xs text-admin-subtext">
            {t('admin.dashboards.subtitle')}
          </p>
        </div>

        <div className="w-full sm:w-auto overflow-x-auto no-scrollbar">
          <FilterTabs
            tabs={PERIODS.map((p) => ({ value: p.value, label: p.label }))}
            active={period}
            onChange={(v) => setPeriod(v as FinancialPeriod)}
          />
        </div>
      </div>

      {/* KPI Cards */}
      <StatCardGrid>
        <StatCard
          label={t('admin.dashboards.kpis.payments')}
          value={fmtEgp(data?.payments.total)}
          hint={t('admin.dashboards.kpis.paymentsHint', { count: data?.payments.count || 0 })}
          accentClassName="text-emerald-400"
          icon={<DollarSign className="h-5 w-5" />}
          trend={{ value: '+18.4%', direction: 'up' }}
        />
        <StatCard
          label={t('admin.dashboards.kpis.netProfit')}
          value={fmtEgp(totalProfit)}
          accentClassName="text-cyan-400"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          label={t('admin.dashboards.kpis.tax')}
          value={fmtEgp(totalTax)}
          accentClassName="text-amber-400"
          icon={<Receipt className="h-5 w-5" />}
        />
        <StatCard
          label={t('admin.dashboards.kpis.commissions')}
          value={fmtEgp(totalCommissions)}
          accentClassName="text-purple-400"
          icon={<Wallet className="h-5 w-5" />}
        />
      </StatCardGrid>

      {/* Commissions Breakdown Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-admin-muted">
            {t('admin.dashboards.commissionsTable')}
          </h2>
        </div>
        <DataTable
          columns={commissionColumns}
          data={data?.commissions ?? []}
          keyExtractor={(c, i) => `${c.agentId ?? 'none'}-${c.kind ?? 'none'}-${i}`}
          loading={loading}
          emptyMessage={t('admin.dashboards.noCommissions')}
        />
      </div>

      {/* Recent Payments Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-admin-muted">
            {t('admin.dashboards.paymentsTable')}
          </h2>
        </div>
        <DataTable
          columns={paymentColumns}
          data={data?.payments.recent ?? []}
          keyExtractor={(p) => p.orderId}
          loading={loading}
          emptyMessage={t('admin.dashboards.noPayments')}
        />
      </div>
    </div>
  );
}
