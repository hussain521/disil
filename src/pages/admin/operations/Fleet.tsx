import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Truck, Compass } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DataTable, { type DataTableColumn } from '../../../components/DataTable';
import FilterTabs from '../../../components/FilterTabs';
import StatusBadge from '../../../components/StatusBadge';
import { useAdminAuth } from '../../../lib/auth';
import { useSocket } from '../../../lib/socket';
import {
  adminGetFleetOverview,
  formatPlateDisplay,
  type FleetOverview,
  type FleetOverviewTruck,
} from '../../../lib/api/adminOperations';
import { formatTruckType } from '../../../lib/truckTranslations';

type ApprovalFilter = 'approved' | 'pending_review' | 'rejected';

export default function Fleet() {
  const { t } = useTranslation();
  const { token } = useAdminAuth();
  const { socket } = useSocket(token);
  const navigate = useNavigate();

  const [overview, setOverview] = useState<FleetOverview | null>(null);
  const [approvalFilter, setApprovalFilter] = useState<ApprovalFilter>('approved');
  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!token) return;
    const { data } = await adminGetFleetOverview(token, { approvalStatus: approvalFilter, q: query || undefined });
    if (data) setOverview(data);
  }, [token, approvalFilter, query]);

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  useEffect(() => {
    if (!socket) return;
    const handler = (payload: { id?: string; status?: string }) => {
      if (!payload?.id || !payload.status) return;
      setOverview((prev) =>
        prev
          ? { ...prev, trucks: prev.trucks.map((truck) => (truck.id === payload.id ? { ...truck, status: payload.status! } : truck)) }
          : prev
      );
    };
    socket.on('truck:status', handler);
    return () => {
      socket.off('truck:status', handler);
    };
  }, [socket]);

  const columns: DataTableColumn<FleetOverviewTruck>[] = [
    {
      key: 'plate',
      header: 'Plate & Serial Code',
      render: (truck) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-admin-surface text-admin-accent font-bold">
            <Truck className="h-4 w-4" />
          </div>
          <div>
            <p className="font-extrabold text-admin-text text-xs sm:text-sm">
              {formatPlateDisplay(truck.plateNumber)}
            </p>
            {truck.truckCode ? (
              <p className="text-[11px] font-mono text-admin-muted">{truck.truckCode}</p>
            ) : null}
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Vehicle Class',
      render: (truck) => (
        <span className="inline-flex items-center rounded-lg bg-admin-surface px-2.5 py-1 text-xs font-semibold text-admin-text">
          {formatTruckType(truck.type)} · {truck.capacity}t
        </span>
      ),
    },
    { key: 'owner', header: 'Owner', render: (truck) => <span className="text-xs font-medium text-admin-text">{truck.owner?.fullName ?? '—'}</span> },
    { key: 'agent', header: 'Managing Agent', render: (truck) => <span className="text-xs font-medium text-admin-text">{truck.agent?.fullName ?? '—'}</span> },
    { key: 'driver', header: 'Assigned Driver', render: (truck) => <span className="text-xs font-medium text-admin-text">{truck.driver?.fullName ?? '—'}</span> },
    {
      key: 'status',
      header: 'Fleet Status',
      render: (truck) =>
        approvalFilter === 'pending_review' ? (
          <StatusBadge status="pending_review" label="Under review" tone="warning" />
        ) : truck.activeTrip ? (
          <StatusBadge status="active" label={truck.activeTrip.workStatusLabel || truck.activeTrip.workStatus} tone="info" />
        ) : (
          <StatusBadge status={truck.status} />
        ),
    },
  ];

  return (
    <div className="space-y-6 animation-fade-in">
      {/* Fleet Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-teal-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Fleet Operations
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-admin-text">
            Fleet Vehicles
          </h1>
          <p className="mt-1 text-xs text-admin-subtext">
            {overview ? `${overview.total} Total Registered Vehicles` : 'Loading fleet data…'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <Link
            to="/admin/search"
            className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl border border-admin-border bg-admin-card px-3.5 py-2 text-xs font-bold text-admin-text transition hover:border-admin-accent hover:text-admin-accent shadow-xs"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Advanced Search</span>
          </Link>
          <Link
            to="/admin/track"
            className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl bg-admin-accent px-3.5 py-2 text-xs font-bold text-white transition hover:bg-admin-accent-dark shadow-lg glow-accent-sm"
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Live GPS Map</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:w-auto overflow-x-auto no-scrollbar">
          <FilterTabs
            tabs={[
              { value: 'approved', label: 'Approved Fleet' },
              { value: 'pending_review', label: 'KYC Pending' },
              { value: 'rejected', label: 'Rejected' },
            ]}
            active={approvalFilter}
            onChange={(v) => setApprovalFilter(v as ApprovalFilter)}
          />
        </div>

        <form
          className="flex w-full sm:w-auto gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setQuery(searchInput.trim());
          }}
        >
          <div className="relative flex-1 sm:flex-initial">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-admin-muted" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Plate number or truck code…"
              className="w-full sm:w-60 rounded-xl border border-admin-border bg-admin-card py-2 pl-9 pr-3 text-xs text-admin-text placeholder:text-admin-muted focus:border-admin-accent focus:outline-none shadow-xs"
            />
          </div>
          <button
            type="submit"
            className="shrink-0 rounded-xl bg-admin-accent px-4 py-2 text-xs font-bold text-white transition hover:bg-admin-accent-dark shadow-xs"
          >
            Search
          </button>
        </form>
      </div>

      {/* Fleet Table */}
      <DataTable
        columns={columns}
        data={overview?.trucks ?? []}
        keyExtractor={(truck) => truck.id}
        loading={loading}
        emptyMessage="No trucks found matching this filter."
        onRowClick={(truck) => navigate(`/admin/truck-detail/${truck.id}`)}
      />
    </div>
  );
}
