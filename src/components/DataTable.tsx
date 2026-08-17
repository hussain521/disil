import { ReactNode } from 'react';
import { resolveVariant, useAdminTheme, type UiVariant } from '../lib/adminTheme';
import { Inbox } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface DataTableColumn<T> {
  key: string;
  header: ReactNode;
  render?: (row: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string;
  loading?: boolean;
  emptyMessage?: ReactNode;
  onRowClick?: (row: T) => void;
  className?: string;
  variant?: UiVariant;
}

/**
 * Modern, responsive Data Table:
 * - Subtle glass border & elevation
 * - Sleek hover states and transition animations
 * - Professional empty & loading states
 */
export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  loading = false,
  emptyMessage,
  onRowClick,
  className = '',
  variant,
}: DataTableProps<T>) {
  const { t } = useTranslation();
  const isAdmin = resolveVariant(variant, useAdminTheme().isAdminTheme) === 'admin';
  const resolvedEmptyMessage = emptyMessage ?? t('common.noRecordsFound', 'No records found');

  return (
    <div
      className={`overflow-hidden rounded-2xl border shadow-sm transition-colors duration-200 ${
        isAdmin
          ? 'border-admin-border bg-admin-card shadow-subtle-dark'
          : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-subtle-light'
      } ${className}`}
    >
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[600px] sm:min-w-full text-left rtl:text-right text-xs sm:text-sm">
          <thead
            className={`border-b text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${
              isAdmin
                ? 'border-admin-border bg-admin-surface/70 text-admin-muted'
                : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400'
            }`}
          >
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-3 py-2.5 sm:px-4 sm:py-3.5 font-bold whitespace-nowrap ${col.headerClassName ?? ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody
            className={`divide-y ${
              isAdmin ? 'divide-admin-border' : 'divide-gray-200 dark:divide-gray-800'
            }`}
          >
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-admin-accent border-t-transparent" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-admin-muted">
                      {t('common.loadingData', 'Loading data…')}
                    </span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Inbox className="h-8 w-8 text-admin-muted/60" />
                    <p className={`text-xs font-medium ${isAdmin ? 'text-admin-subtext' : 'text-gray-600 dark:text-gray-400'}`}>
                      {resolvedEmptyMessage}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={keyExtractor(row, index)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={`group transition duration-150 ${
                    onRowClick ? 'cursor-pointer' : ''
                  } ${
                    isAdmin
                      ? 'hover:bg-admin-card-hover text-admin-text'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-3 py-2.5 sm:px-4 sm:py-3.5 align-middle ${col.className ?? ''}`}
                    >
                      {col.render ? col.render(row, index) : (row as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
