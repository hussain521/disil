import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  adminCreatePaymentDetail,
  adminDeletePaymentDetail,
  adminGetPaymentDetails,
  adminUpdatePaymentDetail,
  type PaymentDetail,
} from '../../../lib/api/adminAccounts';
import { useAdminAuth } from '../../../lib/auth';
import DataTable, { DataTableColumn } from '../../../components/DataTable';
import Modal from '../../../components/Modal';

interface FormState {
  label: string;
  type: PaymentDetail['type'];
  accountName: string;
  accountNumber: string;
  bankName: string;
  notes: string;
  isDefault: boolean;
  isActive: boolean;
}

const EMPTY_FORM: FormState = {
  label: '',
  type: 'bank',
  accountName: '',
  accountNumber: '',
  bankName: '',
  notes: '',
  isDefault: false,
  isActive: true,
};

/** Ported from `app/(admin)/payment-details.tsx`: CRUD company payment methods with default/active toggles. */
export default function PaymentDetails() {
  const { t } = useTranslation();
  const { token } = useAdminAuth();
  const [list, setList] = useState<PaymentDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const TYPE_OPTIONS: { value: PaymentDetail['type']; label: string }[] = [
    { value: 'bank', label: t('admin.paymentDetails.types.bank') },
    { value: 'ewallet', label: t('admin.paymentDetails.types.ewallet') },
    { value: 'instapay', label: t('admin.paymentDetails.types.instapay') },
    { value: 'vodafone_cash', label: t('admin.paymentDetails.types.vodafone_cash') },
  ];

  const TYPE_LABEL: Record<PaymentDetail['type'], string> = {
    bank: t('admin.paymentDetails.types.bank'),
    ewallet: t('admin.paymentDetails.types.ewallet'),
    instapay: t('admin.paymentDetails.types.instapay'),
    vodafone_cash: t('admin.paymentDetails.types.vodafone_cash'),
  };

  const load = useCallback(async () => {
    if (!token) return;
    const { data } = await adminGetPaymentDetails(token);
    setList(data?.paymentDetails ?? []);
  }, [token]);

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError(null);
    setShowModal(true);
  };

  const openEdit = (detail: PaymentDetail) => {
    setEditingId(detail.id);
    setForm({
      label: detail.label,
      type: detail.type,
      accountName: detail.accountName ?? '',
      accountNumber: detail.accountNumber,
      bankName: detail.bankName ?? '',
      notes: detail.notes ?? '',
      isDefault: detail.isDefault,
      isActive: detail.isActive ?? true,
    });
    setError(null);
    setShowModal(true);
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) return;
    if (!form.label.trim()) {
      setError('Label is required');
      return;
    }
    if (form.type === 'bank' && !form.accountName.trim()) {
      setError('Account name is required for bank transfers');
      return;
    }
    if (!form.accountNumber.trim()) {
      setError('Account number is required');
      return;
    }

    setSaving(true);
    setError(null);
    const basePayload = {
      label: form.label.trim(),
      type: form.type,
      accountNumber: form.accountNumber.trim(),
      bankName: form.type === 'bank' && form.bankName.trim() ? form.bankName.trim() : undefined,
      notes: form.notes.trim() || undefined,
      isDefault: form.isDefault,
    };

    const result = editingId
      ? await adminUpdatePaymentDetail(token, editingId, {
          ...basePayload,
          accountName: form.type === 'bank' ? form.accountName.trim() : undefined,
          isActive: form.isActive,
        })
      : await adminCreatePaymentDetail(token, {
          ...basePayload,
          accountName: form.type === 'bank' ? form.accountName.trim() : undefined,
        });
    setSaving(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    await load();
    setShowModal(false);
  };

  const handleSetDefault = async (detail: PaymentDetail) => {
    if (!token || detail.isDefault) return;
    setBusyId(detail.id);
    const { error: err } = await adminUpdatePaymentDetail(token, detail.id, { isDefault: true });
    setBusyId(null);
    if (err) {
      setError(err);
      return;
    }
    await load();
  };

  const handleDelete = async (detail: PaymentDetail) => {
    if (!token) return;
    if (!window.confirm(t('admin.paymentDetails.confirmDelete', { label: detail.label }))) return;
    setBusyId(detail.id);
    const { error: err } = await adminDeletePaymentDetail(token, detail.id);
    setBusyId(null);
    if (err) {
      setError(err);
      return;
    }
    await load();
  };

  const columns: DataTableColumn<PaymentDetail>[] = [
    {
      key: 'label',
      header: t('admin.paymentDetails.columns.label'),
      render: (d) => (
        <div>
          <div className="font-medium">{d.label}</div>
          {d.accountName ? <div className="text-xs text-gray-400">{d.accountName}</div> : null}
        </div>
      ),
    },
    { key: 'type', header: t('admin.paymentDetails.columns.type'), render: (d) => TYPE_LABEL[d.type] },
    { key: 'accountNumber', header: t('admin.paymentDetails.columns.account'), render: (d) => <span className="font-mono">{d.accountNumber}</span> },
    { key: 'bankName', header: t('admin.paymentDetails.columns.bank'), render: (d) => d.bankName || '—' },
    {
      key: 'status',
      header: t('admin.paymentDetails.columns.status'),
      render: (d) => (
        <div className="flex flex-wrap gap-1.5">
          {d.isDefault ? (
            <span className="rounded-full border border-emerald-500 px-2 py-0.5 text-xs font-medium text-emerald-500">{t('admin.paymentDetails.defaultBadge')}</span>
          ) : null}
          {d.isActive === false ? (
            <span className="rounded-full border border-gray-400 px-2 py-0.5 text-xs font-medium text-gray-400">{t('admin.paymentDetails.inactiveBadge')}</span>
          ) : null}
        </div>
      ),
    },
    {
      key: 'actions',
      header: t('admin.paymentDetails.columns.actions'),
      render: (d) => (
        <div className="flex flex-wrap gap-2">
          {!d.isDefault ? (
            <button
              type="button"
              disabled={busyId === d.id}
              onClick={() => handleSetDefault(d)}
              className="rounded-md border border-emerald-500 px-2.5 py-1 text-xs font-semibold text-emerald-500 transition hover:bg-emerald-500/10 disabled:opacity-50"
            >
              {t('admin.paymentDetails.setDefault')}
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => openEdit(d)}
            className="rounded-md border border-sky-500 px-2.5 py-1 text-xs font-semibold text-sky-500 transition hover:bg-sky-500/10"
          >
            {t('common.edit')}
          </button>
          <button
            type="button"
            disabled={busyId === d.id}
            onClick={() => handleDelete(d)}
            className="rounded-md border border-red-500 px-2.5 py-1 text-xs font-semibold text-red-500 transition hover:bg-red-500/10 disabled:opacity-50"
          >
            {t('common.delete')}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-admin-text">{t('admin.paymentDetails.title')}</h1>
          <p className="mt-1 text-sm text-admin-subtext">{t('admin.paymentDetails.subtitle')}</p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="shrink-0 rounded-md bg-admin-accent px-3.5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          {t('admin.paymentDetails.addMethod')}
        </button>
      </div>

      <DataTable columns={columns} data={list} keyExtractor={(d) => d.id} loading={loading} emptyMessage={t('admin.paymentDetails.noMethods')} />

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editingId ? t('admin.paymentDetails.editMethod') : t('admin.paymentDetails.addMethod')} size="md">
        <form className="space-y-4" onSubmit={handleSave}>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-admin-text">{t('admin.paymentDetails.form.label')}</label>
            <input
              className="w-full rounded-md border border-admin-border bg-admin-card px-3 py-2 text-sm text-admin-text placeholder-admin-subtext focus:border-admin-accent focus:outline-none"
              value={form.label}
              onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
              placeholder={t('admin.paymentDetails.form.labelPlaceholder')}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-admin-text">{t('admin.paymentDetails.form.type')}</label>
            <div className="flex flex-wrap gap-2">
              {TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, type: opt.value, accountNumber: '', accountName: '', bankName: '' }))}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                    form.type === opt.value
                      ? 'border-admin-accent bg-admin-accent text-white'
                      : 'border-admin-border text-admin-subtext hover:border-admin-accent hover:text-admin-text'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {form.type === 'bank' ? (
            <>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-admin-text">{t('admin.paymentDetails.form.accountName')}</label>
                <input
                  className="w-full rounded-md border border-admin-border bg-admin-card px-3 py-2 text-sm text-admin-text placeholder-admin-subtext focus:border-admin-accent focus:outline-none"
                  value={form.accountName}
                  onChange={(e) => setForm((p) => ({ ...p, accountName: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-admin-text">{t('admin.paymentDetails.form.accountNumber')}</label>
                <input
                  className="w-full rounded-md border border-admin-border bg-admin-card px-3 py-2 text-sm text-admin-text placeholder-admin-subtext focus:border-admin-accent focus:outline-none"
                  value={form.accountNumber}
                  onChange={(e) => setForm((p) => ({ ...p, accountNumber: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-admin-text">{t('admin.paymentDetails.form.bankName')}</label>
                <input
                  className="w-full rounded-md border border-admin-border bg-admin-card px-3 py-2 text-sm text-admin-text placeholder-admin-subtext focus:border-admin-accent focus:outline-none"
                  value={form.bankName}
                  onChange={(e) => setForm((p) => ({ ...p, bankName: e.target.value }))}
                />
              </div>
            </>
          ) : null}

          {form.type === 'ewallet' || form.type === 'vodafone_cash' ? (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-admin-text">{t('admin.paymentDetails.form.phone')}</label>
              <input
                className="w-full rounded-md border border-admin-border bg-admin-card px-3 py-2 text-sm text-admin-text placeholder-admin-subtext focus:border-admin-accent focus:outline-none"
                value={form.accountNumber}
                onChange={(e) => setForm((p) => ({ ...p, accountNumber: e.target.value }))}
              />
            </div>
          ) : null}

          {form.type === 'instapay' ? (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-admin-text">{t('admin.paymentDetails.form.instapayId')}</label>
              <input
                className="w-full rounded-md border border-admin-border bg-admin-card px-3 py-2 text-sm text-admin-text placeholder-admin-subtext focus:border-admin-accent focus:outline-none"
                value={form.accountNumber}
                onChange={(e) => {
                  const v = e.target.value;
                  setForm((p) => ({ ...p, accountNumber: v === '' ? '' : v.startsWith('@') ? v : `@${v}` }));
                }}
              />
            </div>
          ) : null}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-admin-text">{t('admin.paymentDetails.form.notes')}</label>
            <textarea
              className="w-full rounded-md border border-admin-border bg-admin-card px-3 py-2 text-sm text-admin-text placeholder-admin-subtext focus:border-admin-accent focus:outline-none"
              rows={3}
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-admin-text">{t('admin.paymentDetails.form.isDefault')}</span>
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => setForm((p) => ({ ...p, isDefault: e.target.checked }))}
              className="h-5 w-5 accent-admin-accent"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-admin-text">{t('admin.paymentDetails.form.isActive')}</span>
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
              className="h-5 w-5 accent-admin-accent"
            />
          </div>

          {error ? <p className="text-sm text-red-500">{error}</p> : null}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-md bg-admin-accent px-3 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? t('common.saving') : t('common.save')}
          </button>
        </form>
      </Modal>
    </div>
  );
}
