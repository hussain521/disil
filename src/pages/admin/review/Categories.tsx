import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAdminAuth } from '../../../lib/auth';
import {
  ServiceCategory,
  adminCreateServiceCategory,
  adminDeleteServiceCategory,
  adminGetServiceCategories,
  adminUpdateServiceCategory,
} from '../../../lib/api/adminReview';

const inputClass =
  'w-full rounded-md border border-admin-border bg-admin-bg px-3 py-2 text-sm text-admin-text placeholder:text-admin-subtext focus:border-admin-accent focus:outline-none';

/** Service categories + subcategories CRUD — mirrors `app/(admin)/categories.tsx`. */
export default function Categories() {
  const { t } = useTranslation();
  const { token } = useAdminAuth();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [key, setKey] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [saving, setSaving] = useState(false);

  const [subCategoryId, setSubCategoryId] = useState<string | null>(null);
  const [subKey, setSubKey] = useState('');
  const [subNameAr, setSubNameAr] = useState('');
  const [subNameEn, setSubNameEn] = useState('');

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    const { data, error: err } = await adminGetServiceCategories(token);
    setCategories(data?.categories ?? []);
    if (err) setError(err);
    setLoading(false);
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async () => {
    if (!token || !key.trim() || !nameAr.trim() || !nameEn.trim()) {
      setError(t('admin.categories.fillAll'));
      return;
    }
    setSaving(true);
    setError(null);
    const { data, error: err } = await adminCreateServiceCategory(token, {
      key: key.trim(),
      nameAr: nameAr.trim(),
      nameEn: nameEn.trim(),
    });
    setSaving(false);
    if (err) {
      setError(err);
      return;
    }
    if (data?.category) setCategories((prev) => [...prev, data.category]);
    setKey('');
    setNameAr('');
    setNameEn('');
  };

  const toggleActive = async (cat: ServiceCategory) => {
    if (!token || !cat.id) return;
    const { data, error: err } = await adminUpdateServiceCategory(token, cat.id, {
      isActive: cat.isActive === false,
    });
    if (err) {
      setError(err);
      return;
    }
    if (data?.category) setCategories((prev) => prev.map((c) => (c.id === cat.id ? data.category : c)));
  };

  const addSubcategory = async (cat: ServiceCategory) => {
    if (!token || !cat.id || !subKey.trim() || !subNameAr.trim() || !subNameEn.trim()) {
      setError(t('admin.categories.fillSubAll'));
      return;
    }
    const next = [...(cat.subcategories ?? []), { key: subKey.trim(), nameAr: subNameAr.trim(), nameEn: subNameEn.trim() }];
    setError(null);
    const { data, error: err } = await adminUpdateServiceCategory(token, cat.id, { subcategories: next });
    if (err) {
      setError(err);
      return;
    }
    if (data?.category) {
      setCategories((prev) => prev.map((c) => (c.id === cat.id ? data.category : c)));
      setSubKey('');
      setSubNameAr('');
      setSubNameEn('');
      setSubCategoryId(null);
    }
  };

  const removeSubcategory = async (cat: ServiceCategory, subKeyToRemove: string) => {
    if (!token || !cat.id) return;
    const next = (cat.subcategories ?? []).filter((s) => s.key !== subKeyToRemove);
    const { data, error: err } = await adminUpdateServiceCategory(token, cat.id, { subcategories: next });
    if (err) {
      setError(err);
      return;
    }
    if (data?.category) setCategories((prev) => prev.map((c) => (c.id === cat.id ? data.category : c)));
  };

  const handleDelete = async (cat: ServiceCategory) => {
    if (!token || !cat.id) return;
    if (!window.confirm(t('admin.categories.confirmDelete'))) return;
    const { error: err } = await adminDeleteServiceCategory(token, cat.id);
    if (err) {
      setError(err);
      return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== cat.id));
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-admin-text">{t('admin.categories.title')}</h1>
        <p className="mt-1 text-sm text-admin-subtext">{t('admin.categories.subtitle')}</p>
      </div>

      {error ? <p className="text-sm text-brand-danger">{error}</p> : null}

      <div className="space-y-2 rounded-lg border border-admin-border bg-admin-card p-4">
        <h2 className="text-sm font-semibold text-admin-text">{t('admin.categories.addCategory')}</h2>
        <div className="grid gap-2 sm:grid-cols-3">
          <input className={inputClass} placeholder={t('admin.categories.key')} value={key} onChange={(e) => setKey(e.target.value)} />
          <input
            className={inputClass}
            placeholder={t('admin.categories.nameAr')}
            value={nameAr}
            onChange={(e) => setNameAr(e.target.value)}
          />
          <input
            className={inputClass}
            placeholder={t('admin.categories.nameEn')}
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
          />
        </div>
        <button
          type="button"
          onClick={handleCreate}
          disabled={saving}
          className="rounded-md bg-admin-accent px-4 py-1.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? t('admin.categories.adding') : t('admin.categories.add')}
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-admin-subtext">{t('common.loading')}</p>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat.id ?? cat.key} className="space-y-3 rounded-lg border border-admin-border bg-admin-card p-4">
              <div>
                <p className="font-semibold text-admin-text">{cat.nameEn}</p>
                <p className="text-xs text-admin-subtext">
                  {cat.key} · {cat.isActive === false ? t('common.inactive') : t('common.active')}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => toggleActive(cat)}
                  className="rounded-md border border-admin-border px-3 py-1.5 text-sm font-medium text-admin-text transition hover:border-admin-accent hover:text-admin-accent"
                >
                  {cat.isActive === false ? t('admin.categories.activate') : t('admin.categories.deactivate')}
                </button>
                <button
                  type="button"
                  onClick={() => setSubCategoryId(subCategoryId === cat.id ? null : cat.id ?? null)}
                  className="rounded-md border border-admin-border px-3 py-1.5 text-sm font-medium text-admin-text transition hover:border-admin-accent hover:text-admin-accent"
                >
                  {t('admin.categories.subcategories')}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(cat)}
                  className="rounded-md border border-brand-danger px-3 py-1.5 text-sm font-medium text-brand-danger transition hover:bg-brand-danger/10"
                >
                  {t('common.delete')}
                </button>
              </div>

              {(cat.subcategories ?? []).length > 0 ? (
                <ul className="space-y-1.5">
                  {(cat.subcategories ?? []).map((sub) => (
                    <li key={sub.key} className="flex items-center justify-between gap-2 text-sm">
                      <span className="text-admin-subtext">
                        {sub.nameEn} ({sub.key})
                      </span>
                      <button
                        type="button"
                        onClick={() => removeSubcategory(cat, sub.key)}
                        className="text-xs font-medium text-brand-danger hover:underline"
                      >
                        {t('common.delete')}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}

              {subCategoryId === cat.id ? (
                <div className="space-y-2 border-t border-admin-border pt-3">
                  <div className="grid gap-2 sm:grid-cols-3">
                    <input
                      className={inputClass}
                      placeholder={t('admin.categories.subKey')}
                      value={subKey}
                      onChange={(e) => setSubKey(e.target.value)}
                    />
                    <input
                      className={inputClass}
                      placeholder={t('admin.categories.nameAr')}
                      value={subNameAr}
                      onChange={(e) => setSubNameAr(e.target.value)}
                    />
                    <input
                      className={inputClass}
                      placeholder={t('admin.categories.nameEn')}
                      value={subNameEn}
                      onChange={(e) => setSubNameEn(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => addSubcategory(cat)}
                    className="rounded-md bg-admin-accent px-3 py-1.5 text-sm font-semibold text-white transition"
                  >
                    {t('admin.categories.addSubcategory')}
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
