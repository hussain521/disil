import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';
import ImageZoomModal from '../../../components/ImageZoomModal';
import Modal from '../../../components/Modal';
import { StatCard, StatCardGrid } from '../../../components/StatCard';
import StatusBadge from '../../../components/StatusBadge';
import {
  adminActivateUser,
  adminCreateTruckForUser,
  adminGetTruckComposeOptions,
  adminGetUser,
  adminGetUserDocuments,
  adminRejectUser,
  adminReviewDocument,
  adminSetTruckVisibility,
  resolveFileUrl,
  type AdminDocument,
  type AdminUserDetail,
  type CreateFullTruckPayload,
  type TruckComposeOptions,
} from '../../../lib/api/adminCore';
import { useAdminAuth } from '../../../lib/auth';

const DOC_FILTERS = ['all', 'approved', 'rejected', 'under_review'] as const;

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-1 py-1.5 text-sm">
      <span className="text-admin-subtext">{label}</span>
      <span className="text-admin-text font-medium">{value}</span>
    </div>
  );
}

/** Admin user detail — ports `app/(admin)/user/[id].tsx`. */
export default function UserDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { token } = useAdminAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState<AdminUserDetail | null>(null);
  const [documents, setDocuments] = useState<AdminDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [docFilter, setDocFilter] = useState<(typeof DOC_FILTERS)[number]>('all');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [reviewingDoc, setReviewingDoc] = useState<AdminDocument | null>(null);
  const [docDecision, setDocDecision] = useState<'approve' | 'reject' | null>(null);
  const [docReason, setDocReason] = useState('');
  const [zoomSrc, setZoomSrc] = useState<string | null>(null);

  const [showRejectAccount, setShowRejectAccount] = useState(false);
  const [accountRejectReason, setAccountRejectReason] = useState('');
  const [updatingTruckId, setUpdatingTruckId] = useState<string | null>(null);

  const [showAddTruck, setShowAddTruck] = useState(false);
  const [composeOptions, setComposeOptions] = useState<TruckComposeOptions | null>(null);
  const [newTruck, setNewTruck] = useState({
    driverId: '',
    headType: 'fardany' as CreateFullTruckPayload['headType'],
    operationType: '',
    capacity: '',
    plateNumber: '',
  });
  const [creatingTruck, setCreatingTruck] = useState(false);

  const loadData = useCallback(async () => {
    if (!token || !id) return;
    const [userRes, docsRes] = await Promise.all([adminGetUser(token, id), adminGetUserDocuments(token, id)]);
    setUser(userRes.data ?? null);
    setDocuments(docsRes.data?.documents ?? []);
  }, [token, id]);

  useEffect(() => {
    setLoading(true);
    loadData().finally(() => setLoading(false));
  }, [loadData]);

  if (loading) return <div className="p-8 text-center text-sm text-admin-subtext">{t('common.loading')}</div>;
  if (!user) return <div className="p-8 text-center text-sm text-admin-subtext">{t('common.emptyMessage')}</div>;

  const accountStatus = user.accountStatus ?? (user.isActive ? 'active' : 'under_review');
  const canApproveAccount = user.role !== 'admin' && ['under_review', 'rejected', 'idle'].includes(accountStatus);
  const canRejectAccount = user.role !== 'admin' && accountStatus === 'under_review';
  const canManageTrucks = user.role === 'agent' || user.role === 'truck_owner';

  const filteredDocs = documents.filter((doc) => {
    if (docFilter === 'all') return true;
    if (docFilter === 'under_review') return doc.status === 'pending';
    return doc.status === docFilter;
  });

  const approveAccount = async () => {
    if (!token) return;
    if (!window.confirm('Approve this account? All required documents must be approved first.')) return;
    setBusy(true);
    const { data, error: err } = await adminActivateUser(token, user.id);
    setBusy(false);
    if (err) {
      setError(err);
      return;
    }
    setUser((cur) => (cur ? { ...cur, accountStatus: data?.accountStatus ?? 'active', isActive: data?.isActive ?? true, rejectionReason: null } : cur));
  };

  const rejectAccount = async () => {
    if (!token || !accountRejectReason.trim()) return;
    setBusy(true);
    const { data, error: err } = await adminRejectUser(token, user.id, accountRejectReason.trim());
    setBusy(false);
    if (err) {
      setError(err);
      return;
    }
    setUser((cur) => (cur ? { ...cur, accountStatus: data?.accountStatus ?? 'rejected', rejectionReason: data?.rejectionReason ?? accountRejectReason } : cur));
    setShowRejectAccount(false);
    setAccountRejectReason('');
  };

  const submitDocReview = async () => {
    if (!token || !reviewingDoc || !docDecision) return;
    if (docDecision === 'reject' && !docReason.trim()) {
      setError('Rejection reason required');
      return;
    }
    setBusy(true);
    const { error: err } = await adminReviewDocument(token, reviewingDoc.id, docDecision, docReason.trim() || undefined);
    setBusy(false);
    if (err) {
      setError(err);
      return;
    }
    setReviewingDoc(null);
    setDocDecision(null);
    setDocReason('');
    await loadData();
  };

  const toggleTruckVisibility = async (truckId: string, hidden: boolean) => {
    if (!token) return;
    const label = hidden ? 'Hide' : 'Show';
    if (!window.confirm(`${label} this truck ${hidden ? 'from' : 'in'} the active fleet?`)) return;
    setUpdatingTruckId(truckId);
    const { error: err } = await adminSetTruckVisibility(token, truckId, hidden);
    setUpdatingTruckId(null);
    if (err) {
      setError(err);
      return;
    }
    await loadData();
  };

  const openAddTruck = async () => {
    if (!token || !id) return;
    setShowAddTruck(true);
    const { data } = await adminGetTruckComposeOptions(token, id);
    setComposeOptions(data ?? null);
  };

  const submitNewTruck = async () => {
    if (!token || !id) return;
    if (!newTruck.operationType || !newTruck.capacity || !newTruck.plateNumber) {
      setError('Operation type, capacity and plate number are required');
      return;
    }
    setCreatingTruck(true);
    const payload: CreateFullTruckPayload = {
      driverId: newTruck.driverId || undefined,
      headType: newTruck.headType,
      operationType: newTruck.operationType,
      capacity: Number(newTruck.capacity),
      tractor: { plateNumber: newTruck.plateNumber },
    };
    const { error: err } = await adminCreateTruckForUser(token, id, payload);
    setCreatingTruck(false);
    if (err) {
      setError(err);
      return;
    }
    setShowAddTruck(false);
    setNewTruck({ driverId: '', headType: 'fardany', operationType: '', capacity: '', plateNumber: '' });
    await loadData();
  };

  return (
    <div className="space-y-4 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate('/admin/users')} className="text-admin-subtext hover:text-admin-text text-sm font-semibold">
            {t('common.back')}
          </button>
          <h1 className="text-lg sm:text-xl font-bold text-admin-text truncate">{user.fullName}</h1>
        </div>
        <div className="flex items-center gap-1.5">
          <StatusBadge status={accountStatus} />
        </div>
      </div>

      {error ? (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-400">{error}</div>
      ) : null}

      <div className="rounded-2xl border border-admin-border bg-admin-card p-4 sm:p-5 shadow-subtle-dark">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="text-lg sm:text-xl font-extrabold text-admin-text">{user.fullName}</div>
            <div className="text-xs sm:text-sm text-admin-subtext font-mono mt-0.5">{user.phone}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <StatusBadge status={user.role} />
              <StatusBadge status={user.isActive ? 'active' : 'deactivated'} />
            </div>
          </div>
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start text-xs text-admin-subtext border-t sm:border-t-0 border-admin-border pt-2 sm:pt-0">
            {user.createdAt ? <div>{new Date(user.createdAt).toLocaleDateString()}</div> : null}
            <div className="flex items-center justify-end gap-1 font-bold text-amber-400 mt-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {user.rating?.toFixed(1) ?? '0.0'}
            </div>
          </div>
        </div>
      </div>

      {canApproveAccount || canRejectAccount ? (
        <div className="rounded-lg border border-yellow-500/40 bg-admin-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-admin-text">{t('admin.userDetail.accountReview')}</h2>
          </div>
          {user.rejectionReason ? <p className="mb-2 text-sm text-red-400">{t('admin.userDetail.rejectionReason')} {user.rejectionReason}</p> : null}
          <div className="flex gap-2">
            {canApproveAccount ? (
              <button
                type="button"
                onClick={approveAccount}
                disabled={busy}
                className="rounded-md border border-emerald-500 bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50"
              >
                {t('admin.userDetail.approveAccount')}
              </button>
            ) : null}
            {canRejectAccount ? (
              <button
                type="button"
                onClick={() => setShowRejectAccount(true)}
                disabled={busy}
                className="rounded-md border border-red-500 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/20 disabled:opacity-50"
              >
                {t('admin.userDetail.rejectAccount')}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      <StatCardGrid>
        <StatCard label={t('nav.items.fleet')} value={user.stats.truckCount} accentClassName="text-yellow-500" />
        <StatCard label={t('nav.items.orders')} value={user.stats.orderCount} accentClassName="text-sky-500" />
        <StatCard label={t('marketing.stats.tripsLabel')} value={user.stats.tripCount} accentClassName="text-emerald-500" />
        <StatCard label={t('status.active')} value={user.stats.activeTripCount} accentClassName="text-violet-500" />
      </StatCardGrid>

      {user.role === 'driver' ? (
        <Link
          to={`/admin/orders?driverId=${user.id}`}
          className="block rounded-lg border border-admin-border bg-admin-card p-4 text-sm font-semibold text-sky-400 hover:border-sky-500"
        >
          {t('common.viewDetails')} →
        </Link>
      ) : null}

      {(user.companyType === 'company' || user.role === 'agent') && user.accountManager ? (
        <div className="rounded-lg border border-admin-border bg-admin-card p-4">
          <h2 className="mb-2 text-sm font-semibold text-admin-text">{t('admin.userDetail.accountManager')}</h2>
          <InfoRow label="Name" value={user.accountManager.name} />
          {user.accountManager.phone ? <InfoRow label="Phone" value={user.accountManager.phone} /> : null}
          {user.accountManager.email ? <InfoRow label="Email" value={user.accountManager.email} /> : null}
        </div>
      ) : null}

      <div className="rounded-lg border border-admin-border bg-admin-card p-4">
        <h2 className="mb-3 text-sm font-semibold text-admin-text">{t('admin.userDetail.documentsReview')}</h2>
        <div className="mb-3 flex flex-wrap gap-2">
          {DOC_FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setDocFilter(filter)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize transition ${
                docFilter === filter
                  ? 'border-admin-accent bg-admin-accent/15 text-admin-accent'
                  : 'border-admin-border text-admin-subtext hover:border-admin-accent'
              }`}
            >
              {filter.replace('_', ' ')}
            </button>
          ))}
        </div>
        {filteredDocs.length === 0 ? (
          <p className="text-sm text-admin-subtext">{t('admin.userDetail.noDocs')}</p>
        ) : (
          <div className="space-y-2">
            {filteredDocs.map((doc) => (
              <button
                key={doc.id}
                type="button"
                onClick={() => {
                  setReviewingDoc(doc);
                  setDocDecision(null);
                  setDocReason('');
                }}
                className="flex w-full items-center justify-between rounded-md border border-admin-border bg-admin-bg px-3 py-2 text-left rtl:text-right text-sm hover:border-admin-accent"
              >
                <div>
                  <div className="font-medium text-admin-text capitalize">{doc.type.replace(/_/g, ' ')}</div>
                  <div className="text-xs text-admin-subtext">{doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : ''}</div>
                </div>
                <StatusBadge status={doc.status} />
              </button>
            ))}
          </div>
        )}
      </div>

      {user.linkedAgent || user.linkedTruckOwner ? (
        <div className="rounded-lg border border-admin-border bg-admin-card p-4">
          <h2 className="mb-2 text-sm font-semibold text-admin-text">{t('admin.userDetail.linkedAccounts')}</h2>
          {user.linkedAgent ? <InfoRow label={t('admin.users.roleTabs.agent')} value={`${user.linkedAgent.fullName} • ${user.linkedAgent.phone}`} /> : null}
          {user.linkedTruckOwner ? (
            <InfoRow label={t('admin.users.roleTabs.truck_owner')} value={`${user.linkedTruckOwner.fullName} • ${user.linkedTruckOwner.phone}`} />
          ) : null}
        </div>
      ) : null}

      {user.trucks.length > 0 || canManageTrucks ? (
        <div className="rounded-lg border border-admin-border bg-admin-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-admin-text">{t('admin.userDetail.fleet')}</h2>
            {canManageTrucks ? (
              <button
                type="button"
                onClick={openAddTruck}
                className="rounded-md border border-violet-500/50 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-400 hover:bg-violet-500/20"
              >
                {t('admin.userDetail.addFullTruck')}
              </button>
            ) : null}
          </div>
          {user.trucks.length === 0 ? (
            <p className="text-sm text-admin-subtext">{t('admin.userDetail.noTrucks')}</p>
          ) : (
            <div className="space-y-2">
              {user.trucks.map((truck) => {
                const isHidden = truck.status === 'inactive';
                return (
                  <div key={truck.id} className="flex items-center justify-between rounded-md border border-admin-border bg-admin-bg px-3 py-2">
                    <div>
                      <div className="text-sm font-semibold text-admin-text">{truck.plateNumber}</div>
                      <div className="text-xs text-admin-subtext">{truck.assignedDriver?.fullName ?? '—'}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={isHidden ? 'hidden' : truck.busy ? 'busy' : 'available'} />
                      {canManageTrucks ? (
                        <button
                          type="button"
                          onClick={() => toggleTruckVisibility(truck.id, !isHidden)}
                          disabled={updatingTruckId === truck.id || (truck.busy && !isHidden)}
                          className={`rounded-md border px-2.5 py-1 text-xs font-semibold transition disabled:opacity-50 ${
                            isHidden
                              ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                              : 'border-red-500/50 bg-red-500/10 text-red-500 hover:bg-red-500/20'
                          }`}
                        >
                          {isHidden ? t('common.active') : t('common.inactive')}
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : null}

      {user.orders.length > 0 ? (
        <div className="rounded-lg border border-admin-border bg-admin-card p-4">
          <h2 className="mb-3 text-sm font-semibold text-admin-text">{t('admin.userDetail.recentOrders')}</h2>
          <div className="space-y-2">
            {user.orders.slice(0, 10).map((order) => (
              <Link
                key={order.id}
                to={`/admin/orders/${order.id}`}
                className="flex items-center justify-between rounded-md border border-admin-border bg-admin-bg px-3 py-2 text-sm hover:border-admin-accent"
              >
                <span className="font-medium text-admin-text">#{order.orderCode || order.id.slice(-8).toUpperCase()}</span>
                <StatusBadge status={order.status} />
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {user.trips.length > 0 ? (
        <div className="rounded-lg border border-admin-border bg-admin-card p-4">
          <h2 className="mb-3 text-sm font-semibold text-admin-text">{t('admin.userDetail.tripHistory')}</h2>
          <div className="space-y-2">
            {user.trips.slice(0, 10).map((trip) => (
              <div key={trip.id} className="rounded-md border border-admin-border bg-admin-bg px-3 py-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-admin-text">#{trip.id.slice(-8).toUpperCase()}</span>
                  <StatusBadge status={trip.status} />
                </div>
                <div className="mt-1 text-xs text-admin-subtext">
                  {trip.order?.pickup.address ?? '—'} → {trip.order?.delivery.address ?? '—'}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <Modal
        open={!!reviewingDoc}
        onClose={() => setReviewingDoc(null)}
        title={reviewingDoc?.type.replace(/_/g, ' ') ?? ''}
        footer={
          <button
            type="button"
            onClick={submitDocReview}
            disabled={!docDecision || busy}
            className="rounded-md bg-admin-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            Submit Review
          </button>
        }
      >
        {reviewingDoc?.fileUrl ? (
          <button
            type="button"
            onClick={() => setZoomSrc(resolveFileUrl(reviewingDoc.fileUrl))}
            className="mb-3 block w-full overflow-hidden rounded-md border border-admin-border"
          >
            <img src={resolveFileUrl(reviewingDoc.fileUrl) ?? undefined} alt="document" className="max-h-56 w-full object-contain bg-black" />
          </button>
        ) : null}
        <div className="mb-3 flex gap-2">
          <button
            type="button"
            onClick={() => setDocDecision('approve')}
            className={`flex-1 rounded-md border py-2 text-sm font-semibold ${
              docDecision === 'approve' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : 'border-admin-border text-admin-text'
            }`}
          >
            Approve
          </button>
          <button
            type="button"
            onClick={() => setDocDecision('reject')}
            className={`flex-1 rounded-md border py-2 text-sm font-semibold ${
              docDecision === 'reject' ? 'border-red-500 bg-red-500/10 text-red-500' : 'border-admin-border text-admin-text'
            }`}
          >
            Reject
          </button>
        </div>
        {docDecision === 'reject' ? (
          <textarea
            value={docReason}
            onChange={(e) => setDocReason(e.target.value)}
            placeholder="Rejection reason"
            rows={3}
            className="w-full rounded-md border border-admin-border bg-admin-card px-3 py-2 text-sm text-admin-text placeholder-admin-subtext focus:border-admin-accent focus:outline-none"
          />
        ) : null}
      </Modal>

      <Modal
        open={showRejectAccount}
        onClose={() => setShowRejectAccount(false)}
        title="Reject Account"
        footer={
          <button
            type="button"
            onClick={rejectAccount}
            disabled={!accountRejectReason.trim() || busy}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50"
          >
            Reject
          </button>
        }
      >
        <textarea
          value={accountRejectReason}
          onChange={(e) => setAccountRejectReason(e.target.value)}
          placeholder="Rejection reason required"
          rows={3}
          className="w-full rounded-md border border-admin-border bg-admin-card px-3 py-2 text-sm text-admin-text placeholder-admin-subtext focus:border-admin-accent focus:outline-none"
        />
      </Modal>

      <Modal
        open={showAddTruck}
        onClose={() => setShowAddTruck(false)}
        title="Add Full Truck"
        footer={
          <button
            type="button"
            onClick={submitNewTruck}
            disabled={creatingTruck}
            className="rounded-md bg-admin-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            Create Truck
          </button>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-admin-subtext">Driver (optional)</label>
            <select
              value={newTruck.driverId}
              onChange={(e) => setNewTruck((n) => ({ ...n, driverId: e.target.value }))}
              className="w-full rounded-md border border-admin-border bg-admin-card px-3 py-2 text-sm text-admin-text focus:border-admin-accent focus:outline-none"
            >
              <option value="">Unassigned</option>
              {composeOptions?.drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.fullName} ({d.phone})
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-admin-subtext">Head type</label>
              <select
                value={newTruck.headType}
                onChange={(e) => setNewTruck((n) => ({ ...n, headType: e.target.value as CreateFullTruckPayload['headType'] }))}
                className="w-full rounded-md border border-admin-border bg-admin-card px-3 py-2 text-sm text-admin-text focus:border-admin-accent focus:outline-none"
              >
                <option value="fardany">Fardany</option>
                <option value="ras">Ras</option>
                <option value="jambo">Jambo</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-admin-subtext">Capacity (tons)</label>
              <input
                type="number"
                value={newTruck.capacity}
                onChange={(e) => setNewTruck((n) => ({ ...n, capacity: e.target.value }))}
                className="w-full rounded-md border border-admin-border bg-admin-card px-3 py-2 text-sm text-admin-text placeholder-admin-subtext focus:border-admin-accent focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-admin-subtext">Operation type</label>
            <input
              type="text"
              value={newTruck.operationType}
              onChange={(e) => setNewTruck((n) => ({ ...n, operationType: e.target.value }))}
              placeholder="e.g. flat_surface"
              className="w-full rounded-md border border-admin-border bg-admin-card px-3 py-2 text-sm text-admin-text placeholder-admin-subtext focus:border-admin-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-admin-subtext">Plate number</label>
            <input
              type="text"
              value={newTruck.plateNumber}
              onChange={(e) => setNewTruck((n) => ({ ...n, plateNumber: e.target.value }))}
              className="w-full rounded-md border border-admin-border bg-admin-card px-3 py-2 text-sm text-admin-text placeholder-admin-subtext focus:border-admin-accent focus:outline-none"
            />
          </div>
        </div>
      </Modal>

      <ImageZoomModal src={zoomSrc} onClose={() => setZoomSrc(null)} />
    </div>
  );
}
