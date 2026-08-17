import { useCallback, useEffect, useState } from 'react';
import { Eye, EyeOff, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  VehicleTaxonomyData,
  VehicleTaxonomyLabel,
  getVehicleTaxonomy,
  updateVehicleTaxonomy,
} from '../../../lib/api/adminMisc';
import { useAdminAuth } from '../../../lib/auth';

type SectionKey = 'categories' | 'truckBodyTypes' | 'fleetOperations' | 'headTypes' | 'trailerTypes';

const SECTION_KEYS: SectionKey[] = ['categories', 'truckBodyTypes', 'fleetOperations', 'headTypes', 'trailerTypes'];

const EMPTY_TAXONOMY: VehicleTaxonomyData = {
  categories: [],
  vehicleSubtypes: { jumbo: [], single: [], truck: [] },
  truckBodyTypes: [],
  fleetOperations: [],
  headTypes: [],
  trailerTypes: [],
};

/** Vehicle taxonomy editor (categories, body types, heads, trailers). Ported from `app/(admin)/vehicle-types.tsx`. */
export default function VehicleTypes() {
  const { t } = useTranslation();
  const { token } = useAdminAuth();
  const [taxonomy, setTaxonomy] = useState<VehicleTaxonomyData>(EMPTY_TAXONOMY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionKey>('categories');
  const [key, setKey] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [message, setMessage] = useState<{ kind: 'error' | 'success'; text: string } | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    const { data } = await getVehicleTaxonomy(token);
    if (data?.taxonomy) setTaxonomy(data.taxonomy);
  }, [token]);

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  const sectionItems = taxonomy[activeSection] ?? [];

  const updateSection = (items: VehicleTaxonomyLabel[]) => {
    setTaxonomy((prev) => ({ ...prev, [activeSection]: items }));
  };

  const addItem = () => {
    setMessage(null);
    if (!key.trim() || !nameAr.trim() || !nameEn.trim()) {
      setMessage({ kind: 'error', text: t('admin.vehicleTypes.fillAllFields') });
      return;
    }
    if (sectionItems.some((item) => item.key === key.trim())) {
      setMessage({ kind: 'error', text: t('admin.vehicleTypes.keyExists') });
      return;
    }
    updateSection([...sectionItems, { key: key.trim(), ar: nameAr.trim(), en: nameEn.trim() }]);
    setKey('');
    setNameAr('');
    setNameEn('');
  };

  const toggleDisabled = (itemKey: string) => {
    updateSection(sectionItems.map((item) => (item.key === itemKey ? { ...item, disabled: !item.disabled } : item)));
  };

  const removeItem = (itemKey: string) => {
    updateSection(sectionItems.filter((item) => item.key !== itemKey));
  };

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    setMessage(null);
    const { data, error } = await updateVehicleTaxonomy(token, taxonomy);
    setSaving(false);
    if (error) {
      setMessage({ kind: 'error', text: error });
      return;
    }
    if (data?.taxonomy) setTaxonomy(data.taxonomy);
    setMessage({ kind: 'success', text: t('admin.vehicleTypes.savedSuccess') });
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-admin-text">{t('admin.vehicleTypes.title')}</h1>
          <p className="mt-1 text-sm text-admin-subtext">{t('admin.vehicleTypes.subtitle')}</p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || loading}
          className="rounded-md bg-admin-accent px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-admin-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? t('common.saving') : t('common.saveChanges')}
        </button>
      </div>

      {message ? (
        <div
          className={`mb-4 rounded-md border px-3 py-2 text-sm ${
            message.kind === 'error'
              ? 'border-red-800 bg-red-950/40 text-red-300'
              : 'border-emerald-800 bg-emerald-950/40 text-emerald-300'
          }`}
        >
          {message.text}
        </div>
      ) : null}

      {loading ? (
        <div className="py-16 text-center text-sm text-admin-subtext">{t('common.loading')}</div>
      ) : (
        <>
          <div className="mb-5 flex flex-wrap gap-2">
            {SECTION_KEYS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setActiveSection(k)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                  activeSection === k
                    ? 'border-admin-accent bg-admin-accent text-white'
                    : 'border-admin-border bg-admin-card text-admin-subtext hover:border-admin-accent hover:text-admin-accent'
                }`}
              >
                {t(`admin.vehicleTypes.sections.${k}`, { defaultValue: k })}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {sectionItems.map((item) => (
              <div
                key={item.key}
                className="flex items-center gap-3 rounded-lg border border-admin-border bg-admin-card p-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-xs font-semibold text-admin-accent">{item.key}</div>
                  <div className="text-sm text-admin-text">
                    {item.en} <span className="text-admin-subtext">· {item.ar}</span>
                  </div>
                  {item.disabled ? <div className="mt-0.5 text-xs text-admin-subtext">{t('admin.vehicleTypes.disabled')}</div> : null}
                </div>
                <button
                  type="button"
                  onClick={() => toggleDisabled(item.key)}
                  title={item.disabled ? t('admin.vehicleTypes.enable') : t('admin.vehicleTypes.disable')}
                  className="rounded-md p-2 text-admin-subtext transition hover:bg-white/5 hover:text-admin-text"
                >
                  {item.disabled ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(item.key)}
                  title={t('common.delete')}
                  className="rounded-md p-2 text-admin-accent transition hover:bg-admin-accent/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {sectionItems.length === 0 ? (
              <p className="py-6 text-center text-sm text-admin-subtext">{t('admin.vehicleTypes.noItems')}</p>
            ) : null}
          </div>

          <div className="mt-5 space-y-3 rounded-lg border border-admin-border bg-admin-card p-4">
            <h2 className="text-sm font-semibold text-admin-text">{t('admin.vehicleTypes.addItem')}</h2>
            <div className="grid gap-2 sm:grid-cols-3">
              <input
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder={t('admin.vehicleTypes.keyPlaceholder')}
                className="rounded-md border border-admin-border bg-admin-bg px-3 py-2 text-sm text-admin-text placeholder:text-admin-subtext focus:border-admin-accent focus:outline-none"
              />
              <input
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                placeholder={t('admin.vehicleTypes.nameArPlaceholder')}
                className="rounded-md border border-admin-border bg-admin-bg px-3 py-2 text-sm text-admin-text placeholder:text-admin-subtext focus:border-admin-accent focus:outline-none"
              />
              <input
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder={t('admin.vehicleTypes.nameEnPlaceholder')}
                className="rounded-md border border-admin-border bg-admin-bg px-3 py-2 text-sm text-admin-text placeholder:text-admin-subtext focus:border-admin-accent focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={addItem}
              className="rounded-md bg-admin-accent px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-admin-accent/90"
            >
              {t('common.add')}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
