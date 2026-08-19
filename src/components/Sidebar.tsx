import { ReactNode, useState } from 'react';
import { ChevronDown, ChevronRight, PanelLeftClose, PanelLeftOpen, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface SidebarNavItem {
  key: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  badge?: ReactNode;
  groupKey?: string;
  onClick?: () => void;
}

export interface SidebarProps {
  items: SidebarNavItem[];
  activeKey: string;
  onSelect?: (key: string) => void;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  /** Render each nav item — pass react-router's `Link`/`NavLink` here to get client-side routing. */
  renderLink?: (item: SidebarNavItem, content: ReactNode, isActive: boolean) => ReactNode;
}

/**
 * Modern, high-tier portal sidebar with:
 * - Collapsible icon-only mode when closed
 * - Fixed viewport height with hidden scrollbar (.no-scrollbar)
 * - Quick filter search
 * - Collapsible groups and badge counters
 */
export default function Sidebar({
  items,
  activeKey,
  onSelect,
  header,
  footer,
  className = '',
  collapsed = false,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile,
  renderLink,
}: SidebarProps) {
  const { t } = useTranslation();
  const [filterQuery, setFilterQuery] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupKey: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  const filteredItems = items.filter((item) => {
    if (!filterQuery) return true;
    return item.label.toLowerCase().includes(filterQuery.toLowerCase());
  });

  const sidebarContent = (
    <div className="flex h-full max-h-screen flex-col bg-admin-bg text-admin-text">
      {/* Header Bar */}
      <div className="relative border-b border-admin-border shrink-0 h-16 flex items-center justify-between px-4">
        {!collapsed || mobileOpen ? (
          <>
            <div className="flex-1 min-w-0 mr-2">{header}</div>
            {onCloseMobile && mobileOpen ? (
              <button
                type="button"
                onClick={onCloseMobile}
                title="Close Navigation"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-admin-border bg-admin-card text-admin-muted transition hover:border-admin-accent hover:text-admin-accent hover:bg-admin-card-hover lg:hidden"
              >
                ✕
              </button>
            ) : onToggleCollapse ? (
              <button
                type="button"
                onClick={onToggleCollapse}
                title="Collapse Sidebar"
                className="hidden lg:flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-admin-border bg-admin-card text-admin-muted transition hover:border-admin-accent hover:text-admin-accent hover:bg-admin-card-hover"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            ) : null}
          </>
        ) : (
          <div className="w-full flex items-center justify-center">
            <button
              type="button"
              onClick={onToggleCollapse}
              title="Expand Sidebar"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 to-rose-400 text-white shadow-lg glow-accent-sm transition hover:scale-105 hover:shadow-rose-500/30"
            >
              <span className="font-extrabold text-base leading-none">D</span>
            </button>
          </div>
        )}
      </div>

      {/* Quick Search inside Sidebar (visible when expanded or mobile) */}
      {(!collapsed || mobileOpen) && (
        <div className="px-4 pt-3 pb-1 shrink-0">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-admin-muted" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder={t('sidebar.searchNavPlaceholder', 'Search navigation...')}
              className="w-full rounded-lg border border-admin-border bg-admin-card/70 py-1.5 pl-8 pr-3 text-xs text-admin-text placeholder:text-admin-muted focus:border-admin-accent focus:bg-admin-card focus:outline-none focus:ring-1 focus:ring-admin-accent transition"
            />
            {filterQuery && (
              <button
                onClick={() => setFilterQuery('')}
                className="absolute right-2.5 top-2 text-xs text-admin-muted hover:text-admin-text"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* Navigation items list - scrollable with hidden scrollbar */}
      <nav className={`flex-1 space-y-1 overflow-y-auto no-scrollbar py-3 ${collapsed && !mobileOpen ? 'px-2' : 'px-3'}`}>
        {filteredItems.map((item) => {
          const isActive = item.key === activeKey;
          const isGroupHeader = (item as any).isHeader;
          const groupKey = item.groupKey || item.key;
          const isGroupCollapsed = collapsedGroups[groupKey];

          if (isGroupHeader) {
            if (collapsed && !mobileOpen) {
              return (
                <div key={item.key} className="my-2 border-t border-admin-border/60" />
              );
            }
            return (
              <div
                key={item.key}
                onClick={() => toggleGroup(groupKey)}
                className="flex cursor-pointer items-center justify-between px-3 pb-1.5 pt-4 text-[11px] font-bold uppercase tracking-wider text-admin-muted transition hover:text-admin-text select-none first:pt-1"
              >
                <span>{item.label}</span>
                <span className="text-admin-muted/70">
                  {isGroupCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </span>
              </div>
            );
          }

          if (item.groupKey && collapsedGroups[item.groupKey] && !filterQuery && (!collapsed || mobileOpen)) {
            return null;
          }

          const content = (
            <>
              {item.icon ? (
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-xl transition duration-200 shrink-0 ${
                    isActive
                      ? 'bg-admin-accent text-white shadow-sm glow-accent-sm'
                      : 'bg-admin-card/80 text-admin-subtext group-hover:bg-admin-card-hover group-hover:text-admin-text'
                  }`}
                >
                  {item.icon}
                </span>
              ) : null}

              {(!collapsed || mobileOpen) && (
                <>
                  <span className="flex-1 truncate tracking-tight text-xs font-semibold">{item.label}</span>
                  {item.badge}
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-admin-accent shadow-sm" />
                  )}
                </>
              )}
            </>
          );

          const baseClass = `group relative flex w-full items-center gap-3 rounded-xl transition-all duration-200 ${
            collapsed && !mobileOpen ? 'justify-center p-2' : 'px-3 py-2 text-xs font-semibold'
          } ${
            isActive
              ? 'bg-admin-accent/15 text-admin-accent font-bold shadow-xs border border-admin-accent/20'
              : 'text-admin-subtext hover:bg-admin-card-hover hover:text-admin-text border border-transparent'
          }`;

          if (renderLink) {
            return (
              <div
                key={item.key}
                title={collapsed && !mobileOpen ? item.label : undefined}
                onClick={() => {
                  if (mobileOpen && onCloseMobile) {
                    onCloseMobile();
                  }
                }}
              >
                {renderLink(item, content, isActive)}
              </div>
            );
          }

          if (item.href) {
            return (
              <a
                key={item.key}
                href={item.href}
                title={collapsed && !mobileOpen ? item.label : undefined}
                onClick={() => {
                  onSelect?.(item.key);
                  item.onClick?.();
                  if (mobileOpen && onCloseMobile) onCloseMobile();
                }}
                className={baseClass}
              >
                {content}
              </a>
            );
          }

          return (
            <button
              key={item.key}
              type="button"
              title={collapsed && !mobileOpen ? item.label : undefined}
              onClick={() => {
                onSelect?.(item.key);
                item.onClick?.();
                if (mobileOpen && onCloseMobile) onCloseMobile();
              }}
              className={baseClass}
            >
              {content}
            </button>
          );
        })}
      </nav>

      {/* Footer / Account overview */}
      {footer ? (
        <div className={`border-t border-admin-border bg-admin-card/40 shrink-0 ${collapsed && !mobileOpen ? 'p-2 flex justify-center' : 'p-3'}`}>
          {footer}
        </div>
      ) : null}
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animation-fade-in"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] border-r border-admin-border bg-admin-bg/95 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Sticky Sidebar */}
      <aside
        className={`hidden lg:flex sticky top-0 h-screen max-h-screen shrink-0 flex-col border-r border-admin-border bg-admin-bg/95 backdrop-blur-xl text-admin-text transition-all duration-300 select-none z-30 ${
          collapsed ? 'w-20' : 'w-72'
        } ${className}`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
