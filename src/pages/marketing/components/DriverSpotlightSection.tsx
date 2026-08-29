import { useTranslation } from "react-i18next";

export default function DriverSpotlightSection() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language?.startsWith("ar");

  return (
    <section
      id="driver-spotlight"
      className="w-full overflow-hidden transform-gpu"
    >
      <div
        className="
          relative
          overflow-hidden
          rounded-t-[32px]
          sm:rounded-t-[60px]
          lg:rounded-t-[80px]
          bg-[#10294b]
          px-4
          py-6
          xs:px-6
          sm:px-10
          sm:py-8
          lg:px-16
          lg:py-10
        "
      >
        <div
          className="
            grid
            items-center
            gap-8
            sm:gap-12
            lg:grid-cols-[0.9fr_1.1fr]
            lg:gap-16
          "
        >
          {/* ================= DRIVER PROFILE DUAL PHONE 3D MOCKUP ================= */}
          <div className="relative mx-auto w-full max-w-[340px] xs:max-w-[400px] sm:max-w-[520px] flex items-center justify-center py-4 sm:py-6 perspective-1500 overflow-visible">
            {/* Left/Back Phone: Real Driver App Screen (hero1.png) */}
            <div
              className={`relative z-10 w-[160px] xs:w-[190px] sm:w-[235px] h-[340px] xs:h-[400px] sm:h-[480px] rounded-[26px] xs:rounded-[32px] sm:rounded-[40px] bg-slate-800 p-1.5 xs:p-2 sm:p-2.5 shadow-2xl border border-white/20 transform-gpu transition-transform duration-500 hover:scale-105 shrink-0 ${
                isRtl
                  ? "rotate-y-[12deg] sm:rotate-y-[16deg] -rotate-x-[3deg] sm:-rotate-x-[4deg] -rotate-[2deg] sm:-rotate-[3deg]"
                  : "-rotate-y-[12deg] sm:-rotate-y-[16deg] rotate-x-[3deg] sm:rotate-x-[4deg] -rotate-[2deg] sm:-rotate-[3deg]"
              }`}
              style={{
                background: "linear-gradient(145deg, #2d3748 0%, #1a202c 100%)",
                boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.7)",
              }}
            >
              <div className="relative h-full w-full overflow-hidden rounded-[20px] xs:rounded-[24px] sm:rounded-[32px] bg-slate-950 text-white flex flex-col justify-between border border-black shadow-inner">
                {/* Dynamic Island Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 h-3.5 w-18 bg-black rounded-full border border-slate-800" />

                <img
                  src="/hero1.png"
                  alt="Diziel Driver App"
                  className="h-full w-full object-cover object-top"
                  loading="lazy"
                  decoding="async"
                />

                {/* Bottom Home Indicator */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                  <div className="h-1 w-14 bg-white/40 rounded-full" />
                </div>
              </div>
            </div>

            {/* Right/Front Phone: Fleet & Navigation Screen (اسطول.png) */}
            <div
              className={`relative z-20 w-[170px] xs:w-[200px] sm:w-[250px] h-[360px] xs:h-[420px] sm:h-[500px] -ml-8 xs:-ml-10 sm:-ml-12 rtl:ml-0 rtl:-mr-8 rtl:xs:-mr-10 rtl:sm:-mr-12 rounded-[26px] xs:rounded-[32px] sm:rounded-[42px] bg-slate-800 p-1.5 xs:p-2 sm:p-2.5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85)] border border-white/25 transform-gpu transition-transform duration-500 hover:scale-105 shrink-0 ${
                isRtl
                  ? "-rotate-y-[8deg] sm:-rotate-y-[10deg] rotate-x-[2deg]"
                  : "rotate-y-[8deg] sm:rotate-y-[10deg] -rotate-x-[2deg]"
              }`}
              style={{
                background: "linear-gradient(155deg, #374151 0%, #1e293b 100%)",
              }}
            >
              <div className="relative h-full w-full overflow-hidden rounded-[20px] xs:rounded-[24px] sm:rounded-[34px] bg-slate-950 text-white flex flex-col justify-between border border-black shadow-inner">
                {/* Dynamic Island Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 h-3.5 w-20 bg-black rounded-full border border-slate-800" />

                <img
                  src="/اسطول.png"
                  alt="Diziel Fleet Management"
                  className="h-full w-full object-cover object-top"
                  loading="lazy"
                  decoding="async"
                />

                {/* Bottom Home Indicator */}
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                  <div className="h-1 w-16 bg-white/40 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* ================= CONTENT ================= */}
          <div className="text-white text-center lg:text-start">
            {/* Label */}
            <span
              className="
                inline-block
                text-xs
                font-medium
                uppercase
                tracking-[0.18em]
                text-[#ffad22]
                sm:text-sm
              "
            >
              {t("marketing.driverSpotlight.label", "Driver Spotlight")}
            </span>

            {/* Heading */}
            <h2
              className="
                mt-4
                sm:mt-7
                max-w-2xl
                mx-auto
                lg:mx-0
                text-2xl
                xs:text-3xl
                font-medium
                leading-[1.2]
                tracking-[-0.035em]
                text-white
                sm:text-5xl
                lg:text-[42px]
                xl:text-[46px]
              "
            >
              {t(
                "marketing.driverSpotlight.title",
                '"Diziel transformed my business."',
              )}
            </h2>

            {/* Quote */}
            <p
              className="
                mt-4
                sm:mt-7
                max-w-2xl
                mx-auto
                lg:mx-0
                text-sm
                leading-6
                text-white/85
                sm:text-lg
                sm:leading-8
              "
            >
              {t(
                "marketing.driverSpotlight.quote",
                "\"Before joining the network, finding consistent loads was a daily struggle. Now, my truck is always moving, and payments are settled instantly. It's the best decision I've made for my logistics career.\"",
              )}
            </p>

            {/* ================= DRIVER INFO ================= */}
            <div className="mt-6 sm:mt-9">
              <h3 className="text-base font-bold text-white sm:text-xl">
                {t("marketing.driverSpotlight.name", "Ahmed Hassan")}
              </h3>

              <p className="mt-1 text-xs sm:text-sm text-white/60">
                {t(
                  "marketing.driverSpotlight.role",
                  "Jumbo Truck Owner-Operator, Cairo",
                )}
              </p>
            </div>

            {/* ================= CTA ================= */}
            <div className="mt-8 sm:mt-10">
              <a
                href="#join-fleet"
                className="
                  inline-flex
                  w-full
                  xs:w-auto
                  items-center
                  justify-center
                  rounded-full
                  bg-[#ffad22]
                  px-8
                  py-3
                  sm:py-3.5
                  text-sm
                  font-medium
                  text-[#10294b]
                  shadow-[0_8px_20px_rgba(255,173,34,0.22)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#ffb936]
                  hover:shadow-[0_12px_28px_rgba(255,173,34,0.30)]
                "
              >
                {t("marketing.driverSpotlight.cta", "Join the Fleet")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
