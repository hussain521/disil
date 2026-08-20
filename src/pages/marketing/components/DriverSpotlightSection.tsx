import { useTranslation } from "react-i18next";
import { Star, ShieldCheck, Zap, Truck } from "lucide-react";
import AnimatedPhoneMockup from "./AnimatedPhoneMockup";

export default function DriverSpotlightSection() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language?.startsWith("ar");

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
          {/* ================= DRIVER PROFILE DUAL PHONE 3D MOCKUP ================= */}
          <div className="relative mx-auto w-full max-w-[520px] flex items-center justify-center py-6 perspective-1500">
            {/* Left/Back Phone: Driver Stats & Trip History (Red/Orange Header Theme like Reference 1) */}
            <div
              className={`relative z-10 w-[210px] sm:w-[230px] h-[430px] sm:h-[470px] rounded-[38px] bg-slate-800 p-2 shadow-2xl border border-white/20 transform-gpu transition-all duration-500 hover:scale-105 ${
                isRtl
                  ? "rotate-y-[16deg] -rotate-x-[4deg] -rotate-[3deg]"
                  : "-rotate-y-[16deg] rotate-x-[4deg] -rotate-[3deg]"
              }`}
              style={{
                background: "linear-gradient(145deg, #2d3748 0%, #1a202c 100%)",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
              }}
            >
              <div className="relative h-full w-full overflow-hidden rounded-[30px] bg-slate-950 text-white flex flex-col justify-between border border-black shadow-inner">
                {/* Red/Orange Curved Header Banner */}
                <div className="relative h-28 bg-gradient-to-b from-amber-600 to-amber-700 p-2.5 text-center flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[8px] text-amber-200 font-bold">
                    <span>DZ-DRIVER</span>
                    <span>5G</span>
                  </div>
                  <span className="text-[10px] font-black text-white">
                    {isRtl ? "بطاقة أداء السائق" : "Driver Performance"}
                  </span>
                  <div className="h-2" />
                </div>

                {/* Overlapping Avatar Circle */}
                <div className="relative -mt-9 flex flex-col items-center z-10">
                  <div className="h-16 w-16 rounded-full border-4 border-slate-950 overflow-hidden bg-slate-800 shadow-lg">
                    <img
                      src="/man.png"
                      alt="Captain Ahmed"
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <span className="mt-1 text-xs font-extrabold text-white">
                    {isRtl ? "أحمد حسن" : "Ahmed Hassan"}
                  </span>
                  <span className="text-[8px] text-amber-400 font-medium">
                    {isRtl ? "سائق تريلا معتمد" : "Certified Trela Operator"}
                  </span>
                </div>

                {/* Performance Key Stats Matrix */}
                <div className="p-2.5 space-y-1.5 text-[8.5px]">
                  <div className="flex justify-between items-center bg-white/5 p-1.5 rounded-lg border border-white/5">
                    <span className="text-slate-400">{isRtl ? "الرحلات المكتملة:" : "Completed Trips:"}</span>
                    <span className="font-bold text-white">142</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-1.5 rounded-lg border border-white/5">
                    <span className="text-slate-400">{isRtl ? "نسبة الالتزام:" : "On-Time Rate:"}</span>
                    <span className="font-bold text-emerald-400">99.4%</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-1.5 rounded-lg border border-white/5">
                    <span className="text-slate-400">{isRtl ? "إجمالي الأرباح:" : "Total Payouts:"}</span>
                    <span className="font-bold text-amber-400">184,500 EGP</span>
                  </div>
                </div>

                {/* 5-Star Rating Footer */}
                <div className="pb-3 text-center">
                  <div className="flex justify-center gap-0.5 text-amber-400">
                    {"★★★★★".split("").map((s, i) => (
                      <span key={i} className="text-xs">{s}</span>
                    ))}
                  </div>
                  <span className="text-[7.5px] text-slate-400 font-mono">
                    4.98 · {isRtl ? "١٢٨ تقييم إيجابي" : "128 Reviews"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right/Front Phone: Live Active Trip & Navigation (Blue Header Theme like Reference 1) */}
            <div
              className={`relative z-20 w-[220px] sm:w-[245px] h-[450px] sm:h-[490px] -ml-12 rtl:-ml-0 rtl:-mr-12 rounded-[40px] bg-slate-800 p-2.5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.85)] border border-white/25 transform-gpu transition-all duration-500 hover:scale-105 ${
                isRtl
                  ? "-rotate-y-[10deg] rotate-x-[2deg]"
                  : "rotate-y-[10deg] -rotate-x-[2deg]"
              }`}
              style={{
                background: "linear-gradient(155deg, #374151 0%, #1e293b 100%)",
              }}
            >
              <div className="relative h-full w-full overflow-hidden rounded-[32px] bg-slate-950 text-white flex flex-col justify-between border border-black shadow-inner">
                {/* Blue Top Header Banner */}
                <div className="relative h-28 bg-gradient-to-b from-blue-600 to-indigo-700 p-2.5 text-center flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[8px] text-blue-200 font-bold">
                    <span>DIZIEL LIVE</span>
                    <span className="text-emerald-300">● GPS</span>
                  </div>
                  <span className="text-[10px] font-black text-white">
                    {isRtl ? "الرحلة الحالية المباشرة" : "Live Active Freight"}
                  </span>
                  <div className="h-2" />
                </div>

                {/* Overlapping Truck Badge Circle */}
                <div className="relative -mt-9 flex flex-col items-center z-10">
                  <div className="h-16 w-16 rounded-full border-4 border-slate-950 overflow-hidden bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 shadow-xl">
                    <Truck className="h-8 w-8" />
                  </div>
                  <span className="mt-1 text-xs font-black text-white">
                    #DZ-8942
                  </span>
                  <span className="text-[8px] text-emerald-400 font-bold">
                    {isRtl ? "جاري التوصيل للعميل" : "En Route to Destination"}
                  </span>
                </div>

                {/* Live Route Progress Card */}
                <div className="p-2.5 space-y-2 text-[8.5px]">
                  <div className="rounded-xl bg-white/5 border border-white/10 p-2 space-y-1">
                    <div className="flex justify-between text-[8px]">
                      <span className="text-slate-400">{isRtl ? "نقطة الشحن:" : "Pickup:"}</span>
                      <span className="font-bold text-white">{isRtl ? "ميناء السخنة" : "Sokhna Port"}</span>
                    </div>
                    <div className="flex justify-between text-[8px]">
                      <span className="text-slate-400">{isRtl ? "الوجهة:" : "Dropoff:"}</span>
                      <span className="font-bold text-white">{isRtl ? "٦ أكتوبر" : "6th October"}</span>
                    </div>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-gradient-to-r from-blue-400 to-emerald-400 w-[72%]" />
                    </div>
                  </div>

                  <div className="rounded-xl bg-amber-500/20 border border-amber-500/40 p-1.5 flex justify-between items-center text-[9px]">
                    <span className="text-amber-300 font-bold">{isRtl ? "قيمة الرحلة المعتمدة:" : "Guaranteed Tariff:"}</span>
                    <span className="font-black text-amber-400">8,450 EGP</span>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-2.5 pt-0">
                  <div className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2 text-center text-[9.5px] font-black text-white shadow-md">
                    {isRtl ? "تأكيد الوصول ورفع البوليصة" : "Confirm POD & Settle"}
                  </div>
                </div>
              </div>
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