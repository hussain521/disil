import { useState } from 'react';
import { Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { changePassword, updateProfile } from '../../../lib/api/adminCore';
import { useAdminAuth } from '../../../lib/auth';

/** Admin profile — ports `app/(admin)/profile.tsx`. */
export default function Profile() {
  const { t } = useTranslation();
  const { user, token, logout, refreshUser } = useAdminAuth();

  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [savingName, setSavingName] = useState(false);
  const [nameMessage, setNameMessage] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSaveName = async () => {
    if (!fullName.trim() || !token) return;
    setSavingName(true);
    setNameMessage(null);
    const { error } = await updateProfile(token, { fullName: fullName.trim() });
    setSavingName(false);
    if (error) {
      setNameMessage(error);
      return;
    }
    await refreshUser();
    setNameMessage(t('common.success'));
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage({ type: 'error', text: t('admin.userDetail.rejectionReasonRequired') });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    if (!token) return;
    setChangingPassword(true);
    setPasswordMessage(null);
    const { error } = await changePassword(token, currentPassword, newPassword);
    setChangingPassword(false);
    if (error) {
      setPasswordMessage({ type: 'error', text: error });
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordMessage({ type: 'success', text: t('common.success') });
  };

  return (
    <div className="max-w-2xl space-y-6 animation-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-admin-border bg-admin-card p-5 sm:p-6 shadow-subtle-dark">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-admin-accent bg-admin-accent/15 text-admin-accent shrink-0">
          <Shield className="h-7 w-7" />
        </div>
        <div>
          <div className="text-lg sm:text-xl font-bold text-admin-text">{user?.fullName}</div>
          <div className="text-xs font-bold uppercase tracking-wide text-admin-accent">{t('admin.profile.masterAdmin')}</div>
          <div className="text-xs sm:text-sm text-admin-subtext font-mono mt-0.5">{user?.phone}</div>
        </div>
      </div>

      <div className="rounded-2xl border border-admin-border bg-admin-card p-5 sm:p-6 shadow-subtle-dark">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-admin-muted">{t('admin.profile.accountSection')}</h2>
        <label className="mb-1 block text-xs font-medium text-admin-subtext">{t('admin.profile.fullName')}</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="mb-3 w-full rounded-xl border border-admin-border bg-admin-bg px-3.5 py-2 text-xs sm:text-sm text-admin-text focus:border-admin-accent focus:outline-none shadow-xs"
        />
        {nameMessage ? <p className="mb-3 text-xs text-admin-subtext">{nameMessage}</p> : null}
        <button
          type="button"
          onClick={handleSaveName}
          disabled={savingName}
          className="rounded-xl bg-admin-accent px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-admin-accent-dark disabled:opacity-50"
        >
          {savingName ? t('common.saving') : t('admin.profile.saveChanges')}
        </button>
      </div>

      <div className="rounded-2xl border border-admin-border bg-admin-card p-5 sm:p-6 shadow-subtle-dark">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-admin-muted">{t('admin.profile.changePassword')}</h2>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-admin-subtext">{t('admin.profile.currentPassword')}</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-xl border border-admin-border bg-admin-bg px-3.5 py-2 text-xs sm:text-sm text-admin-text focus:border-admin-accent focus:outline-none shadow-xs"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-admin-subtext">{t('admin.profile.newPassword')}</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl border border-admin-border bg-admin-bg px-3.5 py-2 text-xs sm:text-sm text-admin-text focus:border-admin-accent focus:outline-none shadow-xs"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-admin-subtext">{t('admin.profile.confirmNewPassword')}</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-admin-border bg-admin-bg px-3.5 py-2 text-xs sm:text-sm text-admin-text focus:border-admin-accent focus:outline-none shadow-xs"
            />
          </div>
        </div>
        {passwordMessage ? (
          <p className={`mt-3 text-xs ${passwordMessage.type === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>
            {passwordMessage.text}
          </p>
        ) : null}
        <button
          type="button"
          onClick={handleChangePassword}
          disabled={changingPassword}
          className="mt-4 rounded-xl border border-admin-border bg-admin-bg px-4 py-2 text-xs font-bold text-admin-text transition hover:border-admin-accent disabled:opacity-50 shadow-xs"
        >
          {changingPassword ? t('common.loading') : t('admin.profile.updatePassword')}
        </button>
      </div>

      <button
        type="button"
        onClick={logout}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs sm:text-sm font-bold text-red-400 transition hover:bg-red-500/20 shadow-xs"
      >
        {t('admin.profile.logoutAdmin')}
      </button>
    </div>
  );
}
