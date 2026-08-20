import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Truck,
  MapPin,
  FileText,
  Wallet,
  Zap,
  Star,
  Phone,
  Radio,
  ShieldCheck,
  Sparkles,
  QrCode,
  Layers,
} from "lucide-react";

export type MockupScreenType =
  | "live-map"
  | "select-truck"
  | "instant-quote"
  | "track-settle"
  | "driver-radar"
  | "enterprise"
  | "wallet"
  | "waybill";

export type MockupPose =
  | "upright"
  | "floating-tilt"
  | "floating-tilt-reverse"
  | "isometric"
  | "flat-hero";

export interface AnimatedPhoneMockupProps {
  screen?: MockupScreenType;
  pose?: MockupPose;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  floatingBadges?: boolean;
  className?: string;
  badgeTopText?: string;
  badgeTopSub?: string;
  badgeBottomText?: string;
  badgeBottomSub?: string;
}

export default function AnimatedPhoneMockup({
  screen = "live-map",
  pose = "floating-tilt",
  size = "md",
  interactive = true,
  floatingBadges = true,
  className = "",
  badgeTopText,
  badgeTopSub,
  badgeBottomText,
  badgeBottomSub,
}: AnimatedPhoneMockupProps) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language?.startsWith("ar");
  const [activeTab, setActiveTab] = useState<MockupScreenType>(screen);

  useEffect(() => {
    setActiveTab(screen);
  }, [screen]);

  const sizeClasses = {
    sm: "w-[240px] h-[490px] sm:w-[260px] sm:h-[530px]",
    md: "w-[265px] h-[540px] sm:w-[290px] sm:h-[590px]",
    lg: "w-[285px] h-[580px] sm:w-[320px] sm:h-[650px]",
  }[size];

  const getPoseClass = () => {
    switch (pose) {
      case "floating-tilt":
        return isRtl ? "animate-float-tilted-rtl" : "animate-float-tilted";
      case "floating-tilt-reverse":
        return isRtl ? "animate-float-tilted" : "animate-float-tilted-rtl";
      case "isometric":
        return "animate-float-isometric";
      case "flat-hero":
        return "animate-float-smooth";
      case "upright":
      default:
        return "transition-transform duration-500 hover:scale-[1.02]";
    }
  };

  return (
    <div
      className={`relative flex items-center justify-center select-none perspective-1500 ${className}`}
    >
      {/* Background Multi-layer Dynamic Glow */}
      <div className="pointer-events-none absolute -inset-6 rounded-[60px] bg-gradient-to-tr from-amber-500/20 via-blue-500/15 to-emerald-500/20 blur-3xl opacity-75" />
      <div className="pointer-events-none absolute -inset-10 rounded-full bg-amber-500/10 blur-[90px] animate-pulse" />

      {/* Floating Interactive Badges Around Phone */}
      {floatingBadges && (
        <>
          {/* Top Floating Badge */}
          <div
            className={`absolute -top-4 z-30 flex items-center gap-2 rounded-2xl border border-white/20 bg-slate-950/90 px-3.5 py-2 text-xs font-semibold text-white shadow-2xl backdrop-blur-md animate-badge-bob ${
              isRtl ? "-right-4" : "-left-4"
            }`}
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
            <div>
              <span className="block text-[9px] text-slate-400 leading-tight font-normal">
                {badgeTopSub || (isRtl ? "شحنات موثقة" : "Verified Loads")}
              </span>
              <span className="block text-[11px] font-bold text-emerald-400 leading-tight">
                {badgeTopText || (isRtl ? "١٠٠٪ ضمان وصول" : "100% Guaranteed")}
              </span>
            </div>
          </div>

          {/* Bottom Floating Badge */}
          <div
            className={`absolute -bottom-4 z-30 flex items-center gap-2.5 rounded-2xl border border-white/20 bg-slate-950/90 px-3.5 py-2 text-xs font-semibold text-white shadow-2xl backdrop-blur-md animate-badge-bob ${
              isRtl ? "-left-4" : "-right-4"
            }`}
            style={{ animationDelay: "1.8s" }}
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
              <Zap className="h-3.5 w-3.5" />
            </div>
            <div>
              <span className="block text-[9px] text-slate-400 leading-tight font-normal">
                {badgeBottomSub || (isRtl ? "متوسط سرعة الإسناد" : "Dispatch Speed")}
              </span>
              <span className="block text-[11px] font-extrabold text-amber-400 leading-tight">
                {badgeBottomText || (isRtl ? "< ٣٠ ثانية" : "< 30 Seconds")}
              </span>
            </div>
          </div>
        </>
      )}

      {/* Main 3D Phone Chassis */}
      <div
        className={`relative ${sizeClasses} rounded-[48px] bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950 p-[9px] mockup-3d-shadow border border-slate-600/70 ring-1 ring-black ${getPoseClass()}`}
      >
        {/* Screen Bezel & Dynamic Display Screen */}
        <div className="relative h-full w-full overflow-hidden rounded-[39px] bg-slate-950 text-white border border-black flex flex-col justify-between shadow-inner">
          {/* Glass Reflection Sweep Accent */}
          <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-[39px]">
            <div className="absolute -top-10 -left-20 h-[140%] w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer-glass pointer-events-none" />
          </div>

          {/* Dynamic Island / Hardware Notch */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-40 flex items-center justify-between px-3 h-5 w-26 bg-black rounded-full shadow-md border border-white/5">
            <div className="h-2 w-2 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
              <div className="h-0.5 w-0.5 rounded-full bg-blue-400" />
            </div>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[7px] font-mono text-emerald-400 font-bold">
                GPS LIVE
              </span>
            </div>
          </div>

          {/* Phone Status Bar */}
          <div className="relative z-30 flex items-center justify-between px-5 pt-2 text-[9px] font-semibold text-slate-300">
            <span className="font-mono">09:41</span>
            <div className="flex items-center gap-1 text-slate-300">
              <Radio className="h-2.5 w-2.5" />
              <span className="text-[8px] font-mono">5G</span>
              <div className="h-2 w-3 rounded-2xs border border-current p-[1px]">
                <div className="h-full w-full bg-current rounded-2xs" />
              </div>
            </div>
          </div>

          {/* Screen Content Container */}
          <div className="relative flex-1 overflow-hidden p-3 pt-1 flex flex-col justify-between">
            {/* ================= SCREEN 1: LIVE MAP TELEMETRY ================= */}
            {(activeTab === "live-map" || activeTab === "track-settle") && (
              <div className="relative flex flex-col h-full bg-slate-900 rounded-2xl overflow-hidden animate-fadeIn">
                {/* Background Radar Map */}
                <img
                  src="/map.png"
                  alt="Diziel Live Map"
                  className="absolute inset-0 h-full w-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-transparent to-slate-950/90" />

                {/* Live Tracking Header */}
                <div className="relative z-10 p-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 rounded-full bg-slate-950/80 px-2 py-0.5 border border-white/10 backdrop-blur-md">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[8px] font-bold text-white">
                      #DZ-8942
                    </span>
                  </div>
                  <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[8px] font-extrabold text-slate-950 shadow-sm">
                    {isRtl ? "في الطريق" : "In Transit"}
                  </span>
                </div>

                {/* Animated Truck Radar Ping */}
                <div className="relative z-10 my-auto flex flex-col items-center">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute h-14 w-14 rounded-full bg-amber-400/20 animate-radar-ping" />
                    <div className="h-10 w-10 rounded-full bg-amber-500 shadow-xl flex items-center justify-center text-slate-950 ring-4 ring-white/20 animate-bounce">
                      <Truck className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-2 rounded-full bg-slate-950/90 px-2.5 py-0.5 text-[8px] font-mono text-amber-400 border border-amber-500/30 backdrop-blur-md shadow-md">
                    {isRtl ? "٨٤ كم/س · طريق السويس" : "84 km/h · Highway"}
                  </div>
                </div>

                {/* Bottom Route & Driver Telemetry Card */}
                <div className="relative z-10 m-2 rounded-2xl bg-slate-950/95 p-2.5 border border-white/15 backdrop-blur-md text-white space-y-1.5 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px]">
                        MS
                      </div>
                      <div>
                        <span className="text-[10px] font-bold block leading-none">
                          {isRtl ? "محمود السيد" : "Mahmoud Sayed"}
                        </span>
                        <span className="text-[8px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />{" "}
                          4.95 ({isRtl ? "١٤٠+ رحلة" : "140+ trips"})
                        </span>
                      </div>
                    </div>
                    <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Phone className="h-3 w-3" />
                    </div>
                  </div>

                  {/* Progress Line */}
                  <div className="pt-1">
                    <div className="flex justify-between text-[8px] text-slate-400">
                      <span>{isRtl ? "العين السخنة" : "Sokhna Port"}</span>
                      <span className="font-bold text-amber-400">
                        {isRtl ? "باقي ٤٢ دقيقة" : "42 mins remaining"}
                      </span>
                      <span>{isRtl ? "٦ أكتوبر" : "6th Oct"}</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-amber-400 rounded-full w-[68%]" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= SCREEN 2: SELECT TRUCK & BOOKING ================= */}
            {activeTab === "select-truck" && (
              <div className="flex flex-col h-full bg-slate-900 rounded-2xl p-2.5 space-y-2 text-white animate-fadeIn">
                {/* Header */}
                <div className="flex items-center justify-between pb-1 border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    <div className="h-5 w-5 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center font-black text-[10px]">
                      D
                    </div>
                    <span className="text-xs font-bold">
                      {isRtl ? "حجز شاحنة" : "Select Truck"}
                    </span>
                  </div>
                  <span className="text-[8px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-full">
                    {isRtl ? "متاح فوري" : "Available"}
                  </span>
                </div>

                {/* Origin - Destination Card */}
                <div className="rounded-xl bg-white/5 p-2 space-y-1.5 border border-white/10 text-[9px]">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="text-slate-300">
                      {isRtl ? "ميناء الإسكندرية (رصيف ٥٤)" : "Alexandria Port"}
                    </span>
                  </div>
                  <div className="h-2 border-l border-dashed border-slate-600 ml-1" />
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-amber-400" />
                    <span className="text-slate-300">
                      {isRtl ? "المنطقة الصناعية - ٦ أكتوبر" : "6th of October"}
                    </span>
                  </div>
                </div>

                {/* Truck Types Selection */}
                <div className="space-y-1.5 flex-1">
                  <div className="rounded-xl bg-amber-500/20 border border-amber-500 p-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-amber-400" />
                      <div>
                        <span className="text-[10px] font-bold block leading-none">
                          {isRtl ? "تريلا فرش ٤٥ طن" : "Flatbed Trela (45t)"}
                        </span>
                        <span className="text-[8px] text-slate-400">
                          {isRtl ? "حديد وصلب وبناء" : "Heavy Cargo & Steel"}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-amber-400">
                      8,450 {t("common.currency", "EGP")}
                    </span>
                  </div>

                  <div className="rounded-xl bg-white/5 border border-white/10 p-2 flex items-center justify-between opacity-80">
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-slate-300" />
                      <div>
                        <span className="text-[10px] font-bold block leading-none">
                          {isRtl ? "جامبو مغلق ٦ طن" : "Jumbo Box (6t)"}
                        </span>
                        <span className="text-[8px] text-slate-400">
                          {isRtl ? "بضائع وتجزئة" : "FMCG & Retail"}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-300">
                      3,800 {t("common.currency", "EGP")}
                    </span>
                  </div>
                </div>

                {/* Confirm Dispatch CTA */}
                <div className="w-full rounded-xl bg-amber-500 py-2 text-center text-[10px] font-black text-slate-950 shadow-md">
                  {isRtl ? "تأكيد الطلب وإسناد الشاحنة" : "Confirm Dispatch"}
                </div>
              </div>
            )}

            {/* ================= SCREEN 3: INSTANT QUOTE ================= */}
            {activeTab === "instant-quote" && (
              <div className="flex flex-col h-full bg-slate-900 rounded-2xl p-2.5 space-y-2 text-white animate-fadeIn">
                <div className="flex items-center justify-between pb-1 border-b border-white/10">
                  <span className="text-xs font-bold">
                    {isRtl ? "التسعير الخوارزمي الفوري" : "Instant Tariff"}
                  </span>
                  <span className="text-[8px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full font-bold">
                    {isRtl ? "سعر رسمي معتمد" : "Guaranteed"}
                  </span>
                </div>

                {/* Distance & Load Calculation Matrix */}
                <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 p-2.5 border border-white/10 space-y-2">
                  <div className="flex justify-between items-center text-[9px]">
                    <span className="text-slate-400">
                      {isRtl ? "المسافة المعتمدة (Google):" : "Calculated Distance:"}
                    </span>
                    <span className="font-bold text-white">218 {t("common.km", "km")}</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px]">
                    <span className="text-slate-400">
                      {isRtl ? "وزن الحمولة:" : "Cargo Weight:"}
                    </span>
                    <span className="font-bold text-white">45.00 {t("common.ton", "ton")}</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px]">
                    <span className="text-slate-400">
                      {isRtl ? "رسوم الطرق والكارتات:" : "Tolls & Scales:"}
                    </span>
                    <span className="font-bold text-emerald-400">
                      {isRtl ? "مشملة بالكامل" : "Included"}
                    </span>
                  </div>
                </div>

                {/* Price Total */}
                <div className="rounded-xl bg-amber-500/15 border border-amber-500/40 p-2.5 text-center space-y-0.5">
                  <span className="text-[8px] text-amber-300 font-bold uppercase tracking-wider block">
                    {isRtl ? "الإجمالي الصافي للرحلة" : "Net Trip Total"}
                  </span>
                  <span className="text-xl font-black text-amber-400">
                    8,450 <span className="text-xs font-bold">{t("common.currency", "EGP")}</span>
                  </span>
                </div>

                {/* CTA */}
                <div className="w-full rounded-xl bg-amber-500 py-2 text-center text-[10px] font-black text-slate-950 shadow-md">
                  {isRtl ? "حجز وتأكيد الفاتورة" : "Book with Instant Tariff"}
                </div>
              </div>
            )}

            {/* ================= SCREEN 4: DRIVER RADAR & OFFERS ================= */}
            {activeTab === "driver-radar" && (
              <div className="flex flex-col h-full bg-slate-900 rounded-2xl p-2.5 space-y-2 text-white animate-fadeIn">
                <div className="flex items-center justify-between pb-1 border-b border-white/10">
                  <div className="flex items-center gap-1">
                    <Zap className="h-3.5 w-3.5 text-amber-400" />
                    <span className="text-xs font-bold">
                      {isRtl ? "رادار الشحنات" : "Freight Radar"}
                    </span>
                  </div>
                  <span className="text-[8px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-full">
                    +18 {isRtl ? "شحنة نشطة" : "Active Loads"}
                  </span>
                </div>

                {/* Load Card 1 */}
                <div className="rounded-xl bg-amber-500/20 border border-amber-500/40 p-2 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-bold text-amber-300 bg-black/40 px-1.5 py-0.5 rounded">
                      {isRtl ? "تحميل فوري" : "Immediate Loading"}
                    </span>
                    <span className="text-[10px] font-extrabold text-amber-400">
                      12,500 EGP
                    </span>
                  </div>
                  <span className="text-[10px] font-bold block text-white">
                    {isRtl ? "دمياط ← أسيوط (حديد ٥٠ طن)" : "Damietta → Assiut (50t Steel)"}
                  </span>
                  <span className="text-[8px] text-slate-400 block">
                    {isRtl ? "المسافة: ٤٨٠ كم · تريلا فرش" : "480 km · Trela Flatbed"}
                  </span>
                  <div className="w-full rounded-lg bg-amber-500 py-1 text-center text-[9px] font-black text-slate-950">
                    {isRtl ? "قبول وتأكيد الرحلة" : "Accept Load"}
                  </div>
                </div>

                {/* Load Card 2 */}
                <div className="rounded-xl bg-white/5 border border-white/10 p-2 space-y-1 opacity-80">
                  <div className="flex justify-between items-center text-[9px]">
                    <span className="font-bold text-white">
                      {isRtl ? "السويس ← القاهرة (أسمنت)" : "Suez → Cairo (Cement)"}
                    </span>
                    <span className="font-bold text-emerald-400">5,800 EGP</span>
                  </div>
                  <span className="text-[8px] text-slate-400 block">
                    {isRtl ? "مطلوب تريلا جوانب" : "Trela Sided Required"}
                  </span>
                </div>
              </div>
            )}

            {/* ================= SCREEN 5: ENTERPRISE ================= */}
            {activeTab === "enterprise" && (
              <div className="flex flex-col h-full bg-slate-900 rounded-2xl p-2.5 space-y-2 text-white animate-fadeIn">
                <div className="flex items-center justify-between pb-1 border-b border-white/10">
                  <span className="text-xs font-bold">
                    {isRtl ? "بوابة الشركات" : "Enterprise Hub"}
                  </span>
                  <span className="text-[8px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                    {isRtl ? "١٢ شاحنة نشطة" : "12 Active Fleet"}
                  </span>
                </div>

                {/* Credit Limit Overview */}
                <div className="rounded-xl bg-white/5 p-2 space-y-1 border border-white/10 text-[9px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{isRtl ? "الحد الائتماني:" : "Credit Line:"}</span>
                    <span className="font-bold text-amber-400">500,000 EGP</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full w-[64%]" />
                  </div>
                  <div className="flex justify-between text-[8px] text-slate-400 font-mono">
                    <span>{isRtl ? "المستخدم: ٦٤٪" : "Utilized: 64%"}</span>
                    <span className="text-emerald-400">{isRtl ? "متبقي: ١٨٠ ألف" : "180k Rem."}</span>
                  </div>
                </div>

                {/* Live Enterprise Dispatch */}
                <div className="rounded-xl bg-white/5 border border-white/10 p-2 space-y-1">
                  <div className="flex justify-between text-[8px] text-slate-400">
                    <span>#CORP-8492</span>
                    <span className="text-emerald-400 font-bold">
                      {isRtl ? "في الطريق" : "In Transit"}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-white block">
                    {isRtl ? "ميناء الإسكندرية ← ٦ أكتوبر" : "Alex Port → 6th October"}
                  </span>
                  <span className="text-[8px] text-amber-400 block font-mono">
                    8 {isRtl ? "تريلات" : "Trelas"} · 340 {t("common.ton", "tons")}
                  </span>
                </div>

                <div className="w-full rounded-xl bg-amber-500 py-1.5 text-center text-[9px] font-black text-slate-950">
                  {isRtl ? "طلب إسناد أسطول فوري (+٤٠)" : "Multi-Truck Dispatch"}
                </div>
              </div>
            )}

            {/* ================= SCREEN 6: WALLET & SETTLEMENTS ================= */}
            {activeTab === "wallet" && (
              <div className="flex flex-col h-full bg-slate-900 rounded-2xl p-2.5 space-y-2 text-white animate-fadeIn">
                <div className="flex items-center justify-between pb-1 border-b border-white/10">
                  <div className="flex items-center gap-1">
                    <Wallet className="h-3.5 w-3.5 text-amber-400" />
                    <span className="text-xs font-bold">
                      {isRtl ? "محفظة ديزل" : "Diziel Wallet"}
                    </span>
                  </div>
                  <span className="text-[8px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded font-bold">
                    {isRtl ? "تسوية فورية" : "Instant"}
                  </span>
                </div>

                {/* Wallet Balance Card */}
                <div className="rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-2.5 text-slate-950 shadow-md space-y-1">
                  <span className="text-[8px] font-bold uppercase tracking-wider opacity-80 block">
                    {isRtl ? "الرصيد المتاح للسحب" : "Available Balance"}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black">54,820</span>
                    <span className="text-[10px] font-bold">{t("common.currency", "EGP")}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-black/10 text-[8px] font-bold">
                    <span>InstaPay / Bank</span>
                    <span className="bg-slate-950 text-white px-2 py-0.5 rounded text-[7px]">
                      {isRtl ? "سحب فوري" : "Withdraw"}
                    </span>
                  </div>
                </div>

                {/* Transactions list */}
                <div className="space-y-1 text-[8px]">
                  <div className="rounded-lg bg-white/5 p-1.5 flex justify-between items-center border border-white/5">
                    <span>{isRtl ? "العين السخنة ← ٦ أكتوبر" : "Sokhna → October"}</span>
                    <span className="font-bold text-emerald-400">+8,450 EGP</span>
                  </div>
                  <div className="rounded-lg bg-white/5 p-1.5 flex justify-between items-center border border-white/5">
                    <span>{isRtl ? "الإسكندرية ← العاشر" : "Alex → 10th Ramadan"}</span>
                    <span className="font-bold text-emerald-400">+6,200 EGP</span>
                  </div>
                </div>
              </div>
            )}

            {/* ================= SCREEN 7: DIGITAL WAYBILL ================= */}
            {activeTab === "waybill" && (
              <div className="flex flex-col h-full bg-slate-900 rounded-2xl p-2.5 space-y-2 text-white animate-fadeIn">
                <div className="flex items-center justify-between pb-1 border-b border-white/10">
                  <div className="flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5 text-amber-400" />
                    <span className="text-xs font-bold">
                      {isRtl ? "بوليصة شحن رقمية" : "Digital Waybill"}
                    </span>
                  </div>
                  <span className="text-[8px] font-mono text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                    VERIFIED
                  </span>
                </div>

                {/* Barcode & QR code */}
                <div className="rounded-xl bg-white p-2 text-slate-950 flex flex-col items-center justify-center shadow-inner">
                  <QrCode className="h-12 w-12 text-slate-900" />
                  <span className="text-[7px] font-mono font-bold tracking-widest mt-0.5 text-slate-600">
                    WB-2026-098741-EG
                  </span>
                </div>

                {/* Waybill checklist */}
                <div className="rounded-xl bg-white/5 border border-white/10 p-2 space-y-1 text-[8px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{isRtl ? "الحمولة:" : "Cargo:"}</span>
                    <span className="font-bold text-white">42.50 {t("common.ton", "Tons")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{isRtl ? "تذكرة الميزان:" : "Scale Ticket:"}</span>
                    <span className="font-bold text-emerald-400">✓ {isRtl ? "مطابقة" : "Verified"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{isRtl ? "إثبات الاستلام:" : "POD Sign:"}</span>
                    <span className="font-bold text-amber-400">✓ {isRtl ? "موقع رقمياً" : "Digitally Signed"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Interactive Bottom Screen Switcher */}
            {interactive && (
              <div className="mt-1 flex items-center justify-center gap-1 pt-1 border-t border-white/10">
                {[
                  { id: "live-map", icon: MapPin },
                  { id: "select-truck", icon: Truck },
                  { id: "instant-quote", icon: Sparkles },
                  { id: "driver-radar", icon: Zap },
                  { id: "wallet", icon: Wallet },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id as MockupScreenType)}
                      className={`h-6 w-6 rounded-lg flex items-center justify-center transition-all ${
                        isActive
                          ? "bg-amber-500 text-slate-950 shadow-sm scale-110"
                          : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon className="h-3 w-3" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom Home Bar */}
          <div className="relative z-30 pb-1.5 flex justify-center">
            <div className="h-1 w-20 bg-white/30 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}