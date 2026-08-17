import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Search,
  Truck,
  MapPin,
  Clock,
  ShieldCheck,
  Phone,
  ArrowRight,
  ArrowLeft,
  Navigation,
  FileText,
  Weight,
  UserCheck,
  CheckCircle,
  AlertCircle,
  Share2,
  Copy,
  ExternalLink,
} from "lucide-react";
import MarketingNav from "./components/MarketingNav";
import MarketingFooter from "./components/MarketingFooter";

interface TrackingResult {
  code: string;
  status: "in_transit" | "picked_up" | "assigned" | "delivered" | "created";
  statusTextKey: string;
  defaultStatusText: string;
  lastUpdate: string;
  eta: string;
  distanceKm: number;
  origin: {
    title: string;
    city: string;
    address: string;
    time: string;
  };
  destination: {
    title: string;
    city: string;
    address: string;
    time: string;
  };
  driver: {
    name: string;
    phone: string;
    rating: string;
    truckType: string;
    plateNumber: string;
    photo: string;
  };
  cargo: {
    category: string;
    weightTons: number;
    waybillNo: string;
    weighbridgeVerified: boolean;
    sealNumber: string;
  };
  currentLocation: {
    label: string;
    speed: string;
    highway: string;
  };
}

const DEMO_SHIPMENTS: Record<string, TrackingResult> = {
  "DZ-84920": {
    code: "DZ-84920",
    status: "in_transit",
    statusTextKey: "status.in_transit",
    defaultStatusText: "In Transit (Live GPS)",
    lastUpdate: "منذ دقيقتين · 2 mins ago",
    eta: "١ ساعة و ٤٥ دقيقة (1h 45m)",
    distanceKm: 184,
    origin: {
      title: "ميناء العين السخنة - رصيف الحاويات",
      city: "السويس (Suez)",
      address: "بوابة الميناء رقم ٤ - المنطقة اللوجستية",
      time: "اليوم ٠٨:٣٠ ص",
    },
    destination: {
      title: "مستودعات المنطقة الصناعية المركزية",
      city: "مدينة ٦ أكتوبر (6th of October)",
      address: "المنطقة الصناعية الثالثة، مجمع المخازن الدولية",
      time: "متوقع اليوم ١٢:١٥ م",
    },
    driver: {
      name: "محمود السيد الشناوي",
      phone: "+20 101 234 5678",
      rating: "٤.٩ ★",
      truckType: "تريلا فرش ٤٠ طن (Flatbed Trela)",
      plateNumber: "ط ر ج ٨٩٤١",
      photo: "/t (1).jpg",
    },
    cargo: {
      category: "حديد وصلب ومواد بناء (Steel & Coils)",
      weightTons: 42.5,
      waybillNo: "WB-2026-08492",
      weighbridgeVerified: true,
      sealNumber: "EG-DZ-99410",
    },
    currentLocation: {
      label: "طريق السخنة - القاهرة السريع (كم ٦٥)",
      speed: "٧٨ كم/ساعة",
      highway: "Sokhna-Cairo Expy",
    },
  },
  "DZ-1029": {
    code: "DZ-1029",
    status: "picked_up",
    statusTextKey: "status.picked_up",
    defaultStatusText: "Picked Up & Loaded",
    lastUpdate: "منذ ١٢ دقيقة · 12 mins ago",
    eta: "٣ ساعات و ٢٠ دقيقة (3h 20m)",
    distanceKm: 220,
    origin: {
      title: "ميناء الإسكندرية البحري",
      city: "الإسكندرية (Alexandria)",
      address: "ساحة الدخيلة للصادرات",
      time: "اليوم ٠٩:١٥ ص",
    },
    destination: {
      title: "مدينة بدر الصناعية",
      city: "القاهرة (Cairo)",
      address: "شارع المصانع الرئيسي",
      time: "متوقع اليوم ٠١:٣٥ م",
    },
    driver: {
      name: "إبراهيم عبد الفتاح",
      phone: "+20 102 987 6543",
      rating: "٤.٩٥ ★",
      truckType: "جامبو مغلق ٦ طن (Jumbo Box)",
      plateNumber: "س ق د ٣٢١٨",
      photo: "/t (2).jpg",
    },
    cargo: {
      category: "أجهزة كهربائية ومنزلية (Electronics)",
      weightTons: 5.8,
      waybillNo: "WB-2026-01029",
      weighbridgeVerified: true,
      sealNumber: "EG-DZ-44120",
    },
    currentLocation: {
      label: "محطة تحصيل رسوم الإسكندرية الصحراوي",
      speed: "٦٥ كم/ساعة",
      highway: "Cairo-Alex Desert Rd",
    },
  },
  "DZ-55410": {
    code: "DZ-55410",
    status: "delivered",
    statusTextKey: "status.delivered",
    defaultStatusText: "Delivered & Signed",
    lastUpdate: "اليوم ٠٧:٤٠ ص",
    eta: "تم إتمام التسليم والمصادقة",
    distanceKm: 145,
    origin: {
      title: "مزارع وادي النطرون",
      city: "البحيرة (Beheira)",
      address: "مزرعة المحاصيل التصديرية",
      time: "أمس ٠٤:٠٠ م",
    },
    destination: {
      title: "سوق العبور المركزي",
      city: "القليوبية (Qalyubia)",
      address: "عنبر الخضار والفواكه المبردة",
      time: "اليوم ٠٧:٣٠ ص",
    },
    driver: {
      name: "حسام الجيار",
      phone: "+20 106 112 2334",
      rating: "٤.٨٨ ★",
      truckType: "براد مجهز تبريد حراري (Reefer)",
      plateNumber: "ن م ر ٦٥١٩",
      photo: "/t (3).jpg",
    },
    cargo: {
      category: "منتجات زراعية طازجة (Fresh Produce)",
      weightTons: 18.0,
      waybillNo: "WB-2026-05541",
      weighbridgeVerified: true,
      sealNumber: "EG-DZ-77890",
    },
    currentLocation: {
      label: "موقع العميل النهائي (تم التفريغ)",
      speed: "٠ كم/ساعة",
      highway: "Delivered",
    },
  },
};

export default function TrackShipment() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCode = searchParams.get("code") || "DZ-84920";
  const [inputCode, setInputCode] = useState(initialCode);
  const [activeCode, setActiveCode] = useState(initialCode);
  const [isLoading, setIsLoading] = useState(false);
  const [shipment, setShipment] = useState<TrackingResult | null>(
    DEMO_SHIPMENTS[initialCode] || null,
  );
  const [copied, setCopied] = useState(false);

  const handleSearch = (codeToSearch: string) => {
    const clean = codeToSearch.trim().toUpperCase();
    if (!clean) return;

    setIsLoading(true);
    setActiveCode(clean);
    setSearchParams({ code: clean });

    setTimeout(() => {
      if (DEMO_SHIPMENTS[clean]) {
        setShipment(DEMO_SHIPMENTS[clean]);
      } else {
        // Construct dynamic fallback result if custom code entered
        setShipment({
          code: clean,
          status: "in_transit",
          statusTextKey: "status.in_transit",
          defaultStatusText: "In Transit (Live)",
          lastUpdate: isRtl ? "منذ دقيقة واحدة" : "1 min ago",
          eta: isRtl ? "ساعتان و ١٠ دقائق (2h 10m)" : "2h 10m remaining",
          distanceKm: 160,
          origin: {
            title: isRtl ? "موقع التحميل المعتمد" : "Verified Loading Facility",
            city: isRtl ? "القاهرة الكبرى" : "Greater Cairo",
            address: isRtl ? "المنطقة اللوجستية المركزية" : "Central Logistics Terminal",
            time: "08:00 AM",
          },
          destination: {
            title: isRtl ? "نقطة التفريغ النهائية" : "Destination Warehouse",
            city: isRtl ? "الإسكندرية" : "Alexandria",
            address: isRtl ? "مجمع المستودعات" : "Industrial Port Area",
            time: "01:30 PM",
          },
          driver: {
            name: isRtl ? "سامح كمال الدين" : "Sameh Kamal El-Din",
            phone: "+20 100 889 9771",
            rating: "4.9 ★",
            truckType: isRtl ? "تريلا جوانب ٤٠ طن" : "Sided Trela (40t)",
            plateNumber: "أ ب ج ١٢٣٤",
            photo: "/man.png",
          },
          cargo: {
            category: isRtl ? "بضائع عامة وتغليف" : "General Commercial Cargo",
            weightTons: 25.0,
            waybillNo: `WB-${clean}`,
            weighbridgeVerified: true,
            sealNumber: "EG-DZ-1010",
          },
          currentLocation: {
            label: isRtl ? "طريق مصر الإسكندرية الصحراوي" : "Cairo-Alex Desert Highway",
            speed: "75 km/h",
            highway: "Desert Highway",
          },
        });
      }
      setIsLoading(false);
    }, 600);
  };

  const copyTrackingLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const codeParam = searchParams.get("code");
    if (codeParam && codeParam !== activeCode) {
      setInputCode(codeParam);
      handleSearch(codeParam);
    }
  }, [searchParams]);

  const milestones = [
    { key: "created", label: t("marketing.tracking.milestones.created", "Order Confirmed") },
    { key: "assigned", label: t("marketing.tracking.milestones.assigned", "Truck Assigned") },
    { key: "pickup", label: t("marketing.tracking.milestones.pickup", "At Pickup & Loaded") },
    { key: "in_transit", label: t("marketing.tracking.milestones.inTransit", "In Transit (Live GPS)") },
    { key: "delivered", label: t("marketing.tracking.milestones.delivered", "Delivered & Signed") },
  ];

  const getMilestoneIndex = (status: string) => {
    switch (status) {
      case "created":
        return 0;
      case "assigned":
        return 1;
      case "picked_up":
      case "pickup":
        return 2;
      case "in_transit":
        return 3;
      case "delivered":
        return 4;
      default:
        return 3;
    }
  };

  const currentStep = shipment ? getMilestoneIndex(shipment.status) : 3;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-[#070d18] text-slate-900 dark:text-slate-100 transition-colors">
      <MarketingNav />

      {/* Header & Search Bar */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0e223d] via-[#11294a] to-[#0e223d] py-16 text-white border-b border-sky-950">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold text-sky-300 backdrop-blur-md mb-6">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {t("marketing.tracking.badge", "Real-Time Telemetry & Radar")}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
            {t("marketing.tracking.title", "Live Shipment Tracking & ETA")}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t(
              "marketing.tracking.subtitle",
              "Enter your Order Code or Waybill number to inspect real-time truck position, cargo specs, and accurate ETA.",
            )}
          </p>

          {/* Search Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(inputCode);
            }}
            className="mt-8 max-w-2xl mx-auto flex flex-col sm:flex-row gap-2.5 p-2 rounded-2xl bg-white/10 dark:bg-slate-900/80 border border-white/20 backdrop-blur-md shadow-2xl"
          >
            <div className="relative flex-1">
              <Search className="absolute top-1/2 -translate-y-1/2 start-4 h-5 w-5 text-slate-300 pointer-events-none" />
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder={t(
                  "marketing.tracking.inputPlaceholder",
                  "Enter Order Code (e.g. DZ-84920 or DZ-1029)...",
                )}
                className="w-full bg-transparent py-3.5 ps-12 pe-4 text-sm font-semibold text-white placeholder-slate-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>{t("common.loading", "Loading...")}</span>
              ) : (
                <>
                  <Navigation className="h-4 w-4" />
                  <span>{t("marketing.tracking.trackBtn", "Track Shipment")}</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Codes Buttons */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span>{t("marketing.tracking.demoCodes", "Try sample shipment codes:")}</span>
            {Object.keys(DEMO_SHIPMENTS).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => {
                  setInputCode(code);
                  handleSearch(code);
                }}
                className={`px-2.5 py-1 rounded-md border font-mono transition ${
                  activeCode === code
                    ? "border-amber-400 bg-amber-400/20 text-amber-300 font-bold"
                    : "border-white/15 bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                {code}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto max-w-6xl px-6 lg:px-8 py-12 w-full space-y-10 flex-1">
        {isLoading ? (
          <div className="py-24 text-center space-y-4">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
            <p className="text-base font-semibold text-slate-600 dark:text-slate-400">
              {t("marketing.tracking.searching", "Locating shipment telemetry...")}
            </p>
          </div>
        ) : shipment ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top Status Card */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {t("marketing.tracking.orderCode", "Order Code")}
                    </span>
                    <span className="font-mono text-xl font-extrabold text-slate-900 dark:text-white">
                      {shipment.code}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                      {t(shipment.statusTextKey, shipment.defaultStatusText)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{t("marketing.tracking.lastUpdate", "Last Live Ping")}:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{shipment.lastUpdate}</span>
                  </p>
                </div>

                {/* ETA Badge & Share */}
                <div className="flex items-center gap-3">
                  <div className="text-end">
                    <span className="block text-[11px] font-semibold text-slate-400 uppercase">
                      {t("marketing.tracking.estArrival", "Estimated Arrival (ETA)")}
                    </span>
                    <span className="text-base font-bold text-amber-600 dark:text-amber-400">
                      {shipment.eta}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={copyTrackingLink}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 transition"
                    title="Share Tracking Link"
                  >
                    {copied ? (
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <Share2 className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Progress Milestones Stepper */}
              <div className="mt-8 pt-2">
                <div className="relative">
                  {/* Background Track Line */}
                  <div className="absolute top-4 start-4 end-4 h-1 bg-slate-100 dark:bg-slate-800 -z-0" />
                  {/* Active Progress Line */}
                  <div
                    className="absolute top-4 start-4 h-1 bg-gradient-to-r from-sky-500 to-amber-500 transition-all duration-500 -z-0"
                    style={{
                      width: `${(currentStep / (milestones.length - 1)) * 90}%`,
                    }}
                  />

                  <div className="grid grid-cols-5 gap-2 relative z-10">
                    {milestones.map((m, idx) => {
                      const isDone = idx <= currentStep;
                      const isCurrent = idx === currentStep;

                      return (
                        <div
                          key={m.key}
                          className="flex flex-col items-center text-center space-y-2"
                        >
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-bold transition-all shadow-sm ${
                              isCurrent
                                ? "border-amber-500 bg-amber-500 text-slate-950 ring-4 ring-amber-500/20 scale-110"
                                : isDone
                                  ? "border-sky-600 bg-sky-600 text-white"
                                  : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-400"
                            }`}
                          >
                            {isDone && !isCurrent ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              idx + 1
                            )}
                          </div>
                          <span
                            className={`text-[11px] sm:text-xs font-semibold leading-tight max-w-[90px] ${
                              isCurrent
                                ? "text-amber-600 dark:text-amber-400 font-bold"
                                : isDone
                                  ? "text-slate-900 dark:text-white"
                                  : "text-slate-400"
                            }`}
                          >
                            {m.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Grid: Map Preview & Route Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Route & Live Position Preview (7 Cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Live GPS Radar Mockup Card */}
                <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl">
                  {/* Top Radar Bar */}
                  <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                      </span>
                      <span className="text-xs font-bold text-slate-200">
                        {t("marketing.tracking.liveTelemetry", "Live Satellite GPS Active")}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      {shipment.currentLocation.speed} · {shipment.currentLocation.highway}
                    </span>
                  </div>

                  {/* Simulated Map Visual */}
                  <div className="relative h-64 sm:h-72 w-full bg-[#0d1e34] overflow-hidden flex items-center justify-center">
                    <img
                      src="/map.png"
                      alt="Route Map"
                      className="h-full w-full object-cover opacity-60 mix-blend-luminosity"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/map2.png";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />

                    {/* Truck Pin Beacon */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center group cursor-pointer">
                      <div className="relative inline-flex">
                        <span className="animate-ping absolute -inset-2 rounded-full bg-sky-400 opacity-75" />
                        <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-sky-600 to-amber-500 text-white shadow-2xl border-2 border-white">
                          <Truck className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="mt-2 rounded-lg bg-slate-950/90 px-3 py-1 text-xs font-semibold text-sky-300 border border-sky-500/30 backdrop-blur-md whitespace-nowrap shadow-lg">
                        {shipment.currentLocation.label}
                      </div>
                    </div>
                  </div>

                  {/* Route Summary Details */}
                  <div className="p-6 bg-slate-900 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-slate-400 uppercase font-semibold">
                        {t("marketing.tracking.origin", "Pickup Origin")}
                      </span>
                      <p className="text-sm font-bold text-white">{shipment.origin.city}</p>
                      <p className="text-slate-400 leading-snug">{shipment.origin.title}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-400 uppercase font-semibold">
                        {t("marketing.tracking.destination", "Delivery Destination")}
                      </span>
                      <p className="text-sm font-bold text-white">{shipment.destination.city}</p>
                      <p className="text-slate-400 leading-snug">{shipment.destination.title}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Driver & Cargo Details Cards (5 Cols) */}
              <div className="lg:col-span-5 space-y-6">
                {/* Driver & Truck Card */}
                <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                    {t("marketing.tracking.carrierInfo", "Driver & Vehicle Details")}
                  </h3>

                  <div className="flex items-center gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
                    <img
                      src={shipment.driver.photo}
                      alt={shipment.driver.name}
                      className="h-16 w-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/man.png";
                      }}
                    />
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        {shipment.driver.name}
                      </h4>
                      <p className="text-xs font-semibold text-amber-500">
                        {shipment.driver.rating} {isRtl ? "تقييم ممتاز" : "Top Rated Driver"}
                      </p>
                      <span className="inline-block text-[11px] font-mono font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                        {shipment.driver.plateNumber}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 dark:text-slate-400">
                        {t("marketing.tracking.truckType", "Vehicle Class")}:
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {shipment.driver.truckType}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 dark:text-slate-400">
                        {t("marketing.tracking.driverName", "Assigned Driver")}:
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {shipment.driver.name}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5">
                    <a
                      href={`tel:${shipment.driver.phone}`}
                      dir="ltr"
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-900 dark:text-white font-semibold py-2.5 px-4 text-xs transition"
                    >
                      <Phone className="h-3.5 w-3.5 text-sky-500" />
                      <span>{shipment.driver.phone}</span>
                    </a>
                  </div>
                </div>

                {/* Cargo & Waybill Card */}
                <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {t("marketing.tracking.cargoDetails", "Cargo Specifications")}
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 dark:text-slate-400">
                        {t("marketing.tracking.cargoCategory", "Cargo Type")}:
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {shipment.cargo.category}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 dark:text-slate-400">
                        {t("marketing.tracking.cargoWeight", "Certified Weight")}:
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {shipment.cargo.weightTons} {t("common.ton", "ton")}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 dark:text-slate-400">
                        {t("marketing.tracking.waybillNumber", "Waybill Number")}:
                      </span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                        {shipment.cargo.waybillNo}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 dark:text-slate-400">
                        {isRtl ? "ختم الأمان الرقمي" : "Security Seal"}:
                      </span>
                      <span className="font-mono text-slate-600 dark:text-slate-400">
                        {shipment.cargo.sealNumber}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="h-4 w-4 flex-shrink-0" />
                    <span>
                      {isRtl
                        ? "تمت مطابقة أوزان الميزان وبوليصة الشحن رقمياً"
                        : "Weighbridge tickets & POD verified electronically"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center space-y-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
            <AlertCircle className="h-16 w-16 text-amber-500 mx-auto" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {t(
                "marketing.tracking.notFound",
                "No shipment matching this code was found. Please check the code or contact support.",
              )}
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              {isRtl
                ? "تأكد من إدخال كود الطلب الصحيح المسجل في رسالة التأكيد أو بوليصة الشحن الإلكترونية."
                : "Verify the order ID from your confirmation SMS or digital waybill ticket."}
            </p>
          </div>
        )}
      </main>

      <MarketingFooter />
    </div>
  );
}