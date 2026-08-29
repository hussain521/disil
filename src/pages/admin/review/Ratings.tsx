import { useCallback, useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import FilterTabs from '../../../components/FilterTabs';
import { useAdminAuth } from '../../../lib/auth';
import { RatingLeaderboardRow, RatingSubjectType, adminGetRatingsLeaderboard } from '../../../lib/api/adminReview';

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-3.5 w-3.5 ${n <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-admin-border'}`}
        />
      ))}
    </span>
  );
}

/** Ratings leaderboard by subject type — mirrors `components/RatingsScreen.tsx` (`mode="leaderboard"`). */
export default function Ratings() {
  const { t } = useTranslation();
  const { token } = useAdminAuth();
  const [subject, setSubject] = useState<RatingSubjectType>('driver');
  const [leaderboard, setLeaderboard] = useState<RatingLeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const SUBJECTS: { value: RatingSubjectType; label: string }[] = [
    { value: 'driver', label: t('admin.ratings.tabs.driver') },
    { value: 'truck', label: t('admin.ratings.tabs.truck') },
    { value: 'agent', label: t('admin.ratings.tabs.agent') },
  ];

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    const { data, error: err } = await adminGetRatingsLeaderboard(token, subject);
    if (data) setLeaderboard(data.leaderboard);
    if (err) setError(err);
    setLoading(false);
  }, [token, subject]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-admin-text">{t('admin.ratings.title')}</h1>
        <p className="mt-1 text-sm text-admin-subtext">{t('admin.ratings.subtitle')}</p>
      </div>

      <FilterTabs tabs={SUBJECTS} active={subject} onChange={(v) => setSubject(v as RatingSubjectType)} />

      {error ? <p className="text-sm text-brand-danger">{error}</p> : null}

      <div className="overflow-hidden rounded-lg border border-admin-border bg-admin-card">
        {loading ? (
          <p className="px-4 py-8 text-center text-sm text-admin-subtext">{t('common.loading')}</p>
        ) : leaderboard.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-admin-subtext">{t('admin.ratings.noRatings')}</p>
        ) : (
          <ul className="divide-y divide-admin-border">
            {leaderboard.map((row, index) => (
              <li key={row.subjectId} className="flex items-center gap-4 px-4 py-3">
                <span className="w-8 text-base font-bold text-admin-accent">#{index + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-admin-text">{row.label}</p>
                  <div className="mt-1 flex items-center gap-2 text-sm text-admin-subtext">
                    <Stars value={row.avg} />
                    <span>
                      {row.avg.toFixed(1)} · {t('admin.ratings.reviewsCount', { count: row.count, plural: row.count === 1 ? '' : 's' })}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
