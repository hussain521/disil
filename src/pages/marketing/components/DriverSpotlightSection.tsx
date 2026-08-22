import { useTranslation } from "react-i18next";
import { Truck } from "lucide-react";

export default function DriverSpotlightSection() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language?.startsWith("ar");

  return (
    <section id="driver-spotlight" className="w-full overflow-hidden">
      <div
        className="
          relative
          overflow-hidden
          rounded-t-[32px]
          sm:rounded-t-[60px]
          lg:rounded-t-[80px]
          bg-[#10294b]
          px-4
          py-10
          xs:px-6
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
            gap-8
            sm:gap-12
            lg:grid-cols-[0.9fr_1.1fr]
            lg:gap-16
          "
        >
          {/* ================= DRIVER PROFILE DUAL PHONE 3D MOCKUP ================= */}
          <div className="relative mx-auto w-full max-w-[340px] xs:max-w-[400px] sm:max-w-[520px] flex items-center justify-center py-4 sm:py-6 perspective-1500 overflow-visible">
            {/* Left/Back Phone: Driver Stats & Trip History */}
            <div
              className={`relative z-10 w-[155px] xs:w-[185px] sm:w-[230px] h-[340px] xs:h-[395px] sm:h-[470px] rounded-[26px] xs:rounded-[32px] sm:rounded-[38px] bg-slate-800 p-1.5 xs:p-2 shadow-2xl border border-white/20 transform-gpu transition-all duration-500 hover:scale-105 shrink-0 ${
                isRtl
                  ? "rotate-y-[12deg] sm:rotate-y-[16deg] -rotate-x-[3deg] sm:-rotate-x-[4deg] -rotate-[2deg] sm:-rotate-[3deg]"
                  : "-rotate-y-[12deg] sm:-rotate-y-[16deg] rotate-x-[3deg] sm:rotate-x-[4deg] -rotate-[2deg] sm:-rotate-[3deg]"
              }`}
              style={{
                background: "linear-gradient(145deg, #2d3748 0%, #1a202c 100%)",
                boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.7)",
              }}
            >
              <div className="relative h-full w-full overflow-hidden rounded-[20px] xs:rounded-[24px] sm:rounded-[30px] bg-slate-950 text-white flex flex-col justify-between border border-black shadow-inner">
                {/* Red/Orange Curved Header Banner */}
                <div className="relative h-20 xs:h-24 sm:h-28 bg-gradient-to-b from-amber-600 to-amber-700 p-2 xs:p-2.5 text-center flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[7px] xs:text-[7.5px] sm:text-[8px] text-amber-200 font-bold">
                    <span>DZ-DRIVER</span>
                    <span>5G</span>
                  </div>
                  <span className="text-[8.5px] xs:text-[9px] sm:text-[10px] font-black text-white">
                    {isRtl ? "بطاقة أداء السائق" : "Driver Performance"}
                  </span>
                  <div className="h-1 sm:h-2" />
                </div>

                {/* Overlapping Avatar Circle */}
                <div className="relative -mt-7 xs:-mt-8 sm:-mt-9 flex flex-col items-center z-10">
                  <div className="h-11 w-11 xs:h-13 xs:w-13 sm:h-16 sm:w-16 rounded-full border-2 sm:border-4 border-slate-950 overflow-hidden bg-slate-800 shadow-lg">
                    <img
                      src="/man.png"
                      alt="Captain Ahmed"
                      width={64}
                      height={64}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <span className="mt-1 text-[9.5px] xs:text-[10.5px] sm:text-xs font-extrabold text-white">
                    {isRtl ? "أحمد حسن" : "Ahmed Hassan"}
                  </span>
                  <span className="text-[6.5px] xs:text-[7px] sm:text-[8px] text-amber-400 font-medium">
                    {isRtl ? "سائق تريلا معتمد" : "Certified Trela Operator"}
                  </span>
                </div>

                {/* Performance Key Stats Matrix */}
                <div className="p-1.5 xs:p-2 sm:p-2.5 space-y-1 sm:space-y-1.5 text-[6.5px] xs:text-[7.5px] sm:text-[8.5px]">
                  <div className="flex justify-between items-center bg-white/5 p-1 xs:p-1.5 rounded-md sm:rounded-lg border border-white/5">
                    <span className="text-slate-400">{isRtl ? "الرحلات:" : "Trips:"}</span>
                    <span className="font-bold text-white">142</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-1 xs:p-1.5 rounded-md sm:rounded-lg border border-white/5">
                    <span className="text-slate-400">{isRtl ? "الالتزام:" : "On-Time:"}</span>
                    <span className="font-bold text-emerald-400">99.4%</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-1 xs:p-1.5 rounded-md sm:rounded-lg border border-white/5">
                    <span className="text-slate-400">{isRtl ? "الأرباح:" : "Payouts:"}</span>
                    <span className="font-bold text-amber-400">184.5k EGP</span>
                  </div>
                </div>

                {/* 5-Star Rating Footer */}
                <div className="pb-1.5 xs:pb-2 sm:pb-3 text-center">
                  <div className="flex justify-center gap-0.5 text-amber-400">
                    {"★★★★★".split("").map((s, i) => (
                      <span key={i} className="text-[9px] xs:text-[10px] sm:text-xs">{s}</span>
                    ))}
                  </div>
                  <span className="text-[6px] xs:text-[6.5px] sm:text-[7.5px] text-slate-400 font-mono">
                    4.98 · {isRtl ? "١٢٨ تقييم" : "128 Reviews"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right/Front Phone: Live Active Trip & Navigation */}
            <div
              className={`relative z-20 w-[165px] xs:w-[195px] sm:w-[245px] h-[355px] xs:h-[415px] sm:h-[490px] -ml-8 xs:-ml-10 sm:-ml-12 rtl:ml-0 rtl:-mr-8 rtl:xs:-mr-10 rtl:sm:-mr-12 rounded-[26px] xs:rounded-[32px] sm:rounded-[40px] bg-slate-800 p-1.5 xs:p-2 sm:p-2.5 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.85)] border border-white/25 transform-gpu transition-all duration-500 hover:scale-105 shrink-0 ${
                isRtl
                  ? "-rotate-y-[8deg] sm:-rotate-y-[10deg] rotate-x-[2deg]"
                  : "rotate-y-[8deg] sm:rotate-y-[10deg] -rotate-x-[2deg]"
              }`}
              style={{
                background: "linear-gradient(155deg, #374151 0%, #1e293b 100%)",
              }}
            >
              <div className="relative h-full w-full overflow-hidden rounded-[20px] xs:rounded-[24px] sm:rounded-[32px] bg-slate-950 text-white flex flex-col justify-between border border-black shadow-inner">
                {/* Blue Top Header Banner */}
                <div className="relative h-20 xs:h-24 sm:h-28 bg-gradient-to-b from-blue-600 to-indigo-700 p-2 xs:p-2.5 text-center flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[7px] xs:text-[7.5px] sm:text-[8px] text-blue-200 font-bold">
                    <span>DIZIEL LIVE</span>
                    <span className="text-emerald-300">● GPS</span>
                  </div>
                  <span className="text-[8.5px] xs:text-[9px] sm:text-[10px] font-black text-white">
                    {isRtl ? "الرحلة المباشرة" : "Live Active Freight"}
                  </span>
                  <div className="h-1 sm:h-2" />
                </div>

                {/* Overlapping Truck Badge Circle */}
                <div className="relative -mt-7 xs:-mt-8 sm:-mt-9 flex flex-col items-center z-10">
                  <div className="h-11 w-11 xs:h-13 xs:w-13 sm:h-16 sm:w-16 rounded-full border-2 sm:border-4 border-slate-950 overflow-hidden bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 shadow-xl">
                    <Truck className="h-5 w-5 xs:h-6 xs:w-6 sm:h-8 sm:w-8" />
                  </div>
                  <span className="mt-1 text-[9.5px] xs:text-[10.5px] sm:text-xs font-black text-white">
                    #DZ-8942
                  </span>
                  <span className="text-[6.5px] xs:text-[7px] sm:text-[8px] text-emerald-400 font-bold">
                    {isRtl ? "جاري التوصيل" : "En Route to Dest."}
                  </span>
                </div>

                {/* Live Route Progress Card */}
                <div className="p-1.5 xs:p-2 sm:p-2.5 space-y-1 xs:space-y-1.5 sm:space-y-2 text-[7px] xs:text-[8px] sm:text-[8.5px]">
                  <div className="rounded-lg sm:rounded-xl bg-white/5 border border-white/10 p-1.5 xs:p-2 space-y-1">
                    <div className="flex justify-between text-[6.5px] xs:text-[7.5px] sm:text-[8px]">
                      <span className="text-slate-400">{isRtl ? "الشحن:" : "Pickup:"}</span>
                      <span className="font-bold text-white">{isRtl ? "ميناء السخنة" : "Sokhna Port"}</span>
                    </div>
                    <div className="flex justify-between text-[6.5px] xs:text-[7.5px] sm:text-[8px]">
                      <span className="text-slate-400">{isRtl ? "الوجهة:" : "Dropoff:"}</span>
                      <span className="font-bold text-white">{isRtl ? "٦ أكتوبر" : "6th October"}</span>
                    </div>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-gradient-to-r from-blue-400 to-emerald-400 w-[72%]" />
                    </div>
                  </div>

                  <div className="rounded-lg sm:rounded-xl bg-amber-500/20 border border-amber-500/40 p-1 xs:p-1.5 flex justify-between items-center text-[7px] xs:text-[8px] sm:text-[9px]">
                    <span className="text-amber-300 font-bold">{isRtl ? "القيمة:" : "Tariff:"}</span>
                    <span className="font-black text-amber-400">8,450 EGP</span>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-1.5 xs:p-2 sm:p-2.5 pt-0">
                  <div className="w-full rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-1 xs:py-1.5 sm:py-2 text-center text-[7.5px] xs:text-[8.5px] sm:text-[9.5px] font-black text-white shadow-md">
                    {isRtl ? "تأكيد الوصول ورفع البوليصة" : "Confirm POD & Settle"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= CONTENT ================= */}
          <div className="text-white text-center lg:text-start">
            {/* Label */}
            <span
              className="
                inline-block
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
                mt-4
                sm:mt-7
                max-w-2xl
                mx-auto
                lg:mx-0
                text-2xl
                xs:text-3xl
                font-medium
                leading-[1.2]
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
                mt-4
                sm:mt-7
                max-w-2xl
                mx-auto
                lg:mx-0
                text-sm
                leading-6
                text-white/85
                sm:text-lg
                sm:leading-8
              "
            >
              {t(
                "marketing.driverSpotlight.quote",
                "\"Before joining the network, finding consistent loads was a daily struggle. Now, my truck is always moving, and payments are settled instantly. It's the best decision I've made for my logistics career.\""
              )}
            </p>

            {/* ================= DRIVER INFO ================= */}
            <div className="mt-6 sm:mt-9">
              <h3 className="text-base font-bold text-white sm:text-xl">
                {t("marketing.driverSpotlight.name", "Ahmed Hassan")}
              </h3>

              <p className="mt-1 text-xs sm:text-sm text-white/60">
                {t(
                  "marketing.driverSpotlight.role",
                  "Jumbo Truck Owner-Operator, Cairo"
                )}
              </p>
            </div>

            {/* ================= CTA ================= */}
            <div className="mt-8 sm:mt-10">
              <a
                href="#join-fleet"
                className="
                  inline-flex
                  w-full
                  xs:w-auto
                  items-center
                  justify-center
                  rounded-full
                  bg-[#ffad22]
                  px-8
                  py-3
                  sm:py-3.5
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
