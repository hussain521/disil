import { useTranslation } from "react-i18next";
import { Truck, Calculator, LocateFixed } from "lucide-react";

export default function ProcessSection() {
  const { t } = useTranslation();

  return (
    <section
      id="how-it-works"
      className="bg-[#f7f9fc] dark:bg-gray-900/50 py-20 sm:py-24 lg:py-28 transition-colors duration-200"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ================= SECTION HEADER ================= */}
        <div className="text-center">
          <span className="text-sm font-medium uppercase tracking-[0.14em] text-[#9a6500] dark:text-amber-400">
            {t("marketing.process.label", "The Process")}
          </span>

          <h2 className="mt-7 text-4xl font-medium tracking-[-0.025em] text-[#102746] dark:text-white sm:text-5xl lg:text-[48px]">
            {t(
              "marketing.process.title",
              "Three Steps to Seamless Shipping",
            )}
          </h2>
        </div>

        {/* ================= PROCESS CARDS ================= */}
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {/* ================= CARD 1 ================= */}
          <div
            className="
      group
      relative
      min-h-[435px]
      overflow-hidden
      rounded-[30px]
      bg-white
      dark:bg-gray-900
      border
      border-transparent
      dark:border-gray-800
      p-10
      shadow-[0_10px_30px_rgba(16,39,70,0.08)]
      dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)]
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-[0_20px_45px_rgba(16,39,70,0.12)]
    "
          >
            {/* Large Number */}
            <span
              className="
        pointer-events-none
        absolute
        right-8
        top-1
        text-[150px]
        font-bold
        leading-none
        tracking-[-0.08em]
        text-[#f3eee8]
        dark:text-white/[0.04]
      "
            >
              1
            </span>

            {/* Icon */}
            <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-[20px] bg-[#fff0d9] dark:bg-amber-500/15 text-[#f5a623] dark:text-amber-400">
              <Truck className="h-9 w-9" />
            </div>

            {/* Content */}
            <div className="relative z-10 mt-8">
              <h3 className="text-[25px] font-bold tracking-[-0.02em] text-[#102746] dark:text-white">
                {t("marketing.process.step1.title", "Select Type")}
              </h3>

              <p className="mt-4 max-w-[390px] text-[16px] leading-6 text-[#554b40] dark:text-gray-300">
                {t(
                  "marketing.process.step1.description",
                  "Choose from our diverse fleet of Jumbos, Tippers, Flatbeds, or Refrigerated trucks based on your cargo.",
                )}
              </p>
            </div>

            {/* Bottom Info */}
            <div
              className="
        absolute
        bottom-10
        left-10
        right-10
        flex
        items-center
        justify-between
        rounded-[16px]
        bg-[#f7f9fc]
        dark:bg-gray-800/80
        px-5
        py-4
      "
            >
              <span className="text-sm text-[#554b40] dark:text-gray-400">
                {t("marketing.process.step1.footerLabel", "Popular:")}
              </span>

              <span className="rounded-md bg-[#efe2d5] dark:bg-amber-500/20 px-3 py-2 text-sm font-medium text-[#102746] dark:text-amber-300">
                {t("marketing.process.step1.footerValue", "Jumbo Winch")}
              </span>
            </div>
          </div>

          {/* ================= CARD 2 ================= */}
          <div
            className="
      group
      relative
      min-h-[435px]
      overflow-hidden
      rounded-[30px]
      bg-white
      dark:bg-gray-900
      border
      border-transparent
      dark:border-gray-800
      p-10
      shadow-[0_10px_30px_rgba(16,39,70,0.08)]
      dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)]
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-[0_20px_45px_rgba(16,39,70,0.12)]
    "
          >
            {/* Large Number */}
            <span
              className="
        pointer-events-none
        absolute
        right-7
        top-1
        text-[150px]
        font-bold
        leading-none
        tracking-[-0.08em]
        text-[#f3eee8]
        dark:text-white/[0.04]
      "
            >
              2
            </span>

            {/* Icon */}
            <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-[20px] bg-[#edf0f5] dark:bg-blue-500/15 text-[#536987] dark:text-blue-400">
              <Calculator className="h-9 w-9" />
            </div>

            {/* Content */}
            <div className="relative z-10 mt-8">
              <h3 className="text-[25px] font-bold tracking-[-0.02em] text-[#102746] dark:text-white">
                {t("marketing.process.step2.title", "Get Instant Quote")}
              </h3>

              <p className="mt-4 max-w-[390px] text-[16px] leading-6 text-[#554b40] dark:text-gray-300">
                {t(
                  "marketing.process.step2.description",
                  "Enter your pickup and drop-off locations to receive a transparent, upfront price with zero hidden fees.",
                )}
              </p>
            </div>

            {/* Bottom Info */}
            <div
              className="
        absolute
        bottom-10
        left-10
        right-10
        flex
        items-center
        justify-between
        rounded-[16px]
        bg-[#f7f9fc]
        dark:bg-gray-800/80
        px-5
        py-4
      "
            >
              <span className="text-sm text-[#554b40] dark:text-gray-400">
                {t("marketing.process.step2.footerLabel", "Est. Time:")}
              </span>

              <span className="text-sm font-medium text-[#102746] dark:text-blue-300">
                {t("marketing.process.step2.footerValue", "Under 30s")}
              </span>
            </div>
          </div>

          {/* ================= CARD 3 ================= */}
          <div
            className="
      group
      relative
      min-h-[435px]
      overflow-hidden
      rounded-[30px]
      bg-white
      dark:bg-gray-900
      border
      border-transparent
      dark:border-gray-800
      p-10
      shadow-[0_10px_30px_rgba(16,39,70,0.08)]
      dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)]
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-[0_20px_45px_rgba(16,39,70,0.12)]
    "
          >
            {/* Large Number */}
            <span
              className="
        pointer-events-none
        absolute
        right-7
        top-1
        text-[150px]
        font-bold
        leading-none
        tracking-[-0.08em]
        text-[#f3eee8]
        dark:text-white/[0.04]
      "
            >
              3
            </span>

            {/* Icon */}
            <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-[20px] bg-[#ddfae9] dark:bg-emerald-500/15 text-[#102746] dark:text-emerald-400">
              <LocateFixed className="h-9 w-9" />
            </div>

            {/* Content */}
            <div className="relative z-10 mt-8">
              <h3 className="text-[25px] font-bold tracking-[-0.02em] text-[#102746] dark:text-white">
                {t("marketing.process.step3.title", "Track & Settle")}
              </h3>

              <p className="mt-4 max-w-[390px] text-[16px] leading-6 text-[#554b40] dark:text-gray-300">
                {t(
                  "marketing.process.step3.description",
                  "Monitor your cargo in real-time. Automated settlements ensure secure and prompt payments upon delivery.",
                )}
              </p>
            </div>

            {/* Bottom Info */}
            <div
              className="
        absolute
        bottom-10
        left-10
        right-10
        flex
        items-center
        justify-between
        rounded-[16px]
        bg-[#f7f9fc]
        dark:bg-gray-800/80
        px-5
        py-4
      "
            >
              <span className="text-sm text-[#554b40] dark:text-gray-400">
                {t("marketing.process.step3.footerLabel", "Tracking:")}
              </span>

              <span className="flex items-center gap-2 text-sm font-medium text-emerald-500 dark:text-emerald-400">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                {t("marketing.process.step3.footerValue", "Live")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}