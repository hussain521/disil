import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAdminAuth } from '../../../lib/auth';
import StatusBadge from '../../../components/StatusBadge';
import { formatPlateDisplay, searchTrucks, type Truck, type TruckSearchParams } from '../../../lib/api/adminOperations';
import { formatTruckType, formatHeadType, formatTrailerType } from '../../../lib/truckTranslations';

const CATEGORIES: { key: 'jumbo' | 'single' | 'truck'; labelKey: string }[] = [
  { key: 'jumbo', labelKey: 'trucks.types.jumbo' },
  { key: 'single', labelKey: 'trucks.types.single' },
  { key: 'truck', labelKey: 'trucks.types.truck' },
];

const SUBTYPES_BY_CATEGORY: Record<string, { key: string; labelKey: string }[]> = {
  jumbo: [
    { key: 'recovery_winch', labelKey: 'trucks.types.recovery_winch' },
    { key: 'sided', labelKey: 'trucks.types.sided' },
    { key: 'insulated', labelKey: 'trucks.types.insulated' },
    { key: 'refrigerated', labelKey: 'trucks.types.refrigerated' },
  ],
  single: [
    { key: 'tipper', labelKey: 'trucks.types.tipper' },
    { key: 'flatbed', labelKey: 'trucks.types.flatbed' },
    { key: 'sided', labelKey: 'trucks.types.sided' },
    { key: 'container', labelKey: 'trucks.types.container' },
    { key: 'insulated', labelKey: 'trucks.types.insulated' },
    { key: 'refrigerated', labelKey: 'trucks.types.refrigerated' },
    { key: 'mixer', labelKey: 'trucks.types.mixer' },
  ],
  truck: [
    { key: 'trailer', labelKey: 'trucks.trailers.maqtoura' },
    { key: 'tractor', labelKey: 'trucks.heads.ras' },
    { key: 'both', labelKey: 'common.all' },
  ],
};

const BODY_TYPES = [
  { key: 'flatbed', labelKey: 'trucks.types.flatbed' },
  { key: 'sided', labelKey: 'trucks.types.sided' },
  { key: 'container', labelKey: 'trucks.types.container' },
  { key: 'refrigerated', labelKey: 'trucks.types.refrigerated' },
  { key: 'insulated', labelKey: 'trucks.types.insulated' },
];

const EMPTY_PARAMS: TruckSearchParams = {};

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
        active
          ? 'border-admin-accent bg-admin-accent/15 text-admin-accent'
          : 'border-admin-border text-admin-subtext hover:border-admin-accent/50 hover:text-admin-text'
      }`}
    >
      {label}
    </button>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-admin-subtext">{label}</span>
      <input
        type="number"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
        className="w-full rounded-md border border-admin-border bg-admin-bg px-2.5 py-1.5 text-sm text-admin-text focus:border-admin-accent focus:outline-none"
      />
    </label>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-admin-subtext">{label}</span>
      <input
        type="text"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || undefined)}
        placeholder={placeholder}
        className="w-full rounded-md border border-admin-border bg-admin-bg px-2.5 py-1.5 text-sm text-admin-text focus:border-admin-accent focus:outline-none"
      />
    </label>
  );
}

export default function Search() {
  const { t } = useTranslation();
  const { token } = useAdminAuth();
  const navigate = useNavigate();

  const [q, setQ] = useState('');
  const [filters, setFilters] = useState<TruckSearchParams>(EMPTY_PARAMS);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(false);

  const activeFilterCount = useMemo(
    () => Object.values(filters).filter((v) => v !== undefined && v !== '' && v !== null).length,
    [filters]
  );

  const runSearch = useCallback(
    async (extra?: TruckSearchParams) => {
      if (!token) return;
      setLoading(true);
      const params: TruckSearchParams = { ...filters, ...(extra || {}) };
      if (q.trim()) params.q = q.trim();
      const { data } = await searchTrucks(token, params);
      setTrucks(data?.trucks ?? []);
      setLoading(false);
    },
    [token, filters, q]
  );

  useEffect(() => {
    void runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const setFilter = <K extends keyof TruckSearchParams>(key: K, value: TruckSearchParams[K]) => {
    setFilters((cur) => {
      const next = { ...cur };
      if (value === undefined || value === ('' as unknown) || value === null) delete next[key];
      else next[key] = value;
      return next;
    });
  };

  const clearAll = () => {
    setQ('');
    setFilters(EMPTY_PARAMS);
    void runSearch({});
  };

  const subtypeOptions = filters.category ? SUBTYPES_BY_CATEGORY[filters.category] ?? [] : [];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-admin-text">{t('admin.truckSearch.title')}</h1>
        {activeFilterCount > 0 ? (
          <button
            type="button"
            onClick={clearAll}
            className="rounded-full border border-admin-accent/40 px-3 py-1 text-xs font-semibold text-admin-accent transition hover:bg-admin-accent/10"
          >
            {t('admin.truckSearch.clearFilters', { count: activeFilterCount })}
          </button>
        ) : null}
      </div>

      <form
        className="mt-4 flex flex-col sm:flex-row gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void runSearch();
        }}
      >
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t('admin.truckSearch.searchPlaceholder')}
          className="w-full sm:flex-1 rounded-md border border-admin-border bg-admin-card px-3 py-2 text-sm text-admin-text focus:border-admin-accent focus:outline-none"
        />
        <button type="submit" className="w-full sm:w-auto shrink-0 rounded-md bg-admin-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
          {t('common.search')}
        </button>
      </form>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[20rem_1fr]">
        <div className="space-y-4 rounded-lg border border-admin-border bg-admin-card p-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-admin-subtext">{t('admin.truckSearch.category')}</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <Chip
                  key={c.key}
                  label={t(c.labelKey)}
                  active={filters.category === c.key}
                  onClick={() => setFilter('category', filters.category === c.key ? undefined : c.key)}
                />
              ))}
            </div>
          </div>

          {subtypeOptions.length > 0 ? (
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-admin-subtext">{t('admin.truckSearch.subType')}</p>
              <div className="flex flex-wrap gap-2">
                {subtypeOptions.map((s) => (
                  <Chip
                    key={s.key}
                    label={t(s.labelKey)}
                    active={filters.subType === s.key}
                    onClick={() => setFilter('subType', filters.subType === s.key ? undefined : s.key)}
                  />
                ))}
              </div>
            </div>
          ) : null}

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-admin-subtext">{t('admin.truckSearch.bodyType')}</p>
            <div className="flex flex-wrap gap-2">
              {BODY_TYPES.map((b) => (
                <Chip
                  key={b.key}
                  label={t(b.labelKey)}
                  active={filters.bodyType === b.key}
                  onClick={() => setFilter('bodyType', filters.bodyType === b.key ? undefined : b.key)}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <NumberField label={t('admin.truckSearch.minLength')} value={filters.minLength} onChange={(v) => setFilter('minLength', v)} />
            <NumberField label={t('admin.truckSearch.maxLength')} value={filters.maxLength} onChange={(v) => setFilter('maxLength', v)} />
            <NumberField label={t('admin.truckSearch.minLoad')} value={filters.weightMin} onChange={(v) => setFilter('weightMin', v)} />
            <NumberField label={t('admin.truckSearch.maxLoad')} value={filters.weightMax} onChange={(v) => setFilter('weightMax', v)} />
            <NumberField label={t('admin.truckSearch.minAxles')} value={filters.minAxles} onChange={(v) => setFilter('minAxles', v)} />
            <NumberField label={t('admin.truckSearch.maxHeight')} value={filters.maxHeight} onChange={(v) => setFilter('maxHeight', v)} />
          </div>

          <TextField label={t('admin.truckSearch.agentName')} value={filters.agentName} onChange={(v) => setFilter('agentName', v)} placeholder={t('admin.truckSearch.agentName')} />
          <TextField label={t('admin.truckSearch.ownerName')} value={filters.ownerName} onChange={(v) => setFilter('ownerName', v)} placeholder={t('admin.truckSearch.ownerName')} />
          <TextField label={t('admin.truckSearch.plate')} value={filters.plate} onChange={(v) => setFilter('plate', v)} placeholder="ABC-123" />
          <TextField label={t('admin.truckSearch.truckCode')} value={filters.truckCode} onChange={(v) => setFilter('truckCode', v)} placeholder="TRK-XXXX" />

          <button
            type="button"
            onClick={() => void runSearch()}
            className="w-full rounded-md bg-admin-accent py-2 text-sm font-bold text-white transition hover:opacity-90"
          >
            {t('admin.truckSearch.apply')}
          </button>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold text-admin-subtext">{t('admin.truckSearch.resultsCount', { count: trucks.length })}</p>
          {loading ? (
            <p className="mt-8 text-center text-sm text-admin-subtext">{t('common.loading')}</p>
          ) : trucks.length === 0 ? (
            <p className="mt-8 text-center text-sm text-admin-subtext">{t('common.noResults')}</p>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {trucks.map((truck) => (
                <button
                  key={truck.id}
                  type="button"
                  onClick={() => navigate(`/admin/truck-detail/${truck.id}`)}
                  className="rounded-lg border border-admin-border bg-admin-card p-3 text-left rtl:text-right transition hover:border-admin-accent/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-admin-accent">{truck.truckCode || formatPlateDisplay(truck.plateNumber)}</span>
                    <StatusBadge status={truck.status} />
                  </div>
                  <p className="mt-1 text-xs text-admin-subtext">{formatPlateDisplay(truck.plateNumber)}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {[
                      truck.category ? formatHeadType(truck.category) : null,
                      truck.subType ? formatTrailerType(truck.subType) : null,
                      truck.bodyType ? formatTruckType(truck.bodyType) : null,
                      truck.maxLoad != null ? `${truck.maxLoad}${t('common.ton')}` : null,
                      truck.length != null ? `${truck.length}m` : null,
                      truck.axleCount != null ? `${truck.axleCount} ${t('admin.truckSearch.minAxles')}` : null,
                    ]
                      .filter(Boolean)
                      .map((tag) => (
                        <span key={String(tag)} className="rounded-md border border-admin-border bg-admin-bg px-1.5 py-0.5 text-[10px] text-admin-subtext">
                          {tag}
                        </span>
                      ))}
                  </div>
                  <div className="mt-2 space-y-0.5 text-[11px] text-admin-subtext">
                    {truck.agent?.fullName ? <p>{t('admin.truckDetail.agent')}: {truck.agent.fullName}</p> : null}
                    {truck.owner?.fullName ? <p>{t('admin.truckDetail.truckOwner')}: {truck.owner.fullName}</p> : null}
                    {truck.assignedDriver?.fullName ? <p>{t('admin.truckDetail.driver')}: {truck.assignedDriver.fullName}</p> : null}
                  </div>
                  {truck.busy ? <p className="mt-1 text-[11px] font-bold text-admin-accent">{t('status.busy')}</p> : null}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
