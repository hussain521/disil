import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { StatCardGrid } from '../../../components/StatCard';
import { useAdminAuth } from '../../../lib/auth';
import { adminGetOrderManagementSummary, type OrderManagementSummary } from '../../../lib/api/adminOperations';

interface Slot {
  key: keyof OrderManagementSummary;
  labelKey: string;
  color: string;
  filterStatus: string;
}

const SLOTS: Slot[] = [
  { key: 'newOrders', labelKey: 'admin.orderManagement.newOrders', color: '#FBBF24', filterStatus: 'pending_admin_review' },
  { key: 'pendingAssignment', labelKey: 'admin.orderManagement.pendingAssignment', color: '#60A5FA', filterStatus: 'pending_assignment' },
  { key: 'active', labelKey: 'admin.orderManagement.active', color: '#34D399', filterStatus: 'active' },
  { key: 'delivered', labelKey: 'admin.orderManagement.delivered', color: '#60A5FA', filterStatus: 'completed' },
  { key: 'cancelled', labelKey: 'admin.orderManagement.cancelled', color: '#F87171', filterStatus: 'cancelled' },
  { key: 'reassign', labelKey: 'admin.orderManagement.reassignNeeded', color: '#A78BFA', filterStatus: 'reassign_needed' },
];

export default function OrderManagement() {
  const { t } = useTranslation();
  const { token } = useAdminAuth();
  const [summary, setSummary] = useState<OrderManagementSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!token) return;
    const { data } = await adminGetOrderManagementSummary(token);
    if (data) setSummary(data);
  }, [token]);

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  return (
    <div>
      <h1 className="text-xl font-bold text-admin-text">{t('admin.orderManagement.title')}</h1>
      <p className="mt-1 text-sm text-admin-subtext">{t('admin.orderManagement.subtitle')}</p>

      {loading ? (
        <p className="mt-8 text-center text-sm text-admin-subtext">{t('common.loading')}</p>
      ) : (
        <StatCardGrid className="mt-6">
          {SLOTS.map((slot) => (
            <Link
              key={slot.key}
              to={`/admin/orders?status=${encodeURIComponent(slot.filterStatus)}`}
              className="block rounded-lg border border-admin-border bg-admin-card p-4 transition hover:-translate-y-0.5 hover:border-admin-accent/40"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-medium uppercase tracking-wide text-admin-subtext">{t(slot.labelKey)}</span>
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: slot.color }} />
              </div>
              <div className="mt-2 text-2xl font-semibold text-admin-text">{summary ? summary[slot.key] ?? 0 : '—'}</div>
            </Link>
          ))}
        </StatCardGrid>
      )}
    </div>
  );
}
