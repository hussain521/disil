import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface ImageZoomModalProps {
  src: string | null | undefined;
  alt?: string;
  onClose: () => void;
}

/** Full-screen click-to-zoom viewer for a single image (e.g. pickup/delivery check photos, documents). */
export default function ImageZoomModal({ src, alt = '', onClose }: ImageZoomModalProps) {
  const { t } = useTranslation();
  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 rtl:right-auto rtl:left-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
        aria-label={t('common.close')}
      >
        <X className="h-5 w-5" />
      </button>
      <img
        src={src}
        alt={alt}
        width={1000}
        height={800}
        decoding="async"
        onClick={(e) => e.stopPropagation()}
        className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
      />
    </div>
  );
}
