import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Contract,
  ContractStatus,
  getContracts,
  runContractNow,
  setContractStatus,
} from '../../../lib/api/adminMisc';
import { useAdminAuth } from '../../../lib/auth';
import DataTable, { DataTableColumn } from '../../../components/DataTable';
import StatusBadge, { StatusTone } from '../../../components/StatusBadge';

const STATUS_TONE: Record<ContractStatus, StatusTone> = {
  draft: 'neutral',
  active: 'success',
  paused: 'warning',
  completed: 'info',
  cancelled: 'danger',
};

/** Contracts list — status, run-now action. Ported from `components/ContractsScreen.tsx` (`variant="admin"`). */
export default function Contracts() {
  const { t } = useTranslation();
  const { token } = useAdminAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    const { data } = await getContracts(token, { limit: 100 });
    setContracts(data?.contracts ?? []);
  }, [token]);

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  const onToggleStatus = async (c: Contract) => {
    if (!token) return;
    const next: ContractStatus = c.status === 'active' ? 'paused' : 'active';
    setBusyId(c.id);
    setError(null);
    const { error: err } = await setContractStatus(token, c.id, next);
    setBusyId(null);
    if (err) {
      setError(err);
      return;
    }
    await load();
  };

  const onRunNow = async (c: Contract) => {
    if (!token) return;
    setBusyId(c.id);
    setError(null);
    const { error: err } = await runContractNow(token, c.id);
    setBusyId(null);
    if (err) {
      setError(err);
      return;
    }
    await load();
  };

  const columns: DataTableColumn<Contract>[] = [
    {
      key: 'title',
      header: t('admin.contracts.columns.contract'),
      render: (c) => (
        <div>
          <div className="font-medium text-admin-text">{c.title}</div>
          {c.contractCode ? <div className="text-xs text-admin-subtext">{c.contractCode}</div> : null}
        </div>
      ),
    },
    {
      key: 'status',
      header: t('common.status'),
      render: (c) => <StatusBadge status={c.status} tone={STATUS_TONE[c.status]} />,
    },
    {
      key: 'rate',
      header: t('admin.contracts.columns.rate'),
      render: (c) => (
        <span>
          {c.rate.toLocaleString()} {c.currency} · {t(`admin.contracts.cadences.${c.cadence}`, { defaultValue: c.cadence.replace(/_/g, ' ') })}
        </span>
      ),
    },
    {
      key: 'valid',
      header: t('admin.contracts.columns.valid'),
      className: 'whitespace-nowrap',
      render: (c) => (
        <span>
          {new Date(c.validFrom).toLocaleDateString()} → {new Date(c.validTo).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'nextRunAt',
      header: t('admin.contracts.columns.nextRun'),
      className: 'whitespace-nowrap',
      render: (c) => (c.nextRunAt ? new Date(c.nextRunAt).toLocaleString() : '—'),
    },
    {
      key: 'generatedOrderIds',
      header: t('admin.contracts.columns.orders'),
      render: (c) => c.generatedOrderIds.length,
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (c) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            disabled={busyId === c.id}
            onClick={() => onToggleStatus(c)}
            className="rounded-md border border-admin-accent px-2.5 py-1 text-xs font-semibold text-admin-accent transition hover:bg-admin-accent/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {c.status === 'active' ? t('admin.contracts.pause') : t('admin.contracts.activate')}
          </button>
          {c.status === 'active' ? (
            <button
              type="button"
              disabled={busyId === c.id}
              onClick={() => onRunNow(c)}
              className="rounded-md border border-admin-subtext px-2.5 py-1 text-xs font-semibold text-admin-subtext transition hover:bg-admin-subtext/10 hover:text-admin-text disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t('admin.contracts.runNow')}
            </button>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-admin-text">{t('admin.contracts.title')}</h1>
          <p className="mt-1 text-sm text-admin-subtext">{t('admin.contracts.subtitle')}</p>
        </div>
        <Link
          to="/admin/contracts/new"
          className="rounded-md border border-admin-accent bg-admin-accent/10 px-3.5 py-2 text-sm font-semibold text-admin-accent transition hover:bg-admin-accent/20"
        >
          {t('admin.contracts.newContract')}
        </Link>
      </div>

      {error ? (
        <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      ) : null}

      <DataTable
        columns={columns}
        data={contracts}
        keyExtractor={(c) => c.id}
        loading={loading}
        emptyMessage={t('admin.contracts.noContracts')}
      />
    </div>
  );
}
