import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { adminGetQuotes, adminPriceQuote, type ClientType, type Quote, type QuoteStatus } from '../../../lib/api/adminAccounts';
import { useAdminAuth } from '../../../lib/auth';
import FilterTabs from '../../../components/FilterTabs';
import Modal from '../../../components/Modal';
import Pagination from '../../../components/Pagination';
import { formatCargoType } from '../../../lib/truckTranslations';

const STATUS_COLOR: Record<QuoteStatus, string> = {
  pending: '#F59E0B',
  pricing: '#60A5FA',
  sent_to_client: '#F4A62A',
  accepted: '#34D399',
  rejected: '#F87171',
  cancelled: '#F87171',
  expired: '#9CA3AF',
};

function egp(n?: number | null) {
  return n != null ? `${n.toLocaleString()} EGP` : '—';
}

function commissionPreview(dizielPrice: number, clientType: ClientType) {
  const isContractor = clientType === 'contractor';
  const isVat = clientType === 'individual' || clientType === 'company';
  const commRate = isContractor ? (dizielPrice <= 20000 ? 0.03 : dizielPrice <= 50000 ? 0.02 : 0.01) : 0;
  const commission = Math.round(dizielPrice * commRate * 100) / 100;
  const vat = isVat ? Math.round(dizielPrice * 0.14 * 100) / 100 : 0;
  const total = dizielPrice + commission + vat;
  return { commRate, commission, vat, total };
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className="text-admin-subtext">{label}</span>
      <span className="font-medium text-admin-text">{value}</span>
    </div>
  );
}

/** Ported from `app/(admin)/quotes.tsx`: quote list + status filter, expandable details, pricing modal. */
export default function Quotes() {
  const { t } = useTranslation();
  const { token } = useAdminAuth();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<QuoteStatus | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [modalQuote, setModalQuote] = useState<Quote | null>(null);
  const [providerPrice, setProviderPrice] = useState('');
  const [dizielPrice, setDizielPrice] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [pricing, setPricing] = useState(false);

  const load = useCallback(
    async (targetPage: number) => {
      if (!token) return;
      const params = { status: filterStatus !== 'all' ? filterStatus : undefined, page: targetPage, limit: 20 };
      const { data, error: err } = await adminGetQuotes(token, params);
      if (err) {
        setError(err);
        return;
      }
      if (data) {
        setQuotes(data.quotes);
        setPage(data.page);
        setPages(Math.max(1, data.pages));
      }
    },
    [token, filterStatus]
  );

  useEffect(() => {
    setLoading(true);
    setError(null);
    load(1).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, filterStatus]);

  const changePage = (nextPage: number) => {
    load(nextPage);
  };

  const openPricingModal = (q: Quote) => {
    setModalQuote(q);
    setProviderPrice('');
    setDizielPrice(q.dizielPrice != null ? String(q.dizielPrice) : '');
    setAdminNotes(q.adminNotes ?? '');
    setError(null);
  };

  const handlePrice = async () => {
    if (!token || !modalQuote) return;
    const dp = parseFloat(dizielPrice);
    if (Number.isNaN(dp) || dp <= 0) {
      setError('Diziel price is required');
      return;
    }
    setPricing(true);
    setError(null);
    const pp = providerPrice ? parseFloat(providerPrice) : undefined;
    const { error: err } = await adminPriceQuote(token, modalQuote.id, dp, pp, adminNotes || undefined);
    setPricing(false);
    if (err) {
      setError(err);
      return;
    }
    setModalQuote(null);
    load(page);
  };

  const preview = modalQuote && dizielPrice && !Number.isNaN(parseFloat(dizielPrice)) ? commissionPreview(parseFloat(dizielPrice), modalQuote.clientType) : null;

  const statusFilters = [
    { value: 'all', label: t('common.all') },
    { value: 'pending', label: t('status.pending') },
    { value: 'pricing', label: t('admin.quotes.status.pricing') },
    { value: 'sent_to_client', label: t('admin.quotes.status.sent_to_client') },
    { value: 'accepted', label: t('status.accepted') },
    { value: 'rejected', label: t('status.rejected') },
    { value: 'cancelled', label: t('status.cancelled') },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-admin-text">{t('admin.quotes.title')}</h1>
        <p className="mt-1 text-sm text-admin-subtext">{t('admin.quotes.subtitle')}</p>
      </div>

      <FilterTabs tabs={statusFilters} active={filterStatus} onChange={(v) => setFilterStatus(v as QuoteStatus | 'all')} />

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      {loading ? (
        <p className="text-sm text-admin-subtext">{t('common.loading')}</p>
      ) : quotes.length === 0 ? (
        <div className="rounded-lg border border-admin-border bg-admin-card p-8 text-center text-sm text-admin-subtext">{t('admin.quotes.noQuotes')}</div>
      ) : (
        <div className="space-y-3">
          {quotes.map((q) => {
            const color = STATUS_COLOR[q.status];
            const expanded = expandedId === q.id;
            const canPrice = q.status === 'pending' || q.status === 'pricing';
            return (
              <div key={q.id} className="rounded-lg border border-admin-border bg-admin-card p-4">
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : q.id)}
                  className="flex w-full items-start justify-between gap-4 text-left rtl:text-right"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-admin-text">
                      {q.requester?.fullName ?? '—'} ({q.clientType})
                    </p>
                    <p className="mt-0.5 truncate text-sm text-admin-subtext">
                      {q.pickup.address} → {q.delivery.address}
                    </p>
                    <p className="mt-0.5 text-xs text-admin-subtext">
                      {formatCargoType(q.cargo.type)} · {q.cargo.weight} {t('admin.quotes.ton')} · {q.truckCount}x {t('admin.quotes.truck')}
                    </p>
                  </div>
                  <span
                    className="shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                    style={{ borderColor: color, color, backgroundColor: `${color}22` }}
                  >
                    {t(`admin.quotes.status.${q.status}`, { defaultValue: q.status })}
                  </span>
                </button>

                {expanded ? (
                  <div className="mt-3 border-t border-admin-border pt-3">
                    <DetailRow label={t('admin.quotes.details.cargoType')} value={formatCargoType(q.cargo.type)} />
                    <DetailRow label={t('admin.quotes.details.truckCount')} value={String(q.truckCount)} />
                    <DetailRow label={t('admin.quotes.details.cargoWeight')} value={`${q.cargo.weight} ${t('admin.quotes.ton')}`} />
                    <DetailRow label={t('admin.quotes.details.cargoDescription')} value={q.cargo.description} />
                    <DetailRow label={t('admin.quotes.details.tripDuration')} value={q.tripDurationDays != null ? `${q.tripDurationDays} ${t('common.days')}` : undefined} />
                    {q.insurance?.required ? <DetailRow label={t('admin.quotes.details.insuranceValue')} value={egp(q.insurance.value)} /> : null}
                    {(q.loadingExpenses ?? 0) > 0 ? <DetailRow label={t('admin.quotes.details.loadingExpenses')} value={egp(q.loadingExpenses)} /> : null}
                    {(q.unloadingExpenses ?? 0) > 0 ? <DetailRow label={t('admin.quotes.details.unloadingExpenses')} value={egp(q.unloadingExpenses)} /> : null}
                    <DetailRow label={t('admin.quotes.details.waybillLocation')} value={q.waybillDeliveryLocation} />
                    <DetailRow label={t('admin.quotes.details.notes')} value={q.notes} />

                    {q.finalPrice != null ? (
                      <div className="mt-3 rounded-md border border-amber-500/40 bg-amber-500/5 p-3">
                        {q.providerPrice != null ? <DetailRow label={t('admin.quotes.details.providerPrice')} value={egp(q.providerPrice)} /> : null}
                        <DetailRow label={t('admin.quotes.details.basePrice')} value={egp(q.dizielPrice)} />
                        {(q.commission ?? 0) > 0 ? <DetailRow label={t('admin.quotes.details.commission')} value={egp(q.commission)} /> : null}
                        {q.vatApplicable ? <DetailRow label={t('admin.quotes.details.vat')} value={egp(q.vatAmount)} /> : null}
                        <div className="mt-1 flex items-center justify-between border-t border-amber-500/30 pt-1.5">
                          <span className="text-sm font-semibold text-amber-500">{t('admin.quotes.details.total')}</span>
                          <span className="text-base font-bold text-amber-500">{egp(q.finalPrice)}</span>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <div className="mt-3 flex items-center justify-between gap-3">
                  {canPrice ? (
                    <button
                      type="button"
                      onClick={() => openPricingModal(q)}
                      className="rounded-md bg-admin-accent px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-admin-accent/90"
                    >
                      {t('admin.quotes.setPrice')}
                    </button>
                  ) : (
                    <span />
                  )}
                  <span className="text-xs text-admin-subtext">{q.createdAt ? new Date(q.createdAt).toLocaleDateString() : ''}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Pagination page={page} totalPages={pages} onPageChange={changePage} />

      <Modal open={!!modalQuote} onClose={() => setModalQuote(null)} title={t('admin.quotes.setPrice')} size="md">
        {modalQuote ? (
          <div className="space-y-4">
            <div className="rounded-md border border-admin-border bg-admin-bg p-3">
              <p className="truncate text-sm font-semibold text-admin-text">
                {modalQuote.pickup.address} → {modalQuote.delivery.address}
              </p>
              <p className="mt-1 text-xs text-admin-subtext">
                {modalQuote.requester?.fullName} · {modalQuote.clientType} · {formatCargoType(modalQuote.cargo.type)} · {modalQuote.cargo.weight} {t('admin.quotes.ton')}
              </p>
            </div>

            {preview ? (
              <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3">
                <p className="mb-1 text-sm font-semibold text-amber-500">{t('admin.quotes.autoCalc')}</p>
                <DetailRow label={t('admin.quotes.details.basePrice')} value={egp(parseFloat(dizielPrice))} />
                {preview.commission > 0 ? (
                  <DetailRow label={`${t('admin.quotes.details.commission')} (${(preview.commRate * 100).toFixed(0)}%)`} value={egp(preview.commission)} />
                ) : null}
                {preview.vat > 0 ? <DetailRow label={`${t('admin.quotes.details.vat')} (14%)`} value={egp(preview.vat)} /> : null}
                <div className="mt-1 flex items-center justify-between border-t border-amber-500/30 pt-1.5">
                  <span className="text-sm font-semibold text-amber-500">{t('admin.quotes.details.total')}</span>
                  <span className="text-base font-bold text-amber-500">{egp(preview.total)}</span>
                </div>
              </div>
            ) : null}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-admin-text">{t('admin.quotes.form.providerPrice')}</label>
              <input
                value={providerPrice}
                onChange={(e) => setProviderPrice(e.target.value)}
                type="number"
                className="w-full rounded-md border border-admin-border bg-admin-bg px-3 py-2 text-sm text-admin-text focus:border-admin-accent focus:outline-none"
                placeholder="0"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-admin-text">{t('admin.quotes.form.dizielPrice')}</label>
              <input
                value={dizielPrice}
                onChange={(e) => setDizielPrice(e.target.value)}
                type="number"
                className="w-full rounded-md border border-admin-border bg-admin-bg px-3 py-2 text-sm text-admin-text focus:border-admin-accent focus:outline-none"
                placeholder="0"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-admin-text">{t('admin.quotes.form.adminNotes')}</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-admin-border bg-admin-bg px-3 py-2 text-sm text-admin-text focus:border-admin-accent focus:outline-none"
              />
            </div>

            {error ? <p className="text-sm text-red-500">{error}</p> : null}

            <button
              type="button"
              onClick={handlePrice}
              disabled={pricing}
              className="w-full rounded-md bg-admin-accent px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-admin-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pricing ? t('common.submitting') : t('admin.quotes.sendToClient')}
            </button>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
