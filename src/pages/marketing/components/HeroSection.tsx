import { useTranslation } from "react-i18next";
import { ArrowDownToLine, QrCode, Apple, Smartphone } from "lucide-react";
import { useAppDownload } from "../../../lib/appDownload";

export default function HeroSection() {
  const { t } = useTranslation();
  const { platform, downloadUrl, handleDownload, scrollToAppSection } =
    useAppDownload();

  const downloadCtaText =
    platform === "ios"
      ? t("marketing.nav.downloadForIos", "Download for iPhone (iOS)")
      : platform === "android"
        ? t("marketing.nav.downloadForAndroid", "Download for Android")
        : t("marketing.hero.ctaDownload", "Download App");

  return (
    <section className="relative overflow-hidden rounded-b-[60px] sm:rounded-b-[86px] bg-[#102746] dark:bg-[#0b1b30] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          {/* ================= LEFT CONTENT ================= */}
          <div className="max-w-2xl text-center lg:text-left rtl:lg:text-right">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] px-4 py-2 text-[10px] font-medium uppercase tracking-[0.14em] text-white/90 backdrop-blur-sm sm:text-[11px]">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />

              <span>
                {t("marketing.hero.badge", "Live Network Tracking")}
              </span>
            </div>

            {/* Heading */}
            <h1 className="mt-8 text-[46px] font-medium leading-[1.03] tracking-[-0.035em] sm:text-[56px] md:text-[64px] lg:text-[62px] xl:text-[68px]">
              <span className="block">
                {t("marketing.hero.titleLine1", "Move Cargo")}
              </span>

              <span className="block">
                {t("marketing.hero.titleLine2", "Anywhere in")}
              </span>

              <span className="block">
                {t("marketing.hero.titleLine3", "Seconds.")}
              </span>

              <span className="mt-1 block text-[#FFAA1D]">
                {t("marketing.hero.titleLine4", "Right From Your")}
              </span>

              <span className="block text-[#FFAA1D]">
                {t("marketing.hero.titleLine5", "Phone.")}
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mt-8 max-w-xl text-base leading-7 text-white/75 sm:text-lg lg:mx-0">
              {t(
                "marketing.hero.description",
                "Book a Jumbo, Tipper, Flatbed or Refrigerated truck instantly. Total transparency, guaranteed capacity.",
              )}
            </p>

            {/* ================= CTA BUTTONS ================= */}
            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              {/* Download App (Detects iOS/Android/Desktop) */}
              <a
                href={downloadUrl}
                onClick={handleDownload}
                title={downloadCtaText}
                aria-label={downloadCtaText}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#FFAA1D] px-7 py-3.5 text-sm font-semibold text-[#102746] shadow-lg shadow-orange-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ffb52f] cursor-pointer sm:w-auto"
              >
                {platform === "ios" ? (
                  <Apple className="h-4 w-4 shrink-0 text-[#102746]" />
                ) : platform === "android" ? (
                  <Smartphone className="h-4 w-4 shrink-0 text-[#102746]" />
                ) : (
                  <ArrowDownToLine className="h-4 w-4 shrink-0 text-[#102746]" />
                )}

                <span>{downloadCtaText}</span>
              </a>

              {/* Scan to preview / scroll */}
              <a
                href="#app-download"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToAppSection();
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white/[0.10] px-7 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.16] cursor-pointer sm:w-auto"
              >
                <QrCode className="h-4 w-4" />

                <span>{t("marketing.hero.scan", "Scan to Install")}</span>
              </a>
            </div>
          </div>

          {/* ================= RIGHT PHONE MOCKUP ================= */}
          <div className="relative flex items-center justify-center lg:justify-end">
            {/* Background Glow */}
            <div className="absolute h-[420px] w-[320px] rounded-full bg-cyan-400/[0.08] blur-3xl" />

            {/* Phone */}
            <div
              className="
            relative
            h-[500px]
            w-[250px]
            max-w-[85vw]
            overflow-hidden
            rounded-[40px]
            border-[7px]
            border-white/[0.18]
            bg-white
            dark:bg-slate-900
            shadow-[0_30px_80px_rgba(0,0,0,0.35)]
            sm:h-[540px]
            sm:w-[270px]
          "
            >
              {/* ================= MAP IMAGE ================= */}
              <img
                src="/map.png"
                alt={t("marketing.hero.mapAlt", "Diziel cargo tracking map")}
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* ================= TOP PHONE OVERLAY ================= */}

              {/* Phone Top Gradient */}
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b from-black/10 to-transparent" />

              {/* Phone Speaker */}
              <div className="absolute left-1/2 top-2 z-30 h-1.5 w-12 -translate-x-1/2 rounded-full bg-black/20" />

              {/* ================= BOOKING NOTIFICATION ================= */}
              <div
                className="
              absolute
              left-1/2
              top-12
              z-20
              flex
              -translate-x-1/2
              items-center
              gap-1.5
              whitespace-nowrap
              rounded-full
              bg-[#65F28A]
              px-3.5
              py-2
              text-[8px]
              font-semibold
              text-[#075B24]
              shadow-[0_5px_20px_rgba(0,0,0,0.15)]
              sm:text-[9px]
            "
              >
                <span className="flex h-3 w-3 items-center justify-center rounded-full bg-[#19C957] text-[8px] text-white">
                  ✓
                </span>

                <span>
                  {t(
                    "marketing.hero.bookingAccepted",
                    "New Booking Accepted!",
                  )}
                </span>
              </div>

              {/* ================= ROUTE DOT ================= */}
              <div
                className="
              absolute
              bottom-[31%]
              left-[22%]
              z-20
              flex
              h-5
              w-5
              items-center
              justify-center
              rounded-full
              bg-[#102746]
              ring-4
              ring-white
            "
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              </div>

              {/* ================= ETA CARD ================= */}
              <div
                className="
              absolute
              bottom-2
              left-2
              right-2
              z-20
              rounded-[22px]
              bg-white
              dark:bg-gray-900
              px-4
              py-4
              text-gray-900
              dark:text-white
              shadow-[0_8px_30px_rgba(0,0,0,0.18)]
              border
              border-transparent
              dark:border-gray-800
            "
              >
                {/* ETA Header */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400">
                    {t("marketing.hero.routeEta", "Route ETA")}
                  </span>

                  <span className="text-sm font-bold text-[#986300] dark:text-amber-400">
                    {t("marketing.hero.routeDuration", "1h 45m")}
                  </span>
                </div>

                {/* Progress */}
                <div className="mt-3 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div className="relative h-full w-[68%] rounded-full bg-[#946200] dark:bg-amber-500">
                    <span
                      className="
                    absolute
                    right-0
                    top-1/2
                    h-2.5
                    w-2.5
                    -translate-y-1/2
                    rounded-full
                    border-2
                    border-white
                    dark:border-gray-900
                    bg-[#946200]
                    dark:bg-amber-500
                  "
                    />
                  </div>
                </div>

                {/* Locations */}
                <div className="mt-3 flex items-center justify-between text-[7px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  <span>{t("marketing.hero.from", "Alexandria Port")}</span>

                  <span>{t("marketing.hero.to", "6th of October")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}