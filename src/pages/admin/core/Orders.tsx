import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Flag, MapPin, Package, Search, ArrowUpRight } from 'lucide-react';
import DataTable, { type DataTableColumn } from '../../../components/DataTable';
import FilterTabs from '../../../components/FilterTabs';
import StatusBadge from '../../../components/StatusBadge';
import { adminGetOrders, type Order } from '../../../lib/api/adminCore';
import { useAdminAuth } from '../../../lib/auth';

function orderSerial(order: Order) {
  return order.orderCode || `#${order.id.slice(-8).toUpperCase()}`;
}

/** Modernized Admin Orders List Screen */
export default function Orders() {
  const { t } = useTranslation();
  const { token } = useAdminAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const driverId = searchParams.get('driverId') ?? undefined;
  const filterParam = searchParams.get('filter') ?? '';

  const tabs = [
    { value: '', label: t('admin.orders.tabs.all') },
    { value: 'pending_admin_review', label: t('admin.orders.tabs.pending_admin_review') },
    { value: 'approved_unassigned', label: t('admin.orders.tabs.approved_unassigned') },
    { value: 'pending_assignment', label: t('admin.orders.tabs.pending_assignment') },
    { value: 'active', label: t('admin.orders.tabs.active') },
    { value: 'pending_owner_review', label: t('admin.orders.tabs.pending_owner_review') },
    { value: 'pending_driver_review', label: t('admin.orders.tabs.pending_driver_review') },
    { value: 'completed', label: t('admin.orders.tabs.completed') },
    { value: 'cancelled', label: t('admin.orders.tabs.cancelled') },
    { value: 'reassign_needed', label: t('admin.orders.tabs.reassign_needed') },
  ];

  const [activeTab, setActiveTab] = useState(filterParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(
    async (status: string, q: string) => {
      if (!token) return;
      const { data } = await adminGetOrders(token, {
        status: status || undefined,
        driverId,
        q: q.trim() || undefined,
        limit: 100,
      });
      setOrders(data?.orders ?? []);
    },
    [token, driverId]
  );

  useEffect(() => {
    setActiveTab(filterParam);
  }, [filterParam]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value) {
      setSearchParams({ filter: value });
    } else {
      setSearchParams({});
    }
  };

  useEffect(() => {
    setLoading(true);
    loadOrders(activeTab, searchQuery).finally(() => setLoading(false));
  }, [loadOrders, activeTab, searchQuery]);

  const columns = useMemo<DataTableColumn<Order>[]>(
    () => [
      {
        key: 'orderCode',
        header: t('admin.orders.columns.orderCode'),
        render: (order) => (
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-admin-surface text-admin-accent font-bold text-xs">
              <Package className="h-4 w-4" />
            </div>
            <div>
              <div className="font-extrabold text-admin-text text-xs sm:text-sm flex items-center gap-1">
                <span>{orderSerial(order)}</span>
                <ArrowUpRight className="h-3 w-3 text-admin-muted opacity-0 group-hover:opacity-100 transition" />
              </div>
              <div className="text-[11px] font-mono text-admin-muted">
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
              </div>
            </div>
          </div>
        ),
      },
      {
        key: 'client',
        header: t('admin.orders.columns.client'),
        render: (order) => (
          <div className="font-medium text-xs text-admin-text">
            {order.client?.fullName ?? order.clientId ?? '—'}
          </div>
        ),
      },
      {
        key: 'route',
        header: t('admin.orders.columns.route'),
        render: (order) => (
          <div className="max-w-xs space-y-0.5 text-xs">
            <div className="flex items-center gap-1.5 truncate text-admin-text">
              <MapPin className="h-3 w-3 shrink-0 text-admin-muted" />
              <span className="truncate">{order.pickup?.address ?? '—'}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate text-emerald-400 font-medium">
              <Flag className="h-3 w-3 shrink-0" />
              <span className="truncate">{order.delivery?.address ?? '—'}</span>
            </div>
          </div>
        ),
      },
      {
        key: 'cargo',
        header: t('admin.orders.columns.cargo'),
        render: (order) => (
          <span className="inline-flex items-center rounded-lg bg-admin-surface px-2.5 py-1 text-xs font-semibold text-admin-text">
            {order.cargo?.type ?? 'Standard'} · {order.cargo?.weight ?? 0}t
          </span>
        ),
      },
      {
        key: 'offers',
        header: t('admin.orders.columns.offers'),
        render: (order) => {
          const summary = order.offerSummary;
          if (!summary?.totalOffers) return <span className="text-admin-muted text-xs">—</span>;
          return (
            <div className="text-xs">
              <div className="font-bold text-admin-text">{summary.totalOffers} bids</div>
              {summary.submittedOffers > 0 ? (
                <span className="inline-block font-bold text-amber-400 text-[11px]">
                  {summary.submittedOffers} new
                </span>
              ) : null}
            </div>
          );
        },
      },
      {
        key: 'price',
        header: t('admin.orders.columns.price'),
        render: (order) => (
          <div className="font-extrabold text-admin-text font-mono text-xs sm:text-sm">
            {order.price != null ? `${order.price.toLocaleString()} EGP` : '—'}
          </div>
        ),
      },
      {
        key: 'status',
        header: t('admin.orders.columns.dispatchStatus'),
        render: (order) => <StatusBadge status={order.status} />,
      },
    ],
    [t]
  );

  return (
    <div className="space-y-6 animation-fade-in">
      {/* Header bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-admin-accent animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-admin-accent">
              {t('nav.items.orders')}
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-admin-text">
            {t('admin.orders.title')}
          </h1>
          <p className="mt-1 text-xs text-admin-subtext">
            {t('admin.orders.subtitle', { count: orders.length })}
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute left-3.5 top-2.5 h-4 w-4 text-admin-muted" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('admin.orders.searchPlaceholder')}
            className="w-full rounded-2xl border border-admin-border bg-admin-card py-2 pl-10 pr-4 text-xs text-admin-text placeholder:text-admin-muted focus:border-admin-accent focus:outline-none focus:ring-1 focus:ring-admin-accent shadow-subtle-dark transition"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <FilterTabs tabs={tabs} active={activeTab} onChange={handleTabChange} />

      {/* Modern Data Table */}
      <DataTable
        columns={columns}
        data={orders}
        keyExtractor={(order) => order.id}
        loading={loading}
        emptyMessage={t('common.noResults')}
        onRowClick={(order) => navigate(`/admin/orders/${order.id}`)}
      />
    </div>
  );
}
