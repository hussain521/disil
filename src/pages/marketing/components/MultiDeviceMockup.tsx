import { useTranslation } from "react-i18next";

export interface MultiDeviceMockupProps {
  layout?: "trio" | "duo";
  className?: string;
}

export default function MultiDeviceMockup({
  layout = "trio",
  className = "",
}: MultiDeviceMockupProps) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language?.startsWith("ar");

  /* ================= REALISTIC IPHONE HARDWARE CHASSIS ================= */
  const PhoneHardwareChassis = ({
    imageSrc,
    altText,
    tilt = "center",
    elevation = "normal",
  }: {
    imageSrc: string;
    altText: string;
    tilt?: "left" | "center" | "right" | "duo-back" | "duo-front";
    elevation?: "normal" | "raised";
  }) => {
    let angleStyle = "";
    let animationClass = "";

    if (tilt === "left") {
      angleStyle = isRtl
        ? "rotate-y-[14deg] -rotate-x-[2deg] -rotate-[1deg]"
        : "-rotate-y-[14deg] rotate-x-[2deg] -rotate-[1deg]";
      animationClass = isRtl
        ? "animate-float-tilted-rtl"
        : "animate-float-tilted";
    } else if (tilt === "right") {
      angleStyle = isRtl
        ? "-rotate-y-[14deg] rotate-x-[2deg] rotate-[1deg]"
        : "rotate-y-[14deg] -rotate-x-[2deg] rotate-[1deg]";
      animationClass = isRtl
        ? "animate-float-tilted"
        : "animate-float-tilted-rtl";
    } else if (tilt === "duo-back") {
      angleStyle = isRtl
        ? "rotate-y-[16deg] -rotate-x-[4deg] scale-95"
        : "-rotate-y-[16deg] rotate-x-[4deg] scale-95";
      animationClass = "animate-float-smooth";
    } else if (tilt === "duo-front") {
      angleStyle = isRtl
        ? "rotate-y-[6deg] -rotate-x-[2deg]"
        : "-rotate-y-[6deg] rotate-x-[2deg]";
      animationClass = "animate-float-smooth";
    } else {
      angleStyle = "scale-[1.03]";
      animationClass = "animate-float-smooth";
    }

    return (
      <div
        className={`relative flex flex-col items-center justify-center transition-all duration-700 ease-out transform-gpu perspective-1500 ${
          elevation === "raised" ? "z-30 lg:-translate-y-4" : "z-20"
        }`}
      >
        {/* Dynamic Studio Ambient Glow */}
        <div className="pointer-events-none absolute -inset-4 rounded-[50px] bg-amber-500/15 blur-2xl opacity-70" />

        {/* 3D Hardware Body with Titanium Edge */}
        <div
          className={`relative h-[480px] w-[230px] sm:h-[515px] sm:w-[246px] rounded-[42px] p-[8px] mockup-3d-shadow transition-transform duration-500 hover:rotate-y-0 hover:rotate-x-0 hover:scale-105 ${angleStyle} ${animationClass}`}
          style={{
            background:
              "linear-gradient(155deg, #2b3544 0%, #161e2b 40%, #0b1019 100%)",
            boxShadow:
              "0 25px 50px -15px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.2)",
          }}
        >
          {/* Screen Inner Display Frame */}
          <div className="relative h-full w-full overflow-hidden rounded-[34px] bg-slate-950 text-slate-900 border border-black shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] select-none">
            {/* Dynamic Island Notch */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-3 h-4.5 w-24 bg-black rounded-full shadow-lg border border-slate-800/80">
              <div className="h-2 w-2 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
                <div className="h-0.5 w-0.5 rounded-full bg-blue-400 animate-pulse" />
              </div>
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[6.5px] font-mono text-emerald-400 font-bold tracking-wider">
                  DIZIEL
                </span>
              </div>
            </div>

            {/* Subtle Glass Shimmer Glare */}
            <div className="pointer-events-none absolute inset-0 z-40 bg-gradient-to-tr from-transparent via-white/[0.08] to-transparent" />

            {/* Real Screenshot Image Container */}
            <div className="relative h-full w-full overflow-hidden bg-slate-950">
              <img
                src={imageSrc}
                alt={altText}
                className="h-full w-full object-cover object-top transition-transform duration-500 hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Hardware Home Indicator */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
              <div className="h-1 w-20 bg-white/40 rounded-full backdrop-blur-xs" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`relative w-full max-w-6xl mx-auto ${className}`}>
      {layout === "trio" && (
        <div className="relative flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-0 lg:-space-x-8 py-6">
          {/* Left Phone: hero1.png */}
          <div className="order-2 lg:order-1 transition-transform duration-500 hover:z-40">
            <PhoneHardwareChassis
              imageSrc="/hero1.png"
              altText="Diziel Mobile App Screen 1"
              tilt="left"
            />
          </div>

          {/* Center Phone: hero2.png */}
          <div className="order-1 lg:order-2 z-30 transition-transform duration-500 hover:z-40">
            <PhoneHardwareChassis
              imageSrc="/hero2.png"
              altText="Diziel Mobile App Main Screen"
              tilt="center"
              elevation="raised"
            />
          </div>

          {/* Right Phone: screen3.png */}
          <div className="order-3 lg:order-3 transition-transform duration-500 hover:z-40">
            <PhoneHardwareChassis
              imageSrc="/screen3.png"
              altText="Diziel Mobile App Screen 3"
              tilt="right"
            />
          </div>
        </div>
      )}

      {layout === "duo" && (
        <div className="relative flex items-center justify-center -space-x-10 py-6">
          {/* Back Phone: hero1.png */}
          <div className="z-10">
            <PhoneHardwareChassis
              imageSrc="/hero1.png"
              altText="Diziel Mobile App Screen"
              tilt="duo-back"
            />
          </div>

          {/* Front Phone: hero2.png */}
          <div className="z-20">
            <PhoneHardwareChassis
              imageSrc="/hero2.png"
              altText="Diziel Mobile App Screen Front"
              tilt="duo-front"
            />
          </div>
        </div>
      )}
    </div>
  );
}
