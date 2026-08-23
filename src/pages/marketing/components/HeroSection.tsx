import { useTranslation } from "react-i18next";
import {
  ArrowDownToLine,
  QrCode,
  Apple,
  Smartphone,
  Sparkles,
  Activity,
} from "lucide-react";
import { useAppDownload } from "../../../lib/appDownload";
import MultiDeviceMockup from "./MultiDeviceMockup";
import AnimatedPhoneMockup from "./AnimatedPhoneMockup";

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
    <section className="relative overflow-hidden rounded-b-[60px] sm:rounded-b-[86px] bg-[#102746] dark:bg-[#0b1b30] text-white transform-gpu">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-8 xl:gap-12">
          {/* ================= LEFT CONTENT: WIDER HORIZONTAL BALANCED TYPOGRAPHY ================= */}
          <div className="w-full text-center lg:text-left rtl:lg:text-right z-10 flex flex-col items-center lg:items-start">
            {/* Live Tracking Capsule Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3.5 py-1.5 text-[11.5px] font-semibold uppercase tracking-wider text-white backdrop-blur-md shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>
                {t("marketing.hero.badge", "منظومة النقل الذكية الأولى في مصر")}
              </span>
            </div>

            {/* Harmonious Headline */}
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[42px] xl:text-[46px] leading-[1.2] text-white">
              <span className="inline font-black">
                {t("marketing.hero.titleMain")}{" "}
              </span>
              <span className="inline font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
                {t("marketing.hero.titleHighlight")}
              </span>
              <span className="block text-lg sm:text-xl lg:text-2xl font-medium text-slate-200 mt-1.5">
                {t("marketing.hero.titleSub")}
              </span>
            </h1>

            {/* Refined Subtitle */}
            <p className="mt-3.5 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
              {t(
                "marketing.hero.description",
                "احجز شاحنتك (تريلا، جامبو، قلاب، مبرد) بأسعار خوارزمية معتمدة، وتتبع خط السير مباشرة بنظام GPS مع تسوية مالية فورية وبوليصة شحن رقمية.",
              )}
            </p>

            {/* ================= CTA BUTTONS ================= */}
            <div className="mt-8 flex flex-col items-center gap-3.5 sm:flex-row sm:justify-start w-full sm:w-auto">
              {/* Primary Download App Button */}
              <a
                href={downloadUrl}
                onClick={handleDownload}
                title={downloadCtaText}
                aria-label={downloadCtaText}
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-8 py-4 text-sm font-black text-[#102746] shadow-xl shadow-amber-500/25 transition-all duration-300 hover:scale-105 hover:shadow-amber-500/40 cursor-pointer sm:w-auto"
              >
                {platform === "ios" ? (
                  <Apple className="h-5 w-5 shrink-0 text-[#102746]" />
                ) : (
                  <Smartphone className="h-5 w-5 shrink-0 text-[#102746]" />
                )}
                <span>{downloadCtaText}</span>
              </a>

              {/* Secondary Instant Preview Button */}
              <a
                href="#app-download"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToAppSection();
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-7 py-4 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/[0.16] hover:border-white/40 cursor-pointer sm:w-auto"
              >
                <QrCode className="h-4 w-4 text-amber-400" />
                <span>{t("marketing.hero.scan", "استعراض التطبيق")}</span>
              </a>
            </div>

            {/* Trust Badges Row */}
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-300 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="font-bold text-white">
                  {t("marketing.hero.stats.trucksVal", "+12,000")}
                </span>
                <span className="text-slate-400">
                  {t("marketing.hero.stats.trucksLabel", "شاحنة جاهزة")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-amber-400" />
                <span className="font-bold text-white">
                  {t("marketing.hero.stats.speedVal", "< 30s")}
                </span>
                <span className="text-slate-400">
                  {t("marketing.hero.stats.speedLabel", "سرعة الإسناد")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-400" />
                <span className="font-bold text-white">
                  {t("marketing.hero.stats.podVal", "100%")}
                </span>
                <span className="text-slate-400">
                  {t("marketing.hero.stats.podLabel", "بوالص رقمية موثقة")}
                </span>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COMPACT 3D MULTI-DEVICE MOCKUP ================= */}
          <div className="relative flex flex-col items-center justify-center w-full">
            {/* Scaled 3D Multi-Device Trio */}
            <div className="w-full max-w-md lg:max-w-none flex justify-center scale-90 sm:scale-95 lg:scale-90 xl:scale-95 origin-center">
              <MultiDeviceMockup layout="trio" className="py-0" />
            </div>

            {/* Interactive Badge Hint */}
            <div className="mt-2 flex items-center gap-1.5 rounded-full bg-white/[0.08] px-3.5 py-1 text-[11px] text-white/80 backdrop-blur-md border border-white/15 shadow-md">
              <Sparkles
                className="h-3 w-3 text-[#FFAA1D] animate-spin"
                style={{ animationDuration: "4s" }}
              />
              <span className="font-medium">
                {t(
                  "marketing.hero.interactiveMockupHint",
                  "واجهة تطبيق ديزيل التفاعلية ثلاثية الأبعاد 3D",
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
