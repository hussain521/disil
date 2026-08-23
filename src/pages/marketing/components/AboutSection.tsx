import { useTranslation } from "react-i18next";
import {
  Building2,
  TrendingUp,
  Truck,
  MapPin,
  Award,
  Compass,
  Target,
  CheckCircle2,
  Shield,
  Zap,
  BadgePercent,
} from "lucide-react";

export default function AboutSection() {
  const { t } = useTranslation();

  return (
    <section
      id="about-us"
      className="relative overflow-hidden py-20 sm:py-28 bg-white dark:bg-gray-950 border-b border-gray-200/80 dark:border-gray-800/80 transform-gpu"
    >
      {/* Subtle Ambient Background */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-96 w-full max-w-7xl bg-gradient-to-b from-amber-500/5 via-blue-500/5 to-transparent blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <Building2 className="h-3.5 w-3.5" />
            <span>{t("marketing.about.badge", "About Us & Vision")}</span>
          </div>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-4xl lg:text-5xl leading-tight">
            {t(
              "marketing.about.title",
              "Pioneering the Digital Transformation of Freight Logistics",
            )}
          </h2>

          <p className="mt-5 text-base sm:text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            {t(
              "marketing.about.description",
              "Diziel is an end-to-end digital freight platform seamlessly connecting enterprises and shippers with certified fleet owners and vetted drivers across Egypt, delivering transparent, instant, and reliable road logistics.",
            )}
          </p>
        </div>

        {/* Platform Live Stats Strip */}
        <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {[
            {
              value: t("marketing.about.stats.tripsCount", "+50,000"),
              label: t("marketing.about.stats.trips", "Completed Shipments"),
              icon: TrendingUp,
              color: "text-amber-500",
              bg: "bg-amber-500/10",
            },
            {
              value: t("marketing.about.stats.trucksCount", "+12,000"),
              label: t("marketing.about.stats.trucks", "Verified Trucks"),
              icon: Truck,
              color: "text-blue-500",
              bg: "bg-blue-500/10",
            },
            {
              value: t("marketing.about.stats.governoratesCount", "27"),
              label: t(
                "marketing.about.stats.governorates",
                "Governorates Covered",
              ),
              icon: MapPin,
              color: "text-emerald-500",
              bg: "bg-emerald-500/10",
            },
            {
              value: t("marketing.about.stats.uptimeCount", "99.4%"),
              label: t("marketing.about.stats.uptime", "On-Time Dispatch Rate"),
              icon: Award,
              color: "text-indigo-500",
              bg: "bg-indigo-500/10",
            },
          ].map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl border border-gray-200/80 dark:border-gray-800 bg-slate-50/60 dark:bg-gray-900/50 p-6 text-center shadow-sm transition hover:shadow-md hover:border-amber-500/30"
              >
                <div
                  className={`mx-auto mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl ${stat.bg} ${stat.color}`}
                >
                  <IconComponent className="h-5 w-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* 3 Core Pillars: Who We Are / Vision / Mission */}
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {/* Card 1: Who We Are */}
          <div className="group relative flex flex-col justify-between rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/80 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-amber-500/40">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 transition group-hover:scale-110">
                  <Building2 className="h-7 w-7" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full">
                  01
                </span>
              </div>

              <span className="mt-6 block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {t(
                  "marketing.about.whoWeAre.subtitle",
                  "Smart Logistics Marketplace",
                )}
              </span>

              <h3 className="mt-2 text-2xl font-bold text-gray-950 dark:text-white">
                {t("marketing.about.whoWeAre.title", "About Us")}
              </h3>

              <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {t(
                  "marketing.about.whoWeAre.description",
                  "A state-of-the-art logistics ecosystem engineered to transform heavy and commercial cargo transport in Egypt, utilizing algorithmic pricing, live GPS telemetry, and a verified carrier network across the nation.",
                )}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>{t("marketing.hero.badge", "Live Network Tracking")}</span>
            </div>
          </div>

          {/* Card 2: Vision */}
          <div className="group relative flex flex-col justify-between rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/80 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-blue-500/40">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 transition group-hover:scale-110">
                  <Compass className="h-7 w-7" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full">
                  02
                </span>
              </div>

              <span className="mt-6 block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {t(
                  "marketing.about.vision.subtitle",
                  "Future of Smart Logistics",
                )}
              </span>

              <h3 className="mt-2 text-2xl font-bold text-gray-950 dark:text-white">
                {t("marketing.about.vision.title", "Our Vision")}
              </h3>

              <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {t(
                  "marketing.about.vision.description",
                  "To be the premier digital freight infrastructure across Egypt and the Middle East, leading the transformation of supply chain efficiency through transparency, intelligence, and sustainable innovation.",
                )}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>{t("common.brandName", "Diziel")} — 2030 Roadmap</span>
            </div>
          </div>

          {/* Card 3: Mission */}
          <div className="group relative flex flex-col justify-between rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/80 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-emerald-500/40">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 transition group-hover:scale-110">
                  <Target className="h-7 w-7" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                  03
                </span>
              </div>

              <span className="mt-6 block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {t(
                  "marketing.about.mission.subtitle",
                  "Empowering Supply Chains",
                )}
              </span>

              <h3 className="mt-2 text-2xl font-bold text-gray-950 dark:text-white">
                {t("marketing.about.mission.title", "Our Mission")}
              </h3>

              <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {t(
                  "marketing.about.mission.description",
                  "Empowering shippers, enterprises, and drivers with smart tools that ensure instant fair pricing, guaranteed vehicle capacity, live tracking, and frictionless automated digital settlements.",
                )}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>
                {t(
                  "marketing.driverEarnings.guaranteeTitle",
                  "Guaranteed Fast Payouts",
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Core Values Feature Highlights */}
        <div className="mt-14 rounded-3xl border border-gray-200 dark:border-gray-800 bg-slate-50/80 dark:bg-gray-900/60 p-8 sm:p-10">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              {t("marketing.about.values.badge", "Pillars of Excellence")}
            </span>
            <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-950 dark:text-white">
              {t(
                "marketing.about.values.title",
                "Values Guiding Every Single Shipment",
              )}
            </h3>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-950 dark:text-white">
                  {t(
                    "marketing.about.values.safety.title",
                    "Safety & Reliability",
                  )}
                </h4>
                <p className="mt-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {t(
                    "marketing.about.values.safety.desc",
                    "Rigorous KYC driver checks, comprehensive cargo insurance coverage, and verified vehicle roadworthiness.",
                  )}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-950 dark:text-white">
                  {t(
                    "marketing.about.values.speed.title",
                    "Speed & Guaranteed Capacity",
                  )}
                </h4>
                <p className="mt-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {t(
                    "marketing.about.values.speed.desc",
                    "Fast truck dispatch across all categories within minutes while reducing empty return trips.",
                  )}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <BadgePercent className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-950 dark:text-white">
                  {t(
                    "marketing.about.values.transparency.title",
                    "Total Transparency & Fair Tariffs",
                  )}
                </h4>
                <p className="mt-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {t(
                    "marketing.about.values.transparency.desc",
                    "Instant algorithmic pricing with zero hidden fees and direct, automated digital wallet settlements.",
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
