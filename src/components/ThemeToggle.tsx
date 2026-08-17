import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../lib/theme';
import { useTranslation } from 'react-i18next';

interface ThemeToggleProps {
  variant?: 'topbar' | 'marketing' | 'company' | 'icon';
  className?: string;
}

export default function ThemeToggle({ variant = 'topbar', className = '' }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const titleText = isDark
    ? t('theme.switchToLight', 'Switch to Light Mode')
    : t('theme.switchToDark', 'Switch to Dark Mode');

  if (variant === 'marketing') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        title={titleText}
        aria-label={titleText}
        className={`flex h-9 w-9 items-center justify-center rounded-full text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all focus:outline-none cursor-pointer ${className}`}
      >
        {isDark ? (
          <Moon className="h-4 w-4 text-indigo-400 transition-transform duration-200" />
        ) : (
          <Sun className="h-4 w-4 text-amber-500 transition-transform duration-200" />
        )}
      </button>
    );
  }

  if (variant === 'company') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        title={titleText}
        aria-label={titleText}
        className={`flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-bold text-gray-800 dark:text-gray-100 shadow-xs transition hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${className}`}
      >
        {isDark ? (
          <>
            <Moon className="h-4 w-4 text-indigo-400" />
            <span className="hidden sm:inline">🌙 {t('topbar.themeDark', 'Dark')}</span>
          </>
        ) : (
          <>
            <Sun className="h-4 w-4 text-amber-500" />
            <span className="hidden sm:inline">☀️ {t('topbar.themeLight', 'Light')}</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={titleText}
      aria-label={titleText}
      className={`relative flex h-9 w-9 items-center justify-center rounded-xl border border-admin-border bg-admin-card text-admin-text shadow-xs transition hover:border-admin-accent hover:text-admin-accent hover:bg-admin-card-hover cursor-pointer ${className}`}
    >
      {isDark ? (
        <Moon className="h-4 w-4 text-indigo-400 transition-transform duration-300" />
      ) : (
        <Sun className="h-4 w-4 text-amber-500 transition-transform duration-300" />
      )}
    </button>
  );
}