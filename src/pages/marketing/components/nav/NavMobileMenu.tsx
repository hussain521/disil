import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Building2, ShieldCheck } from 'lucide-react';
import LanguageSwitcher from '../../../../components/LanguageSwitcher';
import ThemeToggle from '../../../../components/ThemeToggle';
import { MARKETING_NAV_ITEMS } from './NavLinks';
import NavDownloadButton from './NavDownloadButton';
import { useAppDownload } from '../../../../lib/appDownload';
import { scrollToSection } from '../../../../lib/scroll';

export default function NavMobileMenu() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { handleDownload } = useAppDownload();

  const handleScrollToSection = (sectionId: string, e?: React.MouseEvent) => {
    setIsOpen(false);

    if (sectionId === 'app-download') {
      handleDownload(e);
      return;
    }

    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
      return;
    }

    scrollToSection(sectionId);
  };

  return (
    <div className="flex items-center gap-2 md:hidden">
      <ThemeToggle variant="marketing" />
      <LanguageSwitcher variant="marketing" />

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none"
        aria-label={t('common.toggleMenu', 'Toggle menu')}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isOpen && (
        <div className="fixed inset-x-4 top-20 z-50 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-5 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-2">
            {MARKETING_NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={(e) => handleScrollToSection(item.id, e)}
                className="flex w-full items-center rounded-xl px-4 py-3 text-start text-sm font-semibold text-gray-800 dark:text-gray-100 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 transition"
              >
                {t(item.labelKey, item.defaultLabel)}
              </button>
            ))}
          </nav>

          <div className="mt-4 border-t border-gray-100 dark:border-gray-800 pt-4 flex flex-col gap-2.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-2">
              {t('marketing.nav.login', 'Portals Login')}
            </div>

            <Link
              to="/company/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:border-amber-500 hover:text-amber-600 transition"
            >
              <Building2 className="h-5 w-5 text-amber-500" />
              <span>{t('marketing.nav.companyLogin', 'Company Login')}</span>
            </Link>

            <Link
              to="/admin/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:border-blue-500 hover:text-blue-600 transition"
            >
              <ShieldCheck className="h-5 w-5 text-blue-500" />
              <span>{t('marketing.nav.adminLogin', 'Admin Login')}</span>
            </Link>

            <div className="mt-2">
              <NavDownloadButton
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-3"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}