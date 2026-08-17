import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, XCircle, AlertCircle, Eye, ShieldCheck, User, Truck, DollarSign, Route, FileText, Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import FilterTabs from '../../../components/FilterTabs';
import { useAdminAuth } from '../../../lib/auth';
import { useSocket } from '../../../lib/socket';
import {
  ApprovalQueue,
  adminApproveEntry,
  adminApproveTruck,
  adminDecideManagerChange,
  adminDecideRouteChange,
  adminGetApprovalsQueue,
  adminRejectEntry,
  adminRejectTruck,
  decidePriceEdit,
} from '../../../lib/api/adminReview';
import { formatTruckType, formatHeadType } from '../../../lib/truckTranslations';

type SectionKey =
  | 'all'
  | 'registrations'
  | 'documents'
  | 'agentChanges'
  | 'routeChanges'
  | 'priceEdits'
  | 'financialAdjustments'
  | 'truckApprovals'
  | 'managerChanges';

function ActionButton({
  tone,
  disabled,
  onClick,
  children,
}: {
  tone: 'approve' | 'reject';
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const cls =
    tone === 'approve'
      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50 shadow-sm'
      : 'border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 shadow-sm';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${cls}`}
    >
      {tone === 'approve' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
      {children}
    </button>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="group rounded-2xl border border-admin-border/70 bg-admin-card/85 p-5 shadow-sm backdrop-blur-xl transition hover:border-admin-accent/40 hover:shadow-md">
      {children}
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-admin-surface text-admin-accent border border-admin-border/50">
          {icon}
        </span>
        <h2 className="text-xs font-bold uppercase tracking-wider text-admin-text">{title}</h2>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">{children}</div>
    </section>
  );
}

/** Unified approvals queue with high-end glassmorphic UI */
export default function Approvals() {
  const { t } = useTranslation();
  const { token } = useAdminAuth();
  const { socket } = useSocket(token);
  const [queue, setQueue] = useState<ApprovalQueue | null>(null);
  const [filter, setFilter] = useState<SectionKey>('all');
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rejectPrompt, setRejectPrompt] = useState<
    | { kind: 'truck'; id: string; label: string }
    | { kind: 'manager'; id: string; label: string }
    | null
  >(null);
  const [rejectReason, setRejectReason] = useState('');
  const [flash, setFlash] = useState<string | null>(null);

  const SECTIONS: { key: SectionKey; label: string }[] = [
    { key: 'all', label: t('admin.approvals.sections.all') },
    { key: 'registrations', label: t('admin.approvals.sections.registrations') },
    { key: 'documents', label: t('admin.approvals.sections.documents') },
    { key: 'agentChanges', label: t('admin.approvals.sections.agentChanges') },
    { key: 'managerChanges', label: t('admin.approvals.sections.managerChanges') },
    { key: 'routeChanges', label: t('admin.approvals.sections.routeChanges') },
    { key: 'priceEdits', label: t('admin.approvals.sections.priceEdits') },
    { key: 'financialAdjustments', label: t('admin.approvals.sections.financialAdjustments') },
    { key: 'truckApprovals', label: t('admin.approvals.sections.truckApprovals') },
  ];

  const load = useCallback(async () => {
    if (!token) return;
    const { data, error: err } = await adminGetApprovalsQueue(token);
    if (data) setQueue(data);
    if (err) setError(err);
  }, [token]);

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  useEffect(() => {
    if (!socket) return;
    const onNewNotification = (payload: { type?: string }) => {
      if (payload?.type === 'registration_pending_review') {
        setFlash('New request received — refreshing…');
        load();
        setTimeout(() => setFlash(null), 4000);
      }
    };
    socket.on('notification:new', onNewNotification);
    return () => {
      socket.off('notification:new', onNewNotification);
    };
  }, [socket, load]);

  const showSection = (key: SectionKey) => filter === 'all' || filter === key;

  const runAction = async (id: string, action: () => Promise<{ error?: string }>) => {
    setActing(id);
    setError(null);
    const { error: err } = await action();
    setActing(null);
    if (err) setError(err);
    else load();
  };

  const handleApproveLedger = (id: string) => runAction(id, () => adminApproveEntry(token!, id));
  const handleRejectLedger = (id: string) =>
    runAction(id, () => adminRejectEntry(token!, id, 'Rejected by admin'));
  const handlePriceEdit = (orderId: string, decision: 'approved' | 'rejected') =>
    runAction(orderId, () => decidePriceEdit(token!, orderId, { decision }));
  const handleRouteChange = (orderId: string, decision: 'approved' | 'rejected') =>
    runAction(orderId, () => adminDecideRouteChange(token!, orderId, decision));
  const handleApproveTruck = (truckId: string) => runAction(truckId, () => adminApproveTruck(token!, truckId));
  const handleApproveManagerChange = (truckId: string) =>
    runAction(truckId, () => adminDecideManagerChange(token!, truckId, { decision: 'approved' }));

  const submitRejectPrompt = async () => {
    if (!rejectPrompt || !rejectReason.trim() || !token) return;
    setActing(rejectPrompt.id);
    setError(null);
    const { error: err } =
      rejectPrompt.kind === 'truck'
        ? await adminRejectTruck(token, rejectPrompt.id, rejectReason.trim())
        : await adminDecideManagerChange(token, rejectPrompt.id, {
            decision: 'rejected',
            reason: rejectReason.trim(),
          });
    setActing(null);
    if (err) {
      setError(err);
      return;
    }
    setRejectPrompt(null);
    setRejectReason('');
    load();
  };

  const total = queue?.counts.total ?? 0;

  return (
    <div className="space-y-6 animation-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-admin-accent/10 text-admin-accent">
              <ShieldCheck className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-admin-accent">
              {t('admin.approvals.hubBadge')}
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-admin-text">
            {t('admin.approvals.title')}
          </h1>
          <p className="mt-1 text-xs text-admin-subtext">
            {t('admin.approvals.subtitle', { count: total })}
          </p>
        </div>
      </div>

      {flash ? (
        <div className="flex items-center gap-2 rounded-xl border border-admin-accent/30 bg-admin-accent/10 px-4 py-3 text-xs font-semibold text-admin-accent backdrop-blur-md">
          <Bell className="h-4 w-4 animate-bounce" />
          {flash}
        </div>
      ) : null}

      {error ? (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs font-semibold text-red-400 backdrop-blur-md">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      ) : null}

      {/* Tabs */}
      <div className="overflow-x-auto no-scrollbar max-w-full">
        <FilterTabs
          tabs={SECTIONS.map((s) => ({
            value: s.key,
            label: s.label,
            count:
              s.key === 'all' ? queue?.counts.total ?? 0 : (queue?.counts as Record<string, number> | undefined)?.[s.key] ?? 0,
          }))}
          active={filter}
          onChange={(v) => setFilter(v as SectionKey)}
        />
      </div>

      {loading ? (
        <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-admin-border/50 bg-admin-card/50">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-admin-accent border-t-transparent" />
            <p className="text-xs font-medium text-admin-muted">Loading pending requests...</p>
          </div>
        </div>
      ) : !queue ? null : (
        <div className="space-y-8">
          {/* Registrations */}
          {showSection('registrations') && queue.registrations.length > 0 && (
            <Section title="Pending User Registrations" icon={<User className="h-3.5 w-3.5" />}>
              {queue.registrations.map((u) => (
                <Card key={u.id}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-admin-text">{u.fullName}</p>
                      <p className="font-mono text-xs text-admin-subtext">{u.phone}</p>
                    </div>
                    <span className="rounded-lg bg-admin-surface px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-admin-accent border border-admin-border/50">
                      {u.role}
                    </span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link
                      to={`/admin/users/${u.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-admin-border bg-admin-surface px-3 py-2 text-xs font-bold text-admin-text transition hover:bg-admin-accent hover:text-white"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      {t('admin.approvals.reviewProfile')}
                    </Link>
                  </div>
                </Card>
              ))}
            </Section>
          )}

          {/* Documents */}
          {showSection('documents') && queue.documents.length > 0 && (
            <Section title={t('admin.approvals.sections.documents')} icon={<FileText className="h-3.5 w-3.5" />}>
              {queue.documents.map((d) => (
                <Card key={d.id}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-admin-text">{d.userName || 'Unknown User'}</p>
                      <p className="font-mono text-xs text-admin-subtext">{d.type}</p>
                    </div>
                    <span className="rounded-lg bg-admin-surface px-2.5 py-1 text-xs font-semibold capitalize text-admin-muted border border-admin-border/50">
                      {d.userRole || 'Document'}
                    </span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link
                      to={`/admin/documents?userId=${d.userId ?? ''}${d.id ? `&docId=${d.id}` : ''}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-admin-accent/30 bg-admin-accent/10 px-3 py-2 text-xs font-bold text-admin-accent transition hover:bg-admin-accent hover:text-white"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      {t('admin.approvals.inspectDocument')}
                    </Link>
                  </div>
                </Card>
              ))}
            </Section>
          )}

          {/* Route Changes */}
          {showSection('routeChanges') && queue.routeChanges.length > 0 && (
            <Section title={t('admin.approvals.sections.routeChanges')} icon={<Route className="h-3.5 w-3.5" />}>
              {queue.routeChanges.map((r) => (
                <Card key={r.orderId}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-extrabold text-admin-accent">
                      #{r.orderId.slice(-6).toUpperCase()}
                    </span>
                    <span className="font-semibold text-xs text-admin-subtext">{r.clientName || 'Shipper'}</span>
                  </div>
                  <p className="mt-2 text-xs text-admin-text font-medium">
                    {t('admin.approvals.newDestination')} <span className="font-bold">{r.newAddress || '—'}</span>
                  </p>
                  {r.reason ? <p className="mt-1 text-xs text-admin-muted italic">"{r.reason}"</p> : null}
                  <div className="mt-4 flex gap-2">
                    <ActionButton
                      tone="approve"
                      disabled={acting === r.orderId}
                      onClick={() => handleRouteChange(r.orderId, 'approved')}
                    >
                      {t('admin.approvals.approve')}
                    </ActionButton>
                    <ActionButton
                      tone="reject"
                      disabled={acting === r.orderId}
                      onClick={() => handleRouteChange(r.orderId, 'rejected')}
                    >
                      {t('admin.approvals.reject')}
                    </ActionButton>
                  </div>
                </Card>
              ))}
            </Section>
          )}

          {/* Price Edits */}
          {showSection('priceEdits') && queue.priceEdits.length > 0 && (
            <Section title={t('admin.approvals.sections.priceEdits')} icon={<DollarSign className="h-3.5 w-3.5" />}>
              {queue.priceEdits.map((p) => (
                <Card key={p.orderId}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-extrabold text-admin-accent">
                      #{p.orderId.slice(-6).toUpperCase()}
                    </span>
                    <span className="font-medium text-xs text-admin-subtext">{p.clientName || '—'}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="font-mono text-admin-muted line-through">{p.currentPrice} {t('common.currency')}</span>
                    <span className="font-bold text-admin-text">→</span>
                    <span className="font-mono font-extrabold text-emerald-400">{p.proposedPrice} {t('common.currency')}</span>
                  </div>
                  {p.reason ? <p className="mt-1 text-xs text-admin-muted italic">"{p.reason}"</p> : null}
                  <div className="mt-4 flex gap-2">
                    <ActionButton
                      tone="approve"
                      disabled={acting === p.orderId}
                      onClick={() => handlePriceEdit(p.orderId, 'approved')}
                    >
                      {t('admin.approvals.approvePrice')}
                    </ActionButton>
                    <ActionButton
                      tone="reject"
                      disabled={acting === p.orderId}
                      onClick={() => handlePriceEdit(p.orderId, 'rejected')}
                    >
                      {t('admin.approvals.reject')}
                    </ActionButton>
                  </div>
                </Card>
              ))}
            </Section>
          )}

          {/* Truck Approvals */}
          {showSection('truckApprovals') && (queue.truckApprovals ?? []).length > 0 && (
            <Section title={t('admin.approvals.sections.truckApprovals')} icon={<Truck className="h-3.5 w-3.5" />}>
              {(queue.truckApprovals ?? []).map((truck) => (
                <Card key={truck.id}>
                  <div className="flex items-center justify-between">
                    <p className="font-mono font-bold text-admin-text">
                      {truck.truckCode} · {truck.plateNumber ?? '—'}
                    </p>
                    <span className="rounded-lg bg-admin-surface px-2 py-0.5 text-[11px] font-semibold text-admin-muted">
                      {formatHeadType(truck.headType)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-admin-subtext">
                    Category: {formatTruckType(truck.type)} · Agent: {truck.agentName || '—'}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Link
                      to={`/admin/truck-detail/${truck.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl border border-admin-border bg-admin-surface px-3 py-2 text-xs font-bold text-admin-text transition hover:border-admin-accent"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      {t('admin.approvals.vehicleProfile')}
                    </Link>
                    <ActionButton
                      tone="approve"
                      disabled={acting === truck.id}
                      onClick={() => handleApproveTruck(truck.id)}
                    >
                      {t('admin.approvals.approve')}
                    </ActionButton>
                    <ActionButton
                      tone="reject"
                      disabled={acting === truck.id}
                      onClick={() => setRejectPrompt({ kind: 'truck', id: truck.id, label: truck.truckCode })}
                    >
                      {t('admin.approvals.reject')}
                    </ActionButton>
                  </div>
                </Card>
              ))}
            </Section>
          )}

          {queue.counts.total === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-admin-border/50 bg-admin-card/50 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="mt-3 text-sm font-extrabold text-admin-text">{t('admin.approvals.allCaughtUp')}</p>
              <p className="mt-1 text-xs text-admin-subtext">{t('admin.approvals.allCaughtUpDesc')}</p>
            </div>
          )}
        </div>
      )}

      {/* Rejection Prompt Modal */}
      {rejectPrompt ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animation-fade-in"
          onClick={() => setRejectPrompt(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-admin-border bg-admin-card p-5 shadow-2xl animation-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-extrabold text-admin-text">
              {t('admin.approvals.rejectPromptTitle', { label: rejectPrompt.label })}
            </h3>
            <textarea
              autoFocus
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder={t('admin.approvals.rejectReasonPlaceholder')}
              rows={3}
              className="mt-3 w-full rounded-xl border border-admin-border bg-admin-surface/70 p-3 text-xs font-medium text-admin-text placeholder:text-admin-muted focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectPrompt(null)}
                className="rounded-xl border border-admin-border px-3.5 py-1.5 text-xs font-semibold text-admin-subtext hover:bg-admin-surface"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={submitRejectPrompt}
                disabled={!rejectReason.trim() || acting === rejectPrompt.id}
                className="rounded-xl bg-red-500 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-500/25 transition hover:bg-red-600 disabled:opacity-50"
              >
                {t('admin.approvals.confirmReject')}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
