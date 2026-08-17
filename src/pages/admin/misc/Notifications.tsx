import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  AppNotification,
  clearAllNotifications,
  deleteNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  resolveAdminNotificationRoute,
} from '../../../lib/api/adminMisc';
import { useAdminAuth } from '../../../lib/auth';
import { useSocket } from '../../../lib/socket';

function mergeNotifications(primary: AppNotification[], secondary: AppNotification[]) {
  const seen = new Set<string>();
  return [...primary, ...secondary]
    .filter((item) => {
      if (!item?.id || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Notifications — list, mark read/delete/clear-all, live `notification:new`
 * updates, best-effort deep-link routing. Ported from
 * `components/NotificationsScreen.tsx` (admin accent).
 */
export default function Notifications() {
  const { t } = useTranslation();
  const { token } = useAdminAuth();
  const { socket } = useSocket(token);
  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!token) return;
    const { data } = await getNotifications(token, { limit: 100 });
    if (data) setItems((current) => mergeNotifications(data.notifications, current));
  }, [token]);

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  useEffect(() => {
    if (!socket) return;
    const handler = (notification: AppNotification) => {
      setItems((current) => mergeNotifications([notification], current));
    };
    socket.on('notification:new', handler);
    return () => {
      socket.off('notification:new', handler);
    };
  }, [socket]);

  const handleMarkRead = async (id: string) => {
    if (!token) return;
    const item = items.find((i) => i.id === id);
    if (!item || item.read) return;
    setItems((cur) => cur.map((i) => (i.id === id ? { ...i, read: true } : i)));
    await markNotificationRead(token, id);
  };

  const handleMarkAll = async () => {
    if (!token) return;
    await markAllNotificationsRead(token);
    setItems((cur) => cur.map((i) => ({ ...i, read: true })));
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    setItems((cur) => cur.filter((i) => i.id !== id));
    await deleteNotification(token, id);
  };

  const handleClearAll = async () => {
    if (!token) return;
    if (!window.confirm(t('admin.notifications.confirmClearAll'))) return;
    await clearAllNotifications(token);
    setItems([]);
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-admin-text">{t('admin.notifications.title')}</h1>
          <p className="mt-1 text-sm text-admin-subtext">{t('admin.notifications.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleMarkAll}
            className="inline-flex items-center gap-1.5 rounded-md border border-admin-accent px-3 py-1.5 text-xs font-semibold text-admin-accent transition hover:bg-admin-accent/10"
          >
            {t('admin.notifications.markAllRead')}
          </button>
          <button
            type="button"
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 rounded-md border border-red-800 px-3 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-950/40"
          >
            {t('admin.notifications.clearAll')}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-admin-subtext">{t('common.loading')}</div>
      ) : items.length === 0 ? (
        <div className="py-16 text-center text-sm text-admin-subtext">{t('admin.notifications.noNotifications')}</div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => {
            const route = resolveAdminNotificationRoute(item);
            const bodyText = item.body?.trim();
            const showBody = Boolean(bodyText) && bodyText !== item.title?.trim();
            const rowContent = (
              <>
                <span
                  className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${item.read ? 'bg-transparent' : 'bg-admin-accent'}`}
                />
                <div className="min-w-0 flex-1">
                  <div className={`truncate text-sm ${item.read ? 'text-admin-subtext' : 'font-semibold text-admin-text'}`}>
                    {item.title}
                  </div>
                  {showBody ? <div className="mt-0.5 line-clamp-2 text-xs text-admin-subtext">{bodyText}</div> : null}
                  <div className="mt-1 text-[11px] text-admin-subtext/70">{new Date(item.createdAt).toLocaleString()}</div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                  title={t('common.delete')}
                  className="shrink-0 rounded-md p-1 text-admin-subtext transition hover:bg-white/5 hover:text-red-400"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            );

            const rowClass = `flex items-start gap-3 rounded-lg border p-3 transition ${
              item.read ? 'border-admin-border bg-admin-card' : 'border-admin-accent/30 bg-admin-accent/5'
            }`;

            return route ? (
              <Link key={item.id} to={route} onClick={() => handleMarkRead(item.id)} className={`${rowClass} hover:border-admin-accent/60`}>
                {rowContent}
              </Link>
            ) : (
              <div key={item.id} onClick={() => handleMarkRead(item.id)} className={`${rowClass} cursor-pointer`}>
                {rowContent}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
