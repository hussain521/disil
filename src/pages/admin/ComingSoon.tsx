import { useTranslation } from 'react-i18next';

/**
 * Shared placeholder body used by every not-yet-built admin screen (see
 * `web/src/pages/admin/<group>/*.tsx`). Each group-owning agent replaces the
 * screen component's body with real content and can delete this import once
 * they do — no shared state or props to worry about.
 */
export default function ComingSoon({ title }: { title: string }) {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[60vh] items-center justify-center rounded-lg border border-admin-border bg-admin-card p-8">
      <div className="text-center">
        <h1 className="text-lg font-semibold text-admin-text">{title}</h1>
        <p className="mt-2 text-sm text-admin-subtext">{t('common.comingSoon')}</p>
      </div>
    </div>
  );
}
