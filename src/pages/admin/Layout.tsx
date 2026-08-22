import { useMemo, useState, useEffect, Suspense } from 'react';
import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import RouteLoadingFallback from '../../components/RouteLoadingFallback';
import {
  Activity,
  Award,
  Bell,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  Compass,
  FileCheck,
  FileSpreadsheet,
  FileText,
  FolderLock,
  Grid,
  HandCoins,
  History,
  Layers,
  LayoutDashboard,
  LifeBuoy,
  MapPin,
  Package,
  Receipt,
  Search,
  Settings,
  Shield,
  Tag,
  Truck,
  UserCheck,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import Sidebar, { SidebarNavItem } from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import { canAccessAdminScreen, useAdminSubRoles } from '../../lib/adminAccess';
import { useAdminAuth } from '../../lib/auth';
import { useTranslation } from 'react-i18next';

interface AdminNavEntry {
  key: string;
  label: string;
  href: string;
  icon: any;
}

interface AdminNavGroup {
  key: string;
  label: string;
  items: AdminNavEntry[];
}

const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    key: 'core',
    label: 'Core Operations',
    items: [
      { key: 'dashboard', label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { key: 'new-offers', label: 'New Offers', href: '/admin/new-offers', icon: HandCoins },
      { key: 'orders', label: 'Orders Management', href: '/admin/orders', icon: Package },
      { key: 'users', label: 'User Directory', href: '/admin/users', icon: Users },
      { key: 'profile', label: 'Admin Profile', href: '/admin/profile', icon: Shield },
    ],
  },
  {
    key: 'operations',
    label: 'Dispatch & Fleet',
    items: [
      { key: 'order-management', label: 'Order Dispatch', href: '/admin/order-management', icon: Layers },
      { key: 'track', label: 'Live Tracking', href: '/admin/track', icon: Compass },
      { key: 'fleet', label: 'Fleet Registry', href: '/admin/fleet', icon: Truck },
      { key: 'search', label: 'Advanced Search', href: '/admin/search', icon: Search },
      { key: 'waybills', label: 'Waybill Control', href: '/admin/waybills', icon: FileSpreadsheet },
    ],
  },
  {
    key: 'review',
    label: 'Review & Quality',
    items: [
      { key: 'documents', label: 'Document Verification', href: '/admin/documents', icon: FileCheck },
      { key: 'approvals', label: 'KYC & Approvals', href: '/admin/approvals', icon: UserCheck },
      { key: 'complaints', label: 'Support & Disputes', href: '/admin/complaints', icon: LifeBuoy },
      { key: 'ratings', label: 'Ratings & Reviews', href: '/admin/ratings', icon: Award },
      { key: 'categories', label: 'Cargo Categories', href: '/admin/categories', icon: Tag },
    ],
  },
  {
    key: 'accounts',
    label: 'Financial & Pricing',
    items: [
      { key: 'financial', label: 'Financial Balance', href: '/admin/financial', icon: Wallet },
      { key: 'dashboards', label: 'Revenue Analytics', href: '/admin/dashboards', icon: Activity },
      { key: 'payment-details', label: 'Payout Details', href: '/admin/payment-details', icon: Receipt },
      { key: 'pricing', label: 'Pricing Matrix', href: '/admin/pricing', icon: Grid },
      { key: 'quotes', label: 'Quote Requests', href: '/admin/quotes', icon: FileText },
    ],
  },
  {
    key: 'misc',
    label: 'Platform Administration',
    items: [
      { key: 'admins', label: 'Admin Team', href: '/admin/admins', icon: FolderLock },
      { key: 'audit', label: 'Audit Trail', href: '/admin/audit', icon: History },
      { key: 'contracts', label: 'Contracts Hub', href: '/admin/contracts', icon: Building2 },
      { key: 'vehicle-types', label: 'Vehicle Specs', href: '/admin/vehicle-types', icon: Settings },
      { key: 'notifications', label: 'Broadcasts & Alerts', href: '/admin/notifications', icon: Bell },
    ],
  },
];

type NavRow = SidebarNavItem & { isHeader?: boolean; groupKey?: string };

export default function AdminLayout() {
  const { t } = useTranslation();
  const { token, user, loading, logout } = useAdminAuth();
  const { allowedTabs } = useAdminSubRoles();
  const location = useLocation();
  const navigate = useNavigate();
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('diziel_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  // Close mobile sidebar on route changes
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('diziel_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setGlobalSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setGlobalSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navRows = useMemo<NavRow[]>(() => {
    const rows: NavRow[] = [];
    for (const group of ADMIN_NAV_GROUPS) {
      const visibleItems = group.items.filter((item) => canAccessAdminScreen(item.key, allowedTabs));
      if (!visibleItems.length) continue;
      rows.push({
        key: `header:${group.key}`,
        label: t(`nav.groups.${group.key}`, group.label),
        isHeader: true,
        groupKey: group.key,
      });
      for (const item of visibleItems) {
        const IconComponent = item.icon;
        rows.push({
          key: item.key,
          label: t(`nav.items.${item.key}`, item.label),
          href: item.href,
          groupKey: group.key,
          icon: <IconComponent className="h-4 w-4 shrink-0" />,
        });
      }
    }
    return rows;
  }, [allowedTabs, t]);

  const activeKey = useMemo(() => {
    const segment = location.pathname.replace(/^\/admin\/?/, '').split('/')[0];
    return segment || 'dashboard';
  }, [location.pathname]);

  const currentLabel = useMemo(() => {
    for (const group of ADMIN_NAV_GROUPS) {
      const found = group.items.find((i) => i.key === activeKey);
      if (found) {
        return {
          group: t(`nav.groups.${group.key}`, group.label),
          item: t(`nav.items.${found.key}`, found.label),
        };
      }
    }
    return { group: t('nav.groups.core', 'Admin'), item: t('nav.items.dashboard', 'Dashboard') };
  }, [activeKey, t]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-admin-bg text-sm text-admin-subtext">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-admin-accent border-t-transparent" />
          <span className="font-semibold text-xs tracking-wider uppercase text-admin-muted">{t('common.loadingPlatform', 'Loading platform…')}</span>
        </div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const allSearchableItems = ADMIN_NAV_GROUPS.flatMap((g) =>
    g.items.map((i) => ({ ...i, groupName: g.label }))
  ).filter((i) =>
    i.label.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
    i.groupName.toLowerCase().includes(globalSearchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-admin-bg transition-colors duration-300 font-sans antialiased text-admin-text">
      {/* Fixed Sticky Sidebar & Mobile Drawer */}
      <Sidebar
        items={navRows}
        activeKey={activeKey}
        collapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        header={
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 to-rose-400 text-white shadow-lg glow-accent-sm font-bold text-base">
              D
            </div>
            <div className="min-w-0 truncate">
              <div className="flex items-center gap-1.5 font-bold tracking-tight text-admin-text text-sm">
                <span>Diziel</span>
                <span className="rounded-md bg-admin-accent/15 px-1.5 py-0.5 text-[10px] font-black uppercase text-admin-accent border border-admin-accent/20">
                  {t('common.control', 'Control')}
                </span>
              </div>
              <p className="text-[10px] text-admin-muted font-medium truncate">{t('common.tagline', 'Logistics & Fleet OS')}</p>
            </div>
          </div>
        }
        footer={
          !isSidebarCollapsed ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 font-bold text-xs">
                  ●
                </div>
                <div className="min-w-0 truncate">
                  <p className="text-[11px] font-bold text-admin-text truncate">Diziel Cloud Egypt</p>
                  <p className="text-[10px] text-emerald-400 font-mono">{t('common.connected', 'Connected')}</p>
                </div>
              </div>
              <Link
                to="/admin/audit"
                title={t('nav.items.audit', 'Audit Trail')}
                className="rounded-lg p-1.5 text-admin-muted hover:bg-admin-card hover:text-admin-text transition shrink-0"
              >
                <History className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="flex justify-center">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm" title="Connected" />
            </div>
          )
        }
        renderLink={(item, content, isActive) => {
          const row = item as NavRow;
          if (row.isHeader) {
            return null;
          }
          const baseClass = `group flex w-full items-center gap-3 rounded-xl transition-all duration-200 ${
            isSidebarCollapsed ? 'justify-center p-2.5' : 'px-3 py-2 text-xs font-semibold'
          } ${
            isActive
              ? 'bg-admin-accent/15 text-admin-accent font-bold shadow-xs border border-admin-accent/20'
              : 'text-admin-subtext hover:bg-admin-card-hover hover:text-admin-text border border-transparent'
          }`;
          return (
            <Link to={row.href ?? '#'} className={baseClass}>
              {content}
            </Link>
          );
        }}
      />

      {/* Main Content Area */}
      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar
          title={currentLabel.item}
          breadcrumbs={[
            { label: currentLabel.group },
            { label: currentLabel.item },
          ]}
          user={user ? { name: user.fullName, subtitle: user.phone, role: user.role } : null}
          onLogout={handleLogout}
          onOpenGlobalSearch={() => setGlobalSearchOpen(true)}
          onOpenMobileMenu={() => setMobileSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl animation-fade-in pb-12">
            <Suspense fallback={<RouteLoadingFallback />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>

      {/* Global Quick Search Modal (⌘K) */}
      {globalSearchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 pt-20"
          onClick={() => setGlobalSearchOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-2xl border border-admin-border bg-admin-card p-4 shadow-2xl backdrop-blur-2xl animation-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-admin-border pb-3 px-2">
              <Search className="h-5 w-5 text-admin-muted" />
              <input
                autoFocus
                type="text"
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                placeholder={t('topbar.searchScreensPlaceholder', 'Search screens, orders, tools...')}
                className="w-full bg-transparent text-sm text-admin-text placeholder:text-admin-muted focus:outline-none"
              />
              <button
                onClick={() => setGlobalSearchOpen(false)}
                className="rounded-lg p-1 text-admin-muted hover:text-admin-text"
                aria-label={t('common.close', 'Close')}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto no-scrollbar py-2">
              <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-admin-muted">
                {t('topbar.adminNavigation', 'Admin Navigation')} ({allSearchableItems.length})
              </div>
              {allSearchableItems.length === 0 ? (
                <p className="p-4 text-center text-xs text-admin-muted">{t('common.noMatchesFound', 'No matching navigation found')}</p>
              ) : (
                <div className="space-y-1 mt-1">
                  {allSearchableItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.href}
                        onClick={() => {
                          setGlobalSearchOpen(false);
                          navigate(item.href);
                        }}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs text-admin-text transition hover:bg-admin-card-hover"
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="h-4 w-4 text-admin-accent" />
                          <span className="font-semibold">{t(`nav.items.${item.key}`, item.label)}</span>
                        </div>
                        <span className="text-[10px] text-admin-muted uppercase tracking-wider">
                          {item.groupName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-admin-border pt-2.5 px-2 text-[10px] text-admin-muted">
              <span>{t('topbar.pressEscToExit', 'Press ESC to exit')}</span>
              <span>{t('topbar.useArrowsToNavigate', 'Use arrows to navigate')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
