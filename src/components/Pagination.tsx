import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdminTheme } from '../lib/adminTheme';

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function getPageNumbers(page: number, totalPages: number): (number | '…')[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages = new Set<number>([1, totalPages, page, page - 1, page + 1]);
  const sorted = Array.from(pages)
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);
  const result: (number | '…')[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - (sorted[i - 1] as number) > 1) result.push('…');
    result.push(p);
  });
  return result;
}

/**
 * Modern pagination bar with page numbers, responsive ellipsis, and disabled states.
 */
export default function Pagination({
  page,
  totalPages,
  onPageChange,
  className = '',
}: PaginationProps) {
  const { isAdminTheme } = useAdminTheme();
  if (totalPages <= 1) return null;

  const buttonClass = (active: boolean) =>
    `min-w-[2.25rem] h-9 flex items-center justify-center rounded-xl px-3 text-xs font-bold transition-all duration-200 ${
      active
        ? isAdminTheme
          ? 'bg-admin-accent text-white shadow-sm glow-accent-sm'
          : 'bg-brand-primary text-white shadow-sm'
        : isAdminTheme
          ? 'text-admin-subtext hover:bg-admin-card-hover hover:text-admin-text'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
    }`;

  return (
    <div className={`flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 p-2 ${className}`}>
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
        className={`${buttonClass(false)} disabled:cursor-not-allowed disabled:opacity-30`}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {getPageNumbers(page, totalPages).map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-xs font-bold text-admin-muted">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p as number)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
            className={buttonClass(p === page)}
          >
            {p}
          </button>
        )
      )}
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
        className={`${buttonClass(false)} disabled:cursor-not-allowed disabled:opacity-30`}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
