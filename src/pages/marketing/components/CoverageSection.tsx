import { useTranslation } from "react-i18next";

export default function CoverageSection() {
  const { t } = useTranslation();

  return (
    <section
      id="coverage"
      className="bg-white dark:bg-gray-950 py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ================= HEADER ================= */}
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-800 dark:text-amber-400">
            {t("marketing.coverage.label", "Coverage")}
          </span>

          <h2
            className="
      mt-7
      text-4xl
      font-bold
      tracking-[-0.035em]
      text-slate-900
      dark:text-white
      sm:text-5xl
      lg:text-[48px]
    "
          >
            {t("marketing.coverage.title", "Regional Footprint")}
          </h2>

          <p
            className="
      mx-auto
      mt-5
      max-w-3xl
      text-base
      leading-7
      text-slate-700
      dark:text-gray-300
      sm:text-lg
    "
          >
            {t(
              "marketing.coverage.description",
              "Connecting Egypt and the MENA region with a reliable, expansive logistics network.",
            )}
          </p>
        </div>

        {/* ================= MAP ================= */}
        <div
          className="
    relative
    mt-16
    h-[560px]
    overflow-hidden
    rounded-[28px]
    bg-[#08182d]
    shadow-[0_15px_40px_rgba(16,39,70,0.15)]
    sm:h-[600px]
    lg:h-[625px]
  "
        >
          {/* Map Image */}
          <img
            src="/map2.png"
            alt="Diziel regional logistics network"
            width={1200}
            height={625}
            loading="lazy"
            decoding="async"
            className="
      absolute
      inset-0
      h-full
      w-full
      object-cover
      object-center
    "
          />

          {/* Dark Overlay */}
          <div
            className="
      pointer-events-none
      absolute
      inset-0
      bg-gradient-to-b
      from-[#071629]/10
      via-transparent
      to-[#071629]/20
    "
          />

          {/* ================= STATS ================= */}
          <div
            className="
absolute
bottom-8
left-1/2
z-20
grid
w-[calc(100%-24px)]
max-w-[1200px]
-translate-x-1/2
grid-cols-2
gap-3
sm:bottom-10
sm:w-[calc(100%-60px)]
sm:grid-cols-4
sm:gap-4
lg:gap-5
"
          >
            {/* Trips Completed */}
            <div
              className="
  rounded-[18px]
  bg-white/[0.94]
  dark:bg-gray-900/[0.92]
  border
  border-transparent
  dark:border-gray-800
  px-3
  py-4
  text-center
  shadow-[0_10px_30px_rgba(0,0,0,0.18)]
  backdrop-blur-md
  sm:rounded-[22px]
  sm:px-4
  sm:py-6
"
            >
              <div className="text-2xl font-bold tracking-[-0.03em] text-[#102746] dark:text-white sm:text-3xl lg:text-4xl">
                {t("marketing.coverage.stats.trips.value", "50k+")}
              </div>

              <div className="mt-1 text-xs font-medium text-slate-600 dark:text-gray-300 sm:mt-2 sm:text-sm lg:text-base">
                {t(
                  "marketing.coverage.stats.trips.label",
                  "Trips Completed",
                )}
              </div>
            </div>

            {/* Kilometers Covered */}
            <div
              className="
  rounded-[18px]
  bg-white/[0.94]
  dark:bg-gray-900/[0.92]
  border
  border-transparent
  dark:border-gray-800
  px-3
  py-4
  text-center
  shadow-[0_10px_30px_rgba(0,0,0,0.18)]
  backdrop-blur-md
  sm:rounded-[22px]
  sm:px-4
  sm:py-6
"
            >
              <div className="text-2xl font-bold tracking-[-0.03em] text-amber-800 dark:text-amber-400 sm:text-3xl lg:text-4xl">
                {t("marketing.coverage.stats.kilometers.value", "2.5M+")}
              </div>

              <div className="mt-1 text-xs font-medium text-slate-600 dark:text-gray-300 sm:mt-2 sm:text-sm lg:text-base">
                {t(
                  "marketing.coverage.stats.kilometers.label",
                  "Kilometers Covered",
                )}
              </div>
            </div>

            {/* Active Drivers */}
            <div
              className="
  rounded-[18px]
  bg-white/[0.94]
  dark:bg-gray-900/[0.92]
  border
  border-transparent
  dark:border-gray-800
  px-3
  py-4
  text-center
  shadow-[0_10px_30px_rgba(0,0,0,0.18)]
  backdrop-blur-md
  sm:rounded-[22px]
  sm:px-4
  sm:py-6
"
            >
              <div className="text-2xl font-bold tracking-[-0.03em] text-[#102746] dark:text-white sm:text-3xl lg:text-4xl">
                {t("marketing.coverage.stats.drivers.value", "12k+")}
              </div>

              <div className="mt-1 text-xs font-medium text-slate-600 dark:text-gray-300 sm:mt-2 sm:text-sm lg:text-base">
                {t(
                  "marketing.coverage.stats.drivers.label",
                  "Active Drivers",
                )}
              </div>
            </div>

            {/* Cities Covered */}
            <div
              className="
  rounded-[18px]
  bg-white/[0.94]
  dark:bg-gray-900/[0.92]
  border
  border-transparent
  dark:border-gray-800
  px-3
  py-4
  text-center
  shadow-[0_10px_30px_rgba(0,0,0,0.18)]
  backdrop-blur-md
  sm:rounded-[22px]
  sm:px-4
  sm:py-6
"
            >
              <div className="text-2xl font-bold tracking-[-0.03em] text-[#102746] dark:text-white sm:text-3xl lg:text-4xl">
                {t("marketing.coverage.stats.cities.value", "25+")}
              </div>

              <div className="mt-1 text-xs font-medium text-slate-600 dark:text-gray-300 sm:mt-2 sm:text-sm lg:text-base">
                {t(
                  "marketing.coverage.stats.cities.label",
                  "Cities Covered",
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}