import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Truck, Calculator, LocateFixed, CheckCircle2 } from "lucide-react";
import AnimatedPhoneMockup, { MockupScreenType } from "./AnimatedPhoneMockup";

export default function ProcessSection() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language?.startsWith("ar");
  const [activeStep, setActiveStep] = useState<MockupScreenType>("select-truck");

  const steps = [
    {
      id: "select-truck" as MockupScreenType,
      num: 1,
      icon: Truck,
      title: t("marketing.process.step1.title", "Select Type"),
      desc: t(
        "marketing.process.step1.description",
        "Choose from our diverse fleet of Jumbos, Tippers, Flatbeds, or Refrigerated trucks based on your cargo."
      ),
      badgeLabel: t("marketing.process.step1.footerLabel", "Popular:"),
      badgeValue: t("marketing.process.step1.footerValue", "Jumbo Winch"),
      badgeClass: "bg-[#efe2d5] dark:bg-amber-500/20 text-[#102746] dark:text-amber-300",
      accentBg: "bg-[#fff0d9] dark:bg-amber-500/15 text-[#f5a623] dark:text-amber-400",
    },
    {
      id: "instant-quote" as MockupScreenType,
      num: 2,
      icon: Calculator,
      title: t("marketing.process.step2.title", "Get Instant Quote"),
      desc: t(
        "marketing.process.step2.description",
        "Enter your pickup and drop-off locations to receive a transparent, upfront price with zero hidden fees."
      ),
      badgeLabel: t("marketing.process.step2.footerLabel", "Est. Time:"),
      badgeValue: t("marketing.process.step2.footerValue", "Under 30s"),
      badgeClass: "bg-blue-100 dark:bg-blue-500/20 text-[#102746] dark:text-blue-300",
      accentBg: "bg-[#edf0f5] dark:bg-blue-500/15 text-[#536987] dark:text-blue-400",
    },
    {
      id: "live-map" as MockupScreenType,
      num: 3,
      icon: LocateFixed,
      title: t("marketing.process.step3.title", "Track & Settle"),
      desc: t(
        "marketing.process.step3.description",
        "Monitor your cargo in real-time. Automated settlements ensure secure and prompt payments upon delivery."
      ),
      badgeLabel: t("marketing.process.step3.footerLabel", "Tracking:"),
      badgeValue: t("marketing.process.step3.footerValue", "Live"),
      badgeClass: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
      accentBg: "bg-[#ddfae9] dark:bg-emerald-500/15 text-[#102746] dark:text-emerald-400",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="bg-[#f7f9fc] dark:bg-gray-900/50 py-10 sm:py-14 lg:py-16 transition-colors duration-200 overflow-hidden transform-gpu"
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
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto">
            {isRtl
              ? "تجربة تطبيق ديزيل مصممة لتكون سلسة وسريعة بدون أي تعقيد. اختر الخطوة لمعاينة الشاشة مباشرة في الموكاب."
              : "The Diziel app experience is crafted for seamless operation. Click each step to preview the real mobile UI."}
          </p>
        </div>

        {/* ================= DYNAMIC WORKFLOW CONTAINER ================= */}
        <div className="mt-16 grid items-center gap-12 lg:grid-cols-12">
          {/* Left Step Cards (7 cols) */}
          <div className="space-y-5 lg:col-span-7">
            {steps.map((step) => {
              const Icon = step.icon;
              const isSelected = activeStep === step.id;
              return (
                <div
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`group relative overflow-hidden rounded-[28px] p-6 sm:p-8 cursor-pointer transition-all duration-300 border ${
                    isSelected
                      ? "bg-white dark:bg-gray-900 border-amber-500/60 shadow-[0_15px_35px_rgba(245,166,35,0.15)] ring-2 ring-amber-500/20 scale-[1.01]"
                      : "bg-white/70 dark:bg-gray-900/60 border-transparent dark:border-gray-800/80 hover:bg-white dark:hover:bg-gray-900 hover:shadow-lg"
                  }`}
                >
                  <div className="flex items-start gap-5">
                    {/* Step Icon */}
                    <div
                      className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl transition-transform group-hover:scale-105 ${step.accentBg}`}
                    >
                      <Icon className="h-8 w-8" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                            {isRtl ? `خطوة ${step.num}` : `Step ${step.num}`}
                          </span>
                          {isSelected && (
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="h-3 w-3" />
                              {isRtl ? "معاينة نشطة" : "Active Preview"}
                            </span>
                          )}
                        </div>
                        <span className="text-3xl font-extrabold text-slate-200 dark:text-slate-800">
                          0{step.num}
                        </span>
                      </div>

                      <h3 className="mt-1 text-xl font-bold text-[#102746] dark:text-white">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {step.desc}
                      </p>

                      <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                        <span className="text-slate-500 dark:text-slate-400">
                          {step.badgeLabel}
                        </span>
                        <span className={`px-2.5 py-1 rounded-md font-medium text-xs ${step.badgeClass}`}>
                          {step.badgeValue}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Phone Mockup in Synchronized Pose */}
          <div className="flex flex-col items-center justify-center lg:col-span-5">
            <div className="relative">
              <AnimatedPhoneMockup
                screen={activeStep}
                pose="floating-tilt-reverse"
                size="md"
                interactive={false}
                floatingBadges={true}
                badgeTopSub={isRtl ? "الخطوة النشطة" : "Active Stage"}
                badgeTopText={
                  activeStep === "select-truck"
                    ? isRtl ? "١. نوع الشاحنة" : "1. Select Truck"
                    : activeStep === "instant-quote"
                    ? isRtl ? "٢. التسعير الفوري" : "2. Instant Tariff"
                    : isRtl ? "٣. التتبع والتسوية" : "3. Live Tracking"
                }
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}