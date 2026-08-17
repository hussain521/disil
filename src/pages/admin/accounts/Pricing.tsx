import { useCallback, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  getPricingTiers,
  updatePricingConfig,
  updatePricingTiers,
  type PricingTier,
  type PricingTiersResponse,
} from '../../../lib/api/adminAccounts';
import { useAdminAuth } from '../../../lib/auth';

interface EditableTier {
  upToKm: string;
  pricePerKm: string;
  weight: string;
  label: string;
}

function tiersToEditable(list: PricingTier[]): EditableTier[] {
  return list.map((t) => ({
    upToKm: String(t.upToKm),
    pricePerKm: String(t.pricePerKm),
    weight: String(t.weight ?? 0),
    label: t.label || '',
  }));
}

function editableToTiers(list: EditableTier[]): { tiers?: PricingTier[]; error?: string } {
  const out: PricingTier[] = [];
  for (let i = 0; i < list.length; i++) {
    const row = list[i];
    const upToKm = Number(row.upToKm);
    const pricePerKm = Number(row.pricePerKm);
    const weight = Number(row.weight || 0);
    if (!Number.isFinite(upToKm) || upToKm <= 0) return { error: `Row ${i + 1}: invalid km` };
    if (!Number.isFinite(pricePerKm) || pricePerKm < 0) return { error: `Row ${i + 1}: invalid price/km` };
    if (!Number.isFinite(weight) || weight < 0) return { error: `Row ${i + 1}: invalid weight` };
    out.push({ upToKm, pricePerKm, weight, label: row.label.trim() });
  }
  out.sort((a, b) => (a.weight ?? 0) - (b.weight ?? 0) || a.upToKm - b.upToKm);
  return { tiers: out };
}

/** Ported from `app/(admin)/pricing.tsx`: editable km/weight pricing tier tables (with/without VAT) + Diziel margin/VAT config. */
export default function Pricing() {
  const { t } = useTranslation();
  const { token } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [savingTiers, setSavingTiers] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [withVAT, setWithVAT] = useState<EditableTier[]>([]);
  const [withoutVAT, setWithoutVAT] = useState<EditableTier[]>([]);
  const [dizielMarginPct, setDizielMarginPct] = useState('5');
  const [vatPct, setVatPct] = useState('14');
  const [tiersError, setTiersError] = useState<string | null>(null);
  const [tiersMessage, setTiersMessage] = useState<string | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);
  const [configMessage, setConfigMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    const { data, error } = await getPricingTiers(token);
    if (error) {
      setTiersError(error);
      return;
    }
    const res = data as PricingTiersResponse;
    setWithVAT(tiersToEditable(res.withVAT));
    setWithoutVAT(tiersToEditable(res.withoutVAT));
    setDizielMarginPct(String(res.config.dizielMarginPct));
    setVatPct(String(res.config.vatPct));
  }, [token]);

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  const addRow = (which: 'with' | 'without') => {
    const setter = which === 'with' ? setWithVAT : setWithoutVAT;
    setter((prev) => [...prev, { upToKm: '', pricePerKm: '', weight: '0', label: '' }]);
  };

  const removeRow = (which: 'with' | 'without', index: number) => {
    const setter = which === 'with' ? setWithVAT : setWithoutVAT;
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const updateRow = (which: 'with' | 'without', index: number, key: keyof EditableTier, value: string) => {
    const setter = which === 'with' ? setWithVAT : setWithoutVAT;
    setter((prev) => prev.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  };

  const saveTiers = async () => {
    if (!token) return;
    setTiersMessage(null);
    const a = editableToTiers(withVAT);
    if (a.error) {
      setTiersError(`With VAT: ${a.error}`);
      return;
    }
    const b = editableToTiers(withoutVAT);
    if (b.error) {
      setTiersError(`Without VAT: ${b.error}`);
      return;
    }

    setTiersError(null);
    setSavingTiers(true);
    const { data, error } = await updatePricingTiers(token, { withVAT: a.tiers, withoutVAT: b.tiers });
    setSavingTiers(false);
    if (error) {
      setTiersError(error);
      return;
    }
    if (data) {
      setWithVAT(tiersToEditable(data.withVAT));
      setWithoutVAT(tiersToEditable(data.withoutVAT));
      setTiersMessage('Pricing tiers saved');
    }
  };

  const saveConfig = async () => {
    if (!token) return;
    setConfigMessage(null);
    const margin = Number(dizielMarginPct);
    const vat = Number(vatPct);
    if (!Number.isFinite(margin) || margin < 0 || margin > 100) {
      setConfigError('Diziel commission must be between 0 and 100');
      return;
    }
    if (!Number.isFinite(vat) || vat < 0 || vat > 100) {
      setConfigError('VAT must be between 0 and 100');
      return;
    }
    setConfigError(null);
    setSavingConfig(true);
    const { data, error } = await updatePricingConfig(token, { dizielMarginPct: margin, vatPct: vat });
    setSavingConfig(false);
    if (error) {
      setConfigError(error);
      return;
    }
    if (data) {
      setDizielMarginPct(String(data.dizielMarginPct));
      setVatPct(String(data.vatPct));
      setConfigMessage('Config saved');
    }
  };

  const renderTierTable = (which: 'with' | 'without', list: EditableTier[], title: string) => (
    <div className="rounded-lg border border-admin-border bg-admin-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-admin-text">{title}</h3>
        <button
          type="button"
          onClick={() => addRow(which)}
          className="rounded-md border border-emerald-500 px-2.5 py-1 text-xs font-semibold text-emerald-500 transition hover:bg-emerald-500/10"
        >
          {t('admin.pricing.addRow')}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left rtl:text-right text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-admin-subtext">
              <th className="px-2 py-2 font-semibold">{t('admin.pricing.weight')}</th>
              <th className="px-2 py-2 font-semibold">{t('admin.pricing.upToKm')}</th>
              <th className="px-2 py-2 font-semibold">{t('admin.pricing.pricePerKm')}</th>
              <th className="px-2 py-2 font-semibold">{t('admin.pricing.label')}</th>
              <th className="w-10 px-2 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-border">
            {list.map((row, idx) => (
              <tr key={`${which}-${idx}`}>
                <td className="px-2 py-1.5">
                  <input
                    value={row.weight}
                    onChange={(e) => updateRow(which, idx, 'weight', e.target.value)}
                    className="w-24 rounded-md border border-admin-border bg-admin-bg px-2 py-1.5 text-sm text-admin-text focus:border-admin-accent focus:outline-none"
                  />
                </td>
                <td className="px-2 py-1.5">
                  <input
                    value={row.upToKm}
                    onChange={(e) => updateRow(which, idx, 'upToKm', e.target.value)}
                    className="w-24 rounded-md border border-admin-border bg-admin-bg px-2 py-1.5 text-sm text-admin-text focus:border-admin-accent focus:outline-none"
                  />
                </td>
                <td className="px-2 py-1.5">
                  <input
                    value={row.pricePerKm}
                    onChange={(e) => updateRow(which, idx, 'pricePerKm', e.target.value)}
                    className="w-28 rounded-md border border-admin-border bg-admin-bg px-2 py-1.5 text-sm text-admin-text focus:border-admin-accent focus:outline-none"
                  />
                </td>
                <td className="px-2 py-1.5">
                  <input
                    value={row.label}
                    onChange={(e) => updateRow(which, idx, 'label', e.target.value)}
                    placeholder={t('common.optional')}
                    className="w-32 rounded-md border border-admin-border bg-admin-bg px-2 py-1.5 text-sm text-admin-text placeholder:text-admin-subtext focus:border-admin-accent focus:outline-none"
                  />
                </td>
                <td className="px-2 py-1.5 text-center">
                  <button
                    type="button"
                    onClick={() => removeRow(which, idx)}
                    className="inline-flex text-admin-subtext transition hover:text-red-500"
                    aria-label="Remove row"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 ? <p className="py-4 text-center text-sm text-admin-subtext">{t('admin.pricing.noTiers')}</p> : null}
      </div>
    </div>
  );

  if (loading) {
    return <p className="text-sm text-admin-subtext">{t('common.loading')}</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-admin-text">{t('admin.pricing.title')}</h1>
        <p className="mt-1 text-sm text-admin-subtext">
          {t('admin.pricing.subtitle')}
        </p>
      </div>

      <div className="rounded-lg border border-admin-border bg-admin-card p-4">
        <h3 className="text-sm font-semibold text-admin-text">{t('admin.pricing.globalConfig')}</h3>

        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-admin-subtext">{t('admin.pricing.dizielMargin')}</label>
            <input
              value={dizielMarginPct}
              onChange={(e) => setDizielMarginPct(e.target.value)}
              className="w-full rounded-md border border-admin-border bg-admin-bg px-3 py-2 text-sm text-admin-text focus:border-admin-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-admin-subtext">{t('admin.pricing.adminFee')}</label>
            <input value="3" disabled className="w-full cursor-not-allowed rounded-md border border-admin-border bg-admin-bg px-3 py-2 text-sm text-admin-subtext opacity-70" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-admin-subtext">{t('admin.pricing.vat')}</label>
            <input
              value={vatPct}
              onChange={(e) => setVatPct(e.target.value)}
              className="w-full rounded-md border border-admin-border bg-admin-bg px-3 py-2 text-sm text-admin-text focus:border-admin-accent focus:outline-none"
            />
          </div>
        </div>

        {configError ? <p className="mt-3 text-sm text-red-400">{configError}</p> : null}
        {configMessage ? <p className="mt-3 text-sm text-emerald-500">{configMessage}</p> : null}

        <button
          type="button"
          onClick={saveConfig}
          disabled={savingConfig}
          className="mt-4 rounded-md bg-admin-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {savingConfig ? t('common.saving') : t('admin.pricing.saveConfig')}
        </button>
      </div>

      {renderTierTable('with', withVAT, t('admin.pricing.withVat'))}
      {renderTierTable('without', withoutVAT, t('admin.pricing.withoutVat'))}

      {tiersError ? <p className="text-sm text-red-400">{tiersError}</p> : null}
      {tiersMessage ? <p className="text-sm text-emerald-500">{tiersMessage}</p> : null}

      <button
        type="button"
        onClick={saveTiers}
        disabled={savingTiers}
        className="rounded-md bg-admin-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {savingTiers ? t('common.saving') : t('admin.pricing.saveAllTiers')}
      </button>
    </div>
  );
}
