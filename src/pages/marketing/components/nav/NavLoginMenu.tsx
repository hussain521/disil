import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Building2, ShieldCheck } from 'lucide-react';

interface NavLoginMenuProps {
  className?: string;
  onItemClick?: () => void;
}

export default function NavLoginMenu({ className = '', onItemClick }: NavLoginMenuProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = () => {
    setOpen(false);
    if (onItemClick) onItemClick();
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        className="flex items-center gap-1 text-[15px] font-normal text-gray-700 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors focus:outline-none cursor-pointer py-1 px-1"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span>{t('marketing.nav.login', 'Login')}</span>
        <ChevronDown className={`h-3.5 w-3.5 opacity-60 transition-transform duration-200 ${open ? 'rotate-180 text-amber-500' : ''}`} />
      </button>

      {open && (
        <div
          onMouseLeave={() => setOpen(false)}
          className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-60 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-2 shadow-2xl ring-1 ring-black/5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800 mb-1">
            {t('marketing.nav.login', 'Choose Login Portal')}
          </div>

          <Link
            to="/company/login"
            onClick={handleSelect}
            className="flex items-center gap-3 rounded-xl p-2.5 text-start transition-colors hover:bg-amber-500/10 dark:hover:bg-amber-500/15 group"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400">
                {t('marketing.nav.companyLogin', 'Company Login')}
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {t('marketing.nav.companyDesc', 'Fleet & shipments')}
              </p>
            </div>
          </Link>

          <Link
            to="/admin/login"
            onClick={handleSelect}
            className="flex items-center gap-3 rounded-xl p-2.5 text-start transition-colors hover:bg-blue-500/10 dark:hover:bg-blue-500/15 group mt-1"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {t('marketing.nav.adminLogin', 'Admin Login')}
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {t('marketing.nav.adminDesc', 'Operations & platform')}
              </p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}