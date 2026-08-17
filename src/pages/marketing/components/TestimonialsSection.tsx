import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Star,
  Quote,
  Building2,
  CheckCircle2,
  TrendingUp,
  Award,
  Users,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface TestimonialItem {
  id: string;
  category: "enterprises" | "fmcg" | "construction" | "fleetOwners";
  quoteKey: string;
  authorKey: string;
  roleKey: string;
  companyKey: string;
  metricKey: string;
  tagKey: string;
  avatarInitials: string;
  rating: number;
}

export default function TestimonialsSection() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language?.startsWith("ar");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const testimonials: TestimonialItem[] = [
    {
      id: "c1",
      category: "fmcg",
      quoteKey: "marketing.testimonials.items.c1.quote",
      authorKey: "marketing.testimonials.items.c1.author",
      roleKey: "marketing.testimonials.items.c1.role",
      companyKey: "marketing.testimonials.items.c1.company",
      metricKey: "marketing.testimonials.items.c1.metric",
      tagKey: "marketing.testimonials.items.c1.tag",
      avatarInitials: "TA",
      rating: 5,
    },
    {
      id: "c2",
      category: "construction",
      quoteKey: "marketing.testimonials.items.c2.quote",
      authorKey: "marketing.testimonials.items.c2.author",
      roleKey: "marketing.testimonials.items.c2.role",
      companyKey: "marketing.testimonials.items.c2.company",
      metricKey: "marketing.testimonials.items.c2.metric",
      tagKey: "marketing.testimonials.items.c2.tag",
      avatarInitials: "AS",
      rating: 5,
    },
    {
      id: "c3",
      category: "enterprises",
      quoteKey: "marketing.testimonials.items.c3.quote",
      authorKey: "marketing.testimonials.items.c3.author",
      roleKey: "marketing.testimonials.items.c3.role",
      companyKey: "marketing.testimonials.items.c3.company",
      metricKey: "marketing.testimonials.items.c3.metric",
      tagKey: "marketing.testimonials.items.c3.tag",
      avatarInitials: "SK",
      rating: 5,
    },
    {
      id: "c4",
      category: "fleetOwners",
      quoteKey: "marketing.testimonials.items.c4.quote",
      authorKey: "marketing.testimonials.items.c4.author",
      roleKey: "marketing.testimonials.items.c4.role",
      companyKey: "marketing.testimonials.items.c4.company",
      metricKey: "marketing.testimonials.items.c4.metric",
      tagKey: "marketing.testimonials.items.c4.tag",
      avatarInitials: "IM",
      rating: 5,
    },
    {
      id: "c5",
      category: "fmcg",
      quoteKey: "marketing.testimonials.items.c5.quote",
      authorKey: "marketing.testimonials.items.c5.author",
      roleKey: "marketing.testimonials.items.c5.role",
      companyKey: "marketing.testimonials.items.c5.company",
      metricKey: "marketing.testimonials.items.c5.metric",
      tagKey: "marketing.testimonials.items.c5.tag",
      avatarInitials: "HY",
      rating: 5,
    },
    {
      id: "c6",
      category: "enterprises",
      quoteKey: "marketing.testimonials.items.c6.quote",
      authorKey: "marketing.testimonials.items.c6.author",
      roleKey: "marketing.testimonials.items.c6.role",
      companyKey: "marketing.testimonials.items.c6.company",
      metricKey: "marketing.testimonials.items.c6.metric",
      tagKey: "marketing.testimonials.items.c6.tag",
      avatarInitials: "MK",
      rating: 5,
    },
  ];

  const categories = [
    { id: "all", labelKey: "marketing.testimonials.categories.all" },
    {
      id: "enterprises",
      labelKey: "marketing.testimonials.categories.enterprises",
    },
    { id: "fmcg", labelKey: "marketing.testimonials.categories.fmcg" },
    {
      id: "construction",
      labelKey: "marketing.testimonials.categories.construction",
    },
    {
      id: "fleetOwners",
      labelKey: "marketing.testimonials.categories.fleetOwners",
    },
  ];

  const filtered =
    activeCategory === "all"
      ? testimonials
      : testimonials.filter((item) => item.category === activeCategory);

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-slate-50 dark:bg-slate-950 py-20 sm:py-28 transition-colors duration-200 border-t border-gray-200/80 dark:border-gray-800/80"
    >
      {/* Background Decorative Gradient Orbs */}
      <div className="pointer-events-none absolute -top-20 left-1/3 h-96 w-96 rounded-full bg-amber-500/5 dark:bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>
              {t("marketing.testimonials.badge", "Client Stories & Reviews")}
            </span>
          </div>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white sm:text-4xl lg:text-5xl leading-tight">
            {t(
              "marketing.testimonials.title",
              "What Leading Shippers Say About Diziel",
            )}
          </h2>

          <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
            {t(
              "marketing.testimonials.subtitle",
              "Trusted by major manufacturers, supply chain leaders, retailers, and fleet owners across Egypt.",
            )}
          </p>
        </div>

        {/* Verified Social Proof Metric Strip */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/90 p-5 sm:p-6 text-center shadow-sm hover:shadow-md transition">
            <div className="mx-auto mb-2.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
              <Star className="h-5 w-5 fill-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white">
              {t("marketing.testimonials.stats.rating", "4.9 / 5")}
            </div>
            <div className="mt-1 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
              {t(
                "marketing.testimonials.stats.ratingLabel",
                "Average Service Rating",
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/90 p-5 sm:p-6 text-center shadow-sm hover:shadow-md transition">
            <div className="mx-auto mb-2.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white">
              {t("marketing.testimonials.stats.verifiedClients", "+1,200")}
            </div>
            <div className="mt-1 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
              {t(
                "marketing.testimonials.stats.verifiedClientsLabel",
                "Enterprise Partners",
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/90 p-5 sm:p-6 text-center shadow-sm hover:shadow-md transition">
            <div className="mx-auto mb-2.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white">
              {t("marketing.testimonials.stats.satisfaction", "99.2%")}
            </div>
            <div className="mt-1 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
              {t(
                "marketing.testimonials.stats.satisfactionLabel",
                "Client Satisfaction Rate",
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/90 p-5 sm:p-6 text-center shadow-sm hover:shadow-md transition">
            <div className="mx-auto mb-2.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500">
              <Award className="h-5 w-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white">
              {t("marketing.testimonials.stats.onTime", "99.4%")}
            </div>
            <div className="mt-1 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
              {t(
                "marketing.testimonials.stats.onTimeLabel",
                "On-Time Delivery Rate",
              )}
            </div>
          </div>
        </div>

        {/* Filter Category Pills */}
        <div className="mt-10 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-105"
                  : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:border-amber-500/40 hover:text-amber-600 dark:hover:text-amber-400"
              }`}
            >
              {t(cat.labelKey)}
            </button>
          ))}
        </div>

        {/* Testimonials Grid Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between rounded-3xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900/90 p-7 sm:p-8 shadow-sm hover:shadow-xl hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Quote Accent Top */}
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>

                  <span className="rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    {t(item.tagKey)}
                  </span>
                </div>

                {/* Quote text */}
                <div className="relative mt-5">
                  <Quote className="h-8 w-8 text-amber-500/15 absolute -top-3 -left-2 rtl:-right-2 rtl:left-auto pointer-events-none" />
                  <p className="relative z-10 text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300 italic">
                    "{t(item.quoteKey)}"
                  </p>
                </div>
              </div>

              {/* Bottom Meta & Metric */}
              <div className="mt-7 pt-5 border-t border-gray-100 dark:border-gray-800/80">
                {/* Highlighted Result Badge */}
                <div className="mb-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 px-3 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>{t(item.metricKey)}</span>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 font-black text-sm text-slate-950 shadow-md">
                    {item.avatarInitials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm sm:text-base font-bold text-gray-950 dark:text-white truncate">
                      {t(item.authorKey)}
                    </h4>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">
                      {t(item.roleKey)}
                    </p>
                    <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 truncate mt-0.5">
                      {t(item.companyKey)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}