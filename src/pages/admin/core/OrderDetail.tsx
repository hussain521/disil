import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Ban,
  Banknote,
  Briefcase,
  Check,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  Globe,
  Layers,
  Package,
  Play,
  Shuffle,
  Star,
  Truck as TruckIcon,
  User,
  UserCheck,
  X,
} from 'lucide-react';
import Modal from '../../../components/Modal';
import StatusBadge from '../../../components/StatusBadge';
import { formatTruckType, formatCargoType } from '../../../lib/truckTranslations';
import {
  adminAssignOrder,
  adminCancelOrder,
  adminCloseOrder,
  adminDecideRouteChange,
  adminForceApproveOrder,
  adminGetOrder,
  adminGetTrucks,
  adminPublishOrder,
  adminSelectOrderOffer,
  adminSetFee,
  adminSetOrderPaymentStatus,
  confirmOrderBalance,
  confirmOrderDeposit,
  getOrderStatement,
  releaseOrderTruck,
  type Order,
  type OrderStatement,
  type Truck,
} from '../../../lib/api/adminCore';
import { useAdminAuth } from '../../../lib/auth';


const OFFER_STATUS_LABEL: Record<string, string> = {
  submitted: 'New',
  selected: 'Selected',
  accepted: 'Accepted',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
};

const TERMINAL_STATUSES = ['closed', 'cancelled', 'delivered'];

function orderSerial(order: Order) {
  return order.orderCode || `#${order.id.slice(-8).toUpperCase()}`;
}

function InfoRow({ label, value, href }: { label: string; value: ReactNode; href?: string }) {
  const content =
    typeof value === 'string' ? (
      <span className={href ? 'text-admin-accent' : 'text-admin-text'}>{value}</span>
    ) : (
      value
    );
  return (
    <div className="flex items-start justify-between gap-4 py-2 text-sm">
      <span className="shrink-0 text-admin-subtext">{label}</span>
      <span className="text-right">{href ? <Link to={href}>{content}</Link> : content}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-admin-border bg-admin-card p-4">
      <h2 className="mb-2 text-sm font-semibold text-admin-text">{title}</h2>
      <div className="divide-y divide-admin-border/60">{children}</div>
    </div>
  );
}

function ActionButton({
  label,
  icon,
  colorClass,
  onClick,
  disabled,
}: {
  label: string;
  icon: ReactNode;
  colorClass: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${colorClass}`}
    >
      <span className="inline-flex shrink-0">{icon}</span>
      {label}
    </button>
  );
}

/** Admin order detail — ports `app/(admin)/order/[id].tsx` (the biggest mobile admin screen). */
export default function OrderDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { token } = useAdminAuth();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTruckId, setSelectedTruckId] = useState('');
  const [assignPrice, setAssignPrice] = useState('');
  const [assignFee, setAssignFee] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'agent' | 'owner'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [collapsedEntities, setCollapsedEntities] = useState<Record<string, boolean>>({});

  const [showFeeModal, setShowFeeModal] = useState(false);
  const [feePrice, setFeePrice] = useState('');
  const [feeFee, setFeeFee] = useState('');

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Cancelled by admin');

  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState('');

  const [statement, setStatement] = useState<OrderStatement | null>(null);
  const [statementLoading, setStatementLoading] = useState(false);
  const [statementError, setStatementError] = useState<string | null>(null);

  const loadOrder = useCallback(async () => {
    if (!token || !id) return;
    const { data, error: err } = await adminGetOrder(token, id);
    if (data) {
      setOrder(data);
      setFeePrice(data.price != null ? String(data.price) : '');
      setFeeFee(data.adminFee != null ? String(data.adminFee) : '');
    } else if (err) {
      setError(err);
    }
  }, [id, token]);

  const loadTrucks = useCallback(async () => {
    if (!token) return;
    const { data } = await adminGetTrucks(token);
    setTrucks(data?.trucks ?? []);
  }, [token]);

  useEffect(() => {
    setLoading(true);
    Promise.all([loadOrder(), loadTrucks()]).finally(() => setLoading(false));
  }, [loadOrder, loadTrucks]);

  const availableTrucks = useMemo(
    () => trucks.filter((t) => !t.busy && t.status === 'available' && t.assignedDriverId),
    [trucks]
  );

  const availableTruckTypes = useMemo(() => {
    const typesSet = new Set<string>();
    availableTrucks.forEach((t) => {
      const rawType = t.type || t.operationType;
      if (rawType) typesSet.add(rawType);
    });
    return Array.from(typesSet);
  }, [availableTrucks]);

  const filteredTrucks = useMemo(() => {
    return availableTrucks.filter((t) => {
      const isAgent = !!(t.agentId || t.agent?.id);
      if (roleFilter === 'agent' && !isAgent) return false;
      if (roleFilter === 'owner' && isAgent) return false;

      if (typeFilter !== 'all') {
        const truckType = t.type || t.operationType || '';
        if (truckType !== typeFilter) return false;
      }

      return true;
    });
  }, [availableTrucks, roleFilter, typeFilter]);

  const entityGroups = useMemo(() => {
    const groupsMap: Record<
      string,
      { id: string; name: string; role: 'agent' | 'owner'; roleLabel: string; trucks: Truck[] }
    > = {};

    filteredTrucks.forEach((truck) => {
      const isAgent = !!(truck.agentId || truck.agent?.id);
      const entityId = isAgent
        ? truck.agentId || truck.agent?.id || 'unknown_agent'
        : truck.ownerId || truck.owner?.id || 'unknown_owner';

      const entityName = isAgent
        ? truck.agent?.fullName || 'الوكيل'
        : truck.owner?.fullName || 'المالك';

      const role: 'agent' | 'owner' = isAgent ? 'agent' : 'owner';
      const roleLabel = isAgent ? 'الوكلاء' : 'المالكون';

      if (!groupsMap[entityId]) {
        groupsMap[entityId] = {
          id: entityId,
          name: entityName,
          role,
          roleLabel,
          trucks: [],
        };
      }
      groupsMap[entityId].trucks.push(truck);
    });

    return Object.values(groupsMap);
  }, [filteredTrucks]);

  const runAction = async (action: () => Promise<{ data?: Order; error?: string }>) => {
    setBusy(true);
    setError(null);
    const { data, error: err } = await action();
    setBusy(false);
    if (err) {
      setError(err);
      return false;
    }
    if (data) setOrder(data);
    return true;
  };

  const handleAssign = async () => {
    if (!token || !order || !selectedTruckId) return;
    const truck = trucks.find((t) => t.id === selectedTruckId);
    if (!truck?.assignedDriverId) return;
    const ok = await runAction(() =>
      adminAssignOrder(
        token,
        order.id,
        truck.id,
        truck.assignedDriverId!,
        assignPrice ? Number(assignPrice) : undefined,
        assignFee ? Number(assignFee) : undefined
      )
    );
    if (ok) {
      setShowAssignModal(false);
      setSelectedTruckId('');
      await loadTrucks();
    }
  };

  const handleSetFee = async () => {
    if (!token || !order) return;
    const fee = Number(feeFee);
    if (Number.isNaN(fee) || fee < 0) {
      setError('Enter a valid fee');
      return;
    }
    const price = feePrice ? Number(feePrice) : undefined;
    const ok = await runAction(() => adminSetFee(token, order.id, fee, price));
    if (ok) setShowFeeModal(false);
  };

  const handleCancel = async () => {
    if (!token || !order) return;
    const ok = await runAction(() => adminCancelOrder(token, order.id, cancelReason));
    if (ok) setShowCancelModal(false);
  };

  const handleClose = () => {
    if (!token || !order) return;
    void runAction(() => adminCloseOrder(token, order.id));
  };

  const handleForceApprove = () => {
    if (!token || !order) return;
    void runAction(() => adminForceApproveOrder(token, order.id));
  };

  const handlePublish = () => {
    if (!token || !order) return;
    void runAction(() => adminPublishOrder(token, order.id));
  };

  const handleReleaseTruck = () => {
    if (!token || !order) return;
    void runAction(() => releaseOrderTruck(token, order.id, 'schedule_overrun'));
  };

  const handleRouteChangeDecision = (decision: 'approved' | 'rejected') => {
    if (!token || !order) return;
    void runAction(() => adminDecideRouteChange(token, order.id, decision));
  };

  const handleSelectOffer = (offerId: string) => {
    if (!token || !order) return;
    if (!window.confirm('Accept this offer and assign the agent?')) return;
    void runAction(() => adminSelectOrderOffer(token, order.id, offerId));
  };

  const handleSetPaymentStatus = (status: 'unpaid' | 'partial' | 'paid') => {
    if (!token || !order) return;
    void runAction(() => adminSetOrderPaymentStatus(token, order.id, status));
  };

  const handleConfirmDeposit = async () => {
    if (!token || !order) return;
    const amount = Number(depositAmount);
    if (!Number.isFinite(amount) || amount <= 0) return;
    const ok = await runAction(() => confirmOrderDeposit(token, order.id, { amount }));
    if (ok) {
      setShowDepositModal(false);
      setDepositAmount('');
    }
  };

  const handleConfirmBalance = async () => {
    if (!token || !order) return;
    const amount = Number(balanceAmount);
    if (!Number.isFinite(amount) || amount <= 0) return;
    const ok = await runAction(() => confirmOrderBalance(token, order.id, { amount }));
    if (ok) {
      setShowBalanceModal(false);
      setBalanceAmount('');
    }
  };

  const loadStatement = async () => {
    if (!token || !order) return;
    setStatementLoading(true);
    setStatementError(null);
    const { data, error: err } = await getOrderStatement(token, order.id);
    setStatementLoading(false);
    if (err) {
      setStatementError(err);
      return;
    }
    setStatement(data ?? null);
  };

  if (loading) {
    return <div className="p-8 text-center text-sm text-admin-subtext">{t('common.loading')}</div>;
  }

  if (!order) {
    return <div className="p-8 text-center text-sm text-admin-subtext">{t('common.emptyMessage')}</div>;
  }

  const canForceApprove = ['pending_truck_owner_approval', 'pending_driver_approval'].includes(order.status);
  const canReleaseTruck =
    Boolean(order.truckId) &&
    ['pending_truck_owner_approval', 'pending_driver_approval', 'approved', 'reassign_needed'].includes(order.status);
  const canCancel = !TERMINAL_STATUSES.includes(order.status) && !['in_transit', 'arrived'].includes(order.status);
  const canClose = ['delivered', 'payment_pending'].includes(order.status);
  const canSetFee = !['cancelled', 'closed'].includes(order.status) && !order.pricingFinal;
  const canAssign = ['created', 'reassign_needed'].includes(order.status) && !(Boolean(order.clientId) && !order.createdByAgentId);
  const hasOffers = (order.agentOffers ?? []).length > 0;
  const isClientMarketplaceOrder = Boolean(order.clientId) && !order.createdByAgentId;
  const canSelectOffers = ['created', 'reassign_needed'].includes(order.status) && !isClientMarketplaceOrder;

  return (
    <div className="space-y-4 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate('/admin/orders')} className="text-admin-subtext hover:text-admin-text text-sm font-semibold">
            {t('common.back')}
          </button>
          <h1 className="text-lg sm:text-xl font-bold text-admin-text">{t('admin.orderDetail.orderTitle', { code: orderSerial(order) })}</h1>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {error ? (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-400">{error}</div>
      ) : null}

      {order.routeChangeRequest?.pending ? (
        <div className="rounded-lg border border-yellow-500/40 bg-yellow-500/10 p-4">
          <p className="text-sm font-semibold text-yellow-400">{t('admin.orderDetail.routeChangePending')}</p>
          <p className="mt-1 text-sm text-admin-text">{order.routeChangeRequest.newAddress}</p>
          <div className="mt-3 flex gap-2">
            <ActionButton
              label={t('admin.orderDetail.approve')}
              icon={<Check className="h-4 w-4" />}
              colorClass="border-emerald-500 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
              onClick={() => handleRouteChangeDecision('approved')}
              disabled={busy}
            />
            <ActionButton
              label={t('admin.orderDetail.reject')}
              icon={<X className="h-4 w-4" />}
              colorClass="border-red-500 bg-red-500/10 text-red-400 hover:bg-red-500/20"
              onClick={() => handleRouteChangeDecision('rejected')}
              disabled={busy}
            />
          </div>
        </div>
      ) : null}

      {!TERMINAL_STATUSES.includes(order.status) ? (
        <div className="flex flex-wrap gap-2">
          <ActionButton
            label={t('admin.orderDetail.confirmDeposit')}
            icon={<Banknote className="h-4 w-4" />}
            colorClass="border-emerald-500 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
            onClick={() => setShowDepositModal(true)}
          />
          <ActionButton
            label={t('admin.orderDetail.confirmBalance')}
            icon={<CheckSquare className="h-4 w-4" />}
            colorClass="border-sky-500 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20"
            onClick={() => setShowBalanceModal(true)}
          />
        </div>
      ) : null}

      {hasOffers ? (
        <Section title={`Agent Offers (${order.offerSummary?.totalOffers ?? order.agentOffers?.length ?? 0})`}>
          {order.offerSummary?.hasNegotiation ? (
            <p className="mb-2 text-xs text-amber-300">
              Negotiation: up to {order.offerSummary.maxNegotiationRounds} round(s)
              {order.offerSummary.priceNegotiationEvents
                ? ` · ${order.offerSummary.priceNegotiationEvents} price change(s)`
                : ''}
            </p>
          ) : null}
          {[...(order.agentOffers ?? [])]
            .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
            .map((offer) => {
              const isSelected = order.selectedOfferId === offer.id || offer.status === 'selected';
              return (
                <div key={offer.id ?? `${offer.agentId}-${offer.createdAt}`} className="flex items-start justify-between gap-4 py-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-sm font-semibold text-admin-text">{offer.agentName ?? 'Agent'}</div>
                      <span className="rounded bg-admin-bg px-2 py-0.5 text-[10px] font-semibold uppercase text-admin-subtext">
                        {OFFER_STATUS_LABEL[offer.status] ?? offer.status}
                      </span>
                      {(offer.negotiationRounds ?? 0) > 1 ? (
                        <span className="text-[10px] text-amber-300">
                          Round {offer.negotiationRound}/{offer.negotiationRounds}
                        </span>
                      ) : null}
                    </div>
                    {offer.agentCode ? <div className="text-xs text-admin-subtext">Code: {offer.agentCode}</div> : null}
                    {offer.createdAt ? (
                      <div className="text-xs text-admin-subtext">{new Date(offer.createdAt).toLocaleString()}</div>
                    ) : null}
                    {offer.notes ? <div className="mt-1 text-xs text-admin-subtext">{offer.notes}</div> : null}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <span className="text-sm font-semibold text-emerald-400">{offer.providerPrice?.toLocaleString()} EGP</span>
                    {isClientMarketplaceOrder && offer.status === 'submitted' ? (
                      <span className="text-xs font-medium text-amber-300">Awaiting client selection</span>
                    ) : canSelectOffers && offer.status === 'submitted' ? (
                      <button
                        type="button"
                        onClick={() => offer.id && handleSelectOffer(offer.id)}
                        className="rounded-md bg-yellow-500 px-3 py-1.5 text-xs font-semibold text-black hover:bg-yellow-400"
                      >
                        Accept Offer
                      </button>
                    ) : isSelected ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                        <Check className="h-3.5 w-3.5" /> Selected
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })}
        </Section>
      ) : null}

      {(order.priceNegotiations ?? []).length > 0 ? (
        <Section title="Price negotiations">
          {(order.priceNegotiations ?? []).map((item, idx) => (
            <div key={`${item.action}-${item.at}-${idx}`} className="py-2 text-sm">
              <div className="font-medium text-admin-text">
                {item.action.replace(/_/g, ' ')}
                {item.byRole ? ` · ${item.byRole}` : ''}
              </div>
              <div className="text-xs text-admin-subtext">
                {item.at ? new Date(item.at).toLocaleString() : '—'}
                {item.fromPrice != null || item.toPrice != null
                  ? ` · ${item.fromPrice?.toLocaleString?.() ?? '—'} → ${item.toPrice?.toLocaleString?.() ?? '—'} EGP`
                  : ''}
              </div>
              {item.reason ? <div className="mt-1 text-xs text-admin-subtext">{item.reason}</div> : null}
            </div>
          ))}
        </Section>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {order.status === 'pending_admin_approval' ? (
          <ActionButton
            label={t('admin.orderDetail.publishOrder')}
            icon={<Globe className="h-4 w-4" />}
            colorClass="border-emerald-500 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
            onClick={handlePublish}
            disabled={busy}
          />
        ) : null}
        {canAssign ? (
          <ActionButton
            label={t('admin.orderDetail.assignTruckDriver')}
            icon={<User className="h-4 w-4" />}
            colorClass="border-sky-500 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20"
            onClick={() => setShowAssignModal(true)}
          />
        ) : null}
        {canForceApprove ? (
          <ActionButton
            label={t('admin.orderDetail.forceStart')}
            icon={<Play className="h-4 w-4" />}
            colorClass="border-emerald-500 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
            onClick={handleForceApprove}
            disabled={busy}
          />
        ) : null}
        {canSetFee ? (
          <ActionButton
            label={t('admin.orderDetail.setFeePrice')}
            icon={<Banknote className="h-4 w-4" />}
            colorClass="border-sky-500 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20"
            onClick={() => setShowFeeModal(true)}
          />
        ) : null}
        {canClose ? (
          <ActionButton
            label={t('admin.orderDetail.closeOrder')}
            icon={<CheckCircle2 className="h-4 w-4" />}
            colorClass="border-emerald-500 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
            onClick={handleClose}
            disabled={busy}
          />
        ) : null}
        {canReleaseTruck ? (
          <ActionButton
            label={t('admin.orderDetail.releaseTruck')}
            icon={<Shuffle className="h-4 w-4" />}
            colorClass="border-yellow-500 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
            onClick={handleReleaseTruck}
            disabled={busy}
          />
        ) : null}
        {canCancel ? (
          <ActionButton
            label={t('admin.orderDetail.cancelOrder')}
            icon={<Ban className="h-4 w-4" />}
            colorClass="border-red-500 bg-red-500/10 text-red-400 hover:bg-red-500/20"
            onClick={() => setShowCancelModal(true)}
          />
        ) : null}
      </div>

      <Section title="Payment Confirmation">
        {order.paymentConfirmation ? (
          <>
            <InfoRow label="Confirmed at" value={new Date(order.paymentConfirmation.confirmedAt).toLocaleString()} />
            <InfoRow label="Sender info" value={order.paymentConfirmation.senderInfo} />
            {order.paymentConfirmation.paymentDetailType ? (
              <InfoRow label="Method used" value={order.paymentConfirmation.paymentDetailType} />
            ) : null}
          </>
        ) : (
          <p className="py-2 text-sm text-admin-subtext">No client payment confirmation yet.</p>
        )}
      </Section>

      <Section title="Payment Status">
        <div className="flex flex-wrap gap-2 py-2">
          {(['unpaid', 'partial', 'paid'] as const).map((status) => {
            const active = (order.paymentStatus ?? 'unpaid') === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => handleSetPaymentStatus(status)}
                disabled={active || busy}
                className={`rounded-md border px-3 py-1.5 text-xs font-semibold capitalize transition disabled:cursor-default ${
                  active
                    ? 'border-admin-accent bg-admin-accent/15 text-admin-accent'
                    : 'border-admin-border text-admin-subtext hover:border-admin-accent hover:text-admin-accent'
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Pricing">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
          <div className="rounded-md border border-admin-border p-3">
            <div className="text-xs text-admin-subtext">Order price</div>
            <div className="mt-1 text-base sm:text-lg font-semibold text-admin-text">
              {order.price != null ? `${order.price.toLocaleString()} EGP` : '—'}
            </div>
          </div>
          <div className="rounded-md border border-admin-accent/40 p-3">
            <div className="text-xs text-admin-accent">Admin fee</div>
            <div className="mt-1 text-base sm:text-lg font-semibold text-admin-accent">
              {order.adminFee != null ? `${order.adminFee.toLocaleString()} EGP` : '—'}
            </div>
          </div>
        </div>
        {(order.advancePaid ?? 0) > 0 ? <InfoRow label="Advance paid" value={`${order.advancePaid!.toLocaleString()} EGP`} /> : null}
      </Section>

      {order.paymentBreakdown ? (
        <Section title="Payment Breakdown">
          <InfoRow label="Order value" value={`${order.paymentBreakdown.orderValue.toLocaleString()} EGP`} />
          <InfoRow label="Expenses" value={`${order.paymentBreakdown.expenses.toLocaleString()} EGP`} />
          <InfoRow label="Holidays" value={`${order.paymentBreakdown.holidays.toLocaleString()} EGP`} />
          <InfoRow label="Taxes" value={`${order.paymentBreakdown.taxes.toLocaleString()} EGP`} />
          <InfoRow label="Insurance" value={`${order.paymentBreakdown.insurance.toLocaleString()} EGP`} />
          <InfoRow label="Admin fee" value={`${(order.paymentBreakdown.dizielFee ?? order.paymentBreakdown.adminFees ?? 0).toLocaleString()} EGP`} />
          <InfoRow label="Total" value={`${order.paymentBreakdown.total.toLocaleString()} EGP`} />
          <InfoRow label="Paid" value={`${order.paymentBreakdown.paid.toLocaleString()} EGP`} />
          <InfoRow label="Remaining" value={`${order.paymentBreakdown.remaining.toLocaleString()} EGP`} />
          {order.paymentBreakdown.method ? <InfoRow label="Payment method" value={order.paymentBreakdown.method} /> : null}
        </Section>
      ) : null}

      <Section title="Route">
        <InfoRow label="Pickup" value={order.pickup?.address ?? '—'} />
        <InfoRow label="Delivery" value={order.delivery?.address ?? '—'} />
        {order.distanceKm != null ? <InfoRow label="Distance" value={`${order.distanceKm} km`} /> : null}
      </Section>

      <Section title="Cargo">
        <InfoRow label="Type" value={formatCargoType(order.cargo?.type)} />
        <InfoRow label="Weight" value={`${order.cargo?.weight ?? 0} tons`} />
        {order.truckTypes?.length ? <InfoRow label="Required truck type" value={order.truckTypes.map(t => formatTruckType(t)).join(', ')} /> : null}
        {order.cargo?.description ? <InfoRow label="Description" value={order.cargo.description} /> : null}
        {order.loadingDate ? <InfoRow label="Loading date" value={new Date(order.loadingDate).toLocaleString()} /> : null}
        {order.numTrucks != null ? <InfoRow label="Number of trucks" value={String(order.numTrucks)} /> : null}
      </Section>

      <Section title="Parties">
        <InfoRow
          label="Client"
          value={order.client?.fullName ?? order.clientId ?? '—'}
          href={order.client?.id ? `/admin/users/${order.client.id}` : undefined}
        />
        {order.agent ? <InfoRow label="Agent" value={order.agent.fullName} href={`/admin/users/${order.agent.id}`} /> : null}
        {order.driverInfo ? (
          <InfoRow label="Driver" value={order.driverInfo.fullName} href={`/admin/users/${order.driverInfo.id}`} />
        ) : null}
      </Section>

      {order.truckInfo ? (
        <Section title="Truck">
          <InfoRow label="Truck code" value={order.truckInfo.truckCode ?? '—'} />
          <InfoRow label="Plate" value={order.truckInfo.plateNumber} />
          <InfoRow label="Type" value={formatTruckType(order.truckInfo.type)} />
          <InfoRow label="Capacity" value={`${order.truckInfo.capacity} tons`} />
          {order.truckInfo.owner ? <InfoRow label="Owner" value={order.truckInfo.owner.fullName} /> : null}
        </Section>
      ) : null}

      {order.notes ? (
        <Section title="Notes">
          <p className="py-2 text-sm text-admin-text">{order.notes}</p>
        </Section>
      ) : null}

      <Section title="Order Statement">
        {statement ? (
          <div className="space-y-2 py-2">
            <InfoRow label="Certified" value={statement.certified ? 'Yes' : 'No'} />
            <InfoRow label="Price" value={`${statement.price?.toLocaleString() ?? 0} EGP`} />
            <div className="pt-2 overflow-x-auto">
              <table className="w-full min-w-[320px] text-left text-xs">
                <thead className="text-admin-subtext">
                  <tr>
                    <th className="py-1 pr-2">Category</th>
                    <th className="py-1 pr-2">Direction</th>
                    <th className="py-1 pr-2">Amount</th>
                    <th className="py-1">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-admin-border/60">
                  {statement.entries.map((entry) => (
                    <tr key={entry.id}>
                      <td className="py-1 pr-2 text-admin-text">{entry.category}</td>
                      <td className="py-1 pr-2 capitalize text-admin-subtext">{entry.direction}</td>
                      <td className="py-1 pr-2 text-admin-text">{entry.amount.toLocaleString()} EGP</td>
                      <td className="py-1 capitalize text-admin-subtext">{entry.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-admin-subtext">
              {statementError ?? 'Certified per-order financial statement.'}
            </span>
            <button
              type="button"
              onClick={loadStatement}
              disabled={statementLoading}
              className="rounded-md border border-admin-border px-3 py-1.5 text-xs font-semibold text-admin-text hover:border-admin-accent"
            >
              {statementLoading ? 'Loading…' : 'Load statement'}
            </button>
          </div>
        )}
      </Section>

      {order.status === 'closed' && (order.ratings?.length ?? 0) > 0 ? (
        <Section title="Party Ratings">
          {order.ratings!.map((rating) => (
            <InfoRow
              key={rating.id}
              label={`${rating.ratedBy?.fullName ?? '—'} (${rating.subjectType})`}
              value={
                <span className="inline-flex flex-wrap items-center gap-1 text-admin-text">
                  <span className="inline-flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={`h-3.5 w-3.5 ${n <= rating.stars ? 'fill-amber-400 text-amber-400' : 'text-admin-border'}`}
                      />
                    ))}
                  </span>
                  {rating.comment ? <span className="text-admin-subtext">— {rating.comment}</span> : null}
                </span>
              }
            />
          ))}
        </Section>
      ) : null}

      <Modal
        open={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title="Assign Truck & Driver"
        size="lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => setShowAssignModal(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-admin-subtext hover:bg-admin-surface hover:text-admin-text"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAssign}
              disabled={!selectedTruckId || busy}
              className="rounded-md bg-admin-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              Assign
            </button>
          </>
        }
      >
        <div className="max-h-[28rem] space-y-3 overflow-y-auto pr-1">
          {/* Order criteria filter summary */}
          {order ? (
            <div className="flex flex-wrap items-center gap-2 rounded-lg bg-admin-bg p-2.5 text-xs font-medium">
              {order.cargo?.type ? (
                <span className="flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-1 text-amber-600">
                  <Package className="h-3 w-3" />
                  {formatCargoType(order.cargo.type)}
                </span>
              ) : null}
              {order.cargo?.weight ? (
                <span className="flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-1 text-amber-600">
                  <Layers className="h-3 w-3" />
                  ≥ {order.cargo.weight} tons
                </span>
              ) : null}
              {(order.truckTypes ?? []).length > 0 ? (
                <span className="flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-1 text-blue-600">
                  <TruckIcon className="h-3 w-3" />
                  {(order.truckTypes ?? []).map((tt) => formatTruckType(tt)).join(', ')}
                </span>
              ) : null}
              {order.transportType ? (
                <span className="flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 text-emerald-600">
                  <Globe className="h-3 w-3" />
                  {order.transportType === 'local' ? 'محلي (Local)' : 'دولي (International)'}
                </span>
              ) : null}
            </div>
          ) : null}

          {/* Role Filter Tabs */}
          <div className="flex items-center gap-1.5 rounded-lg bg-admin-bg p-1 text-xs font-medium">
            <button
              type="button"
              onClick={() => setRoleFilter('all')}
              className={`rounded-md px-3 py-1.5 transition ${
                roleFilter === 'all'
                  ? 'bg-admin-card text-admin-text font-semibold shadow-sm'
                  : 'text-admin-subtext hover:text-admin-text'
              }`}
            >
              الكل (All)
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter('agent')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition ${
                roleFilter === 'agent'
                  ? 'bg-blue-500/20 text-blue-600 font-bold shadow-sm'
                  : 'text-admin-subtext hover:text-admin-text'
              }`}
            >
              <Briefcase className="h-3 w-3" />
              الوكلاء (Agents)
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter('owner')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition ${
                roleFilter === 'owner'
                  ? 'bg-emerald-500/20 text-emerald-600 font-bold shadow-sm'
                  : 'text-admin-subtext hover:text-admin-text'
              }`}
            >
              <UserCheck className="h-3 w-3" />
              المالكون (Owners)
            </button>
          </div>

          {/* Truck Type Filter Pills */}
          {availableTruckTypes.length > 1 ? (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setTypeFilter('all')}
                className={`whitespace-nowrap rounded-full px-2.5 py-1 transition ${
                  typeFilter === 'all'
                    ? 'bg-admin-accent text-white font-medium'
                    : 'bg-admin-bg text-admin-subtext hover:bg-admin-surface'
                }`}
              >
                جميع الأنواع (All Types)
              </button>
              {availableTruckTypes.map((rawType) => {
                const active = typeFilter === rawType;
                return (
                  <button
                    key={rawType}
                    type="button"
                    onClick={() => setTypeFilter(active ? 'all' : rawType)}
                    className={`whitespace-nowrap rounded-full px-2.5 py-1 transition ${
                      active
                        ? 'bg-admin-accent text-white font-medium'
                        : 'bg-admin-bg text-admin-subtext hover:bg-admin-surface'
                    }`}
                  >
                    🚛 {formatTruckType(rawType)}
                  </button>
                );
              })}
            </div>
          ) : null}

          {/* Truck List grouped by Entity */}
          {entityGroups.length === 0 ? (
            <p className="py-4 text-center text-sm text-admin-subtext">No matching full trucks found.</p>
          ) : (
            entityGroups.map((group) => {
              const isCollapsed = collapsedEntities[group.id] ?? false;
              const isAgentGroup = group.role === 'agent';
              return (
                <div key={group.id} className="rounded-lg bg-admin-bg p-2.5 space-y-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCollapsedEntities((prev) => ({ ...prev, [group.id]: !isCollapsed }))
                    }
                    className="flex w-full items-center justify-between text-right text-sm font-semibold text-admin-text"
                  >
                    <div className="flex items-center gap-2">
                      <span>{group.name}</span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          isAgentGroup
                            ? 'bg-blue-500/10 text-blue-600'
                            : 'bg-emerald-500/10 text-emerald-600'
                        }`}
                      >
                        {isAgentGroup ? 'وكيل' : 'مالك'}
                      </span>
                      <span className="text-xs font-normal text-admin-subtext">
                        ({group.trucks.length} شاحنة)
                      </span>
                    </div>
                    {isCollapsed ? (
                      <ChevronDown className="h-4 w-4 text-admin-subtext" />
                    ) : (
                      <ChevronUp className="h-4 w-4 text-admin-subtext" />
                    )}
                  </button>

                  {!isCollapsed ? (
                    <div className="space-y-1.5 pt-1">
                      {group.trucks.map((truck) => {
                        const truckTypeLabel = formatTruckType(truck.type || truck.operationType);
                        const isSelected = selectedTruckId === truck.id;
                        return (
                          <label
                            key={truck.id}
                            className={`flex cursor-pointer items-center justify-between rounded-lg p-2.5 text-sm transition ${
                              isSelected
                              ? 'bg-admin-accent/10 border border-admin-accent text-admin-text font-medium'
                              : 'bg-admin-card hover:bg-admin-surface text-admin-text border border-admin-border'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{truck.plateNumber}</span>
                              {truckTypeLabel && truckTypeLabel !== '—' ? (
                                <span className="rounded bg-admin-surface px-1.5 py-0.5 text-[11px] font-medium text-admin-subtext">
                                  🚛 {truckTypeLabel}
                                </span>
                              ) : null}
                            </div>
                            <div className="text-xs text-admin-subtext">
                              {truck.capacity}t · السائق: {truck.assignedDriver?.fullName ?? 'غير معين'}
                            </div>
                            <div className="text-xs text-admin-subtext">
                              المالك: {truck.owner?.fullName ?? '—'} · الوكيل:{' '}
                              {truck.agent?.fullName ?? 'مباشر (بدون وكيل)'}
                            </div>
                          </div>
                          <input
                            type="radio"
                            name="truck"
                            checked={isSelected}
                            onChange={() => setSelectedTruckId(truck.id)}
                            className="h-4 w-4 accent-admin-accent"
                          />
                          </label>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })
          )}
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-admin-subtext">Price</label>
            <input
              type="number"
              value={assignPrice}
              onChange={(e) => setAssignPrice(e.target.value)}
              placeholder="5000"
              className="w-full rounded-md border border-admin-border bg-admin-card px-3 py-2 text-sm text-admin-text placeholder-admin-subtext focus:border-admin-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-admin-subtext">Admin fee</label>
            <input
              type="number"
              value={assignFee}
              onChange={(e) => setAssignFee(e.target.value)}
              placeholder="500"
              className="w-full rounded-md border border-admin-border bg-admin-card px-3 py-2 text-sm text-admin-text placeholder-admin-subtext focus:border-admin-accent focus:outline-none"
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={showFeeModal}
        onClose={() => setShowFeeModal(false)}
        title="Update Pricing"
        footer={
          <>
            <button
              type="button"
              onClick={() => setShowFeeModal(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-admin-subtext hover:bg-admin-surface hover:text-admin-text"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSetFee}
              disabled={busy}
              className="rounded-md bg-admin-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              Save
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-admin-subtext">Price</label>
            <input
              type="number"
              value={feePrice}
              onChange={(e) => setFeePrice(e.target.value)}
              className="w-full rounded-md border border-admin-border bg-admin-card px-3 py-2 text-sm text-admin-text placeholder-admin-subtext focus:border-admin-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-admin-subtext">Admin fee</label>
            <input
              type="number"
              value={feeFee}
              onChange={(e) => setFeeFee(e.target.value)}
              className="w-full rounded-md border border-admin-border bg-admin-card px-3 py-2 text-sm text-admin-text placeholder-admin-subtext focus:border-admin-accent focus:outline-none"
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Order"
        footer={
          <>
            <button
              type="button"
              onClick={() => setShowCancelModal(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-admin-subtext hover:bg-admin-surface hover:text-admin-text"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={busy}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50"
            >
              Cancel Order
            </button>
          </>
        }
      >
        <label className="mb-1 block text-xs font-medium text-admin-subtext">Reason</label>
        <textarea
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-admin-border bg-admin-card px-3 py-2 text-sm text-admin-text placeholder-admin-subtext focus:border-admin-accent focus:outline-none"
        />
      </Modal>

      <Modal
        open={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        title="Confirm Deposit"
        footer={
          <>
            <button
              type="button"
              onClick={() => setShowDepositModal(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-admin-subtext hover:bg-admin-surface hover:text-admin-text"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDeposit}
              disabled={busy}
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
            >
              Confirm
            </button>
          </>
        }
      >
        <label className="mb-1 block text-xs font-medium text-admin-subtext">Amount received</label>
        <input
          type="number"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          className="w-full rounded-md border border-admin-border bg-admin-card px-3 py-2 text-sm text-admin-text placeholder-admin-subtext focus:border-admin-accent focus:outline-none"
        />
      </Modal>

      <Modal
        open={showBalanceModal}
        onClose={() => setShowBalanceModal(false)}
        title="Confirm Balance"
        footer={
          <>
            <button
              type="button"
              onClick={() => setShowBalanceModal(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-admin-subtext hover:bg-admin-surface hover:text-admin-text"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmBalance}
              disabled={busy}
              className="rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500 disabled:opacity-50"
            >
              Confirm
            </button>
          </>
        }
      >
        <label className="mb-1 block text-xs font-medium text-admin-subtext">Amount received</label>
        <input
          type="number"
          value={balanceAmount}
          onChange={(e) => setBalanceAmount(e.target.value)}
          className="w-full rounded-md border border-admin-border bg-admin-card px-3 py-2 text-sm text-admin-text placeholder-admin-subtext focus:border-admin-accent focus:outline-none"
        />
      </Modal>
    </div>
  );
}
