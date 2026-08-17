import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Users,
  ShieldCheck,
  Truck,
  MessageSquare,
  Building2,
  Headphones,
  Award,
  Sparkles,
} from "lucide-react";
import MarketingNav from "./components/MarketingNav";
import MarketingFooter from "./components/MarketingFooter";

interface TeamMember {
  name: string;
  roleKey: string;
  defaultRole: string;
  image: string;
  department: string;
  experience: string;
}

export default function ContactAndTeam() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    phone: "",
    email: "",
    topic: "general",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const teamMembers: TeamMember[] = [
    {
      name: isRtl ? "م.  امنية السيد" : "Eng. Omnia El-Sayed",
      roleKey: "marketing.contactTeam.team.roles.ceo",
      defaultRole: "Founder & Chief Executive Officer",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&h=800&q=85",
      department: isRtl ? "القيادة التنفيذية" : "Executive Leadership",
      experience: isRtl ? "+١٢ عاماً في سلاسل الإمداد واللوجستيات" : "12+ yrs Supply Chain Tech",
    },
    {
      name: isRtl ? "كابتن أحمد سامي" : "Capt. Ahmed Samy",
      roleKey: "marketing.contactTeam.team.roles.coo",
      defaultRole: "Chief Operating Officer & Fleet Lead",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&h=800&q=85",
      department: isRtl ? "إدارة الأسطول والتشغيل" : "Fleet & Operations",
      experience: isRtl ? "+١٥ عاماً في النقل الثقيل والموانئ" : "15+ yrs Heavy Freight",
    },
    {
      name: isRtl ? "م. طارق كمال" : "Eng. Tarek Kamal",
      roleKey: "marketing.contactTeam.team.roles.cto",
      defaultRole: "Chief Technology Officer",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&h=800&q=85",
      department: isRtl ? "الهندسة والذكاء الاصطناعي" : "Engineering & AI",
      experience: isRtl ? "+١٠ أعوام في المنصات وأنظمة GPS" : "10+ yrs Cloud & GPS Systems",
    },
    {
      name: isRtl ? "أ. رانيا منصور" : "Rania Mansour",
      roleKey: "marketing.contactTeam.team.roles.headCustomer",
      defaultRole: "Head of Partner Success & Support",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&h=800&q=85",
      department: isRtl ? "خدمة الشركاء والعملاء" : "Partner Success",
      experience: isRtl ? "+٨ أعوام في تجربة الشركات وكبار العملاء" : "8+ yrs Client Success",
    },
    {
      name: isRtl ? "م. محمود عبد الرحمن" : "Eng. Mahmoud Abdelrahman",
      roleKey: "marketing.contactTeam.team.roles.headLogistics",
      defaultRole: "Head of Freight & Dispatch Operations",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=700&h=800&q=85",
      department: isRtl ? "توجيه وتوزيع الشحنات" : "Freight Dispatch",
      experience: isRtl ? "+٩ أعوام في مسارات النقل الإقليمي" : "9+ yrs Corridor Optimization",
    },
    {
      name: isRtl ? "المستشار عصام الجندي" : "Counsel Essam El-Gendy",
      roleKey: "marketing.contactTeam.team.roles.headCompliance",
      defaultRole: "Head of Safety & Legal Compliance",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=700&h=800&q=85",
      department: isRtl ? "الأمان والامتثال القانوني" : "Legal & Compliance",
      experience: isRtl ? "+١٤ عاماً في قانون النقل والتأمين الشامل" : "14+ yrs Logistics Law & Cargo Insurance",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        fullName: "",
        companyName: "",
        phone: "",
        email: "",
        topic: "general",
        message: "",
      });
    }, 900);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-[#080e1a] text-slate-900 dark:text-slate-100 transition-colors">
      <MarketingNav />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0b1c34] via-[#0e2444] to-[#0b1c34] py-20 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold text-sky-300 backdrop-blur-md mb-6">
            <Sparkles className="h-3.5 w-3.5 text-sky-400" />
            <span>
              {t("marketing.contactTeam.badge", "Diziel Team & Support")}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl max-w-3xl mx-auto leading-tight">
            {t(
              "marketing.contactTeam.title",
              "We're Here to Power Your Logistics 24/7",
            )}
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t(
              "marketing.contactTeam.subtitle",
              "A dedicated team of technical and logistics specialists ensuring your freight moves seamlessly across Egypt.",
            )}
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 lg:px-8 py-16 space-y-24 w-full">
        {/* Contact Channels & Interactive Form Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Info Cards (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-primary dark:text-sky-400">
                {t("marketing.contactTeam.channels.title", "Direct Contact Channels")}
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {isRtl ? "تواصل مباشر مع مسؤولي العمليات" : "Direct Access to Operations"}
              </h2>
            </div>

            {/* Channels List */}
            <div className="space-y-4 pt-2">
              {/* Phone */}
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-sky-500/50 transition-colors">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {t("marketing.contactTeam.channels.phone", "Operations Hotline")}
                  </h3>
                  <a
                    href="tel:+201000009988"
                    dir="ltr"
                    className="mt-1 block text-base font-bold text-sky-600 dark:text-sky-400 hover:underline"
                  >
                    +20 100 000 9988
                  </a>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {isRtl ? "متاح على مدار الساعة للمكالمات والواتساب" : "Available 24/7 for calls & WhatsApp"}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-sky-500/50 transition-colors">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {t("marketing.contactTeam.channels.email", "Enterprise Inquiries")}
                  </h3>
                  <a
                    href="mailto:operations@diziel.com"
                    className="mt-1 block text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-sky-500"
                  >
                    operations@diziel.com
                  </a>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {isRtl ? "استجابة رسمية خلال أقل من ساعتي عمل" : "Official response within 2 business hours"}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-sky-500/50 transition-colors">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {t("marketing.contactTeam.channels.location", "Headquarters")}
                  </h3>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300 leading-snug">
                    {t(
                      "marketing.contactTeam.channels.locationAddress",
                      "New Cairo, 5th Settlement, Logistics Business Park",
                    )}
                  </p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-sky-500/50 transition-colors">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {t("marketing.contactTeam.channels.hours", "Operating Hours")}
                  </h3>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                    {t(
                      "marketing.contactTeam.channels.hoursDetails",
                      "24/7 Operations & Carrier Dispatch Support",
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-white dark:bg-slate-900 p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {t(
                    "marketing.contactTeam.form.title",
                    "Send Us a Message or Request Partnership",
                  )}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {t(
                    "marketing.contactTeam.form.subtitle",
                    "Fill out the inquiry form and our logistics operations lead will contact you within two hours.",
                  )}
                </p>
              </div>

              {isSubmitted ? (
                <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-8 text-center space-y-4 animate-in fade-in zoom-in duration-300">
                  <CheckCircle2 className="h-14 w-14 text-emerald-500 mx-auto" />
                  <h4 className="text-xl font-bold text-emerald-900 dark:text-emerald-200">
                    {t(
                      "marketing.contactTeam.form.successTitle",
                      "Message Received Successfully!",
                    )}
                  </h4>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300 max-w-md mx-auto">
                    {t(
                      "marketing.contactTeam.form.successDesc",
                      "Thank you for reaching out to Diziel. Our operations team will respond promptly.",
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition"
                  >
                    {isRtl ? "إرسال رسالة أخرى" : "Send Another Message"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        {t("marketing.contactTeam.form.fullName", "Full Name")} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        placeholder={t(
                          "marketing.contactTeam.form.fullNamePlaceholder",
                          "e.g. Eng. Ahmed Abdullah",
                        )}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition"
                      />
                    </div>

                    {/* Company Name */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        {t(
                          "marketing.contactTeam.form.companyName",
                          "Company / Organization",
                        )}
                      </label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            companyName: e.target.value,
                          })
                        }
                        placeholder={t(
                          "marketing.contactTeam.form.companyNamePlaceholder",
                          "e.g. Delta Industrial Group",
                        )}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        {t(
                          "marketing.contactTeam.form.phone",
                          "Phone / WhatsApp",
                        )} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="010XXXXXXXX"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition text-start"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        {t(
                          "marketing.contactTeam.form.email",
                          "Business Email",
                        )} *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="name@company.com"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition text-start"
                      />
                    </div>
                  </div>

                  {/* Topic Select */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      {t("marketing.contactTeam.form.topic", "Inquiry Topic")}
                    </label>
                    <select
                      value={formData.topic}
                      onChange={(e) =>
                        setFormData({ ...formData, topic: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-sky-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition"
                    >
                      <option value="general">
                        {t(
                          "marketing.contactTeam.form.topicGeneral",
                          "General Inquiry",
                        )}
                      </option>
                      <option value="enterprise">
                        {t(
                          "marketing.contactTeam.form.topicEnterprise",
                          "Enterprise & Recurring Freight Contracts",
                        )}
                      </option>
                      <option value="carrier">
                        {t(
                          "marketing.contactTeam.form.topicCarrier",
                          "Fleet & Carrier Onboarding",
                        )}
                      </option>
                      <option value="support">
                        {t(
                          "marketing.contactTeam.form.topicSupport",
                          "Technical & Operational Support",
                        )}
                      </option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      {t(
                        "marketing.contactTeam.form.message",
                        "Message / Shipment Requirements",
                      )} *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder={t(
                        "marketing.contactTeam.form.messagePlaceholder",
                        "Tell us about your cargo scale, routes, or questions...",
                      )}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white font-semibold py-3.5 px-6 shadow-md shadow-sky-600/20 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>
                        {t("marketing.contactTeam.form.submitting", "Sending...")}
                      </span>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>
                          {t(
                            "marketing.contactTeam.form.submit",
                            "Send Message",
                          )}
                        </span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Core Team Showcase Section */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs">
              <Users className="h-3.5 w-3.5 text-brand-primary dark:text-sky-400" />
              <span>
                {t("marketing.contactTeam.team.badge", "Leadership & Core Team")}
              </span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {t(
                "marketing.contactTeam.team.title",
                "The Team Behind the Logistics Transformation",
              )}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              {t(
                "marketing.contactTeam.team.subtitle",
                "Engineers, supply chain operators, and logistics visionaries building Egypt's smartest freight network.",
              )}
            </p>
          </div>

          {/* Team Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Top Image Showcase with Overlay Badge */}
                <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/man.png";
                    }}
                  />
                  {/* Subtle Gradient Shadow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Floating Department Badge on Image */}
                  <div className="absolute top-4 start-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                      <ShieldCheck className="h-3.5 w-3.5 text-sky-400" />
                      {member.department}
                    </span>
                  </div>

                  {/* Name and Role overlay in bottom of photo */}
                  <div className="absolute bottom-4 start-4 end-4">
                    <h3 className="text-xl font-extrabold text-white drop-shadow-md">
                      {member.name}
                    </h3>
                    <p className="text-xs font-semibold text-amber-300 drop-shadow-xs mt-0.5">
                      {t(member.roleKey, member.defaultRole)}
                    </p>
                  </div>
                </div>

                {/* Card Bottom Content & Meta Details */}
                <div className="p-5 flex flex-col justify-between flex-1 gap-4 bg-white dark:bg-slate-900">
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
                    <Award className="h-4 w-4 text-amber-500 flex-shrink-0" />
                    <span>{member.experience}</span>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1.5 font-bold text-sky-600 dark:text-sky-400">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      {isRtl ? "فريق ديزيل المعتمد" : "Verified Diziel Executive"}
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-slate-400">
                      Diziel Core
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}