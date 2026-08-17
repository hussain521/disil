import { useTranslation } from "react-i18next";
import { Star } from "lucide-react";

export default function DriverSpotlightSection() {
  const { t } = useTranslation();

  return (
    <section id="driver-spotlight">
      <div
        className="
  relative
  overflow-hidden
  rounded-t-[48px]
  sm:rounded-t-[80px]
  bg-[#10294b]
  px-6
  py-12
  sm:px-10
  sm:py-14
  lg:px-16
  lg:py-16
"
      >
        <div
          className="
    grid
    items-center
    gap-12
    lg:grid-cols-[0.9fr_1.1fr]
    lg:gap-16
  "
        >
          {/* ================= IMAGE ================= */}
          <div className="relative mx-auto w-full max-w-[480px]">
            <div
              className="
        overflow-hidden
        rounded-[22px]
        bg-[#e8e3dd]
        shadow-[0_20px_50px_rgba(0,0,0,0.20)]
      "
            >
              <img
                src="/man.png"
                alt="Diziel driver spotlight"
                className="
          aspect-[4/4.5]
          h-full
          w-full
          object-cover
          object-center
        "
              />
            </div>

            {/* ================= TOP RATED BADGE ================= */}
            <div
              className="
        absolute
        -bottom-5
        right-[-5px]
        flex
        h-[105px]
        w-[125px]
        flex-col
        items-center
        justify-center
        rounded-[16px]
        bg-[#ffad22]
        text-[#10294b]
        shadow-[0_12px_30px_rgba(0,0,0,0.20)]
        sm:right-[-28px]
        sm:h-[105px]
        sm:w-[130px]
      "
            >
              <Star className="h-8 w-8 fill-none" strokeWidth={2.5} />

              <span className="mt-1 text-base font-bold">
                {t("marketing.driverSpotlight.topRated", "Top Rated")}
              </span>
            </div>
          </div>

          {/* ================= CONTENT ================= */}
          <div className="text-white">
            {/* Label */}
            <span
              className="
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
        mt-7
        max-w-2xl
        text-4xl
        font-medium
        leading-[1.15]
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
        mt-7
        max-w-2xl
        text-base
        leading-7
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
            <div className="mt-9">
              <h3 className="text-lg font-bold text-white sm:text-xl">
                {t("marketing.driverSpotlight.name", "Ahmed Hassan")}
              </h3>

              <p className="mt-1 text-sm text-white/60">
                {t(
                  "marketing.driverSpotlight.role",
                  "Jumbo Truck Owner-Operator, Cairo",
                )}
              </p>
            </div>

            {/* ================= CTA ================= */}
            <div className="mt-10">
              <a
                href="#join-fleet"
                className="
          inline-flex
          items-center
          justify-center
          rounded-full
          bg-[#ffad22]
          px-8
          py-3.5
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