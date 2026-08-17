import NavLogo from "./nav/NavLogo";
import NavLinks from "./nav/NavLinks";
import NavActions from "./nav/NavActions";
import NavMobileMenu from "./nav/NavMobileMenu";

/**
 * Floating rounded pill navbar matching the reference UI design.
 */
export default function MarketingNav() {
  return (
    <header className="sticky top-4 sm:top-6 z-50 w-full px-4 sm:px-6 lg:px-8 pointer-events-none">
      <div className="mx-auto max-w-7xl">
        <div className="pointer-events-auto flex items-center justify-between rounded-full bg-white dark:bg-[#111317] px-6 sm:px-8 py-3 sm:py-3.5 shadow-[0_8px_35px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_35px_rgba(0,0,0,0.5)] border border-gray-100/80 dark:border-gray-800/80 transition-all duration-300">
          {/* Logo & Brand Name */}
          <div className="shrink-0">
            <NavLogo />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center justify-center flex-1 px-6 xl:px-12">
            <NavLinks />
          </div>

          {/* Desktop Actions (Theme Icon, Lang Icon, Login Dropdown, Download Button) */}
          <div className="hidden md:flex items-center shrink-0 gap-3 xl:gap-5">
            <NavActions />
          </div>

          {/* Mobile View Navigation */}
          <div className="flex md:hidden items-center">
            <NavMobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
