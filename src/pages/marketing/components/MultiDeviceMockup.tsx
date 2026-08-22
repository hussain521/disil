import { useState } from "react";
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
  ChevronRight,
  ChevronLeft,
  ArrowUpRight,
  Search,
  SlidersHorizontal,
  Navigation,
  CheckCircle,
  Bell,
  Clock,
  Heart,
  Grid,
  User,
  ShoppingBag,
  Menu,
  Maximize2,
} from "lucide-react";

export interface MultiDeviceMockupProps {
  layout?: "trio" | "duo";
  className?: string;
}

export default function MultiDeviceMockup({
  layout = "trio",
  className = "",
}: MultiDeviceMockupProps) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language?.startsWith("ar");
  const [activeCategory, setActiveCategory] = useState<number>(0);

  /* ================= REALISTIC IPHONE 16 PRO HARDWARE CHASSIS ================= */
  const PhoneHardwareChassis = ({
    children,
    tilt = "center",
    elevation = "normal",
    time = "08:34",
  }: {
    children: React.ReactNode;
    tilt?: "left" | "center" | "right" | "duo-back" | "duo-front";
    elevation?: "normal" | "raised";
    time?: string;
  }) => {
    let angleStyle = "";
    let animationClass = "";

    if (tilt === "left") {
      // Left phone tilted toward center
      angleStyle = isRtl
        ? "rotate-y-[16deg] -rotate-x-[3deg] -rotate-[1deg]"
        : "-rotate-y-[16deg] rotate-x-[3deg] -rotate-[1deg]";
      animationClass = isRtl ? "animate-float-tilted-rtl" : "animate-float-tilted";
    } else if (tilt === "right") {
      // Right phone tilted toward center
      angleStyle = isRtl
        ? "-rotate-y-[16deg] rotate-x-[3deg] rotate-[1deg]"
        : "rotate-y-[16deg] -rotate-x-[3deg] rotate-[1deg]";
      animationClass = isRtl ? "animate-float-tilted" : "animate-float-tilted-rtl";
    } else if (tilt === "duo-back") {
      angleStyle = isRtl
        ? "rotate-y-[18deg] -rotate-x-[5deg] scale-95"
        : "-rotate-y-[18deg] rotate-x-[5deg] scale-95";
      animationClass = "animate-float-smooth";
    } else if (tilt === "duo-front") {
      angleStyle = isRtl
        ? "rotate-y-[8deg] -rotate-x-[2deg]"
        : "-rotate-y-[8deg] rotate-x-[2deg]";
      animationClass = "animate-float-smooth";
    } else {
      // Center Phone (elevated forward)
      angleStyle = "scale-[1.02]";
      animationClass = "animate-float-smooth";
    }

    return (
      <div
        className={`relative flex flex-col items-center justify-center transition-all duration-700 ease-out transform-gpu perspective-1500 ${
          elevation === "raised" ? "z-30 lg:-translate-y-5" : "z-20"
        }`}
      >
        {/* Dynamic Studio Ambient Glow */}
        <div
          className="pointer-events-none absolute -inset-6 rounded-[60px] bg-gradient-to-t from-emerald-500/10 via-amber-500/15 to-transparent blur-3xl opacity-80"
        />

        {/* 3D Hardware Body with Titanium Edge */}
        <div
          className={`relative h-[475px] w-[225px] sm:h-[505px] sm:w-[242px] rounded-[42px] p-[7px] sm:p-[8px] mockup-3d-shadow transition-all duration-700 hover:rotate-y-0 hover:rotate-x-0 hover:scale-105 ${angleStyle} ${animationClass}`}
          style={{
            background:
              "linear-gradient(155deg, #2b3544 0%, #161e2b 40%, #0b1019 100%)",
            boxShadow:
              "0 30px 60px -15px rgba(0, 0, 0, 0.85), 0 0 0 1.5px rgba(255, 255, 255, 0.22), inset 0 2px 4px rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.6)",
          }}
        >
          {/* Screen Inner Display Frame */}
          <div className="relative h-full w-full overflow-hidden rounded-[35px] bg-[#f8fafc] text-slate-900 flex flex-col justify-between border border-black shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] select-none">
            {/* Dynamic Island Notch */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-3 h-5 w-26 bg-black rounded-full shadow-lg border border-slate-800">
              <div className="h-2 w-2 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
                <div className="h-0.5 w-0.5 rounded-full bg-blue-400 animate-pulse" />
              </div>
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[7px] font-mono text-emerald-400 font-bold tracking-wider">
                  DIZIEL
                </span>
              </div>
            </div>

            {/* Subtle Glass Shimmer Glare */}
            <div className="pointer-events-none absolute inset-0 z-40 bg-gradient-to-tr from-transparent via-white/[0.08] to-transparent" />

            {/* Status Bar */}
            <div className="relative z-30 flex items-center justify-between px-6 pt-3 text-[10px] font-semibold text-slate-800">
              <span className="font-mono">{time}</span>
              <div className="flex items-center gap-1.5 text-slate-700">
                <Radio className="h-3 w-3 text-slate-800" />
                <span className="text-[8.5px] font-mono font-bold">5G</span>
                <div className="h-2.5 w-4 rounded-[3px] border border-slate-700 p-[1px] flex items-center">
                  <div className="h-full w-[85%] bg-slate-900 rounded-xs" />
                </div>
              </div>
            </div>

            {/* Screen Body */}
            <div className="relative flex-1 overflow-hidden flex flex-col justify-between">
              {children}
            </div>

            {/* Hardware Home Indicator */}
            <div className="relative z-30 pb-1.5 pt-1 flex justify-center bg-white/80 backdrop-blur-xs">
              <div className="h-1 w-24 bg-slate-900/40 rounded-full hover:bg-slate-900 transition" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ================= SCREEN 1: ONBOARDING / HERO (Exact Match to Left Phone in Reference) ================= */
  const ScreenOnboarding = () => (
    <div className="flex flex-col h-full bg-white text-slate-900 animate-fadeIn justify-between">
      {/* Top Visual Image Banner (Warm pink/orange backdrop with cargo truck & driver) */}
      <div className="relative h-[250px] bg-gradient-to-b from-rose-100 via-amber-50 to-white overflow-hidden flex flex-col justify-between p-3">
        <img
          src="/t (1).jpg"
          alt="Diziel Heavy Freight"
          width={242}
          height={250}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-black/30" />

        {/* Top Tag */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="rounded-full bg-slate-900/90 text-white px-2.5 py-0.5 text-[8px] font-extrabold shadow-sm">
            {isRtl ? "ديزيل للخدمات اللوجستية" : "Diziel Logistics"}
          </span>
          <span className="rounded-full bg-amber-500 text-slate-950 px-2 py-0.5 text-[7.5px] font-black shadow-sm">
            {isRtl ? "شحن فوري" : "Instant Matching"}
          </span>
        </div>
      </div>

      {/* Center Onboarding Text (Matches "Elevate Your Shopping Experience With Orange" layout) */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
        <div className="text-center space-y-1.5">
          <h3 className="text-[17px] font-black text-slate-950 leading-tight tracking-tight">
            {isRtl
              ? "ارتقِ بتجربة الشحن والنقل مع ديزيل"
              : "Elevate Your Freight Experience With Diziel"}
          </h3>
          <p className="text-[10px] text-slate-500 leading-relaxed max-w-[230px] mx-auto">
            {isRtl
              ? "أكثر من ١٢ ألف شاحنة معتمدة جاهزة للإسناد الفوري مع تتبع GPS لحظي وبوليصة رقمية موثقة."
              : "12,000+ certified trucks ready for instant dispatch, 360-degree real-time GPS tracking, and instant wallet payouts."}
          </p>
        </div>

        {/* Action Button & Skip */}
        <div className="space-y-2 pt-1">
          <div className="w-full rounded-2xl bg-slate-950 py-3 text-center text-xs font-black text-white shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition cursor-pointer active:scale-95">
            {isRtl ? "ابدأ الشحن الآن" : "Get Started"}
          </div>
          <span className="block text-center text-[9px] text-slate-400 font-bold hover:text-slate-900 cursor-pointer transition">
            {isRtl ? "تخطي للاستعراض" : "Skip"}
          </span>
        </div>
      </div>
    </div>
  );

  /* ================= SCREEN 2: HOME MARKETPLACE & FLASH DISPATCH (Exact Match to Center Phone in Reference) ================= */
  const ScreenHomeMarketplace = () => (
    <div className="flex flex-col h-full bg-[#f8fafc] text-slate-900 animate-fadeIn justify-between">
      <div className="p-3 space-y-2.5 overflow-hidden">
        {/* Top Header Bar: Menu, Search, Heart, Cart (Matches Center Reference Top Bar) */}
        <div className="flex items-center justify-between pb-0.5">
          <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
            <Menu className="h-3.5 w-3.5" />
          </div>

          <div className="flex items-center gap-1.5 text-slate-600">
            <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center">
              <Search className="h-3.5 w-3.5" />
            </div>
            <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center">
              <Heart className="h-3.5 w-3.5" />
            </div>
            <div className="relative h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center">
              <ShoppingBag className="h-3.5 w-3.5" />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
            </div>
          </div>
        </div>

        {/* Promo Flash Sale / Flash Dispatch Card Banner (Matches Center Reference Banner with Models/Promos) */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-100 via-orange-50 to-amber-200 p-3 text-slate-900 shadow-sm border border-amber-200/60">
          <div className="flex items-center justify-between">
            <div className="space-y-1 max-w-[65%]">
              <span className="text-[7.5px] font-black uppercase tracking-wider text-amber-800 bg-amber-300/60 px-1.5 py-0.5 rounded inline-block">
                {isRtl ? "عرض خاص" : "Flash Offer"}
              </span>
              <h4 className="text-xs font-black text-slate-950 leading-tight">
                {isRtl ? "خصم ١٥٪ على شحنات الموانئ" : "Get special freight discount up to 15%"}
              </h4>
              <div className="rounded-xl bg-slate-950 text-white px-2.5 py-1 text-[8px] font-black inline-block shadow-sm">
                {isRtl ? "اطلب شاحنة" : "Ship Now"}
              </div>
            </div>

            <div className="h-16 w-16 rounded-xl overflow-hidden shadow-md bg-slate-200 shrink-0">
              <img
                src="/t (2).jpg"
                alt="Truck Promo"
                width={64}
                height={64}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Dots carousel indicator */}
          <div className="mt-2 flex items-center justify-center gap-1">
            <span className="h-1 w-3 rounded-full bg-emerald-500" />
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="h-1 w-1 rounded-full bg-slate-300" />
          </div>
        </div>

        {/* 5 Circular Category Bubbles (Exact Match to Shoes, Watches, Electronics, Fashion in Reference) */}
        <div className="space-y-1">
          <div className="grid grid-cols-5 gap-1 pt-0.5">
            {[
              { name: isRtl ? "تريلا" : "Flatbed", icon: Truck, bg: "bg-blue-100 text-blue-600" },
              { name: isRtl ? "جامبو" : "Jumbo", icon: Layers, bg: "bg-amber-100 text-amber-700" },
              { name: isRtl ? "مبرد" : "Reefer", icon: Sparkles, bg: "bg-cyan-100 text-cyan-700" },
              { name: isRtl ? "قلاب" : "Tipper", icon: Zap, bg: "bg-rose-100 text-rose-700" },
              { name: isRtl ? "المزيد" : "More", icon: Grid, bg: "bg-emerald-100 text-emerald-700" },
            ].map((cat, i) => {
              const Icon = cat.icon;
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className={`h-9 w-9 rounded-full flex items-center justify-center ${cat.bg} shadow-xs transition hover:scale-110`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[8px] font-bold text-slate-700 text-center leading-none">
                    {cat.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Flash Sale Section with 2 Product Cards (Matches Bottom of Center Reference) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-black text-slate-900">
                {isRtl ? "عروض الشحن الفورية" : "Flash Dispatch"}
              </span>
              <span className="text-amber-500 text-[10px]">⚡</span>
            </div>
            <span className="text-[8px] font-bold text-emerald-600">
              {isRtl ? "متاح فوري" : "Available"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Card 1: Mahmoud Sayed (Certified Driver) */}
            <div className="rounded-2xl bg-white p-2 border border-slate-200/80 shadow-xs space-y-1 relative">
              <span className="absolute top-1.5 left-1.5 rounded-full bg-rose-500 text-white px-1.5 py-0.2 text-[6.5px] font-bold">
                -15%
              </span>
              <div className="h-16 w-full rounded-xl overflow-hidden bg-slate-100">
                <img
                  src="/man.png"
                  alt="Driver"
                  width={100}
                  height={64}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <span className="text-[9px] font-black text-slate-900 block truncate">
                {isRtl ? "كابتن محمود السيد" : "Mahmoud Sayed"}
              </span>
              <div className="flex items-center justify-between text-[8px]">
                <span className="text-amber-500 font-bold flex items-center gap-0.5">
                  ★ 4.98
                </span>
                <span className="font-extrabold text-slate-900">8,450 EGP</span>
              </div>
            </div>

            {/* Card 2: Reefer Shipment */}
            <div className="rounded-2xl bg-white p-2 border border-slate-200/80 shadow-xs space-y-1 relative">
              <div className="h-16 w-full rounded-xl overflow-hidden bg-slate-100">
                <img
                  src="/t (3).jpg"
                  alt="Reefer"
                  width={100}
                  height={64}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-[9px] font-black text-slate-900 block truncate">
                {isRtl ? "شاحنة تبريد -١٨°م" : "Reefer Cold Cargo"}
              </span>
              <div className="flex items-center justify-between text-[8px]">
                <span className="text-amber-500 font-bold flex items-center gap-0.5">
                  ★ 4.95
                </span>
                <span className="font-extrabold text-slate-900">9,200 EGP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar with Center Floating Green Button (Exact Match to Center Reference Navigation) */}
      <div className="relative bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-between text-slate-400 shadow-lg">
        <div className="flex flex-col items-center gap-0.5 text-emerald-600">
          <Truck className="h-4 w-4" />
          <span className="text-[7.5px] font-bold">{isRtl ? "الرئيسية" : "Home"}</span>
        </div>

        <div className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-700 transition">
          <Grid className="h-4 w-4" />
          <span className="text-[7.5px] font-bold">{isRtl ? "الأقسام" : "Categories"}</span>
        </div>

        {/* Glowing Center Green Action Button */}
        <div className="relative -mt-5 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_4px_16px_rgba(16,185,129,0.5)] ring-4 ring-white transition hover:scale-110 cursor-pointer active:scale-95">
          <Zap className="h-5 w-5 fill-white text-white" />
        </div>

        <div className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-700 transition">
          <FileText className="h-4 w-4" />
          <span className="text-[7.5px] font-bold">{isRtl ? "البوالص" : "Waybill"}</span>
        </div>

        <div className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-700 transition">
          <User className="h-4 w-4" />
          <span className="text-[7.5px] font-bold">{isRtl ? "حسابي" : "Profile"}</span>
        </div>
      </div>
    </div>
  );

  /* ================= SCREEN 3: ALL CATEGORIES 2-COLUMN GRID (Exact Match to Right Phone in Reference) ================= */
  const ScreenAllCategories = () => (
    <div className="flex flex-col h-full bg-[#f8fafc] text-slate-900 animate-fadeIn justify-between">
      <div className="p-3 space-y-2 overflow-hidden">
        {/* Header with Back Arrow and Search (Matches Right Reference Header) */}
        <div className="flex items-center justify-between pb-0.5">
          <div className="flex items-center gap-1.5">
            <ChevronLeft className={`h-4 w-4 text-slate-700 ${isRtl ? "rotate-180" : ""}`} />
            <span className="text-xs font-black text-slate-900">
              {isRtl ? "جميع الفئات والخدمات" : "All Categories"}
            </span>
          </div>
          <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
            <Search className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* 8 Circular Subcategories Bubbles in 2 Rows (Matches Right Reference Top 8 Bubbles) */}
        <div className="grid grid-cols-4 gap-1.5 py-1">
          {[
            { label: isRtl ? "تريلا" : "Trela", icon: Truck, bg: "bg-blue-100 text-blue-600" },
            { label: isRtl ? "جامبو" : "Jumbo", icon: Layers, bg: "bg-amber-100 text-amber-700" },
            { label: isRtl ? "مبرد" : "Reefer", icon: Sparkles, bg: "bg-cyan-100 text-cyan-700" },
            { label: isRtl ? "قلاب" : "Tipper", icon: Zap, bg: "bg-rose-100 text-rose-700" },
            { label: isRtl ? "عقود" : "B2B", icon: ShieldCheck, bg: "bg-emerald-100 text-emerald-700" },
            { label: isRtl ? "مستودعات" : "Storage", icon: MapPin, bg: "bg-purple-100 text-purple-700" },
            { label: isRtl ? "شحن بحري" : "Port", icon: Radio, bg: "bg-indigo-100 text-indigo-700" },
            { label: isRtl ? "المزيد" : "More", icon: Grid, bg: "bg-slate-100 text-slate-700" },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex flex-col items-center gap-0.5">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${item.bg} shadow-2xs transition hover:scale-110`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span className="text-[7.5px] font-bold text-slate-700 text-center">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Popular Brands / Fleet Grid (Matches 2x3 Grid in Right Reference) */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] font-black text-slate-900">
              {isRtl ? "الشاحنات الأكثر طلباً" : "Popular Fleet"}
            </span>
            <span className="text-[8px] font-bold text-emerald-600">
              {isRtl ? "عرض الكل" : "View All"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Grid 1: Trela Flatbed */}
            <div className="rounded-2xl bg-white border border-slate-200/80 p-1.5 space-y-1 shadow-xs hover:border-emerald-500 transition">
              <div className="h-16 w-full rounded-xl overflow-hidden bg-slate-100 relative">
                <img
                  src="/t (1).jpg"
                  alt="Flatbed"
                  width={100}
                  height={64}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
                <span className="absolute top-1 right-1 rounded bg-slate-950 text-white px-1.5 py-0.2 text-[6.5px] font-black">
                  45T
                </span>
              </div>
              <span className="text-[9px] font-black text-slate-900 block truncate">
                {isRtl ? "تريلا فرش مفتوح" : "Flatbed Trela"}
              </span>
              <div className="flex justify-between items-center text-[8px]">
                <span className="font-extrabold text-emerald-600">8,450 EGP</span>
                <span className="text-amber-500">★ 4.9</span>
              </div>
            </div>

            {/* Grid 2: Jumbo Box */}
            <div className="rounded-2xl bg-white border border-slate-200/80 p-1.5 space-y-1 shadow-xs hover:border-emerald-500 transition">
              <div className="h-16 w-full rounded-xl overflow-hidden bg-slate-100 relative">
                <img
                  src="/t (2).jpg"
                  alt="Jumbo"
                  width={100}
                  height={64}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
                <span className="absolute top-1 right-1 rounded bg-blue-600 text-white px-1.5 py-0.2 text-[6.5px] font-black">
                  6T
                </span>
              </div>
              <span className="text-[9px] font-black text-slate-900 block truncate">
                {isRtl ? "جامبو مغلق حماية" : "Jumbo Box"}
              </span>
              <div className="flex justify-between items-center text-[8px]">
                <span className="font-extrabold text-slate-900">4,200 EGP</span>
                <span className="text-amber-500">★ 4.8</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-between text-slate-400 shadow-lg">
        <div className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-700 transition">
          <Truck className="h-4 w-4" />
          <span className="text-[7.5px] font-bold">{isRtl ? "الرئيسية" : "Home"}</span>
        </div>
        <div className="flex flex-col items-center gap-0.5 text-emerald-600">
          <Grid className="h-4 w-4" />
          <span className="text-[7.5px] font-bold">{isRtl ? "الأقسام" : "Categories"}</span>
        </div>
        <div className="relative -mt-5 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_4px_16px_rgba(16,185,129,0.5)] ring-4 ring-white">
          <Zap className="h-5 w-5 fill-white text-white" />
        </div>
        <div className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-700 transition">
          <FileText className="h-4 w-4" />
          <span className="text-[7.5px] font-bold">{isRtl ? "البوالص" : "Waybill"}</span>
        </div>
        <div className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-700 transition">
          <User className="h-4 w-4" />
          <span className="text-[7.5px] font-bold">{isRtl ? "حسابي" : "Profile"}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`relative w-full max-w-6xl mx-auto ${className}`}>
      {layout === "trio" && (
        <div className="relative flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-0 lg:-space-x-10 py-6">
          {/* Left Phone: Onboarding Hero Screen (tilted inwards) */}
          <div className="order-2 lg:order-1 transition-transform duration-500 hover:z-40">
            <PhoneHardwareChassis tilt="left" time="08:31">
              <ScreenOnboarding />
            </PhoneHardwareChassis>
          </div>

          {/* Center Phone: Marketplace & Live Dispatch (elevated forward focus) */}
          <div className="order-1 lg:order-2 z-30 transition-transform duration-500 hover:z-40">
            <PhoneHardwareChassis tilt="center" elevation="raised" time="08:34">
              <ScreenHomeMarketplace />
            </PhoneHardwareChassis>
          </div>

          {/* Right Phone: Categories & Grid (tilted inwards) */}
          <div className="order-3 lg:order-3 transition-transform duration-500 hover:z-40">
            <PhoneHardwareChassis tilt="right" time="09:41">
              <ScreenAllCategories />
            </PhoneHardwareChassis>
          </div>
        </div>
      )}

      {layout === "duo" && (
        <div className="relative flex items-center justify-center -space-x-12 py-6">
          {/* Back Phone */}
          <div className="z-10">
            <PhoneHardwareChassis tilt="duo-back" time="08:31">
              <ScreenOnboarding />
            </PhoneHardwareChassis>
          </div>

          {/* Front Phone */}
          <div className="z-20">
            <PhoneHardwareChassis tilt="duo-front" time="08:34">
              <ScreenHomeMarketplace />
            </PhoneHardwareChassis>
          </div>
        </div>
      )}
    </div>
  );
}