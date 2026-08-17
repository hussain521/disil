import { resolveVariant, useAdminTheme, type UiVariant } from '../lib/adminTheme';

export interface FilterTab {
  value: string;
  label: string;
  count?: number;
}

export interface FilterTabsProps {
  tabs: FilterTab[];
  active: string;
  onChange: (value: string) => void;
  className?: string;
  variant?: UiVariant;
}

/**
 * Modern pill-style FilterTabs with active indicator badges and smooth hover transitions.
 */
export default function FilterTabs({ tabs, active, onChange, className = '', variant }: FilterTabsProps) {
  const isAdmin = resolveVariant(variant, useAdminTheme().isAdminTheme) === 'admin';

  return (
    <div className={`flex items-center gap-1.5 p-1 rounded-2xl overflow-x-auto no-scrollbar max-w-full ${isAdmin ? 'bg-admin-card/80 border border-admin-border' : 'bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700'} ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.value === active;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-1.5 sm:px-3.5 text-xs font-bold transition-all duration-200 whitespace-nowrap ${
              isActive
                ? isAdmin
                  ? 'bg-admin-accent text-white shadow-sm glow-accent-sm'
                  : 'bg-brand-primary text-white shadow-sm'
                : isAdmin
                  ? 'text-admin-subtext hover:bg-admin-card-hover hover:text-admin-text'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined ? (
              <span
                className={`rounded-md px-1.5 py-0.5 text-[10px] font-black ${
                  isActive
                    ? 'bg-black/20 text-white'
                    : isAdmin
                      ? 'bg-admin-surface text-admin-muted'
                      : 'bg-black/5 dark:bg-white/10 text-gray-600 dark:text-gray-300'
                }`}
              >
                {tab.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
