import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { applyDocumentLanguage } from '../i18n';

interface LanguageSwitcherProps {
  variant?: 'topbar' | 'marketing' | 'compact';
  className?: string;
}

export default function LanguageSwitcher({ variant = 'topbar', className = '' }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = i18n.language?.startsWith('ar') ? 'ar' : 'en';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    applyDocumentLanguage(lng);
    setOpen(false);
  };

  const toggleQuickLanguage = () => {
    const nextLang = currentLang === 'ar' ? 'en' : 'ar';
    changeLanguage(nextLang);
  };

  const languages = [
    { code: 'ar', label: 'العربية', flag: '🇪🇬', dir: 'ltr' },
    { code: 'en', label: 'English', flag: '🇬🇧', dir: 'ltr' },
  ];

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1 bg-admin-card border border-admin-border rounded-xl p-1 ${className}`}>
        {languages.map((lng) => (
          <button
            key={lng.code}
            type="button"
            onClick={() => changeLanguage(lng.code)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              currentLang === lng.code
                ? 'bg-admin-accent text-white shadow-xs'
                : 'text-admin-subtext hover:text-admin-text hover:bg-admin-card-hover'
            }`}
          >
            <span>{lng.flag}</span>
            <span>{lng.label}</span>
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'marketing') {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          type="button"
          onClick={toggleQuickLanguage}
          title={currentLang === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
          aria-label={t('common.changeLanguage', 'Change Language')}
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all focus:outline-none cursor-pointer"
        >
          <Globe className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        title={currentLang === 'ar' ? 'تغيير اللغة' : 'Change Language'}
        aria-label={currentLang === 'ar' ? 'تغيير اللغة' : 'Change Language'}
        className="relative flex h-9 items-center gap-2 px-2.5 rounded-xl border border-admin-border bg-admin-card text-admin-subtext shadow-sm transition hover:border-admin-accent hover:text-admin-accent hover:bg-admin-card-hover cursor-pointer"
      >
        <Globe className="h-4 w-4" />
        <span className="text-xs font-bold hidden sm:inline">
          {currentLang === 'ar' ? 'العربية' : 'EN'}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-2xl border border-admin-border bg-admin-card p-1.5 shadow-xl backdrop-blur-2xl animation-slide-up z-50">
          <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-admin-muted border-b border-admin-border mb-1">
            {t('common.language', 'Language')}
          </div>
          {languages.map((lng) => (
            <button
              key={lng.code}
              type="button"
              onClick={() => changeLanguage(lng.code)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition ${
                currentLang === lng.code
                  ? 'bg-admin-accent/15 font-bold text-admin-accent border border-admin-accent/20'
                  : 'text-admin-text hover:bg-admin-card-hover'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-sm">{lng.flag}</span>
                <span>{lng.label}</span>
              </span>
              {currentLang === lng.code && <Check className="h-3.5 w-3.5 text-admin-accent" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}