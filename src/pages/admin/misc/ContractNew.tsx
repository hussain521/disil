import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AdminUserLite,
  ContractCadence,
  ContractServiceCategory,
  adminGetUsers,
  createContract,
} from '../../../lib/api/adminMisc';
import { useAdminAuth } from '../../../lib/auth';
import Modal from '../../../components/Modal';

const CADENCE_KEYS: ContractCadence[] = ['daily', 'weekly', 'biweekly', 'monthly', 'on_demand'];
const CATEGORY_KEYS: ContractServiceCategory[] = ['domestic', 'international', 'fuel'];

function ChipButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
        active
          ? 'border-admin-accent bg-admin-accent text-white shadow-sm'
          : 'border-admin-border bg-admin-card text-admin-subtext hover:border-admin-accent hover:text-admin-accent'
      }`}
    >
      {children}
    </button>
  );
}

const inputClass =
  'w-full rounded-md border border-admin-border bg-admin-bg px-3 py-2 text-sm text-admin-text placeholder:text-admin-subtext focus:border-admin-accent focus:outline-none';
const labelClass = 'mb-1.5 block text-sm font-medium text-admin-text';

/** New contract form + client picker modal. Ported from `app/(admin)/contract/new.tsx`. */
export default function ContractNew() {
  const { t } = useTranslation();
  const { token } = useAdminAuth();
  const navigate = useNavigate();

  const [clients, setClients] = useState<AdminUserLite[]>([]);
  const [clientPickerOpen, setClientPickerOpen] = useState(false);
  const [clientId, setClientId] = useState('');
  const [clientLabel, setClientLabel] = useState('');

  const [title, setTitle] = useState('');
  const [rate, setRate] = useState('');
  const [cadence, setCadence] = useState<ContractCadence>('weekly');
  const [serviceCategory, setServiceCategory] = useState<ContractServiceCategory>('domestic');
  const [validFrom, setValidFrom] = useState(new Date().toISOString().slice(0, 10));
  const [validTo, setValidTo] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!token) return;
      const { data } = await adminGetUsers(token, { role: 'client', limit: 200 });
      setClients(data?.users ?? []);
    })();
  }, [token]);

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!clientId || !title || !rate || !validFrom || !validTo) {
      setError(t('admin.contractNew.validationError'));
      return;
    }
    setSaving(true);
    setError(null);
    const { error: err } = await createContract(token, {
      clientId,
      title,
      rate: Number(rate),
      cadence,
      serviceCategory,
      validFrom: new Date(validFrom).toISOString(),
      validTo: new Date(validTo).toISOString(),
      pickup: pickupAddress ? { address: pickupAddress } : {},
      dropoff: dropoffAddress ? { address: dropoffAddress } : {},
      notes: notes || null,
    });
    setSaving(false);
    if (err) {
      setError(err);
      return;
    }
    navigate('/admin/contracts');
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-admin-text">{t('admin.contractNew.title')}</h1>
        <p className="mt-1 text-sm text-admin-subtext">{t('admin.contractNew.subtitle')}</p>
      </div>

      <form onSubmit={onSave} className="space-y-4 rounded-lg border border-admin-border bg-admin-card p-5">
        <div>
          <label className={labelClass}>{t('admin.contractNew.client')}</label>
          <button
            type="button"
            onClick={() => setClientPickerOpen(true)}
            className={`${inputClass} text-left rtl:text-right ${clientLabel ? '' : 'text-admin-subtext'}`}
          >
            {clientLabel || t('admin.contractNew.selectClient')}
          </button>
        </div>

        <div>
          <label className={labelClass}>{t('admin.contractNew.contractTitle')}</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder={t('admin.contractNew.contractTitlePlaceholder')} />
        </div>

        <div>
          <label className={labelClass}>{t('admin.contractNew.rate')}</label>
          <input
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            type="number"
            min="0"
            className={inputClass}
            placeholder="0"
          />
        </div>

        <div>
          <label className={labelClass}>{t('admin.contractNew.serviceCategory')}</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_KEYS.map((k) => (
              <ChipButton key={k} active={serviceCategory === k} onClick={() => setServiceCategory(k)}>
                {t(`admin.contractNew.categories.${k}`, { defaultValue: k })}
              </ChipButton>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass}>{t('admin.contractNew.cadence')}</label>
          <div className="flex flex-wrap gap-2">
            {CADENCE_KEYS.map((k) => (
              <ChipButton key={k} active={cadence === k} onClick={() => setCadence(k)}>
                {t(`admin.contracts.cadences.${k}`, { defaultValue: k })}
              </ChipButton>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>{t('admin.contractNew.validFrom')}</label>
            <input type="date" value={validFrom} onChange={(e) => setValidFrom(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{t('admin.contractNew.validTo')}</label>
            <input type="date" value={validTo} onChange={(e) => setValidTo(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>{t('admin.contractNew.pickupAddress')}</label>
          <input value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} className={inputClass} placeholder={t('admin.contractNew.pickupAddressPlaceholder')} />
        </div>

        <div>
          <label className={labelClass}>{t('admin.contractNew.dropoffAddress')}</label>
          <input value={dropoffAddress} onChange={(e) => setDropoffAddress(e.target.value)} className={inputClass} placeholder={t('admin.contractNew.dropoffAddressPlaceholder')} />
        </div>

        <div>
          <label className={labelClass}>{t('admin.contractNew.notes')}</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className={`${inputClass} h-20 resize-none`} />
        </div>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-md bg-admin-accent px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-admin-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? t('common.saving') : t('admin.contractNew.saveContract')}
        </button>
      </form>

      <Modal open={clientPickerOpen} onClose={() => setClientPickerOpen(false)} title={t('admin.contractNew.selectClientTitle')} size="sm">
        <div className="max-h-96 overflow-y-auto">
          {clients.length === 0 ? (
            <p className="py-6 text-center text-sm text-admin-subtext">{t('admin.contractNew.noClients')}</p>
          ) : (
            clients.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setClientId(c.id);
                  setClientLabel(c.fullName);
                  setClientPickerOpen(false);
                }}
                className="block w-full border-b border-admin-border px-1 py-2.5 text-left rtl:text-right text-sm text-admin-text last:border-0 hover:text-admin-accent"
              >
                {c.fullName}
                <span className="mx-2 text-xs text-admin-subtext">{c.phone}</span>
              </button>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
}
