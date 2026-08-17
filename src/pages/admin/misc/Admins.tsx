import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  ALL_ADMIN_SUB_ROLES,
  AdminAccount,
  AdminSubRole,
  adminCreateAdmin,
  adminListAdmins,
  adminUpdateAdminSubRoles,
} from '../../../lib/api/adminMisc';
import { useAdminAuth } from '../../../lib/auth';
import DataTable, { DataTableColumn } from '../../../components/DataTable';
import Modal from '../../../components/Modal';

function SubRoleChip({
  role,
  active,
  label,
  onClick,
  disabled,
}: {
  role: AdminSubRole;
  active: boolean;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
        active
          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
          : 'border-admin-border bg-transparent text-admin-subtext hover:border-admin-accent hover:text-admin-accent'
      }`}
    >
      {active ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />} {label}
    </button>
  );
}

/** Admins management — list admins, toggle sub-roles, create new admin. Ported from `app/(admin)/admins.tsx`. */
export default function Admins() {
  const { t } = useTranslation();
  const { token } = useAdminAuth();
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [newSubRoles, setNewSubRoles] = useState<AdminSubRole[]>(['super']);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    const { data, error: err } = await adminListAdmins(token);
    if (data) setAdmins(data.admins);
    else if (err) setError(err);
  }, [token]);

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  const toggleSubRole = async (admin: AdminAccount, role: AdminSubRole) => {
    if (!token) return;
    const has = admin.subRoles.includes(role);
    const next = has ? admin.subRoles.filter((r) => r !== role) : [...admin.subRoles, role];
    if (next.length === 0) {
      setError(t('admin.admins.keepOneRoleError'));
      return;
    }
    setSavingId(admin.id);
    setError(null);
    const { error: err } = await adminUpdateAdminSubRoles(token, admin.id, next);
    setSavingId(null);
    if (err) {
      setError(err);
      return;
    }
    setAdmins((prev) => prev.map((a) => (a.id === admin.id ? { ...a, subRoles: next } : a)));
  };

  const toggleNewSubRole = (role: AdminSubRole) => {
    setNewSubRoles((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]));
  };

  const resetForm = () => {
    setNewName('');
    setNewPhone('');
    setNewPassword('');
    setNewSubRoles(['super']);
    setShowPassword(false);
    setFormError(null);
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const name = newName.trim();
    const phone = newPhone.trim();
    if (!name) return setFormError(t('admin.admins.nameRequired'));
    if (!phone) return setFormError(t('admin.admins.phoneRequired'));
    if (!newPassword || newPassword.length < 6) return setFormError(t('admin.admins.passwordMinChars'));
    if (newSubRoles.length === 0) return setFormError(t('admin.admins.selectSubRole'));

    setCreating(true);
    setFormError(null);
    const { data, error: err } = await adminCreateAdmin(token, {
      fullName: name,
      phone,
      password: newPassword,
      subRoles: newSubRoles,
    });
    setCreating(false);
    if (err) {
      setFormError(err);
      return;
    }
    if (data) setAdmins((prev) => [data, ...prev]);
    setShowAdd(false);
    resetForm();
  };

  const columns: DataTableColumn<AdminAccount>[] = [
    {
      key: 'fullName',
      header: t('admin.admins.columns.admin'),
      render: (a) => (
        <div>
          <div className="font-medium text-admin-text">{a.fullName}</div>
          <div className="text-xs text-admin-subtext">{a.phone}</div>
        </div>
      ),
    },
    {
      key: 'subRoles',
      header: t('admin.admins.columns.subRoles'),
      render: (a) => (
        <div className="flex flex-wrap gap-1.5">
          {ALL_ADMIN_SUB_ROLES.map((role) => (
            <SubRoleChip
              key={role}
              role={role}
              active={a.subRoles.includes(role)}
              label={t(`admin.admins.roles.${role}`, { defaultValue: role })}
              disabled={savingId === a.id}
              onClick={() => toggleSubRole(a, role)}
            />
          ))}
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: t('admin.admins.columns.created'),
      className: 'whitespace-nowrap',
      render: (a) => new Date(a.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-admin-text">{t('admin.admins.title')}</h1>
          <p className="mt-1 text-sm text-admin-subtext">{t('admin.admins.subtitle')}</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="rounded-md border border-admin-accent bg-admin-accent/10 px-3.5 py-2 text-sm font-semibold text-admin-accent transition hover:bg-admin-accent/20"
        >
          {t('admin.admins.addAdmin')}
        </button>
      </div>

      {error ? (
        <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      ) : null}

      <DataTable
        columns={columns}
        data={admins}
        keyExtractor={(a) => a.id}
        loading={loading}
        emptyMessage={t('admin.admins.noAdmins')}
      />

      <Modal
        open={showAdd}
        onClose={() => {
          setShowAdd(false);
          resetForm();
        }}
        title={t('admin.admins.addAdmin')}
        size="md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-admin-text">{t('admin.admins.form.fullName')}</label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full rounded-md border border-admin-border bg-admin-card px-3 py-2 text-sm text-admin-text placeholder-admin-subtext focus:border-admin-accent focus:outline-none"
              placeholder={t('admin.admins.form.fullName')}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-admin-text">{t('admin.admins.form.phoneNumber')}</label>
            <input
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              className="w-full rounded-md border border-admin-border bg-admin-card px-3 py-2 text-sm text-admin-text placeholder-admin-subtext focus:border-admin-accent focus:outline-none"
              placeholder={t('admin.admins.form.phoneNumber')}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-admin-text">{t('admin.admins.form.password')}</label>
            <div className="flex gap-2">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-md border border-admin-border bg-admin-card px-3 py-2 text-sm text-admin-text placeholder-admin-subtext focus:border-admin-accent focus:outline-none"
                placeholder={t('admin.admins.form.passwordPlaceholder')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="shrink-0 rounded-md border border-admin-border px-3 text-xs text-admin-subtext hover:text-admin-text"
              >
                {showPassword ? t('common.hide') : t('common.show')}
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-admin-text">{t('admin.admins.form.subRoles')}</label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_ADMIN_SUB_ROLES.map((role) => (
                <SubRoleChip
                  key={role}
                  role={role}
                  active={newSubRoles.includes(role)}
                  label={t(`admin.admins.roles.${role}`, { defaultValue: role })}
                  onClick={() => toggleNewSubRole(role)}
                />
              ))}
            </div>
          </div>

          {formError ? <p className="text-sm text-red-600">{formError}</p> : null}

          <button
            type="submit"
            disabled={creating}
            className="w-full rounded-md bg-admin-accent px-3 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? t('common.submitting') : t('admin.admins.addAdmin')}
          </button>
        </form>
      </Modal>
    </div>
  );
}
