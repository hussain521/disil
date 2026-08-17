import { useTranslation } from "react-i18next";
import { Check, ShieldCheck, Sparkles, Radio } from "lucide-react";

export default function BusinessSolutionsSection() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language?.startsWith("ar");

  return (
    <section
      id="business-solutions"
      className="bg-[#f7f9fc] dark:bg-gray-900/40 py-16 sm:py-20 lg:py-24"
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
          px-8
          py-14
          sm:px-12
          sm:py-16
          lg:px-20
          lg:py-20
          xl:px-24
        "
            >
              {/* Label */}
              <span className="text-sm font-medium uppercase tracking-[0.16em] text-[#946000] dark:text-amber-400">
                {t("marketing.business.label", "Business Solutions")}
              </span>

              {/* Heading */}
              <h2
                className="
            mt-8
            max-w-xl
            text-4xl
            font-medium
            leading-[1.08]
            tracking-[-0.035em]
            text-[#102746]
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
            text-[#554b40]
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
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-[#9a6500] dark:border-amber-400">
                    <Check
                      className="h-3.5 w-3.5 text-[#9a6500] dark:text-amber-400"
                      strokeWidth={3}
                    />
                  </div>

                  <span className="text-[15px] font-medium text-[#27231f] dark:text-gray-200 sm:text-base">
                    {t(
                      "marketing.business.features.credit",
                      "Flexible credit terms & invoicing",
                    )}
                  </span>
                </div>

                {/* Feature 2 */}
                <div className="flex items-center gap-4">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-[#9a6500] dark:border-amber-400">
                    <Check
                      className="h-3.5 w-3.5 text-[#9a6500] dark:text-amber-400"
                      strokeWidth={3}
                    />
                  </div>

                  <span className="text-[15px] font-medium text-[#27231f] dark:text-gray-200 sm:text-base">
                    {t(
                      "marketing.business.features.dashboard",
                      "Multi-user dashboard access",
                    )}
                  </span>
                </div>

                {/* Feature 3 */}
                <div className="flex items-center gap-4">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-[#9a6500] dark:border-amber-400">
                    <Check
                      className="h-3.5 w-3.5 text-[#9a6500] dark:text-amber-400"
                      strokeWidth={3}
                    />
                  </div>

                  <span className="text-[15px] font-medium text-[#27231f] dark:text-gray-200 sm:text-base">
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
            <div className="relative flex min-h-[560px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#102746] via-[#0d1e35] to-[#071322] p-6 sm:p-10 lg:min-h-[720px]">
              {/* Background Ambient Aura */}
              <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-amber-500/15 blur-[90px]" />
              <div className="pointer-events-none absolute -bottom-24 left-0 h-80 w-80 rounded-full bg-blue-600/20 blur-[100px]" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />

              {/* Floating Enterprise Pill - Top Corner */}
              <div className="absolute top-6 left-6 z-20 hidden sm:flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-md shadow-lg shadow-black/20 animate-fadeIn">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <span>
                  {t(
                    "marketing.business.mockup.electronicInvoice",
                    "Certified E-Invoice",
                  )}
                </span>
              </div>

              {/* Floating Dispatch Pill - Bottom Corner */}
              <div className="absolute bottom-6 right-6 z-20 hidden sm:flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-md shadow-lg shadow-black/20 animate-fadeIn">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span>
                  {t(
                    "marketing.business.mockup.scaleMatched",
                    "Scale Tickets Verified",
                  )}
                </span>
              </div>

              {/* Smartphone Realistic Hardware Mockup Frame */}
              <div className="relative z-10 h-[560px] w-[275px] max-w-[85vw] sm:h-[600px] sm:w-[295px] rounded-[48px] bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950 p-[9px] shadow-[0_25px_60px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.4)] border border-slate-700/80 ring-1 ring-black">
                {/* Physical Side Buttons */}
                <div className="absolute -left-[12px] top-20 h-10 w-[3px] rounded-l-sm bg-slate-600" />
                <div className="absolute -left-[12px] top-34 h-10 w-[3px] rounded-l-sm bg-slate-600" />
                <div className="absolute -right-[12px] top-24 h-14 w-[3px] rounded-r-sm bg-slate-600" />

                {/* Inner Phone Screen */}
                <div className="relative h-full w-full overflow-hidden rounded-[40px] bg-slate-950 text-white border border-black select-none flex flex-col justify-between">
                  {/* Dynamic Island */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 flex items-center justify-between px-3 h-5 w-24 bg-black rounded-full shadow-md">
                    <div className="h-2 w-2 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
                      <div className="h-0.5 w-0.5 rounded-full bg-blue-400" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[7px] font-mono text-emerald-400 font-bold">
                        LIVE
                      </span>
                    </div>
                  </div>

                  {/* Status Bar */}
                  <div className="relative z-30 flex items-center justify-between px-5 pt-2.5 text-[9px] font-semibold text-slate-300">
                    <span>09:41</span>
                    <div className="flex items-center gap-1 text-slate-300">
                      <Radio className="h-2.5 w-2.5" />
                      <span className="text-[8px] font-mono">5G</span>
                      <div className="h-2 w-3 rounded-2xs border border-current p-[1px]">
                        <div className="h-full w-full bg-current rounded-2xs" />
                      </div>
                    </div>
                  </div>

                  {/* In-App Enterprise Dashboard Screen */}
                  <div className="relative flex-1 overflow-hidden p-3 space-y-2.5 flex flex-col">
                    {/* App Header */}
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                      <div className="flex items-center gap-1.5">
                        <div className="h-6 w-6 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black text-xs">
                          D
                        </div>
                        <div>
                          <span className="text-[11px] font-bold block leading-none">
                            {t("common.brandName", "Diziel")}
                          </span>
                          <span className="text-[7px] text-slate-400 uppercase tracking-widest">
                            {t(
                              "marketing.business.mockup.enterpriseHub",
                              "Enterprise Portal",
                            )}
                          </span>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 text-[8px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        {t(
                          "marketing.business.mockup.liveActive",
                          "Live Active",
                        )}
                      </span>
                    </div>

                    {/* Enterprise Credit Line Card */}
                    <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-2.5 space-y-1.5 shadow-inner">
                      <div className="flex justify-between items-center text-[9px]">
                        <span className="text-slate-400 font-medium">
                          {t(
                            "marketing.business.mockup.totalCredit",
                            "Monthly Credit Line",
                          )}
                        </span>
                        <span className="font-extrabold text-amber-400">
                          500,000 EGP
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full w-[64%]" />
                      </div>
                      <div className="flex justify-between text-[8px] text-slate-400 font-mono">
                        <span>
                          {t(
                            "marketing.business.mockup.utilized",
                            "Utilized",
                          )}
                          : 320,000 EGP (64%)
                        </span>
                        <span className="text-emerald-400 font-bold">
                          180,000 EGP Rem.
                        </span>
                      </div>
                    </div>

                    {/* Active Fleet Dispatches Status */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                          {t(
                            "marketing.business.mockup.activeDispatches",
                            "Active Corporate Dispatches",
                          )}
                        </span>
                        <span className="text-[8px] text-amber-400 font-bold">
                          12 {isRtl ? "شاحنة نشطة" : "Trucks Active"}
                        </span>
                      </div>

                      {/* Dispatch Card 1 */}
                      <div className="rounded-xl bg-white/5 border border-white/10 p-2 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] font-mono text-slate-400">
                            #CORP-8492
                          </span>
                          <span className="text-[8px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                            {t(
                              "marketing.business.mockup.inTransit",
                              "In Transit",
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-white truncate max-w-[130px]">
                            {isRtl
                              ? "ميناء الإسكندرية ← ٦ أكتوبر"
                              : "Alex Port → 6th October"}
                          </span>
                          <span className="font-mono text-amber-400 font-bold">
                            8 {isRtl ? "تريلات" : "Trelas"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[8px] text-slate-400 pt-0.5 border-t border-white/5">
                          <span>
                            {isRtl
                              ? "الوصول المتوقع: ساعتان"
                              : "ETA: 2h 15m"}
                          </span>
                          <span className="text-emerald-400 font-bold">
                            ✓ 340 {t("common.ton", "ton")}
                          </span>
                        </div>
                      </div>

                      {/* Dispatch Card 2 */}
                      <div className="rounded-xl bg-white/5 border border-white/10 p-2 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] font-mono text-slate-400">
                            #CORP-8490
                          </span>
                          <span className="text-[8px] font-bold text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded">
                            {t(
                              "marketing.business.mockup.delivered",
                              "Delivered",
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-white truncate max-w-[130px]">
                            {isRtl
                              ? "السويس ← العاشر من رمضان"
                              : "Suez → 10th Ramadan"}
                          </span>
                          <span className="font-mono text-slate-300 font-bold">
                            4 {isRtl ? "جامبو" : "Jumbos"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[8px] text-slate-400 pt-0.5 border-t border-white/5">
                          <span className="text-emerald-400">
                            ✓ {isRtl ? "تمت المصادقة" : "Scale Matched"}
                          </span>
                          <span className="font-bold text-white">
                            48,200 EGP
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Action Button in App Screen */}
                    <div className="pt-1">
                      <div className="w-full rounded-xl bg-amber-500 py-2 text-center text-[10px] font-black text-slate-950 shadow-md">
                        {t(
                          "marketing.business.mockup.fastDispatch",
                          "Instant Multi-Truck Dispatch (40+)",
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Phone Home Bar */}
                  <div className="relative z-30 pb-1.5 flex justify-center">
                    <div className="h-1 w-20 bg-white/30 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}