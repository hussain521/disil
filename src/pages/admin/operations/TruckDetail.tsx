import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Modal from '../../../components/Modal';
import StatusBadge from '../../../components/StatusBadge';
import { useAdminAuth } from '../../../lib/auth';
import { getTrips, type Trip } from '../../../lib/api/trips';
import {
  adminApproveTruck,
  adminRejectTruck,
  formatPlateDisplay,
  getTruck,
  resolveAssetUrl,
  type Truck,
  type TruckVehicleDetails,
} from '../../../lib/api/adminOperations';
import { formatTruckType, formatHeadType, formatTrailerType, getCombinedTruckTypeLabel } from '../../../lib/truckTranslations';

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-1 sm:gap-4 py-1 text-xs sm:text-sm">
      <span className="text-admin-subtext">{label}</span>
      <span className="text-right font-medium text-admin-text break-all">{value == null || value === '' ? '—' : value}</span>
    </div>
  );
}

function formatDate(value?: string | null): string {
  if (!value) return '—';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '—';
  return parsed.toLocaleDateString();
}

function VehicleSection({
  title,
  vehicle,
  docApprovals,
  onSetDocStatus,
  canReview,
  rejectedDocuments,
}: {
  title: string;
  vehicle?: TruckVehicleDetails | null;
  docApprovals: Record<string, 'approved' | 'rejected'>;
  onSetDocStatus: (docKey: string, status: 'approved' | 'rejected') => void;
  canReview: boolean;
  rejectedDocuments: string[];
}) {
  const { t } = useTranslation();
  if (!vehicle) return null;
  const owner = vehicle.ownerDetails;
  const images = [
    { label: 'License Front', url: resolveAssetUrl(vehicle.licenseFrontPhoto) },
    { label: 'License Back', url: resolveAssetUrl(vehicle.licenseBackPhoto) },
    { label: 'Owner ID Front', url: resolveAssetUrl(owner?.idFrontPhoto) },
    { label: 'Owner ID Back', url: resolveAssetUrl(owner?.idBackPhoto) },
  ].filter((img): img is { label: string; url: string } => !!img.url);

  return (
    <div className="rounded-lg border border-admin-border bg-admin-card p-4">
      <h3 className="mb-2 text-sm font-bold text-admin-text">{title}</h3>
      <InfoRow label={t('admin.truckDetail.plateNumber')} value={formatPlateDisplay(vehicle.plateNumber)} />
      <InfoRow label={t('admin.truckDetail.brand')} value={vehicle.brand} />
      <InfoRow label={t('admin.truckDetail.model')} value={vehicle.model} />
      <InfoRow label={t('admin.truckDetail.color')} value={vehicle.color} />
      <InfoRow label={t('admin.truckDetail.axles')} value={vehicle.axles} />
      <InfoRow label={t('admin.truckDetail.length')} value={vehicle.length != null ? `${vehicle.length} m` : null} />
      <InfoRow label={t('admin.truckDetail.engineNumber')} value={vehicle.engineNumber} />
      <InfoRow label={t('admin.truckDetail.chassisNumber')} value={vehicle.chassisNumber} />
      <InfoRow label={t('admin.truckDetail.inspectionDate')} value={formatDate(vehicle.inspectionDate)} />
      <InfoRow label={t('admin.truckDetail.licenseStart')} value={formatDate(vehicle.licenseStartDate)} />
      <InfoRow label={t('admin.truckDetail.licenseEnd')} value={formatDate(vehicle.licenseEndDate)} />

      {owner ? (
        <div className="mt-3 border-t border-admin-border pt-3">
          <h4 className="mb-1 text-xs font-bold uppercase tracking-wide text-admin-subtext">{t('admin.truckDetail.ownerDetails')}</h4>
          <InfoRow label={t('admin.truckDetail.name')} value={owner.name} />
          <InfoRow label={t('admin.truckDetail.phone')} value={owner.phone} />
          <InfoRow label={t('admin.truckDetail.nationalId')} value={owner.nationalId} />
          <InfoRow label={t('admin.truckDetail.address')} value={owner.address} />
        </div>
      ) : null}

      {images.length > 0 ? (
        <div className="mt-3 border-t border-admin-border pt-3">
          <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-admin-subtext">{t('admin.truckDetail.documents')}</h4>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {images.map((img) => {
              const docKey = `${title}_${img.label}`;
              const isRejected = docApprovals[docKey] === 'rejected' || rejectedDocuments.includes(img.label);
              const isApproved = docApprovals[docKey] === 'approved';
              return (
                <div key={docKey} className="rounded-md border border-admin-border bg-admin-bg p-1.5">
                  <a href={img.url} target="_blank" rel="noreferrer">
                    <img src={img.url} alt={img.label} className="h-20 w-full rounded-sm object-cover" />
                  </a>
                  <p className="mt-1 truncate text-[11px] text-admin-subtext">{img.label}</p>
                  {canReview ? (
                    <div className="mt-1 flex gap-1">
                      <button
                        type="button"
                        onClick={() => onSetDocStatus(docKey, 'approved')}
                        className={`flex-1 rounded px-1 py-0.5 text-[10px] font-bold transition ${
                          isApproved ? 'bg-emerald-500 text-white' : 'bg-emerald-500/15 text-emerald-400'
                        }`}
                      >
                        {t('admin.orderDetail.approve')}
                      </button>
                      <button
                        type="button"
                        onClick={() => onSetDocStatus(docKey, 'rejected')}
                        className={`flex-1 rounded px-1 py-0.5 text-[10px] font-bold transition ${
                          isRejected ? 'bg-admin-accent text-white' : 'bg-admin-accent/15 text-admin-accent'
                        }`}
                      >
                        {t('admin.orderDetail.reject')}
                      </button>
                    </div>
                  ) : isRejected ? (
                    <span className="mt-1 inline-block rounded bg-admin-accent/15 px-1.5 py-0.5 text-[10px] font-bold text-admin-accent">
                      {t('status.rejected')}
                    </span>
                  ) : isApproved ? (
                    <span className="mt-1 inline-block rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                      {t('status.approved')}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function TruckDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { token } = useAdminAuth();
  const navigate = useNavigate();

  const [truck, setTruck] = useState<Truck | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [docApprovals, setDocApprovals] = useState<Record<string, 'approved' | 'rejected'>>({});
  const [reviewing, setReviewing] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const load = useCallback(async () => {
    if (!token || !id) return;
    const [truckRes, tripsRes] = await Promise.all([getTruck(token, id), getTrips(token, { truckId: id })]);
    setTruck(truckRes.data ?? null);
    setTrips(tripsRes.data?.trips ?? []);
    setLoading(false);
  }, [token, id]);

  useEffect(() => {
    setLoading(true);
    void load();
  }, [load]);

  const canReview = !!truck && ['pending_review', 'rejected'].includes(truck.approvalStatus ?? '');

  const setDocStatus = (docKey: string, status: 'approved' | 'rejected') => {
    setDocApprovals((prev) => ({ ...prev, [docKey]: status }));
  };

  const handleApprove = async () => {
    if (!token || !truck || reviewing) return;
    setReviewing(true);
    const { data, error } = await adminApproveTruck(token, truck.id);
    setReviewing(false);
    if (error) {
      window.alert(error);
      return;
    }
    window.alert(data?.message || 'Truck approved successfully');
    navigate('/admin/fleet');
  };

  const submitReject = async () => {
    if (!token || !truck || reviewing) return;
    const trimmed = rejectReason.trim();
    if (!trimmed) {
      window.alert('Rejection reason is required');
      return;
    }
    const rejectedDocLabels = Object.entries(docApprovals)
      .filter(([, status]) => status === 'rejected')
      .map(([key]) => key);
    setReviewing(true);
    const { data, error } = await adminRejectTruck(token, truck.id, trimmed, rejectedDocLabels, docApprovals);
    setReviewing(false);
    if (error) {
      window.alert(error);
      return;
    }
    setRejectOpen(false);
    window.alert(data?.message || 'Truck rejected successfully');
    navigate('/admin/fleet');
  };

  if (loading) {
    return <p className="text-center text-sm text-admin-subtext">{t('common.loading')}</p>;
  }

  if (!truck) {
    return (
      <div className="text-center">
        <p className="text-sm text-admin-subtext">{t('common.emptyMessage')}</p>
        <Link to="/admin/fleet" className="mt-2 inline-block text-sm font-semibold text-admin-accent hover:underline">
          {t('admin.truckDetail.backToFleet')}
        </Link>
      </div>
    );
  }

  const gallery = (truck.vehiclePhotos ?? []).map((url) => resolveAssetUrl(url)).filter((url): url is string => !!url);

  return (
    <div className="space-y-4 animation-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/admin/fleet" className="text-xs font-semibold text-admin-accent hover:underline">
            {t('admin.truckDetail.backToFleet')}
          </Link>
          <h1 className="mt-1 text-lg sm:text-xl font-bold text-admin-text">{formatPlateDisplay(truck.plateNumber)}</h1>
        </div>
        <StatusBadge status={truck.approvalStatus ?? truck.status} />
      </div>

      <div className="rounded-lg border border-admin-border bg-admin-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-admin-text">
              {formatTruckType(truck.operationType ?? truck.bodyType ?? truck.type)} · {truck.capacity} {t('common.ton')}
            </p>
            {truck.truckCode ? <p className="text-xs text-admin-subtext">{truck.truckCode}</p> : null}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {truck.headType ? (
              <span className="rounded-full bg-admin-accent/10 px-2.5 py-1 text-xs font-semibold text-admin-accent">
                {formatHeadType(truck.headType)}
              </span>
            ) : null}
            {truck.trailerType ? (
              <span className="rounded-full bg-admin-accent/10 px-2.5 py-1 text-xs font-semibold text-admin-accent">
                {formatTrailerType(truck.trailerType)}
              </span>
            ) : null}
            {getCombinedTruckTypeLabel(truck.headType, truck.trailerType) ? (
              <span className="rounded-full bg-admin-accent/10 px-2.5 py-1 text-xs font-semibold text-admin-accent">
                {getCombinedTruckTypeLabel(truck.headType, truck.trailerType)}
              </span>
            ) : null}
          </div>
        </div>

        {truck.activeTrip ? (
          <div className="mt-3 rounded-md bg-admin-accent/10 p-3">
            <p className="text-sm font-bold text-admin-text">{truck.activeTrip.workStatusLabel || truck.activeTrip.workStatus}</p>
            <InfoRow label={t('admin.orders.columns.orderCode')} value={`#${truck.activeTrip.orderCode}`} />
            {truck.activeTrip.pickupAddress ? <InfoRow label={t('company.pickup')} value={truck.activeTrip.pickupAddress} /> : null}
            {truck.activeTrip.deliveryAddress ? <InfoRow label={t('company.delivery')} value={truck.activeTrip.deliveryAddress} /> : null}
            <Link
              to={`/admin/orders/${truck.activeTrip.orderId}`}
              className="mt-2 inline-block text-xs font-semibold text-admin-accent hover:underline"
            >
              {t('admin.truckDetail.viewOrderDetails')}
            </Link>
          </div>
        ) : null}

        <div className="mt-3 border-t border-admin-border pt-3">
          <InfoRow label={t('admin.truckDetail.driver')} value={truck.assignedDriver?.fullName} />
          <InfoRow label={t('admin.truckDetail.phone')} value={truck.assignedDriver?.phone} />
          <InfoRow label={t('admin.truckDetail.truckOwner')} value={truck.owner?.fullName} />
          <InfoRow label={t('admin.truckDetail.agent')} value={truck.agent?.fullName} />
          <InfoRow label={t('admin.truckDetail.notes')} value={truck.notes} />
        </div>

        {truck.approvalStatus === 'rejected' && truck.approvalRejectionReason ? (
          <div className="mt-3 rounded-md border border-admin-accent/40 bg-admin-accent/10 p-3">
            <p className="text-sm font-bold text-admin-accent">{t('admin.truckDetail.registrationRejected')}</p>
            <p className="mt-1 text-sm text-admin-text">{t('admin.truckDetail.reasonLabel')} {truck.approvalRejectionReason}</p>
            {truck.rejectedDocuments && truck.rejectedDocuments.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {truck.rejectedDocuments.map((doc) => (
                  <span key={doc} className="rounded-full border border-admin-accent/40 px-2 py-0.5 text-[11px] text-admin-accent">
                    {doc}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {gallery.length > 0 ? (
        <div className="rounded-lg border border-admin-border bg-admin-card p-4">
          <h3 className="mb-2 text-sm font-bold text-admin-text">{t('admin.truckDetail.vehiclePhotos')}</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {gallery.map((url, index) => {
              const docKey = `truck_photo_${index + 1}`;
              const label = `Truck Photo #${index + 1}`;
              const isRejected = docApprovals[docKey] === 'rejected' || (truck.rejectedDocuments ?? []).includes(label);
              const isApproved = docApprovals[docKey] === 'approved';

              return (
                <div key={url} className="rounded-md bg-admin-bg p-1.5">
                  <a href={url} target="_blank" rel="noreferrer">
                    <img src={url} alt={`Truck ${index + 1}`} className="h-20 w-full rounded-sm object-cover" />
                  </a>
                  <p className="mt-1 truncate text-[11px] text-admin-subtext">Photo #{index + 1}</p>
                  {canReview ? (
                    <div className="mt-1 flex gap-1">
                      <button
                        type="button"
                        onClick={() => setDocStatus(docKey, 'approved')}
                        className={`flex-1 rounded px-1 py-0.5 text-[10px] font-bold transition ${
                          isApproved ? 'bg-emerald-500 text-white' : 'bg-emerald-500/15 text-emerald-400'
                        }`}
                      >
                        {t('admin.orderDetail.approve')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDocStatus(docKey, 'rejected')}
                        className={`flex-1 rounded px-1 py-0.5 text-[10px] font-bold transition ${
                          isRejected ? 'bg-admin-accent text-white' : 'bg-admin-accent/15 text-admin-accent'
                        }`}
                      >
                        {t('admin.orderDetail.reject')}
                      </button>
                    </div>
                  ) : isRejected ? (
                    <span className="mt-1 inline-block rounded bg-admin-accent/15 px-1.5 py-0.5 text-[10px] font-bold text-admin-accent">
                      {t('status.rejected')}
                    </span>
                  ) : isApproved ? (
                    <span className="mt-1 inline-block rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                      {t('status.approved')}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      <VehicleSection
        title={t('admin.truckDetail.tractorDetails')}
        vehicle={truck.tractor}
        docApprovals={docApprovals}
        onSetDocStatus={setDocStatus}
        canReview={canReview}
        rejectedDocuments={truck.rejectedDocuments ?? []}
      />
      <VehicleSection
        title={t('admin.truckDetail.trailerDetails')}
        vehicle={truck.trailer}
        docApprovals={docApprovals}
        onSetDocStatus={setDocStatus}
        canReview={canReview}
        rejectedDocuments={truck.rejectedDocuments ?? []}
      />

      <div className="rounded-lg border border-admin-border bg-admin-card p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-admin-text">{t('admin.truckDetail.tripHistory')}</h3>
          <span className="text-xs text-admin-subtext">{trips.length}</span>
        </div>
        {trips.length === 0 ? (
          <p className="mt-2 text-sm text-admin-subtext">{t('admin.truckDetail.noTrips')}</p>
        ) : (
          <ul className="mt-2 divide-y divide-admin-border">
            {trips.slice(0, 15).map((trip) => (
              <li key={trip.id} className="py-2">
                <Link to={`/admin/orders/${trip.order?.id ?? trip.orderId}`} className="block hover:opacity-80">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-admin-text">
                      #{(trip.order?.id ?? trip.orderId).slice(-8).toUpperCase()}
                    </span>
                    <StatusBadge status={trip.status} />
                  </div>
                  <p className="mt-1 truncate text-xs text-admin-subtext">
                    {trip.order?.pickup.address ?? '—'} → {trip.order?.delivery.address ?? '—'}
                  </p>
                  <p className="mt-0.5 text-[11px] text-admin-subtext">{formatDate(trip.updatedAt ?? trip.createdAt)}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {canReview ? (
        <div className="rounded-lg border border-admin-border bg-admin-card p-4">
          <h3 className="text-sm font-bold text-admin-text">{t('admin.truckDetail.truckReview')}</h3>
          <p className="mt-1 text-sm text-admin-subtext">{t('admin.truckDetail.reviewPrompt')}</p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              disabled={reviewing}
              onClick={() => setRejectOpen(true)}
              className="flex-1 rounded-md border-2 border-admin-accent px-3 py-2 text-sm font-bold text-admin-accent transition disabled:opacity-60"
            >
              {t('admin.truckDetail.rejectTruck')}
            </button>
            <button
              type="button"
              disabled={reviewing}
              onClick={() => void handleApprove()}
              className="flex-[1.4] rounded-md bg-emerald-500 px-3 py-2 text-sm font-bold text-white transition disabled:opacity-60"
            >
              {t('admin.truckDetail.approveTruck')}
            </button>
          </div>
        </div>
      ) : null}

      <Modal
        open={rejectOpen}
        onClose={() => !reviewing && setRejectOpen(false)}
        title={t('admin.truckDetail.rejectModalTitle')}
        footer={
          <>
            <button
              type="button"
              disabled={reviewing}
              onClick={() => setRejectOpen(false)}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-admin-subtext hover:bg-admin-surface hover:text-admin-text"
            >
              {t('common.cancel')}
            </button>
            <button
              type="button"
              disabled={reviewing}
              onClick={() => void submitReject()}
              className="rounded-md bg-admin-accent px-3 py-1.5 text-sm font-semibold text-white hover:bg-admin-accent/90"
            >
              {t('common.reject', { defaultValue: 'Reject' })}
            </button>
          </>
        }
      >
        <label className="block text-sm font-medium text-admin-text">{t('admin.truckDetail.rejectReason')}</label>
        <textarea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          rows={4}
          placeholder={t('admin.truckDetail.rejectPlaceholder')}
          className="mt-1.5 w-full rounded-md border border-admin-border bg-admin-bg px-3 py-2 text-sm text-admin-text focus:border-admin-accent focus:outline-none"
        />
      </Modal>
    </div>
  );
}
