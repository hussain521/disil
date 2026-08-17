import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataTable, { DataTableColumn } from '../../../components/DataTable';
import FilterTabs from '../../../components/FilterTabs';
import Modal from '../../../components/Modal';
import StatusBadge, { StatusTone } from '../../../components/StatusBadge';
import { useAdminAuth } from '../../../lib/auth';
import {
  Complaint,
  ComplaintStatus,
  adminGetComplaints,
  adminUpdateComplaintStatus,
} from '../../../lib/api/adminReview';

const STATUS_FILTERS: (ComplaintStatus | 'all')[] = ['all', 'open', 'in_review', 'resolved', 'closed'];

const STATUS_TONE: Record<ComplaintStatus, StatusTone> = {
  open: 'danger',
  in_review: 'warning',
  resolved: 'success',
  closed: 'neutral',
};

/** Complaint inbox with a status-workflow resolve modal — mirrors `components/ComplaintsScreen.tsx` (admin mode). */
export default function Complaints() {
  const { t } = useTranslation();
  const { token } = useAdminAuth();
  const [items, setItems] = useState<Complaint[]>([]);
  const [counts, setCounts] = useState<Record<ComplaintStatus, number>>({
    open: 0,
    in_review: 0,
    resolved: 0,
    closed: 0,
  });
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<Complaint | null>(null);
  const [resolution, setResolution] = useState('');
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    const { data, error: err } = await adminGetComplaints(
      token,
      statusFilter === 'all' ? undefined : { status: statusFilter }
    );
    if (data) {
      setItems(data.complaints);
      setCounts(data.counts);
    }
    if (err) setError(err);
    setLoading(false);
  }, [token, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const openDetail = (c: Complaint) => {
    setDetail(c);
    setResolution(c.resolution ?? '');
    setError(null);
  };

  const handleStatusUpdate = async (status: ComplaintStatus) => {
    if (!token || !detail) return;
    setUpdating(true);
    setError(null);
    const { error: err } = await adminUpdateComplaintStatus(token, detail.id, {
      status,
      resolution: resolution.trim() || undefined,
    });
    setUpdating(false);
    if (err) {
      setError(err);
      return;
    }
    setDetail(null);
    setResolution('');
    await load();
  };

  const columns: DataTableColumn<Complaint>[] = [
    {
      key: 'subject',
      header: t('admin.complaints.subject'),
      render: (c) => (
        <div>
          <p className="font-medium text-admin-text">{c.subject}</p>
          <p className="mt-0.5 max-w-md truncate text-xs text-admin-subtext">{c.description}</p>
        </div>
      ),
    },
    {
      key: 'submittedBy',
      header: t('admin.complaints.from'),
      render: (c) =>
        typeof c.submittedBy === 'object' ? (
          <span>
            {c.submittedBy.fullName} <span className="text-admin-subtext">· {c.submittedBy.role}</span>
          </span>
        ) : (
          '—'
        ),
    },
    { key: 'orderId', header: t('admin.complaints.order'), render: (c) => c.orderId ?? '—' },
    {
      key: 'status',
      header: t('common.status'),
      render: (c) => <StatusBadge status={c.status} label={t(`status.${c.status}`)} tone={STATUS_TONE[c.status]} />,
    },
    {
      key: 'createdAt',
      header: t('common.date'),
      render: (c) => new Date(c.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-admin-text">{t('admin.complaints.title')}</h1>
        <p className="mt-1 text-sm text-admin-subtext">{t('admin.complaints.subtitle')}</p>
      </div>

      <FilterTabs
        tabs={STATUS_FILTERS.map((s) => ({
          value: s,
          label: s === 'all' ? t('common.all') : t(`status.${s}`),
          count: s === 'all' ? undefined : counts[s],
        }))}
        active={statusFilter}
        onChange={(v) => setStatusFilter(v as ComplaintStatus | 'all')}
      />

      <DataTable
        columns={columns}
        data={items}
        keyExtractor={(c) => c.id}
        loading={loading}
        emptyMessage={t('admin.complaints.noComplaints')}
        onRowClick={openDetail}
      />

      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.subject} size="md">
        {detail ? (
          <div className="space-y-3">
            <p className="text-sm text-admin-text">{detail.description}</p>
            {typeof detail.submittedBy === 'object' ? (
              <p className="text-xs text-admin-subtext">
                {t('admin.complaints.from')}: {detail.submittedBy.fullName} ({detail.submittedBy.role})
                {detail.submittedBy.phone ? ` · ${detail.submittedBy.phone}` : ''}
              </p>
            ) : null}
            {detail.orderId ? <p className="text-xs text-admin-subtext">{t('admin.complaints.order')}: {detail.orderId}</p> : null}
            <StatusBadge status={detail.status} label={t(`status.${detail.status}`)} tone={STATUS_TONE[detail.status]} />

            <textarea
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              placeholder={t('admin.complaints.resolutionNote')}
              rows={3}
              className="w-full rounded-md border border-admin-border bg-admin-bg p-2 text-sm text-admin-text placeholder:text-admin-subtext focus:border-admin-accent focus:outline-none"
            />

            {error ? <p className="text-sm text-brand-danger">{error}</p> : null}

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                disabled={updating}
                onClick={() => handleStatusUpdate('in_review')}
                className="rounded-md bg-amber-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t('admin.complaints.inReview')}
              </button>
              <button
                type="button"
                disabled={updating}
                onClick={() => handleStatusUpdate('resolved')}
                className="rounded-md bg-brand-success px-3 py-1.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t('admin.complaints.resolve')}
              </button>
              <button
                type="button"
                disabled={updating}
                onClick={() => handleStatusUpdate('closed')}
                className="rounded-md border border-admin-border px-3 py-1.5 text-sm font-medium text-admin-subtext transition hover:text-admin-text disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t('admin.complaints.close')}
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
