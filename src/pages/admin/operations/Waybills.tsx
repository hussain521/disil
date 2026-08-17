import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAdminAuth } from '../../../lib/auth';
import { getTrips, type Trip } from '../../../lib/api/trips';
import { useSocket } from '../../../lib/socket';
import {
  adminApproveWaybill,
  adminSetWaybillDeliveredToCompany,
  adminSetWaybillDeliveredToDiziel,
  formatPlateDisplay,
  requestTripWaybill,
  resolveAssetUrl,
} from '../../../lib/api/adminOperations';

function formatDate(value?: string | null): string {
  if (!value) return '—';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '—';
  return parsed.toLocaleDateString();
}

function tripStageLabel(status?: string | null): string {
  const map: Record<string, string> = {
    pending: 'Shipment Accepted',
    en_route_to_pickup: 'En Route to Pickup',
    at_pickup: 'At Loading Point',
    loaded: 'Loaded',
    in_transit: 'In Transit to Delivery',
    at_delivery: 'At Unloading Point',
    completed: 'Shipment Finished',
  };
  return map[status || ''] || status || '—';
}

function waybillStatusLabel(status?: string | null): string {
  const map: Record<string, string> = {
    received_from_client: 'Waybill Received',
    signed_at_unloading: 'Waybill Signed',
    delivered_to_client: 'Delivered to Customer',
    delivered_to_diziel: 'Delivered to Diziel',
    unloaded_shortage: 'Shortage Reported',
    unloaded_signed_match: 'Signed (legacy)',
    delivered_to_company: 'Delivered to Company',
  };
  return map[status || ''] || status || '—';
}

export default function Waybills() {
  const { t } = useTranslation();
  const { token } = useAdminAuth();
  const { socket } = useSocket(token);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] = useState<string | null>(null);
  const [deliveringId, setDeliveringId] = useState<string | null>(null);
  const [companyDeliveringId, setCompanyDeliveringId] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    const [activeRes, completedRes] = await Promise.all([
      getTrips(token, {}),
      getTrips(token, { status: 'completed' }),
    ]);
    const merged = new Map<string, Trip>();
    for (const trip of [...(activeRes.data?.trips ?? []), ...(completedRes.data?.trips ?? [])]) {
      merged.set(trip.id, trip);
    }
    setTrips(Array.from(merged.values()).sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || '')));
    setLoading(false);
  }, [token]);

  useEffect(() => {
    setLoading(true);
    void load();
  }, [load]);

  useEffect(() => {
    if (!socket) return;
    const refresh = () => {
      void load();
    };
    socket.on('waybill_status_updated', refresh);
    socket.on('waybill_approval_requested', refresh);
    socket.on('waybill_approval_decided', refresh);
    socket.on('notification:new', refresh);
    return () => {
      socket.off('waybill_status_updated', refresh);
      socket.off('waybill_approval_requested', refresh);
      socket.off('waybill_approval_decided', refresh);
      socket.off('notification:new', refresh);
    };
  }, [socket, load]);

  const pendingApprovals = useMemo(
    () => trips.filter((trip) => trip.waybillApprovalStatus === 'pending'),
    [trips],
  );

  const handleRequest = async (trip: Trip) => {
    if (!token) return;
    setRequestingId(trip.id);
    const { data, error } = await requestTripWaybill(token, trip.id);
    setRequestingId(null);
    if (error || !data) {
      window.alert(error ?? 'Failed');
      return;
    }
    setTrips((prev) => prev.map((item) => (item.id === trip.id ? data : item)));
  };

  const handleDeliveredToDiziel = async (trip: Trip) => {
    if (!token) return;
    setDeliveringId(trip.id);
    const { error } = await adminSetWaybillDeliveredToDiziel(token, trip.id);
    setDeliveringId(null);
    if (error) {
      window.alert(error);
      return;
    }
    setTrips((prev) =>
      prev.map((item) => (item.id === trip.id ? { ...item, waybillDriverStatus: 'delivered_to_diziel' } : item)),
    );
  };

  const handleDeliveredToCompany = async (trip: Trip) => {
    if (!token) return;
    setCompanyDeliveringId(trip.id);
    const { error } = await adminSetWaybillDeliveredToCompany(token, trip.id);
    setCompanyDeliveringId(null);
    if (error) {
      window.alert(error);
      return;
    }
    setTrips((prev) =>
      prev.map((item) => (item.id === trip.id ? { ...item, waybillDriverStatus: 'delivered_to_company' } : item)),
    );
  };

  const handleApproval = async (trip: Trip, decision: 'approve' | 'reject') => {
    if (!token) return;
    setApprovingId(trip.id);
    const { data, error } = await adminApproveWaybill(token, trip.id, decision);
    setApprovingId(null);
    if (error || !data) {
      window.alert(error ?? 'Failed');
      return;
    }
    setTrips((prev) =>
      prev.map((item) =>
        item.id === trip.id
          ? {
              ...item,
              waybillApprovalStatus: data.waybillApprovalStatus as Trip['waybillApprovalStatus'],
              waybillDriverStatus: data.waybillDriverStatus as Trip['waybillDriverStatus'],
            }
          : item,
      ),
    );
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-admin-text">{t('admin.waybills.title')}</h1>
      <p className="mt-1 text-sm text-admin-subtext">
        {t('admin.waybills.subtitle')}
      </p>

      {pendingApprovals.length > 0 ? (
        <div className="mt-4 rounded-lg bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
          {t('admin.waybills.pendingActionsNotice', { count: pendingApprovals.length })}
        </div>
      ) : null}

      {loading ? (
        <p className="mt-8 text-center text-sm text-admin-subtext">{t('common.loading')}</p>
      ) : trips.length === 0 ? (
        <p className="mt-8 text-center text-sm text-admin-subtext">{t('admin.waybills.noTrips')}</p>
      ) : (
        <div className="mt-4 space-y-3">
          {trips.map((trip) => {
            const requested = Boolean(trip.waybillRequested);
            const received = Boolean(trip.waybillReceived);
            const fileUrl = resolveAssetUrl(trip.waybillFileUrl);
            const statusLabel = received
              ? t('admin.waybills.statusReceived')
              : requested
              ? t('admin.waybills.statusRequested')
              : t('admin.waybills.statusPendingRequest');
            const statusColor = received
              ? 'text-emerald-400 bg-emerald-400/10'
              : requested
              ? 'text-amber-400 bg-amber-400/10'
              : 'text-sky-400 bg-sky-400/10';
            const needsApproval = trip.waybillApprovalStatus === 'pending';

            return (
              <div key={trip.id} className="rounded-lg bg-admin-card p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Link
                      to={`/admin/orders/${trip.order?.id ?? trip.orderId}`}
                      className="text-sm font-bold text-admin-text hover:underline"
                    >
                      #{trip.order?.orderCode || (trip.order?.id ?? trip.orderId)?.slice(-8).toUpperCase()}
                    </Link>
                    <p className="mt-1 text-xs text-admin-subtext">{trip.order?.pickup?.address ?? '—'}</p>
                    <p className="text-xs text-admin-subtext">{trip.order?.delivery?.address ?? '—'}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusColor}`}>{statusLabel}</span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-admin-subtext sm:grid-cols-3">
                  <p>{t('admin.waybills.tripStage')} {t(`admin.waybills.stages.${trip.status}`, { defaultValue: tripStageLabel(trip.status) })}</p>
                  <p>{t('admin.waybills.waybill')} {trip.waybillDriverStatus ? t(`admin.waybills.driverStatuses.${trip.waybillDriverStatus}`, { defaultValue: waybillStatusLabel(trip.waybillDriverStatus) }) : '—'}</p>
                  <p>{t('admin.waybills.driver')} {trip.driver?.fullName ?? '—'}</p>
                  <p>{t('admin.waybills.truck')} {formatPlateDisplay(trip.truck?.plateNumber)}</p>
                  <p>{t('admin.waybills.completed')} {formatDate(trip.completedAt)}</p>
                  <p>{t('admin.waybills.approval')} {trip.waybillApprovalStatus ? t(`status.${trip.waybillApprovalStatus}`, { defaultValue: trip.waybillApprovalStatus }) : '—'}</p>
                  {trip.waybillRecipientType ? <p>{t('admin.waybills.recipient')} {trip.waybillRecipientType}</p> : null}
                  {trip.waybillDeliveryNotes ? <p className="sm:col-span-3">{t('admin.waybills.notes')} {trip.waybillDeliveryNotes}</p> : null}
                  {Number(trip.waybillShortageQty || 0) > 0 ? (
                    <p className="sm:col-span-3">{t('admin.waybills.shortageQty')} {trip.waybillShortageQty}</p>
                  ) : null}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {needsApproval ? (
                    <>
                      <button
                        type="button"
                        disabled={approvingId === trip.id}
                        onClick={() => void handleApproval(trip, 'approve')}
                        className="rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white transition disabled:opacity-60"
                      >
                        {approvingId === trip.id ? t('common.saving') : t('admin.orderDetail.approve')}
                      </button>
                      <button
                        type="button"
                        disabled={approvingId === trip.id}
                        onClick={() => void handleApproval(trip, 'reject')}
                        className="rounded-md bg-red-500/90 px-3 py-1.5 text-xs font-bold text-white transition disabled:opacity-60"
                      >
                        {t('admin.orderDetail.reject')}
                      </button>
                    </>
                  ) : null}

                  {trip.status === 'completed' && !requested ? (
                    <button
                      type="button"
                      disabled={requestingId === trip.id}
                      onClick={() => void handleRequest(trip)}
                      className="rounded-md bg-amber-500 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-amber-600 disabled:opacity-60"
                    >
                      {requestingId === trip.id ? t('common.loading') : t('admin.waybills.requestUpload')}
                    </button>
                  ) : null}

                  {received && fileUrl ? (
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-md bg-sky-500/15 px-3 py-1.5 text-xs font-bold text-sky-500 hover:bg-sky-500/25"
                    >
                      {t('admin.waybills.openFile')}
                    </a>
                  ) : null}

                  {trip.waybillDriverStatus !== 'delivered_to_diziel' &&
                  trip.waybillDriverStatus !== 'delivered_to_company' ? (
                    <button
                      type="button"
                      disabled={deliveringId === trip.id}
                      onClick={() => void handleDeliveredToDiziel(trip)}
                      className="rounded-md bg-amber-500 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-amber-600 disabled:opacity-60"
                    >
                      {deliveringId === trip.id ? t('common.saving') : t('admin.waybills.markDeliveredToDiziel')}
                    </button>
                  ) : null}

                  {trip.waybillDriverStatus === 'delivered_to_diziel' ? (
                    <button
                      type="button"
                      disabled={companyDeliveringId === trip.id}
                      onClick={() => void handleDeliveredToCompany(trip)}
                      className="rounded-md bg-white/10 px-3 py-1.5 text-xs font-bold text-admin-text transition disabled:opacity-60"
                    >
                      {companyDeliveringId === trip.id ? t('common.saving') : t('admin.waybills.markDeliveredToCompany')}
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
