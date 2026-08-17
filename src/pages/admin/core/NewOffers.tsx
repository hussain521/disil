import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Flag, MapPin, Tag } from 'lucide-react';
import DataTable, { type DataTableColumn } from '../../../components/DataTable';
import StatusBadge from '../../../components/StatusBadge';
import {
  adminGetOrders,
  adminGetRecentOffers,
  type Order,
  type RecentOfferItem,
} from '../../../lib/api/adminCore';
import { useAdminAuth } from '../../../lib/auth';

function orderSerial(order: Order) {
  return order.orderCode || `#${order.id.slice(-8).toUpperCase()}`;
}

function offerSerial(offer: RecentOfferItem) {
  return offer.orderCode || `#${offer.orderId.slice(-8).toUpperCase()}`;
}

function RecentOfferCard({ offer, onClick }: { offer: RecentOfferItem; onClick: () => void }) {
  const { t } = useTranslation();
  const date = offer.createdAt ? new Date(offer.createdAt).toLocaleDateString() : '';

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-[14px] border border-admin-border bg-admin-card p-4 text-left rtl:text-right transition hover:border-admin-accent/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[15px] font-bold text-admin-text">{offerSerial(offer)}</div>
          {date ? <div className="mt-0.5 text-[11px] text-admin-subtext">{date}</div> : null}
        </div>
        <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
          <StatusBadge status={offer.orderStatus} />
          <span className="rounded-lg border border-yellow-500/40 bg-yellow-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-yellow-400">
            {t('admin.newOffers.newOfferBadge')}
          </span>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-1.5 rounded-md border border-yellow-500/25 bg-yellow-500/10 px-2.5 py-1.5">
        <Tag className="h-3.5 w-3.5 shrink-0 text-yellow-400" />
        <span className="text-xs font-semibold text-yellow-300">
          {offer.agentName || t('nav.items.admins')}
          {offer.agentCode ? ` · ${offer.agentCode}` : ''}
          {offer.negotiationRounds > 1 ? ` · ${t('admin.newOffers.negotiationRounds', { count: offer.negotiationRounds })}` : ''}
        </span>
      </div>

      <div className="my-2.5 h-px bg-admin-border" />

      <div className="space-y-1 text-[13px]">
        <div className="flex items-center gap-1 truncate text-admin-subtext">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{offer.pickup || '—'}</span>
        </div>
        <div className="flex items-center gap-1 truncate text-emerald-400">
          <Flag className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{offer.delivery || '—'}</span>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <span className="truncate text-xs font-medium text-sky-400">{offer.clientName || '—'}</span>
        <span className="shrink-0 text-[13px] font-bold text-emerald-400 font-mono">
          {offer.providerPrice?.toLocaleString()} {t('common.currency')}
        </span>
      </div>
    </button>
  );
}

/** Orders with new agent offers — same layout as Orders, plus recent offers feed. */
export default function NewOffers() {
  const { t } = useTranslation();
  const { token } = useAdminAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [recentOffers, setRecentOffers] = useState<RecentOfferItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!token) return;
    const [{ data }, { data: offersData }] = await Promise.all([
      adminGetOrders(token, {
        status: 'has_new_offers',
        q: searchQuery.trim() || undefined,
        limit: 100,
      }),
      adminGetRecentOffers(token, 10),
    ]);
    setOrders(data?.orders ?? []);
    setRecentOffers(offersData?.offers ?? []);
  }, [token, searchQuery]);

  useEffect(() => {
    setLoading(true);
    loadData().finally(() => setLoading(false));
  }, [loadData]);

  const columns = useMemo<DataTableColumn<Order>[]>(
    () => [
      {
        key: 'orderCode',
        header: t('admin.orders.columns.orderCode'),
        render: (order) => (
          <div>
            <div className="font-semibold text-admin-text">
              {orderSerial(order)}
            </div>
            <div className="text-xs text-admin-subtext">
              {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
            </div>
          </div>
        ),
      },
      {
        key: 'client',
        header: t('admin.orders.columns.client'),
        render: (order) => order.client?.fullName ?? order.clientId ?? '—',
      },
      {
        key: 'route',
        header: t('admin.orders.columns.route'),
        render: (order) => (
          <div className="max-w-xs text-xs">
            <div className="flex items-center gap-1 truncate text-admin-text">
              <MapPin className="h-3 w-3 shrink-0 text-admin-subtext" />
              {order.pickup?.address ?? '—'}
            </div>
            <div className="flex items-center gap-1 truncate text-emerald-400">
              <Flag className="h-3 w-3 shrink-0" />
              {order.delivery?.address ?? '—'}
            </div>
          </div>
        ),
      },
      {
        key: 'cargo',
        header: t('admin.orders.columns.cargo'),
        render: (order) => `${order.cargo?.type ?? '—'} · ${order.cargo?.weight ?? 0}${t('common.ton')}`,
      },
      {
        key: 'offers',
        header: t('admin.orders.columns.offers'),
        render: (order) => {
          const summary = order.offerSummary;
          if (!summary?.totalOffers) return '—';
          return (
            <div className="text-xs">
              <div className="font-semibold text-admin-text">{t('admin.newOffers.bidsCount', { count: summary.totalOffers })}</div>
              {summary.submittedOffers > 0 ? (
                <div className="text-yellow-400">{t('admin.newOffers.newBids', { count: summary.submittedOffers })}</div>
              ) : null}
              {summary.hasNegotiation ? (
                <div className="text-admin-subtext">{t('admin.newOffers.negotiationRounds', { count: summary.maxNegotiationRounds })}</div>
              ) : null}
            </div>
          );
        },
      },
      {
        key: 'price',
        header: t('admin.orders.columns.price'),
        render: (order) => (order.price != null ? `${order.price.toLocaleString()} ${t('common.currency')}` : '—'),
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {t('admin.newOffers.recentOffers')}
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-admin-text">{t('admin.newOffers.title')}</h1>
          <p className="mt-1 text-xs text-admin-subtext">{t('admin.newOffers.subtitle', { count: orders.length })}</p>
        </div>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('admin.newOffers.searchPlaceholder')}
          className="w-full sm:w-80 rounded-2xl border border-admin-border bg-admin-card px-4 py-2 text-xs text-admin-text placeholder:text-admin-muted focus:border-admin-accent focus:outline-none focus:ring-1 focus:ring-admin-accent shadow-subtle-dark transition"
        />
      </div>

      {recentOffers.length > 0 ? (
        <div>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-admin-subtext">{t('admin.newOffers.recentOffers')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentOffers.map((offer) => (
              <RecentOfferCard
                key={`${offer.orderId}-${offer.offerId}`}
                offer={offer}
                onClick={() => navigate(`/admin/orders/${offer.orderId}`)}
              />
            ))}
          </div>
        </div>
      ) : null}

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
