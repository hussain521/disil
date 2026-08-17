import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  adminApproveEntry,
  adminGetFinancialSummary,
  adminRejectEntry,
  adminSettleEntry,
  getMyFinancialCenter,
  type FinancialPeriod,
  type FinancialSummaryTotals,
  type LedgerEntry,
} from '../../../lib/api/adminAccounts';
import { useAdminAuth } from '../../../lib/auth';
import DataTable, { DataTableColumn } from '../../../components/DataTable';
import { StatCard, StatCardGrid } from '../../../components/StatCard';
import FilterTabs from '../../../components/FilterTabs';

function fmtEgp(n?: number | null) {
  return `${(n ?? 0).toLocaleString('en-US', { maximumFractionDigits: 2 })} EGP`;
}

/** Ported from `app/(admin)/financial.tsx`: period KPI grid + pending ledger entries with approve/reject/settle. */
export default function Financial() {
  const { t } = useTranslation();
  const { token } = useAdminAuth();
  const [period, setPeriod] = useState<FinancialPeriod>('daily');
  const [totals, setTotals] = useState<FinancialSummaryTotals | null>(null);
  const [pending, setPending] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const PERIODS: { value: FinancialPeriod; label: string }[] = [
    { value: 'daily', label: t('admin.financial.periods.daily') },
    { value: 'weekly', label: t('admin.financial.periods.weekly') },
    { value: 'monthly', label: t('admin.financial.periods.monthly') },
  ];

  const KPI_DEFS: { key: keyof FinancialSummaryTotals; label: string; accent: string }[] = [
    { key: 'revenue', label: t('admin.financial.kpis.revenue'), accent: 'text-emerald-500' },
    { key: 'driverPay', label: t('admin.financial.kpis.driverPay'), accent: 'text-sky-500' },
    { key: 'truckCost', label: t('admin.financial.kpis.truckCost'), accent: 'text-amber-500' },
    { key: 'depreciation', label: t('admin.financial.kpis.depreciation'), accent: 'text-violet-500' },
    { key: 'agentCommission', label: t('admin.financial.kpis.agentCommission'), accent: 'text-pink-500' },
    { key: 'profit', label: t('admin.financial.kpis.profit'), accent: 'text-emerald-500' },
    { key: 'tax', label: t('admin.financial.kpis.tax'), accent: 'text-red-500' },
    { key: 'adjustments', label: t('admin.financial.kpis.adjustments'), accent: 'text-gray-400' },
  ];

  const load = useCallback(async () => {
    if (!token) return;
    const [summaryRes, meRes] = await Promise.all([
      adminGetFinancialSummary(token, period),
      getMyFinancialCenter(token, { status: 'under_review', limit: 200 }),
    ]);
    if (summaryRes.data) setTotals(summaryRes.data.totals);
    if (meRes.data) setPending(meRes.data.entries);
  }, [token, period]);

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  const runAction = async (action: () => Promise<{ error?: string }>, id: string) => {
    setActingId(id);
    setError(null);
    const { error: err } = await action();
    setActingId(null);
    if (err) {
      setError(err);
      return;
    }
    await load();
  };

  const columns: DataTableColumn<LedgerEntry>[] = [
    {
      key: 'category',
      header: t('admin.financial.columns.category'),
      render: (e) => <span className="font-medium capitalize">{e.category.replace(/_/g, ' ')}</span>,
    },
    {
      key: 'description',
      header: t('admin.financial.columns.description'),
      render: (e) => (
        <div>
          <div>{e.description || '—'}</div>
          {e.reason ? <div className="text-xs text-amber-500">Reason: {e.reason}</div> : null}
        </div>
      ),
    },
    {
      key: 'amount',
      header: t('admin.financial.columns.amount'),
      render: (e) => (
        <span className={`font-semibold ${e.direction === 'credit' ? 'text-emerald-500' : 'text-red-500'}`}>
          {e.direction === 'credit' ? '+' : '−'}
          {fmtEgp(e.amount)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: t('admin.financial.columns.actions'),
      render: (e) => (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={actingId === e.id}
            onClick={() => runAction(() => adminApproveEntry(token!, e.id), e.id)}
            className="rounded-md border border-emerald-500 px-2.5 py-1 text-xs font-semibold text-emerald-500 transition hover:bg-emerald-500/10 disabled:opacity-50"
          >
            {t('admin.financial.approve')}
          </button>
          <button
            type="button"
            disabled={actingId === e.id}
            onClick={() => runAction(() => adminRejectEntry(token!, e.id), e.id)}
            className="rounded-md border border-red-500 px-2.5 py-1 text-xs font-semibold text-red-500 transition hover:bg-red-500/10 disabled:opacity-50"
          >
            {t('admin.financial.reject')}
          </button>
          <button
            type="button"
            disabled={actingId === e.id}
            onClick={() => runAction(() => adminSettleEntry(token!, e.id), e.id)}
            className="rounded-md border border-sky-500 px-2.5 py-1 text-xs font-semibold text-sky-500 transition hover:bg-sky-500/10 disabled:opacity-50"
          >
            {t('admin.financial.settle')}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-admin-text">{t('admin.financial.title')}</h1>
        <p className="mt-1 text-sm text-admin-subtext">{t('admin.financial.subtitle')}</p>
      </div>

      <FilterTabs tabs={PERIODS.map((p) => ({ value: p.value, label: p.label }))} active={period} onChange={(v) => setPeriod(v as FinancialPeriod)} />

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <StatCardGrid>
        {KPI_DEFS.map((kpi) => (
          <StatCard
            key={kpi.key}
            label={kpi.label}
            value={fmtEgp(totals?.[kpi.key])}
            accentClassName={kpi.accent}
          />
        ))}
      </StatCardGrid>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-admin-subtext">{t('admin.financial.pendingApprovals')}</h2>
        <DataTable
          columns={columns}
          data={pending}
          keyExtractor={(e) => e.id}
          loading={loading}
          emptyMessage={t('admin.financial.noPending')}
        />
      </div>
    </div>
  );
}
