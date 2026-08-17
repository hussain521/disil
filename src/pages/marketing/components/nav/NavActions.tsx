import LanguageSwitcher from '../../../../components/LanguageSwitcher';
import ThemeToggle from '../../../../components/ThemeToggle';
import NavLoginMenu from './NavLoginMenu';
import NavDownloadButton from './NavDownloadButton';

interface NavActionsProps {
  className?: string;
  onActionClick?: () => void;
}

export default function NavActions({ className = '', onActionClick }: NavActionsProps) {
  return (
    <div className={`flex items-center gap-4 sm:gap-6 ${className}`}>
      {/* Login Portal Selector */}
      <NavLoginMenu onItemClick={onActionClick} />

      {/* Primary CTA Button matching image */}
      <NavDownloadButton onClick={onActionClick} />

      {/* Icon-only Controls (Theme Toggle & Language Switcher) */}
      <div className="flex items-center gap-1 border-s border-gray-200 dark:border-gray-800 ps-2 sm:ps-3">
        <ThemeToggle variant="marketing" />
        <LanguageSwitcher variant="marketing" />
      </div>
    </div>
  );
}