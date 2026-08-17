import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Star, UserCheck, UserX, Users as UsersIcon, X } from 'lucide-react';
import DataTable, { type DataTableColumn } from '../../../components/DataTable';
import FilterTabs from '../../../components/FilterTabs';
import StatusBadge from '../../../components/StatusBadge';
import {
  adminActivateUser,
  adminGetPendingReviewUsers,
  adminGetUsers,
  adminRejectUser,
  adminToggleUserActive,
  type AdminUser,
} from '../../../lib/api/adminCore';
import { useAdminAuth } from '../../../lib/auth';

/** Admin user directory with sleek modern UI/UX */
export default function Users() {
  const { t } = useTranslation();
  const { token } = useAdminAuth();
  const navigate = useNavigate();

  const roleTabs = [
    { value: '', label: t('admin.users.roleTabs.all') },
    { value: 'pending_review', label: t('admin.users.roleTabs.pending_review') },
    { value: 'client', label: t('admin.users.roleTabs.client') },
    { value: 'driver', label: t('admin.users.roleTabs.driver') },
    { value: 'truck_owner', label: t('admin.users.roleTabs.truck_owner') },
    { value: 'agent', label: t('admin.users.roleTabs.agent') },
  ];

  const clientTypeTabs = [
    { value: 'all', label: t('admin.users.clientTypes.all') },
    { value: 'company', label: t('admin.users.clientTypes.company') },
    { value: 'individual', label: t('admin.users.clientTypes.individual') },
  ];

  const driverTruckTabs = [
    { value: 'all', label: t('admin.users.driverFilters.all') },
    { value: 'approved_no_orders', label: t('admin.users.driverFilters.approved_no_orders') },
    { value: 'linked', label: t('admin.users.driverFilters.linked') },
    { value: 'unlinked', label: t('admin.users.driverFilters.unlinked') },
  ];

  const [activeTab, setActiveTab] = useState('');
  const [clientCompanyType, setClientCompanyType] = useState<'all' | 'company' | 'individual'>('all');
  const [driverTruckFilter, setDriverTruckFilter] = useState<'all' | 'linked' | 'unlinked' | 'approved_no_orders'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [rejectingUser, setRejectingUser] = useState<AdminUser | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const loadUsers = useCallback(
    async (role: string, companyType: typeof clientCompanyType, driverFilter: typeof driverTruckFilter, q: string) => {
      if (!token) return;
      if (role === 'pending_review') {
        const { data } = await adminGetPendingReviewUsers(token, { q: q.trim() || undefined });
        setUsers(data?.users ?? []);
        return;
      }
      const { data } = await adminGetUsers(token, {
        role: role || undefined,
        limit: 100,
        companyType: role === 'client' && companyType !== 'all' ? companyType : undefined,
        driverTruckStatus: role === 'driver' && driverFilter !== 'all' ? driverFilter : undefined,
        q: q.trim() || undefined,
      });
      setUsers(data?.users ?? []);
    },
    [token]
  );

  useEffect(() => {
    setLoading(true);
    loadUsers(activeTab, clientCompanyType, driverTruckFilter, searchQuery).finally(() => setLoading(false));
  }, [loadUsers, activeTab, clientCompanyType, driverTruckFilter, searchQuery]);

  const refresh = () => loadUsers(activeTab, clientCompanyType, driverTruckFilter, searchQuery);

  const handleToggle = async (user: AdminUser) => {
    if (!token) return;
    const status = user.accountStatus;
    const needsActivation = !user.isActive && (status === 'under_review' || status === 'rejected' || status === 'accepted');

    if (needsActivation) {
      if (!window.confirm(`Activate ${user.fullName}? All required documents must be approved.`)) return;
      setTogglingId(user.id);
      const { data, error } = await adminActivateUser(token, user.id);
      setTogglingId(null);
      if (error) {
        window.alert(error);
        return;
      }
      if (data?.missing?.length) {
        window.alert(`Missing or unapproved documents:\n\n${data.missing.join(', ')}`);
        return;
      }
      await refresh();
      return;
    }

    const isActive = user.isActive;
    if (!window.confirm(`${isActive ? 'Deactivate' : 'Activate'} ${user.fullName}?`)) return;
    setTogglingId(user.id);
    const { data, error } = await adminToggleUserActive(token, user.id);
    setTogglingId(null);
    if (error) {
      window.alert(error);
      return;
    }
    if (data) {
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, isActive: data.isActive } : u)));
    }
  };

  const submitReject = async () => {
    if (!token || !rejectingUser || !rejectReason.trim()) return;
    setTogglingId(rejectingUser.id);
    const { error } = await adminRejectUser(token, rejectingUser.id, rejectReason.trim());
    setTogglingId(null);
    if (error) {
      window.alert(error);
      return;
    }
    setRejectingUser(null);
    setRejectReason('');
    await refresh();
  };

  const columns = useMemo<DataTableColumn<AdminUser>[]>(
    () => [
      {
        key: 'name',
        header: t('admin.users.columns.account'),
        render: (user) => (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-admin-surface text-admin-accent font-bold text-xs border border-admin-border/70">
              {(user.fullName || user.companyName || 'U').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="font-bold text-admin-text text-sm">
                {user.companyName || user.fullName}
              </div>
              <div className="font-mono text-xs text-admin-muted">{user.phone || '—'}</div>
            </div>
          </div>
        ),
      },
      {
        key: 'role',
        header: t('admin.users.columns.role'),
        render: (user) => (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-admin-surface px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-admin-text border border-admin-border/50">
            {user.role.replace('_', ' ')}
          </span>
        ),
      },
      {
        key: 'status',
        header: t('admin.users.columns.status'),
        render: (user) => (
          <div className="flex flex-wrap items-center gap-1.5">
            <StatusBadge status={user.isActive ? 'active' : 'deactivated'} />
            {user.accountStatus ? <StatusBadge status={user.accountStatus} /> : null}
          </div>
        ),
      },
      {
        key: 'detail',
        header: t('admin.users.columns.specifications'),
        render: (user) => {
          if (user.role === 'driver') {
            return (
              <span className="inline-flex items-center gap-1.5 text-xs text-admin-subtext font-medium">
                <span className="rounded bg-admin-surface px-1.5 py-0.5 text-[11px] font-mono text-admin-text">
                  Lic: {user.licenseStatus}
                </span>
                <span className="flex items-center gap-0.5 font-bold text-amber-400">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {user.rating?.toFixed(1) ?? '0.0'}
                </span>
              </span>
            );
          }
          if (user.role === 'agent') {
            return (
              <span className="font-mono text-xs font-bold text-admin-accent">
                {user.agentCode ? `Code: ${user.agentCode}` : '—'}
              </span>
            );
          }
          if (user.role === 'truck_owner') {
            return (
              <span className="font-mono text-xs font-bold text-cyan-400">
                {user.truckOwnerCode ? `Owner: ${user.truckOwnerCode}` : '—'}
              </span>
            );
          }
          if (user.role === 'client') {
            return (
              <span className="text-xs font-semibold capitalize text-admin-subtext">
                {user.companyType || 'Standard'}
              </span>
            );
          }
          return <span className="text-admin-muted text-xs">—</span>;
        },
      },
      {
        key: 'joined',
        header: t('admin.users.columns.registeredAt'),
        render: (user) => (
          <span className="font-mono text-xs text-admin-muted">
            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
          </span>
        ),
      },
      {
        key: 'actions',
        header: t('admin.users.columns.controls'),
        render: (user) => (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                void handleToggle(user);
              }}
              disabled={togglingId === user.id}
              className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-bold transition disabled:opacity-50 ${
                user.isActive
                  ? 'border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/50'
                  : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50'
              }`}
            >
              {user.isActive ? <UserX className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
              {user.isActive ? t('admin.users.deactivate') : t('admin.users.activate')}
            </button>
            {!user.isActive && user.accountStatus === 'under_review' ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setRejectingUser(user);
                  setRejectReason('');
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-400 transition hover:bg-red-500/20 hover:border-red-500/50"
              >
                {t('admin.users.reject')}
              </button>
            ) : null}
          </div>
        ),
      },
    ],
    [togglingId, t]
  );

  return (
    <div className="space-y-6 animation-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-admin-accent/10 text-admin-accent">
              <UsersIcon className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-admin-accent">
              {t('nav.items.users')}
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-admin-text">
            {t('admin.users.title')}
          </h1>
          <p className="mt-1 text-xs text-admin-subtext">
            {t('admin.users.subtitle', { count: users.length })}
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-muted rtl:left-auto rtl:right-3.5" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('admin.users.searchPlaceholder')}
            className="w-full rounded-xl border border-admin-border bg-admin-card/80 py-2 pl-10 pr-4 rtl:pl-4 rtl:pr-10 text-xs font-medium text-admin-text placeholder:text-admin-muted backdrop-blur-md transition focus:border-admin-accent focus:outline-none focus:ring-2 focus:ring-admin-accent/20"
          />
        </div>
      </div>

      {/* Role Navigation */}
      <FilterTabs
        tabs={roleTabs}
        active={activeTab}
        onChange={(value) => {
          setActiveTab(value);
          if (value !== 'client') setClientCompanyType('all');
          if (value !== 'driver') setDriverTruckFilter('all');
        }}
      />

      {/* Sub-Filters */}
      {activeTab === 'client' ? (
        <div className="flex items-center gap-2 pl-1 rtl:pl-0 rtl:pr-1">
          <span className="text-xs font-bold uppercase tracking-wider text-admin-muted">{t('admin.users.clientFilter')}</span>
          <FilterTabs
            tabs={clientTypeTabs}
            active={clientCompanyType}
            onChange={(v) => setClientCompanyType(v as 'all' | 'company' | 'individual')}
          />
        </div>
      ) : null}

      {activeTab === 'driver' ? (
        <div className="flex items-center gap-2 pl-1 rtl:pl-0 rtl:pr-1">
          <span className="text-xs font-bold uppercase tracking-wider text-admin-muted">{t('admin.users.driverFilter')}</span>
          <FilterTabs
            tabs={driverTruckTabs}
            active={driverTruckFilter}
            onChange={(v) => setDriverTruckFilter(v as 'all' | 'linked' | 'unlinked' | 'approved_no_orders')}
          />
        </div>
      ) : null}

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={users}
        keyExtractor={(user) => user.id}
        loading={loading}
        emptyMessage={t('common.noResults')}
        onRowClick={(user) => navigate(`/admin/users/${user.id}`)}
      />

      {/* Reject User Modal */}
      {rejectingUser ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animation-fade-in"
          onClick={() => setRejectingUser(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-admin-border bg-admin-card p-6 shadow-2xl animation-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-admin-border/60">
              <h2 className="text-base font-extrabold text-admin-text">
                {t('admin.users.rejectModal.title', { name: rejectingUser.fullName })}
              </h2>
              <button
                type="button"
                onClick={() => setRejectingUser(null)}
                className="rounded-lg p-1.5 text-admin-muted hover:bg-admin-surface hover:text-admin-text"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <p className="mt-3 text-xs text-admin-subtext leading-relaxed">
              {t('admin.users.rejectModal.desc')}
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              placeholder={t('admin.users.rejectModal.placeholder')}
              className="mt-3 w-full rounded-xl border border-admin-border bg-admin-surface/70 p-3 text-xs font-medium text-admin-text placeholder:text-admin-muted focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setRejectingUser(null)}
                className="rounded-xl border border-admin-border px-4 py-2 text-xs font-semibold text-admin-subtext hover:bg-admin-surface hover:text-admin-text"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={submitReject}
                disabled={!rejectReason.trim()}
                className="rounded-xl bg-red-500 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-red-500/25 transition hover:bg-red-600 disabled:opacity-50"
              >
                {t('admin.users.rejectModal.confirm')}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
