import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AuditEntry, adminGetAuditLog } from '../../../lib/api/adminMisc';
import { useAdminAuth } from '../../../lib/auth';
import FilterTabs from '../../../components/FilterTabs';

/** Audit log — entity-type filter chips + action search. Ported from `app/(admin)/audit.tsx`. */
export default function Audit() {
  const { t } = useTranslation();
  const { token } = useAdminAuth();
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [entityType, setEntityType] = useState('');
  const [actionQuery, setActionQuery] = useState('');
  const [actionInput, setActionInput] = useState('');

  const load = useCallback(async () => {
    if (!token) return;
    const { data } = await adminGetAuditLog(token, {
      entityType: entityType || undefined,
      action: actionQuery || undefined,
      limit: 100,
    });
    setEntries(data?.entries ?? []);
  }, [token, entityType, actionQuery]);

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActionQuery(actionInput.trim());
  };

  const entityTypes = [
    { value: '', label: t('common.all') },
    { value: 'order', label: t('admin.audit.entities.order') },
    { value: 'payment', label: t('admin.audit.entities.payment') },
    { value: 'document', label: t('admin.audit.entities.document') },
    { value: 'trip', label: t('admin.audit.entities.trip') },
    { value: 'contract', label: t('admin.audit.entities.contract') },
    { value: 'ledger', label: t('admin.audit.entities.ledger') },
    { value: 'user', label: t('admin.audit.entities.user') },
  ];

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-admin-text">{t('admin.audit.title')}</h1>
        <p className="mt-1 text-sm text-admin-subtext">{t('admin.audit.subtitle')}</p>
      </div>

      <div className="mb-5 space-y-3 rounded-lg border border-admin-border bg-admin-card p-4">
        <FilterTabs tabs={entityTypes} active={entityType} onChange={setEntityType} />
        <form onSubmit={onSearchSubmit} className="flex gap-2">
          <input
            value={actionInput}
            onChange={(e) => setActionInput(e.target.value)}
            placeholder={t('admin.audit.filterByActionPlaceholder')}
            className="w-full max-w-sm rounded-md border border-admin-border bg-admin-bg px-3 py-2 text-sm text-admin-text placeholder:text-admin-subtext focus:border-admin-accent focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-md border border-admin-border px-3 py-2 text-sm font-medium text-admin-subtext transition hover:border-admin-accent hover:text-admin-accent"
          >
            {t('common.search')}
          </button>
        </form>
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-admin-subtext">{t('common.loading')}</div>
      ) : entries.length === 0 ? (
        <div className="py-16 text-center text-sm text-admin-subtext">{t('admin.audit.noEntries')}</div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div key={entry.id} className="rounded-lg border border-admin-border bg-admin-card p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center rounded-md border border-admin-accent bg-admin-accent/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-admin-accent">
                  {entry.entityType}
                </span>
                <span className="text-xs text-admin-subtext">{new Date(entry.createdAt).toLocaleString()}</span>
              </div>
              <div className="mt-2 text-sm font-semibold text-admin-text">{entry.action}</div>
              {entry.summary ? <p className="mt-1 text-sm text-admin-subtext">{entry.summary}</p> : null}
              {entry.from !== null && entry.from !== undefined ? (
                <p className="mt-1 text-xs text-admin-subtext">
                  {t('admin.audit.from')}: {typeof entry.from === 'object' ? JSON.stringify(entry.from) : String(entry.from)} →{' '}
                  {typeof entry.to === 'object' ? JSON.stringify(entry.to) : String(entry.to)}
                </p>
              ) : null}
              {entry.amount !== null && entry.amount !== undefined ? (
                <p className="mt-1 text-xs text-admin-subtext">{t('admin.audit.amount')}: {entry.amount.toLocaleString()} EGP</p>
              ) : null}
              {entry.actor ? (
                <p className="mt-1 text-xs text-admin-subtext">
                  {t('admin.audit.actor')}: {entry.actor.fullName} ({entry.actor.role})
                </p>
              ) : entry.actorRole ? (
                <p className="mt-1 text-xs text-admin-subtext">{t('admin.audit.actor')}: {entry.actorRole}</p>
              ) : null}
              <p className="mt-2 font-mono text-[11px] text-admin-subtext/60">id: {entry.entityId}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
