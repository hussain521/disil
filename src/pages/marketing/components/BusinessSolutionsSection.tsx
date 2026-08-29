import { useTranslation } from "react-i18next";
import { Check, ShieldCheck, Sparkles } from "lucide-react";
import AnimatedPhoneMockup from "./AnimatedPhoneMockup";

export default function BusinessSolutionsSection() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language?.startsWith("ar");

  return (
    <section
      id="business-solutions"
      className="bg-[#f7f9fc] dark:bg-gray-900/40 py-8 sm:py-12 lg:py-14 transform-gpu"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="
      overflow-hidden
      rounded-[36px]
      sm:rounded-[42px]
      bg-white
      dark:bg-gray-900
      border
      border-gray-100
      dark:border-gray-800
      shadow-[0_12px_35px_rgba(16,39,70,0.10)]
    "
        >
          <div className="grid lg:grid-cols-2">
            {/* ================= LEFT CONTENT ================= */}
            <div
              className="
          flex
          flex-col
          justify-center
          px-5
          py-8
          sm:px-12
          sm:py-16
          lg:px-20
          lg:py-20
          xl:px-24
        "
            >
              {/* Label */}
              <span className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-800 dark:text-amber-400">
                {t("marketing.business.label", "Business Solutions")}
              </span>

              {/* Heading */}
              <h2
                className="
            mt-8
            max-w-xl
            text-4xl
            font-bold
            leading-[1.08]
            tracking-[-0.035em]
            text-slate-900
            dark:text-white
            sm:text-5xl
          "
              >
                {t(
                  "marketing.business.title",
                  "Scale Your Enterprise Logistics",
                )}
              </h2>

              {/* Description */}
              <p
                className="
            mt-8
            max-w-xl
            text-base
            leading-7
            text-slate-700
            dark:text-gray-300
            sm:text-lg
          "
              >
                {t(
                  "marketing.business.description",
                  "Designed for SMEs and large corporations, our business portal offers dedicated features to manage complex supply chains.",
                )}
              </p>

              {/* ================= FEATURES ================= */}
              <div className="mt-10 space-y-5">
                {/* Feature 1 */}
                <div className="flex items-center gap-4">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-amber-600 dark:border-amber-400">
                    <Check
                      className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400"
                      strokeWidth={3}
                    />
                  </div>

                  <span className="text-[15px] font-medium text-slate-800 dark:text-gray-200 sm:text-base">
                    {t(
                      "marketing.business.features.credit",
                      "Flexible credit terms & invoicing",
                    )}
                  </span>
                </div>

                {/* Feature 2 */}
                <div className="flex items-center gap-4">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-amber-600 dark:border-amber-400">
                    <Check
                      className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400"
                      strokeWidth={3}
                    />
                  </div>

                  <span className="text-[15px] font-medium text-slate-800 dark:text-gray-200 sm:text-base">
                    {t(
                      "marketing.business.features.dashboard",
                      "Multi-user dashboard access",
                    )}
                  </span>
                </div>

                {/* Feature 3 */}
                <div className="flex items-center gap-4">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-amber-600 dark:border-amber-400">
                    <Check
                      className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400"
                      strokeWidth={3}
                    />
                  </div>

                  <span className="text-[15px] font-medium text-slate-800 dark:text-gray-200 sm:text-base">
                    {t(
                      "marketing.business.features.reporting",
                      "Custom reporting & analytics API",
                    )}
                  </span>
                </div>
              </div>

              {/* ================= CTA ================= */}
              <div className="mt-12">
                <a
                  href="#contact"
                  className="
              inline-flex
              items-center
              justify-center
              rounded-full
              bg-[#102746]
              dark:bg-amber-500
              px-9
              py-4
              text-base
              font-medium
              text-white
              dark:text-slate-950
              dark:font-bold
              shadow-[0_8px_20px_rgba(16,39,70,0.18)]
              dark:shadow-amber-500/20
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-[#18365e]
              dark:hover:bg-amber-400
              hover:shadow-[0_12px_25px_rgba(16,39,70,0.25)]
            "
                >
                  {t("marketing.business.cta", "Contact Sales")}
                </a>
              </div>
            </div>

            {/* ================= RIGHT PHONE MOCKUP (APP SCREENSHOTS) ================= */}
            <div className="relative flex min-h-[500px] xs:min-h-[540px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#102746] via-[#0d1e35] to-[#071322] px-2 py-8 sm:p-10 lg:min-h-[720px]">
              {/* Background Ambient Aura */}
              <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-amber-500/15 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-blue-600/15 blur-2xl" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />

              <AnimatedPhoneMockup
                screen="enterprise"
                pose="isometric"
                size="lg"
                interactive={true}
                floatingBadges={true}
                badgeTopSub={isRtl ? "بوابة الشركات" : "Enterprise Hub"}
                badgeTopText={
                  isRtl ? "فواتير إلكترونية معتمدة" : "Certified E-Invoice"
                }
                badgeBottomSub={isRtl ? "شاحنات مخصصة" : "Dedicated Fleet"}
                badgeBottomText={isRtl ? "+٤٠ شاحنة فوراً" : "+40 Trucks Ready"}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
