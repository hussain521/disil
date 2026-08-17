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
      className="relative overflow-hidden bg-slate-900 py-24 sm:py-32 text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Dynamic Background Glow Elements */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[140px]" />
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

        {/* Category Pill Tabs */}
        <div className="mt-10 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
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
        <div className="mt-14 grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Interactive Feature Highlight Card (5 cols) */}
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
                  title={
                    platform === "ios"
                      ? t("marketing.nav.downloadForIos", "Download for iPhone (iOS)")
                      : platform === "android"
                        ? t("marketing.nav.downloadForAndroid", "Download for Android")
                        : t("marketing.appShowcase.ctaDownload", "Download Free App")
                  }
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-2.5 text-xs sm:text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:scale-105 hover:shadow-amber-500/30 cursor-pointer"
                >
                  {platform === "ios" ? (
                    <Apple className="h-4 w-4 shrink-0 text-slate-950" />
                  ) : platform === "android" ? (
                    <Smartphone className="h-4 w-4 shrink-0 text-slate-950" />
                  ) : null}
                  <span>
                    {platform === "ios"
                      ? t("marketing.nav.downloadForIos", "Download for iPhone (iOS)")
                      : platform === "android"
                        ? t("marketing.nav.downloadForAndroid", "Download for Android")
                        : t("marketing.appShowcase.ctaDownload", "Download Free App")}
                  </span>
                  <ArrowUpRight
                    className={`h-4 w-4 ${isRtl ? "-scale-x-100" : ""}`}
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Smartphone Mockup with Real In-App UI (6 cols) */}
          <div
            className="lg:col-span-6 flex items-center justify-center order-1 lg:order-2"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative flex items-center justify-center">
              {/* Outer Phone Aura & Reflections */}
              <div className="absolute -inset-4 rounded-[60px] bg-gradient-to-tr from-amber-500/20 via-blue-500/20 to-emerald-500/20 blur-2xl" />

              {/* Realistic Hardware Frame */}
              <div className="relative h-[590px] w-[290px] max-w-[85vw] sm:h-[630px] sm:w-[310px] rounded-[50px] bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950 p-[10px] shadow-[0_25px_70px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.4)] border border-slate-700/80 ring-1 ring-black">
                {/* Physical Side Buttons Accent (Left volume, right power) */}
                <div className="absolute -left-[13px] top-24 h-12 w-[3px] rounded-l-sm bg-slate-600" />
                <div className="absolute -left-[13px] top-40 h-12 w-[3px] rounded-l-sm bg-slate-600" />
                <div className="absolute -right-[13px] top-28 h-16 w-[3px] rounded-r-sm bg-slate-600" />

                {/* Inner Screen Bezel */}
                <div className="relative h-full w-full overflow-hidden rounded-[40px] bg-slate-950 text-slate-900 border border-black select-none flex flex-col justify-between">
                  {/* Dynamic Island / Hardware Notch */}
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-40 flex items-center justify-between px-3 h-6 w-28 bg-black rounded-full shadow-md">
                    <div className="h-2.5 w-2.5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
                      <div className="h-1 w-1 rounded-full bg-blue-500" />
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[8px] font-mono text-emerald-400 font-bold">
                        GPS
                      </span>
                    </div>
                  </div>

                  {/* Phone Status Bar */}
                  <div className="relative z-30 flex items-center justify-between px-6 pt-3 text-[10px] font-semibold text-slate-800 dark:text-slate-200">
                    <span>09:41</span>
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <Radio className="h-3 w-3" />
                      <span className="text-[9px]">5G</span>
                      <div className="h-2 w-3.5 rounded-sm border border-current p-[1px]">
                        <div className="h-full w-full bg-current rounded-2xs" />
                      </div>
                    </div>
                  </div>

                  {/* ACTIVE SCREEN CONTENT CONTAINER */}
                  <div className="relative flex-1 overflow-hidden transition-all duration-500 flex flex-col">
                    {/* ================= SCREEN 1: BOOKING ================= */}
                    {activeSlide.screenType === "booking" && (
                      <div className="animate-fadeIn flex flex-col h-full bg-slate-900 text-white p-3.5 pt-1 space-y-2.5">
                        {/* Top App Header */}
                        <div className="flex items-center justify-between pb-1 border-b border-white/10">
                          <div className="flex items-center gap-1.5">
                            <div className="h-6 w-6 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black text-xs">
                              D
                            </div>
                            <span className="text-xs font-bold">
                              {t("common.brandName", "Diziel")}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
                            {t("marketing.appShowcase.mockup.newTrip", isRtl ? "طلب جديد" : "New Trip")}
                          </span>
                        </div>

                        {/* Route Selector Card */}
                        <div className="rounded-2xl bg-white/10 p-2.5 space-y-2 border border-white/10">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-400" />
                            <div className="flex-1">
                              <span className="text-[9px] text-slate-400 block">
                                {t("marketing.appShowcase.mockup.pickup", isRtl ? "نقطة التحميل" : "Pickup")}
                              </span>
                              <span className="text-[11px] font-bold text-white">
                                {t("marketing.appShowcase.mockup.pickupLoc", isRtl ? "ميناء العين السخنة" : "Ain Sokhna Port")}
                              </span>
                            </div>
                          </div>
                          <div className="h-4 border-l border-dashed border-slate-600 ml-1" />
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-amber-400" />
                            <div className="flex-1">
                              <span className="text-[9px] text-slate-400 block">
                                {t("marketing.appShowcase.mockup.dropoff", isRtl ? "وجهة التسليم" : "Drop-off")}
                              </span>
                              <span className="text-[11px] font-bold text-white">
                                {t("marketing.appShowcase.mockup.dropoffLoc", isRtl ? "مدينة ٦ أكتوبر - الجيزة" : "6th of October City")}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Vehicle Choice List */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                            {t("marketing.appShowcase.mockup.selectVehicle", isRtl ? "اختر فئة الشاحنة" : "Select Vehicle")}
                          </span>
                          <div className="grid grid-cols-2 gap-1.5">
                            <div className="rounded-xl bg-amber-500/20 border border-amber-500 p-2 text-center">
                              <Truck className="h-4 w-4 text-amber-400 mx-auto" />
                              <span className="text-[10px] font-bold block mt-1">
                                {t("marketing.appShowcase.mockup.trelaFlatbed", isRtl ? "تريلا فرش" : "Trela Flatbed")}
                              </span>
                              <span className="text-[9px] text-amber-400 font-extrabold">
                                8,450 {t("common.currency", "EGP")}
                              </span>
                            </div>
                            <div className="rounded-xl bg-white/5 border border-white/10 p-2 text-center opacity-70">
                              <Layers className="h-4 w-4 text-slate-300 mx-auto" />
                              <span className="text-[10px] font-bold block mt-1">
                                {t("marketing.appShowcase.mockup.jumboBox", isRtl ? "جامبو مغلق" : "Jumbo Box")}
                              </span>
                              <span className="text-[9px] text-slate-300">
                                4,200 {t("common.currency", "EGP")}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Instant Price Breakdown */}
                        <div className="rounded-xl bg-black/40 p-2.5 flex items-center justify-between border border-white/5">
                          <div>
                            <span className="text-[8px] text-slate-400 block">
                              {t("marketing.appShowcase.mockup.estTariff", isRtl ? "السعر التقديري الشامل" : "Estimated Tariff")}
                            </span>
                            <span className="text-xs font-black text-amber-400">
                              8,450 {t("common.currency", "EGP")}
                            </span>
                          </div>
                          <span className="text-[9px] text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md font-bold">
                            {t("marketing.appShowcase.mockup.instantMatch", isRtl ? "توفير ١٥٪" : "Instant Match")}
                          </span>
                        </div>

                        {/* CTA button */}
                        <div className="pt-1">
                          <div className="w-full rounded-xl bg-amber-500 py-2.5 text-center text-xs font-extrabold text-slate-950 shadow-md">
                            {t("marketing.appShowcase.mockup.dispatchNow", isRtl ? "تأكيد وحجز الشاحنة" : "Dispatch Now")}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ================= SCREEN 2: TRACKING ================= */}
                    {activeSlide.screenType === "tracking" && (
                      <div className="animate-fadeIn relative flex flex-col h-full bg-slate-900 overflow-hidden">
                        {/* Map Background with visual route */}
                        <img
                          src="/map.png"
                          alt="Live Map Telemetry"
                          className="absolute inset-0 h-full w-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-transparent to-slate-950/90" />

                        {/* Top Telemetry Header */}
                        <div className="relative z-10 p-3 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 rounded-full bg-slate-950/80 px-2.5 py-1 border border-white/10 backdrop-blur-md">
                            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                            <span className="text-[9px] font-bold text-white">
                              #DZ-8942 Live
                            </span>
                          </div>
                          <div className="rounded-full bg-amber-500 px-2.5 py-1 text-[9px] font-bold text-slate-950">
                            {t("marketing.appShowcase.mockup.inTransit", isRtl ? "في الطريق" : "In Transit")}
                          </div>
                        </div>

                        {/* Center Animated Truck Marker */}
                        <div className="relative z-10 my-auto flex flex-col items-center">
                          <div className="relative">
                            <div className="h-10 w-10 rounded-full bg-amber-500 shadow-xl flex items-center justify-center text-slate-950 ring-4 ring-white/20 animate-bounce">
                              <Truck className="h-5 w-5" />
                            </div>
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/40 rounded-full blur-xs" />
                          </div>
                          <div className="mt-2 rounded-md bg-slate-950/90 px-2 py-0.5 text-[8px] font-mono text-amber-400 border border-amber-500/30">
                            {t("marketing.appShowcase.mockup.speedLabel", "84 km/h · Highway 1")}
                          </div>
                        </div>

                        {/* Bottom Driver & ETA Card */}
                        <div className="relative z-10 m-2.5 rounded-2xl bg-slate-950/95 p-3 border border-white/15 backdrop-blur-md text-white space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                                MS
                              </div>
                              <div>
                                <span className="text-[11px] font-bold block">
                                  {t("marketing.appShowcase.mockup.driverName", isRtl ? "محمود السيد" : "Mahmoud Sayed")}
                                </span>
                                <span className="text-[9px] text-slate-400 flex items-center gap-1">
                                  <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />{" "}
                                  4.95 ({t("marketing.appShowcase.mockup.tripsCount", isRtl ? "١٤٠+ رحلة" : "140+ trips")})
                                </span>
                              </div>
                            </div>
                            <div className="h-7 w-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                              <Phone className="h-3.5 w-3.5" />
                            </div>
                          </div>

                          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                            <span className="text-slate-400">
                              {t("marketing.appShowcase.mockup.etaLabel", isRtl ? "الوصول المتوقع:" : "ETA:")}
                            </span>
                            <span className="font-extrabold text-amber-400">
                              {t("marketing.appShowcase.mockup.etaValue", isRtl ? "٤٢ دقيقة (٦٥ كم)" : "42 mins (65 km)")}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ================= SCREEN 3: WAYBILL ================= */}
                    {activeSlide.screenType === "waybill" && (
                      <div className="animate-fadeIn flex flex-col h-full bg-slate-900 text-white p-3.5 pt-1 space-y-2.5">
                        <div className="flex items-center justify-between pb-1 border-b border-white/10">
                          <div className="flex items-center gap-1.5">
                            <FileText className="h-4 w-4 text-amber-400" />
                            <span className="text-xs font-bold">
                              {t("marketing.appShowcase.mockup.digitalWaybill", isRtl ? "بوليصة شحن رقمية" : "Digital Waybill")}
                            </span>
                          </div>
                          <span className="text-[8px] font-mono text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                            {t("marketing.appShowcase.mockup.statusVerified", "VERIFIED")}
                          </span>
                        </div>

                        {/* Barcode / QR Section */}
                        <div className="rounded-2xl bg-white p-2.5 text-slate-950 flex flex-col items-center justify-center shadow-inner">
                          <QrCode className="h-16 w-16 text-slate-900" />
                          <span className="text-[8px] font-mono font-bold tracking-widest mt-1 text-slate-600">
                            WB-2026-098741-EG
                          </span>
                        </div>

                        {/* Checkpoints info */}
                        <div className="rounded-xl bg-white/5 border border-white/10 p-2.5 space-y-2 text-[10px]">
                          <div className="flex justify-between">
                            <span className="text-slate-400">
                              {t("marketing.appShowcase.mockup.cargoWeight", isRtl ? "الحمولة المعتمدة:" : "Cargo Weight:")}
                            </span>
                            <span className="font-bold text-white">
                              {t("marketing.appShowcase.mockup.cargoWeightVal", isRtl ? "٤٢.٥٠ طن" : "42.50 Tons")}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">
                              {t("marketing.appShowcase.mockup.scaleTicket", isRtl ? "تذكرة الميزان:" : "Scale Ticket:")}
                            </span>
                            <span className="font-bold text-emerald-400">
                              ✓ {t("marketing.appShowcase.mockup.scaleTicketVal", isRtl ? "مطابقة وموثقة" : "Verified")}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">
                              {t("marketing.appShowcase.mockup.waybillStatus", isRtl ? "حالة البوليصة:" : "Status:")}
                            </span>
                            <span className="font-bold text-amber-400">
                              {t("marketing.appShowcase.mockup.signedAtDelivery", isRtl ? "تم التسليم والمصادقة" : "Signed at Delivery")}
                            </span>
                          </div>
                        </div>

                        {/* Signature confirmation */}
                        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-2 text-center">
                          <span className="text-[9px] text-emerald-300 font-bold block">
                            {t("marketing.appShowcase.mockup.digitalPod", isRtl ? "إثبات استلام رقمي معتمد" : "Digital Proof of Delivery")}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* ================= SCREEN 4: WALLET ================= */}
                    {activeSlide.screenType === "wallet" && (
                      <div className="animate-fadeIn flex flex-col h-full bg-slate-900 text-white p-3.5 pt-1 space-y-2.5">
                        <div className="flex items-center justify-between pb-1 border-b border-white/10">
                          <div className="flex items-center gap-1.5">
                            <Wallet className="h-4 w-4 text-amber-400" />
                            <span className="text-xs font-bold">
                              {t("marketing.appShowcase.mockup.walletTitle", isRtl ? "محفظة ديزل" : "Diziel Wallet")}
                            </span>
                          </div>
                          <span className="text-[8px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full font-bold">
                            {t("marketing.appShowcase.mockup.liveSettled", isRtl ? "تسوية فورية" : "Live Settled")}
                          </span>
                        </div>

                        {/* Wallet Balance Card */}
                        <div className="rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-3.5 text-slate-950 shadow-lg space-y-2">
                          <span className="text-[9px] font-bold uppercase tracking-wider opacity-80 block">
                            {t("marketing.appShowcase.mockup.availableBalance", isRtl ? "الرصيد المتاح للسحب" : "Available Balance")}
                          </span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black">54,820</span>
                            <span className="text-xs font-bold">{t("common.currency", "EGP")}</span>
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-black/10 text-[9px] font-bold">
                            <span>
                              {t("marketing.appShowcase.mockup.instantPayout", isRtl ? "سحب فوري (إنستاباي / بنك)" : "Instant Payout")}
                            </span>
                            <span className="bg-slate-950 text-white px-2 py-0.5 rounded-md text-[8px]">
                              {t("marketing.appShowcase.mockup.withdrawNow", isRtl ? "سحب الآن" : "Withdraw")}
                            </span>
                          </div>
                        </div>

                        {/* Recent Transactions List */}
                        <div className="space-y-1.5">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                            {t("marketing.appShowcase.mockup.recentSettlements", isRtl ? "أحدث المعاملات المكتملة" : "Recent Settlements")}
                          </span>
                          <div className="rounded-xl bg-white/5 border border-white/10 p-2 flex items-center justify-between text-[9px]">
                            <div>
                              <span className="font-bold text-white block">
                                {isRtl
                                  ? "رحلة العين السخنة ← ٦ أكتوبر"
                                  : "Sokhna → October"}
                              </span>
                              <span className="text-[8px] text-slate-400">
                                Today, 08:30 AM
                              </span>
                            </div>
                            <span className="font-extrabold text-emerald-400">
                              + 8,450 {t("common.currency", "EGP")}
                            </span>
                          </div>

                          <div className="rounded-xl bg-white/5 border border-white/10 p-2 flex items-center justify-between text-[9px]">
                            <div>
                              <span className="font-bold text-white block">
                                {isRtl
                                  ? "رحلة الإسكندرية ← العاشر"
                                  : "Alex → 10th Ramadan"}
                              </span>
                              <span className="text-[8px] text-slate-400">
                                Yesterday
                              </span>
                            </div>
                            <span className="font-extrabold text-emerald-400">
                              + 6,200 {t("common.currency", "EGP")}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ================= SCREEN 5: OFFERS & DISPATCH ================= */}
                    {activeSlide.screenType === "offers" && (
                      <div className="animate-fadeIn flex flex-col h-full bg-slate-900 text-white p-3.5 pt-1 space-y-2.5">
                        <div className="flex items-center justify-between pb-1 border-b border-white/10">
                          <div className="flex items-center gap-1.5">
                            <Zap className="h-4 w-4 text-amber-400" />
                            <span className="text-xs font-bold">
                              {t("marketing.appShowcase.mockup.liveFreightRadar", isRtl ? "رادار الشحنات الحية" : "Live Freight Radar")}
                            </span>
                          </div>
                          <span className="text-[8px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full font-bold">
                            {t("marketing.appShowcase.mockup.availableLoads", isRtl ? "+١٨ طلب متاح" : "+18 Available Loads")}
                          </span>
                        </div>

                        {/* Top Offer Card */}
                        <div className="rounded-2xl bg-white/10 border border-amber-500/40 p-3 space-y-2 relative overflow-hidden">
                          <div className="absolute top-0 right-0 h-16 w-16 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                              {t("marketing.appShowcase.mockup.highPriority", isRtl ? "عالي القيمة" : "High Priority")}
                            </span>
                            <span className="text-[9px] font-extrabold text-white">
                              12,500 {t("common.currency", "EGP")}
                            </span>
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-white block">
                              {t("marketing.appShowcase.mockup.offer1Title", isRtl ? "دمياط ← أسيوط (حديد وصلب ٥٠ طن)" : "Damietta → Assiut (50t Steel)")}
                            </span>
                            <span className="text-[8px] text-slate-400">
                              {t("marketing.appShowcase.mockup.offer1Subtitle", isRtl ? "المسافة: ٤٨٠ كم · تحميل فوري" : "480 km · Ready for immediate loading")}
                            </span>
                          </div>
                          <div className="w-full rounded-xl bg-amber-500 py-2 text-center text-xs font-extrabold text-slate-950 shadow-md">
                            {t("marketing.appShowcase.mockup.acceptDispatch", isRtl ? "تقديم عرض سعر / قبول" : "Accept Dispatch")}
                          </div>
                        </div>

                        {/* Secondary Offer */}
                        <div className="rounded-xl bg-white/5 border border-white/10 p-2.5 space-y-1">
                          <div className="flex justify-between text-[10px]">
                            <span className="font-bold text-white">
                              {t("marketing.appShowcase.mockup.offer2Title", isRtl ? "السويس ← القاهرة (أسمنت)" : "Suez → Cairo (Cement)")}
                            </span>
                            <span className="font-bold text-emerald-400">
                              5,800 {t("common.currency", "EGP")}
                            </span>
                          </div>
                          <span className="text-[8px] text-slate-400 block">
                            {t("marketing.appShowcase.mockup.offer2Subtitle", isRtl ? "مطلوب تريلا جوانب" : "Trela Sided Required")}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Phone Bottom Home Indicator Bar */}
                  <div className="relative z-30 pb-2 flex justify-center">
                    <div className="h-1 w-24 bg-white/30 rounded-full" />
                  </div>
                </div>
              </div>
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
    </section>
  );
}
