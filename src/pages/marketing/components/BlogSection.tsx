import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Tag,
} from "lucide-react";

interface BlogArticle {
  id: string;
  categorySlug: "tech" | "supplyChain" | "regulations";
  titleKey: string;
  excerptKey: string;
  categoryKey: string;
  dateKey: string;
  readTimeKey: string;
  imageUrl: string;
  featuredBadge?: string;
  readCount: string;
}

export default function BlogSection() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language?.startsWith("ar");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const articles: BlogArticle[] = [
    {
      id: "a1",
      categorySlug: "tech",
      titleKey: "marketing.blog.articles.a1.title",
      excerptKey: "marketing.blog.articles.a1.excerpt",
      categoryKey: "marketing.blog.articles.a1.category",
      dateKey: "marketing.blog.articles.a1.date",
      readTimeKey: "marketing.blog.articles.a1.readTime",
      imageUrl: "/business-solutions.png",
      featuredBadge: t("marketing.blog.featured", "Featured"),
      readCount: "2.4k",
    },
    {
      id: "a2",
      categorySlug: "supplyChain",
      titleKey: "marketing.blog.articles.a2.title",
      excerptKey: "marketing.blog.articles.a2.excerpt",
      categoryKey: "marketing.blog.articles.a2.category",
      dateKey: "marketing.blog.articles.a2.date",
      readTimeKey: "marketing.blog.articles.a2.readTime",
      imageUrl: "/map2.png",
      readCount: "1.8k",
    },
    {
      id: "a3",
      categorySlug: "regulations",
      titleKey: "marketing.blog.articles.a3.title",
      excerptKey: "marketing.blog.articles.a3.excerpt",
      categoryKey: "marketing.blog.articles.a3.category",
      dateKey: "marketing.blog.articles.a3.date",
      readTimeKey: "marketing.blog.articles.a3.readTime",
      imageUrl: "/map.png",
      readCount: "3.1k",
    },
  ];

  const categories = [
    { id: "all", labelKey: "marketing.blog.categories.all" },
    { id: "tech", labelKey: "marketing.blog.categories.tech" },
    { id: "supplyChain", labelKey: "marketing.blog.categories.supplyChain" },
    { id: "regulations", labelKey: "marketing.blog.categories.regulations" },
  ];

  const filteredArticles =
    selectedCategory === "all"
      ? articles
      : articles.filter((a) => a.categorySlug === selectedCategory);

  return (
    <section
      id="blog"
      className="relative overflow-hidden bg-white dark:bg-gray-950 py-20 sm:py-28 transition-colors duration-200 border-t border-gray-200/80 dark:border-gray-800/80"
    >
      {/* Background Decorative Gradient Orbs */}
      <div className="pointer-events-none absolute top-1/4 right-10 h-80 w-80 rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-10 h-80 w-80 rounded-full bg-amber-500/5 dark:bg-amber-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <BookOpen className="h-3.5 w-3.5" />
            <span>
              {t("marketing.blog.badge", "Logistics Knowledge Hub")}
            </span>
          </div>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white sm:text-4xl lg:text-5xl leading-tight">
            {t(
              "marketing.blog.title",
              "Latest Insights, Industry Trends & Logistics Intelligence",
            )}
          </h2>

          <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
            {t(
              "marketing.blog.subtitle",
              "Discover forward-thinking strategies, technological advancements, and operational best practices transforming road freight in Egypt and the MENA region.",
            )}
          </p>
        </div>

        {/* Categories Bar */}
        <div className="mt-10 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[#102746] dark:bg-amber-500 text-white dark:text-slate-950 shadow-md scale-105"
                  : "bg-slate-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:border-blue-500/40 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              {t(cat.labelKey)}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => {
            const mins = t(article.readTimeKey, "5");
            return (
              <article
                key={article.id}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Article Image Container */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-800">
                  <img
                    src={article.imageUrl}
                    alt={t(article.titleKey)}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Category & Badge Top */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-gray-900 dark:text-white shadow-sm">
                      {t(article.categoryKey)}
                    </span>

                    {article.featuredBadge && (
                      <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-black text-slate-950 shadow-md">
                        {article.featuredBadge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Article Body */}
                <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                  <div>
                    {/* Meta info: Date & Read Time */}
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{t(article.dateKey)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>
                          {t("marketing.blog.readTime", { mins })}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="mt-3.5 text-lg sm:text-xl font-bold text-gray-950 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-amber-400 transition-colors">
                      {t(article.titleKey)}
                    </h3>

                    {/* Excerpt */}
                    <p className="mt-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                      {t(article.excerptKey)}
                    </p>
                  </div>

                  {/* Read More Footer */}
                  <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs sm:text-sm font-bold text-blue-600 dark:text-amber-400">
                    <span className="inline-flex items-center gap-1.5 group-hover:underline">
                      <span>
                        {t("marketing.blog.readMore", "Read Full Article")}
                      </span>
                      <ArrowRight
                        className={`h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 ${
                          isRtl ? "rotate-180" : ""
                        }`}
                      />
                    </span>

                    <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">
                      {article.readCount} {isRtl ? "مشاهدة" : "reads"}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Knowledge Hub Newsletter & Resource Banner */}
        <div className="mt-14 overflow-hidden rounded-3xl bg-gradient-to-br from-[#102746] to-[#0c1c31] p-8 sm:p-12 text-white shadow-xl">
          <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3.5 py-1 text-xs font-bold text-amber-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>
                  {isRtl
                    ? "نشرة ديزل اللوجستية الشهرية"
                    : "Diziel Monthly Logistics Brief"}
                </span>
              </div>

              <h3 className="mt-4 text-2xl sm:text-3xl font-extrabold text-white">
                {isRtl
                  ? "ابقَ على اطلاع بأحدث تقارير وتغيرات سوق الشحن في مصر"
                  : "Stay Ahead with Exclusive Egypt Freight & Logistics Intelligence"}
              </h3>

              <p className="mt-3 text-sm text-slate-300 max-w-xl leading-relaxed">
                {isRtl
                  ? "اشترك ليصلك تقرير شهري عن مؤشرات أسعار النقل البري، وتحليلات مسارات البضائع، وأحدث اللوائح التنظيمية."
                  : "Subscribe for monthly insights on road freight tariffs, corridor volume analytics, and regulatory logistics updates."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="email"
                placeholder={
                  isRtl
                    ? "أدخل بريدك الإلكتروني المهني..."
                    : "Enter your corporate email..."
                }
                className="flex-1 rounded-full border border-white/20 bg-white/10 px-5 py-3.5 text-sm text-white placeholder-slate-400 backdrop-blur-sm focus:border-amber-400 focus:outline-none"
              />
              <button
                type="button"
                className="rounded-full bg-amber-500 px-7 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-amber-400 shadow-md whitespace-nowrap cursor-pointer"
              >
                {isRtl ? "اشتراك مجاني" : "Subscribe"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}