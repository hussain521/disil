import { ReactNode, useState, useEffect, useRef } from 'react';
import {
  Bell,
  Check,
  ChevronDown,
  Globe,
  LogOut,
  Moon,
  Search,
  Shield,
  Sun,
  User,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';

export interface TopbarProps {
  title?: ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: ReactNode;
  user?: { name: string; subtitle?: string; avatarUrl?: string | null; role?: string } | null;
  onLogout?: () => void;
  onOpenGlobalSearch?: () => void;
  onOpenMobileMenu?: () => void;
  className?: string;
}

/**
 * High-tier glassmorphism top navigation bar:
 * - Dynamic breadcrumbs and live system indicators
 * - Quick search trigger (Command + K)
 * - Quick Theme toggle (Light/Dark mode)
 * - Notification bell with active badge and dropdown preview
 * - User profile menu with status and clean logout
 */
export default function Topbar({
  title,
  breadcrumbs,
  actions,
  user,
  onLogout,
  onOpenGlobalSearch,
  onOpenMobileMenu,
  className = '',
}: TopbarProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 flex h-16 items-center justify-between gap-2 sm:gap-4 border-b border-admin-border bg-admin-card/85 px-3 sm:px-6 backdrop-blur-xl text-admin-text transition-colors duration-200 ${className}`}
    >
      {/* Left side: Mobile Menu Trigger + Breadcrumb & Title */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            title="Open Menu"
            aria-label="Open Menu"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-admin-border bg-admin-card text-admin-muted transition hover:border-admin-accent hover:text-admin-accent hover:bg-admin-card-hover lg:hidden"
          >
            <span className="sr-only">Toggle navigation</span>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav className="flex items-center gap-1 sm:gap-1.5 text-xs text-admin-muted font-medium overflow-hidden">
            {breadcrumbs.map((crumb, idx) => (
              <div key={idx} className="flex items-center gap-1 sm:gap-1.5 min-w-0 truncate">
                {idx > 0 && <span className="text-admin-border">/</span>}
                {crumb.href ? (
                  <Link to={crumb.href} className="hover:text-admin-accent transition truncate hidden sm:inline">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-admin-text font-semibold truncate">{crumb.label}</span>
                )}
              </div>
            ))}
          </nav>
        ) : (
          <div className="flex items-center gap-2 min-w-0">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm animate-pulse shrink-0" />
            <div className="min-w-0 truncate text-sm sm:text-base font-bold tracking-tight text-admin-text">
              {title}
            </div>
          </div>
        )}
      </div>

      {/* Center/Quick Search Trigger */}
      {onOpenGlobalSearch ? (
        <button
          type="button"
          onClick={onOpenGlobalSearch}
          className="hidden md:flex items-center gap-3 rounded-xl border border-admin-border bg-admin-bg/60 px-4 py-1.5 text-xs text-admin-muted hover:border-admin-accent hover:text-admin-text transition shadow-xs w-64 lg:w-80 justify-between"
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-admin-muted" />
            <span>{t('topbar.searchPlaceholder', 'Search orders, trucks, users...')}</span>
          </div>
          <kbd className="rounded bg-admin-card px-1.5 py-0.5 text-[10px] font-mono border border-admin-border text-admin-subtext">
            ⌘K
          </kbd>
        </button>
      ) : null}

      {/* Right side: Custom Actions, Quick Search on Mobile, Language Switcher, Theme Switcher, Notifications & User Profile */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {onOpenGlobalSearch ? (
          <button
            type="button"
            onClick={onOpenGlobalSearch}
            aria-label={t('common.search', 'Search')}
            className="flex md:hidden h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-admin-border bg-admin-card text-admin-subtext transition hover:border-admin-accent hover:text-admin-accent hover:bg-admin-card-hover"
          >
            <Search className="h-4 w-4" />
          </button>
        ) : null}

        {actions}

        {/* Language Switcher */}
        <LanguageSwitcher variant="topbar" />

        {/* Theme mode toggle */}
        <ThemeToggle variant="topbar" />

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifMenuRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen((prev) => !prev)}
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-admin-border bg-admin-card text-admin-subtext transition hover:border-admin-accent hover:text-admin-accent hover:bg-admin-card-hover"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-admin-accent ring-2 ring-admin-card" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-admin-border bg-admin-card p-3 shadow-xl backdrop-blur-2xl animation-slide-up z-50">
              <div className="flex items-center justify-between border-b border-admin-border pb-2.5 px-2">
                <span className="text-xs font-bold uppercase tracking-wider text-admin-text">{t('topbar.notifications', 'Notifications')}</span>
                <Link
                  to="/admin/notifications"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-xs font-semibold text-admin-accent hover:underline"
                >
                  {t('common.viewAll', 'View all')}
                </Link>
              </div>
              <div className="py-2 space-y-1">
                <div className="rounded-xl p-2 text-xs transition hover:bg-admin-card-hover cursor-pointer">
                  <p className="font-semibold text-admin-text">{t('topbar.mockNotif1Title', 'New Order Placed')}</p>
                  <p className="text-[11px] text-admin-muted">{t('topbar.mockNotif1Desc', 'Client requested a flatbed trailer')}</p>
                  <span className="text-[10px] text-admin-muted font-mono mt-1 inline-block">{t('common.justNow', 'Just now')}</span>
                </div>
                <div className="rounded-xl p-2 text-xs transition hover:bg-admin-card-hover cursor-pointer">
                  <p className="font-semibold text-admin-text">{t('topbar.mockNotif2Title', 'Driver KYC Pending')}</p>
                  <p className="text-[11px] text-admin-muted">{t('topbar.mockNotif2Desc', 'Review driver license and vehicle permit')}</p>
                  <span className="text-[10px] text-admin-muted font-mono mt-1 inline-block">{t('common.tenMinAgo', '10m ago')}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        {user ? (
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setUserDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2.5 rounded-xl border border-admin-border bg-admin-card p-1.5 pr-3 transition hover:border-admin-accent/50 hover:bg-admin-card-hover"
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="h-7 w-7 rounded-lg object-cover ring-1 ring-admin-border"
                />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-admin-accent/20 text-xs font-bold text-admin-accent">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="hidden text-left sm:block">
                <div className="text-xs font-bold leading-tight text-admin-text truncate max-w-[120px]">
                  {user.name}
                </div>
                <div className="text-[10px] leading-tight text-admin-muted truncate max-w-[120px]">
                  {user.subtitle || 'Super Admin'}
                </div>
              </div>
              <ChevronDown className="h-3 w-3 text-admin-muted" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-admin-border bg-admin-card p-2 shadow-xl backdrop-blur-2xl z-50 animation-slide-up">
                <div className="px-3 py-2 border-b border-admin-border mb-1">
                  <p className="text-xs font-bold text-admin-text">{user.name}</p>
                  <p className="text-[11px] text-admin-muted font-mono">{user.subtitle || 'Admin'}</p>
                </div>
                <Link
                  to="/admin/profile"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-admin-subtext transition hover:bg-admin-card-hover hover:text-admin-text"
                >
                  <User className="h-3.5 w-3.5" />
                  <span>{t('topbar.adminProfile', 'Admin Profile')}</span>
                </Link>
                <Link
                  to="/company/track"
                  target="_blank"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-admin-subtext transition hover:bg-admin-card-hover hover:text-admin-text"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>{t('topbar.companyView', 'Company View')}</span>
                </Link>
                {onLogout ? (
                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onLogout();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-400 transition hover:bg-rose-500/10"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>{t('topbar.logout', 'Log out')}</span>
                  </button>
                ) : null}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </header>
  );
}
