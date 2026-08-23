import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Truck,
  MapPin,
  FileText,
  Wallet,
  Zap,
  ShieldCheck,
  Sparkles,
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

// Map each logical screen to one of the real user images
const screenImageMap: Record<MockupScreenType, { src: string; alt: string }> = {
  "live-map": {
    src: "/screen2.png",
    alt: "Diziel Live Map Tracking",
  },
  "select-truck": {
    src: "/hero2.png",
    alt: "Diziel Select Truck Fleet",
  },
  "instant-quote": {
    src: "/screen.png",
    alt: "Diziel Instant Quote Calculation",
  },
  "track-settle": {
    src: "/screen2.png",
    alt: "Diziel Track & Settle",
  },
  "driver-radar": {
    src: "/hero1.png",
    alt: "Diziel Driver Radar & Offers",
  },
  enterprise: {
    src: "/اسطول.png",
    alt: "Diziel Fleet & Enterprise Hub",
  },
  wallet: {
    src: "/screen3.png",
    alt: "Diziel Digital Wallet & Settlements",
  },
  waybill: {
    src: "/screen.png",
    alt: "Diziel Digital Waybill",
  },
};

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
  const { i18n } = useTranslation();
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

  const currentImageInfo =
    screenImageMap[activeTab] || screenImageMap["live-map"];

  return (
    <div
      className={`relative flex items-center justify-center select-none perspective-1500 ${className}`}
    >
      {/* Background Multi-layer Dynamic Glow */}
      <div className="pointer-events-none absolute -inset-6 rounded-[50px] bg-gradient-to-tr from-amber-500/15 via-blue-500/10 to-emerald-500/15 blur-2xl opacity-70" />

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
                {badgeBottomSub ||
                  (isRtl ? "متوسط سرعة الإسناد" : "Dispatch Speed")}
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
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-40 flex items-center justify-between px-3 h-4.5 w-24 bg-black rounded-full shadow-md border border-white/5">
            <div className="h-2 w-2 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
              <div className="h-0.5 w-0.5 rounded-full bg-blue-400" />
            </div>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[6.5px] font-mono text-emerald-400 font-bold">
                GPS LIVE
              </span>
            </div>
          </div>

          {/* Screen Content Container with Real Screenshot Image */}
          <div className="relative flex-1 overflow-hidden flex flex-col justify-between bg-slate-950">
            <div className="relative h-full w-full overflow-hidden">
              <img
                key={activeTab}
                src={currentImageInfo.src}
                alt={currentImageInfo.alt}
                className="h-full w-full object-cover object-top animate-fadeIn transition-transform duration-500 hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Interactive Bottom Screen Switcher (floating glass pills at bottom of screen) */}
            {interactive && (
              <div className="absolute bottom-3 inset-x-2 z-40 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-950/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg">
                {[
                  {
                    id: "select-truck",
                    label: isRtl ? "شاحنات" : "Trucks",
                    icon: Truck,
                  },
                  {
                    id: "instant-quote",
                    label: isRtl ? "تسعير" : "Tariff",
                    icon: Sparkles,
                  },
                  {
                    id: "live-map",
                    label: isRtl ? "تتبع" : "Tracking",
                    icon: MapPin,
                  },
                  {
                    id: "wallet",
                    label: isRtl ? "محفظة" : "Wallet",
                    icon: Wallet,
                  },
                  {
                    id: "enterprise",
                    label: isRtl ? "أسطول" : "Fleet",
                    icon: Layers,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-label={item.label}
                      title={item.label}
                      onClick={() => setActiveTab(item.id as MockupScreenType)}
                      className={`h-7 px-2 rounded-xl flex items-center gap-1 text-[9px] font-bold transition-all ${
                        isActive
                          ? "bg-amber-500 text-slate-950 shadow-md scale-105"
                          : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon className="h-3 w-3" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom Home Bar */}
          <div className="relative z-30 pb-1.5 flex justify-center bg-slate-950/40 backdrop-blur-xs">
            <div className="h-1 w-20 bg-white/30 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
