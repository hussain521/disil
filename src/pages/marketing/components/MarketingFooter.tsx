import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Globe, AtSign, Play, Apple } from "lucide-react";
import { APP_STORE_URL, PLAY_STORE_URL } from "../../../lib/appDownload";

/**
 * MarketingFooter matching the reference screenshot design:
 * - Dark navy background (#0e223d)
 * - Brand logo (public/logo.png) & tagline
 * - Quick Links
 * - Get the App (App Store & Play Store badges linking to iOS/Android)
 * - Connect (Globe, @, Network icons)
 * - Bottom Bar: Copyright 2026 Diziel Logistics. All rights reserved. & Privacy Policy / Terms of Service
 */
export default function MarketingFooter() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#0e223d] text-slate-300 font-sans border-t border-[#193256]">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12 pt-16 pb-12">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 items-start">
          {/* Column 1: Brand & Slogan */}
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-flex items-center gap-3 group focus:outline-none"
              aria-label="Diziel"
            >
              <img
                src="/logo.png"
                alt="Diziel"
                className="h-9 w-auto object-contain brightness-110 drop-shadow-sm"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="text-2xl font-bold tracking-tight text-white font-sans">
                {t("common.brandName", "Diziel")}
              </span>
            </Link>
            <p className="text-[14px] leading-relaxed text-slate-300/85 max-w-xs font-normal">
              {t(
                "marketing.footer.tagline",
                "Revolutionizing the freight marketplace with modern logistics technology.",
              )}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-[16px] font-medium text-white tracking-normal">
              {t("marketing.footer.quickLinks", "Quick Links")}
            </h3>
            <ul className="space-y-2.5 text-[14px]">
              <li>
                <Link
                  to="/contact-team"
                  className="text-slate-300/85 hover:text-white transition-colors duration-150 block"
                >
                  {t("marketing.footer.contactTeam", "Contact & Team")}
                </Link>
              </li>
              <li>
                <Link
                  to="/track"
                  className="text-slate-300/85 hover:text-white transition-colors duration-150 block"
                >
                  {t("marketing.footer.trackShipment", "Track Shipment")}
                </Link>
              </li>
              <li>
                <Link
                  to="/company/login"
                  className="text-slate-300/85 hover:text-white transition-colors duration-150 block"
                >
                  {t("marketing.footer.carrierPortal", "Carrier Portal")}
                </Link>
              </li>
              <li>
                <a
                  href="/#business"
                  className="text-slate-300/85 hover:text-white transition-colors duration-150 block"
                >
                  {t("marketing.footer.shipperSolutions", "Shipper Solutions")}
                </a>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-slate-300/85 hover:text-white transition-colors duration-150 block"
                >
                  {t("marketing.footer.safetyCompliance", "Safety & Compliance")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Get the App */}
          <div className="space-y-4">
            <h3 className="text-[16px] font-medium text-white tracking-normal">
              {t("marketing.footer.getTheApp", "Get the App")}
            </h3>
            <div className="space-y-2.5 max-w-[170px]">
              {/* App Store Button */}
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[#152a48] hover:bg-[#1c3860] border border-white/5 text-white transition-all shadow-inner group"
                aria-label="App Store"
              >
                <Apple className="h-5 w-5 text-white flex-shrink-0" />
                <span className="text-[13px] font-medium text-white">
                  {t("marketing.footer.appStore", "App Store")}
                </span>
              </a>

              {/* Play Store Button */}
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[#152a48] hover:bg-[#1c3860] border border-white/5 text-white transition-all shadow-inner group"
                aria-label="Play Store"
              >
                <Play className="h-4 w-4 text-white fill-white flex-shrink-0" />
                <span className="text-[13px] font-medium text-white">
                  {t("marketing.footer.playStore", "Play Store")}
                </span>
              </a>
            </div>
          </div>

          {/* Column 4: Connect */}
          <div className="space-y-4">
            <h3 className="text-[16px] font-medium text-white tracking-normal">
              {t("marketing.footer.connect", "Connect")}
            </h3>
            <div className="flex items-center gap-4 text-white">
              {/* Globe Icon */}
              <a
                href="/"
                className="text-slate-200 hover:text-white transition-colors duration-150 p-1"
                aria-label="Website"
              >
                <Globe className="h-6 w-6" strokeWidth={1.8} />
              </a>

              {/* AtSign Icon */}
              <a
                href="mailto:operations@diziel.com"
                className="text-slate-200 hover:text-white transition-colors duration-150 p-1"
                aria-label="Email"
              >
                <AtSign className="h-6 w-6" strokeWidth={1.8} />
              </a>

              {/* Connected Network Nodes Icon matching screenshot */}
              <Link
                to="/contact-team"
                className="text-slate-200 hover:text-white transition-colors duration-150 p-1"
                aria-label={t("marketing.footer.contactTeam", "Contact & Team")}
                title={t("marketing.footer.contactTeam", "Contact & Team")}
              >
                <svg
                  className="h-6 w-6 text-slate-200 hover:text-white transition-colors"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="2.5" fill="currentColor" />
                  <circle cx="18" cy="6" r="2" />
                  <circle cx="6" cy="6" r="2" />
                  <circle cx="6" cy="18" r="2" />
                  <circle cx="18" cy="18" r="2" />
                  <line x1="12" y1="9.5" x2="12" y2="4" />
                  <line x1="10" y1="13.5" x2="7.5" y2="16.5" />
                  <line x1="14" y1="13.5" x2="16.5" y2="16.5" />
                  <line x1="10" y1="10.5" x2="7.5" y2="7.5" />
                  <line x1="14" y1="10.5" x2="16.5" y2="7.5" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Divider, Copyright & Legal Links */}
        <div className="mt-16 pt-8 border-t border-[#183256] flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-slate-400">
          <div>
            {t(
              "marketing.footer.copyright",
              "© 2026 Diziel Logistics. All rights reserved.",
              { year: 2026 },
            )}
          </div>
          <div className="flex items-center gap-8">
            <Link
              to="/privacy-policy"
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              {t("marketing.footer.privacyPolicy", "Privacy Policy")}
            </Link>
            <Link
              to="/terms"
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              {t("marketing.footer.termsOfService", "Terms of Service")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
