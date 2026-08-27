import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDownload } from "../../../../lib/appDownload";
import { scrollToSection } from "../../../../lib/scroll";

export interface NavItem {
  id: string;
  labelKey: string;
  defaultLabel: string;
}

export const MARKETING_NAV_ITEMS: NavItem[] = [
  {
    id: "about-us",
    labelKey: "marketing.nav.aboutUs",
    defaultLabel: "About Us",
  },
  {
    id: "how-it-works",
    labelKey: "marketing.nav.howItWorks",
    defaultLabel: "How It Works",
  },
  {
    id: "truck-types",
    labelKey: "marketing.nav.truckTypes",
    defaultLabel: "Truck Types",
  },
  {
    id: "testimonials",
    labelKey: "marketing.nav.testimonials",
    defaultLabel: "Testimonials",
  },
  { id: "blog", labelKey: "marketing.nav.blog", defaultLabel: "Blog" },
  {
    id: "app-download",
    labelKey: "marketing.nav.appDownload",
    defaultLabel: "App Download",
  },
];

interface NavLinksProps {
  onItemClick?: () => void;
  className?: string;
  itemClassName?: string;
}

export default function NavLinks({
  onItemClick,
  className = "",
  itemClassName = "",
}: NavLinksProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { handleDownload } = useAppDownload();

  const handleScrollToSection = (sectionId: string, e?: React.MouseEvent) => {
    if (onItemClick) onItemClick();

    if (sectionId === "app-download") {
      handleDownload(e);
      return;
    }

    if (location.pathname !== "/") {
      navigate(`/#${sectionId}`);
      return;
    }

    scrollToSection(sectionId);
  };

  return (
    <nav className={`flex items-center gap-5 xl:gap-7 ${className}`}>
      {MARKETING_NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={(e) => handleScrollToSection(item.id, e)}
          className={`text-[15px] font-normal text-gray-700 dark:text-gray-200 transition-colors duration-150 hover:text-amber-600 dark:hover:text-amber-400 focus:outline-none cursor-pointer whitespace-nowrap ${itemClassName}`}
        >
          {t(item.labelKey, item.defaultLabel)}
        </button>
      ))}
    </nav>
  );
}
