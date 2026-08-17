import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { resolveVariant, useAdminTheme, type UiVariant } from '../lib/adminTheme';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: UiVariant;
}

const SIZE_CLASSES: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

/**
 * Modern backdrop-blurred Modal dialog:
 * - Rounded corners, smooth elevation, ESC key dismiss
 */
export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  className = '',
  variant,
}: ModalProps) {
  const { t } = useTranslation();
  const isAdmin = resolveVariant(variant, useAdminTheme().isAdminTheme) === 'admin';

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-md animation-fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${SIZE_CLASSES[size]} max-h-[90vh] flex flex-col rounded-2xl border shadow-2xl backdrop-blur-xl animation-slide-up transition-all overflow-hidden ${
          isAdmin
            ? 'border-admin-border bg-admin-card text-admin-text'
            : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100'
        } ${className}`}
      >
        {title ? (
          <div
            className={`flex items-center justify-between border-b px-4 py-3 sm:px-6 sm:py-4 shrink-0 ${
              isAdmin ? 'border-admin-border' : 'border-gray-200 dark:border-gray-800'
            }`}
          >
            <h2 className="text-sm sm:text-base font-bold tracking-tight">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className={`rounded-xl p-1.5 transition ${
                isAdmin
                  ? 'text-admin-muted hover:bg-admin-card-hover hover:text-admin-text'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
              aria-label={t('common.close')}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : null}
        <div className="px-4 py-4 sm:px-6 sm:py-5 overflow-y-auto max-h-[calc(90vh-8rem)] scrollbar-thin">{children}</div>
        {footer ? (
          <div
            className={`flex flex-wrap items-center justify-end rtl:justify-start gap-2 sm:gap-2.5 border-t px-4 py-3 sm:px-6 sm:py-4 shrink-0 ${
              isAdmin ? 'border-admin-border bg-admin-bg/40' : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50'
            }`}
          >
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
