import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Truck,
  ShieldCheck,
  Wallet,
  Clock,
  Navigation,
  QrCode,
  FileText,
  TrendingUp,
  CheckCircle,
  Star,
  Phone,
  ArrowUpRight,
  Sparkles,
  Layers,
  CircleDot,
  Radio,
  Zap,
  Check,
  Apple,
  Smartphone,
} from "lucide-react";
import { useAppDownload } from "../../../lib/appDownload";
import MultiDeviceMockup from "./MultiDeviceMockup";
import AnimatedPhoneMockup from "./AnimatedPhoneMockup";

interface SlideItem {
  id: string;
  badgeKey: string;
  titleKey: string;
  subtitleKey: string;
  descriptionKey: string;
  features: string[];
  screenType: "booking" | "tracking" | "waybill" | "wallet" | "offers";
}

export default function AppScreenshotsSlider() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language?.startsWith("ar");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const { platform, downloadUrl, handleDownload } = useAppDownload();
  const [viewMode, setViewMode] = useState<"trio" | "detailed">("trio");

  const slides: SlideItem[] = [
    {
      id: "booking",
      badgeKey: "marketing.appShowcase.slides.booking.badge",
      titleKey: "marketing.appShowcase.slides.booking.title",
      subtitleKey: "marketing.appShowcase.slides.booking.subtitle",
      descriptionKey: "marketing.appShowcase.slides.booking.desc",
      features: [
        "marketing.appShowcase.slides.booking.feat1",
        "marketing.appShowcase.slides.booking.feat2",
        "marketing.appShowcase.slides.booking.feat3",
      ],
      screenType: "booking",
    },
    {
      id: "tracking",
      badgeKey: "marketing.appShowcase.slides.tracking.badge",
      titleKey: "marketing.appShowcase.slides.tracking.title",
      subtitleKey: "marketing.appShowcase.slides.tracking.subtitle",
      descriptionKey: "marketing.appShowcase.slides.tracking.desc",
      features: [
        "marketing.appShowcase.slides.tracking.feat1",
        "marketing.appShowcase.slides.tracking.feat2",
        "marketing.appShowcase.slides.tracking.feat3",
      ],
      screenType: "tracking",
    },
    {
      id: "waybill",
      badgeKey: "marketing.appShowcase.slides.waybill.badge",
      titleKey: "marketing.appShowcase.slides.waybill.title",
      subtitleKey: "marketing.appShowcase.slides.waybill.subtitle",
      descriptionKey: "marketing.appShowcase.slides.waybill.desc",
      features: [
        "marketing.appShowcase.slides.waybill.feat1",
        "marketing.appShowcase.slides.waybill.feat2",
        "marketing.appShowcase.slides.waybill.feat3",
      ],
      screenType: "waybill",
    },
    {
      id: "wallet",
      badgeKey: "marketing.appShowcase.slides.wallet.badge",
      titleKey: "marketing.appShowcase.slides.wallet.title",
      subtitleKey: "marketing.appShowcase.slides.wallet.subtitle",
      descriptionKey: "marketing.appShowcase.slides.wallet.desc",
      features: [
        "marketing.appShowcase.slides.wallet.feat1",
        "marketing.appShowcase.slides.wallet.feat2",
        "marketing.appShowcase.slides.wallet.feat3",
      ],
      screenType: "wallet",
    },
    {
      id: "offers",
      badgeKey: "marketing.appShowcase.slides.offers.badge",
      titleKey: "marketing.appShowcase.slides.offers.title",
      subtitleKey: "marketing.appShowcase.slides.offers.subtitle",
      descriptionKey: "marketing.appShowcase.slides.offers.desc",
      features: [
        "marketing.appShowcase.slides.offers.feat1",
        "marketing.appShowcase.slides.offers.feat2",
        "marketing.appShowcase.slides.offers.feat3",
      ],
      screenType: "offers",
    },
  ];

  const total = slides.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + total) % total);
  };

  // Auto-play slider
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, total]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        // swipe left
        isRtl ? prevSlide() : nextSlide();
      } else {
        // swipe right
        isRtl ? nextSlide() : prevSlide();
      }
    }
    touchStartX.current = null;
  };

  const activeSlide = slides[currentSlide];

  return (
    <section
      id="app-download"
      className="relative overflow-hidden bg-slate-900 py-24 sm:py-32 text-white transform-gpu"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Dynamic Background Glow Elements */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>
              {t(
                "marketing.appShowcase.sectionBadge",
                "Mobile Application Showcase",
              )}
            </span>
          </div>

          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
            {t(
              "marketing.appShowcase.heading",
              "Experience the Diziel Power in Your Hands",
            )}
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {t(
              "marketing.appShowcase.subheading",
              "Intuitive tools designed for shippers, fleet owners, and drivers. Instant dispatch, live GPS tracking, and guaranteed digital settlements.",
            )}
          </p>
        </div>

        {/* Presentation Mode Toggle Buttons */}
        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setViewMode("trio")}
            className={`rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
              viewMode === "trio"
                ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 scale-105"
                : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>
              {isRtl ? "منظور الهواتف الثلاثي 3D" : "3D Panoramic Trio Mockup"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("detailed")}
            className={`rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
              viewMode === "detailed"
                ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 scale-105"
                : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10"
            }`}
          >
            <Smartphone className="h-4 w-4" />
            <span>
              {isRtl ? "استعراض تفصيلي للشاشات" : "Feature Deep Dive"}
            </span>
          </button>
        </div>

        {/* ================= VIEW MODE 1: 3D TRIO PANORAMIC MOCKUP ================= */}
        {viewMode === "trio" ? (
          <div className="mt-12 flex flex-col items-center">
            {/* 3D Multi-Device Component */}
            <MultiDeviceMockup layout="trio" />

            {/* Quick Feature Pillars Underneath the Trio */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-5xl">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md text-center space-y-2 hover:border-amber-500/40 transition">
                <div className="h-10 w-10 mx-auto rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Truck className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-white text-base">
                  {isRtl ? "حجز وإسناد فوري" : "Instant Fleet Dispatch"}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isRtl
                    ? "اختر نوع الشاحنة (تريلا، جامبو، مبرد) واحصل على تسعير فوري وإسناد خلال ٣٠ ثانية."
                    : "Choose vehicle specs, get automated algorithm rates, and dispatch within 30 seconds."}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md text-center space-y-2 hover:border-amber-500/40 transition">
                <div className="h-10 w-10 mx-auto rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  <Navigation className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-white text-base">
                  {isRtl ? "تتبع GPS حي على الخريطة" : "Real-Time Telemetry"}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isRtl
                    ? "مراقبة مسار الشاحنة بدقة فائقة مع حساب السرعة، الوقت المتبقي، والتواصل المباشر."
                    : "Track exact cargo GPS coordinates, speed, and real-time remaining arrival ETA."}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md text-center space-y-2 hover:border-amber-500/40 transition">
                <div className="h-10 w-10 mx-auto rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-white text-base">
                  {isRtl
                    ? "بوليصة رقمية وتسوية فورية"
                    : "Digital POD & Payouts"}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isRtl
                    ? "إثبات تسليم إلكتروني بالباركود وتفريغ أوتوماتيكي للأموال في المحفظة عبر إنستاباي."
                    : "Instant QR proof of delivery with live settlement straight to driver and shipper wallets."}
                </p>
              </div>
            </div>

            {/* App Store / Google Play Download CTA */}
            <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
              <a
                href={downloadUrl}
                onClick={handleDownload}
                className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-8 py-3.5 text-sm font-extrabold text-slate-950 shadow-xl shadow-amber-500/20 transition hover:scale-105 hover:shadow-amber-500/30"
              >
                <Apple className="h-5 w-5" />
                <span>
                  {isRtl ? "تحميل تطبيق الآيفون (iOS)" : "Download for iPhone"}
                </span>
              </a>

              <a
                href={downloadUrl}
                onClick={handleDownload}
                className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-extrabold text-white transition hover:bg-white/10 hover:border-white/40"
              >
                <Smartphone className="h-5 w-5 text-amber-400" />
                <span>
                  {isRtl
                    ? "تحميل للأندرويد (Google Play)"
                    : "Download for Android"}
                </span>
              </a>
            </div>
          </div>
        ) : (
          /* ================= VIEW MODE 2: INTERACTIVE SLIDER DEEP DIVE ================= */
          <div>
            {/* Category Pill Tabs */}
            <div className="mt-8 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              {slides.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                    currentSlide === idx
                      ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 scale-105"
                      : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${currentSlide === idx ? "bg-slate-950" : "bg-amber-400"}`}
                  />
                  <span>{t(item.badgeKey)}</span>
                </button>
              ))}
            </div>

            {/* Main Showcase Stage */}
            <div className="mt-12 grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
              {/* Left Column: Interactive Feature Highlight Card (6 cols) */}
              <div className="lg:col-span-6 flex flex-col justify-center order-2 lg:order-1">
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 sm:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-32 w-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                  {/* Step indicator */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                      {t(activeSlide.badgeKey)}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      0{currentSlide + 1} / 0{total}
                    </span>
                  </div>

                  {/* Title & description */}
                  <h3 className="mt-6 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {t(activeSlide.titleKey)}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-amber-400">
                    {t(activeSlide.subtitleKey)}
                  </p>
                  <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
                    {t(activeSlide.descriptionKey)}
                  </p>

                  {/* Key Highlights Checklist */}
                  <div className="mt-8 space-y-3.5 border-t border-white/10 pt-6">
                    {activeSlide.features.map((featKey, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-3">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 mt-0.5">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-slate-200">
                          {t(featKey)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Navigation Arrows & CTA */}
                  <div className="mt-10 flex items-center justify-between pt-6 border-t border-white/10">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={isRtl ? nextSlide : prevSlide}
                        aria-label="Previous Slide"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500"
                      >
                        <ChevronLeft
                          className={`h-5 w-5 ${isRtl ? "rotate-180" : ""}`}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={isRtl ? prevSlide : nextSlide}
                        aria-label="Next Slide"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500"
                      >
                        <ChevronRight
                          className={`h-5 w-5 ${isRtl ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>

                    <a
                      href={downloadUrl}
                      onClick={handleDownload}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-2.5 text-xs sm:text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:scale-105 hover:shadow-amber-500/30 cursor-pointer"
                    >
                      {platform === "ios" ? (
                        <Apple className="h-4 w-4 shrink-0 text-slate-950" />
                      ) : (
                        <Smartphone className="h-4 w-4 shrink-0 text-slate-950" />
                      )}
                      <span>
                        {platform === "ios"
                          ? t(
                              "marketing.nav.downloadForIos",
                              "Download for iPhone",
                            )
                          : t(
                              "marketing.nav.downloadForAndroid",
                              "Download App",
                            )}
                      </span>
                      <ArrowUpRight
                        className={`h-4 w-4 ${isRtl ? "-scale-x-100" : ""}`}
                      />
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column: Animated Smartphone Mockup (6 cols) */}
              <div
                className="lg:col-span-6 flex items-center justify-center order-1 lg:order-2"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <div className="relative flex items-center justify-center">
                  <AnimatedPhoneMockup
                    screen={
                      activeSlide.screenType === "booking"
                        ? "select-truck"
                        : activeSlide.screenType === "tracking"
                          ? "live-map"
                          : activeSlide.screenType === "waybill"
                            ? "waybill"
                            : activeSlide.screenType === "wallet"
                              ? "wallet"
                              : "driver-radar"
                    }
                    pose={
                      currentSlide % 2 === 0
                        ? "floating-tilt"
                        : "floating-tilt-reverse"
                    }
                    size="lg"
                    interactive={true}
                    floatingBadges={true}
                  />
                </div>
              </div>
            </div>

            {/* Carousel Pagination Dots */}
            <div className="mt-14 flex items-center justify-center gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    currentSlide === idx
                      ? "w-8 bg-amber-400"
                      : "w-2.5 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
