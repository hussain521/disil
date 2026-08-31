import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Truck, MapPin, Wallet, Sparkles, Layers } from "lucide-react";

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
  badgeTopSub?: string;
  badgeTopText?: string;
  badgeBottomSub?: string;
  badgeBottomText?: string;
  className?: string;
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

const AUTO_ROTATE_SCREENS: MockupScreenType[] = [
  "select-truck",
  "instant-quote",
  "live-map",
  "wallet",
  "enterprise",
];

export default function AnimatedPhoneMockup({
  screen = "live-map",
  pose = "floating-tilt",
  size = "md",
  interactive = true,
  className = "",
}: AnimatedPhoneMockupProps) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language?.startsWith("ar");
  const [activeTab, setActiveTab] = useState<MockupScreenType>(screen);
  const [prevTab, setPrevTab] = useState<MockupScreenType>(screen);

  useEffect(() => {
    if (screen !== activeTab) {
      setPrevTab(activeTab);
      setActiveTab(screen);
    }
  }, [screen]);

  // Auto-switch images smoothly every 3.5 seconds without any blank/black frame
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((currentActive) => {
        const currentIndex = AUTO_ROTATE_SCREENS.indexOf(currentActive);
        const nextIndex =
          currentIndex === -1
            ? 0
            : (currentIndex + 1) % AUTO_ROTATE_SCREENS.length;
        const nextTab = AUTO_ROTATE_SCREENS[nextIndex];
        setPrevTab(currentActive);
        return nextTab;
      });
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  const changeTabWithFade = (newTab: MockupScreenType) => {
    if (newTab !== activeTab) {
      setPrevTab(activeTab);
      setActiveTab(newTab);
    }
  };

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
        return "";
    }
  };

  const currentImageInfo =
    screenImageMap[activeTab] || screenImageMap["live-map"];

  const buttonsList = [
    {
      id: "select-truck" as MockupScreenType,
      label: isRtl ? "شاحنات" : "Trucks",
      icon: Truck,
    },
    {
      id: "instant-quote" as MockupScreenType,
      label: isRtl ? "تسعير" : "Tariff",
      icon: Sparkles,
    },
    {
      id: "live-map" as MockupScreenType,
      label: isRtl ? "تتبع" : "Tracking",
      icon: MapPin,
    },
    {
      id: "wallet" as MockupScreenType,
      label: isRtl ? "محفظة" : "Wallet",
      icon: Wallet,
    },
    {
      id: "enterprise" as MockupScreenType,
      label: isRtl ? "أسطول" : "Fleet",
      icon: Layers,
    },
  ];

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none perspective-1500 w-full max-w-full ${className}`}
    >
      {/* Background Dynamic Glow */}
      <div className="pointer-events-none absolute -inset-6 rounded-[50px] bg-gradient-to-tr from-amber-500/15 via-blue-500/10 to-emerald-500/15 blur-2xl opacity-70" />

      {/* Main 3D Phone Chassis (Clean without any floating badges) */}
      <div
        className={`relative ${sizeClasses} rounded-[48px] sm:rounded-[54px] bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950 p-[8px] sm:p-[10px] mockup-3d-shadow border border-slate-600/70 ring-1 ring-black ${getPoseClass()}`}
      >
        {/* Screen Bezel & Display Screen */}
        <div className="relative h-full w-full overflow-hidden rounded-[40px] sm:rounded-[44px] bg-slate-950 text-white border border-black flex flex-col justify-between shadow-inner">
          {/* Glass Reflection Sweep Accent */}
          <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-[40px] sm:rounded-[44px]">
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
                DIZIEL GPS
              </span>
            </div>
          </div>

          {/* Screen Content Container with Smooth Fade In / Fade Out Transitions */}
          <div className="relative flex-1 overflow-hidden bg-slate-950 flex items-center justify-center p-1">
            {Object.entries(screenImageMap).map(([key, info]) => {
              const isActive = activeTab === key;
              const isPrev = prevTab === key;

              let layerStyle = "opacity-0 z-0 pointer-events-none";
              if (isActive) {
                layerStyle = "opacity-100 z-20 transition-opacity duration-700 ease-in-out";
              } else if (isPrev) {
                layerStyle = "opacity-100 z-10";
              }

              return (
                <img
                  key={key}
                  src={info.src}
                  alt={info.alt}
                  className={`absolute inset-0 h-full w-full object-contain object-center ${layerStyle}`}
                  loading="eager"
                  decoding="async"
                />
              );
            })}
          </div>

          {/* Bottom Home Bar */}
          <div className="relative z-30 pb-1.5 flex justify-center bg-slate-950/40 backdrop-blur-xs">
            <div className="h-1 w-20 bg-white/30 rounded-full" />
          </div>
        </div>
      </div>

      {/* Interactive Buttons OUTSIDE the phone bar */}
      {interactive && (
        <div className="mt-5 z-40 w-full max-w-full overflow-x-auto no-scrollbar px-2 py-1 flex justify-center">
          <div className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-xl rounded-full border border-slate-700/80 shadow-2xl max-w-full overflow-x-auto no-scrollbar">
            {buttonsList.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-label={item.label}
                  title={item.label}
                  onClick={() => changeTabWithFade(item.id)}
                  className={`h-7 sm:h-9 px-2 sm:px-3 rounded-full flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-bold transition-all duration-300 cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30"
                      : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
