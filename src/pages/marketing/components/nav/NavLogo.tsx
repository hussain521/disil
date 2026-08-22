import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NavLogo() {
  const { t } = useTranslation();

  return (
    <Link
      to="/"
      className="flex items-center gap-2.5 group transition-opacity hover:opacity-90 focus:outline-none select-none"
      aria-label={t('common.brandName', 'Diziel')}
    >
      <img
        src="/logo.png"
        alt="Diziel Logo"
        width={32}
        height={32}
        loading="lazy"
        decoding="async"
        className="h-8 w-auto object-contain"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = 'none';
        }}
      />
      <span className="text-xl font-bold tracking-tight text-gray-950 dark:text-white font-sans">
        {t('common.brandName', 'Diziel')}
      </span>
    </Link>
  );
}