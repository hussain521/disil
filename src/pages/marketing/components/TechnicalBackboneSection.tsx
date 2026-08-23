import { useTranslation } from "react-i18next";

export default function TechnicalBackboneSection() {
  const { t } = useTranslation();

  return (
    <section
      id="technical-backbone"
      className="bg-[#fff1e4] dark:bg-gray-950 px-6 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28 transition-colors duration-200 transform-gpu"
    >
      <div className="mx-auto max-w-[1480px]">
        {/* ================= HEADER ================= */}
        <div className="text-center">
          <span
            className="
              text-sm
              font-semibold
              uppercase
              tracking-[0.16em]
              text-amber-800
              dark:text-amber-400
            "
          >
            {t("marketing.technicalBackbone.label", "Technical Backbone")}
          </span>

          <h2
            className="
              mt-7
              text-4xl
              font-bold
              tracking-[-0.035em]
              text-slate-900
              dark:text-white
              sm:text-5xl
              lg:text-[48px]
            "
          >
            {t(
              "marketing.technicalBackbone.title",
              "Global-Scale Infrastructure",
            )}
          </h2>
        </div>

        {/* ================= CARDS ================= */}
        <div
          className="
            mt-16
            grid
            grid-cols-1
            gap-6
            md:grid-cols-2
            lg:grid-cols-3
            lg:gap-8
          "
        >
          {/* ================= CARD 1 ================= */}
          <article
            className="
              overflow-hidden
              rounded-[28px]
              bg-white
              dark:bg-gray-900
              border
              border-transparent
              dark:border-gray-800
              p-6
              shadow-[0_12px_30px_rgba(16,39,70,0.10)]
              dark:shadow-[0_12px_30px_rgba(0,0,0,0.4)]
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-[0_18px_40px_rgba(16,39,70,0.14)]
              sm:p-7
            "
          >
            <div className="overflow-hidden rounded-[20px]">
              <img
                src="/t (1).jpg"
                alt="Secure warehousing"
                width={400}
                height={210}
                loading="lazy"
                decoding="async"
                className="
                  aspect-[1.9/1]
                  w-full
                  object-cover
                  transition-transform
                  duration-500
                  hover:scale-105
                "
              />
            </div>

            <h3
              className="
                mt-10
                text-2xl
                font-bold
                tracking-[-0.025em]
                text-[#102746]
                dark:text-white
              "
            >
              {t(
                "marketing.technicalBackbone.cards.warehousing.title",
                "Secure Warehousing",
              )}
            </h3>

            <p
              className="
                mt-5
                text-base
                leading-7
                text-slate-700
                dark:text-gray-300
              "
            >
              {t(
                "marketing.technicalBackbone.cards.warehousing.description",
                "24/7 monitoring and climate-controlled facilities ensure optimal safety and preservation.",
              )}
            </p>
          </article>

          {/* ================= CARD 2 ================= */}
          <article
            className="
              overflow-hidden
              rounded-[28px]
              bg-white
              dark:bg-gray-900
              border
              border-transparent
              dark:border-gray-800
              p-6
              shadow-[0_12px_30px_rgba(16,39,70,0.10)]
              dark:shadow-[0_12px_30px_rgba(0,0,0,0.4)]
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-[0_18px_40px_rgba(16,39,70,0.14)]
              sm:p-7
            "
          >
            <div className="overflow-hidden rounded-[20px]">
              <img
                src="/t (2).jpg"
                alt="Smart fleet management"
                width={400}
                height={210}
                loading="lazy"
                decoding="async"
                className="
                  aspect-[1.9/1]
                  w-full
                  object-cover
                  transition-transform
                  duration-500
                  hover:scale-105
                "
              />
            </div>

            <h3
              className="
                mt-10
                text-2xl
                font-bold
                tracking-[-0.025em]
                text-[#102746]
                dark:text-white
              "
            >
              {t(
                "marketing.technicalBackbone.cards.fleet.title",
                "Smart Fleet Management",
              )}
            </h3>

            <p
              className="
                mt-5
                text-base
                leading-7
                text-slate-700
                dark:text-gray-300
              "
            >
              {t(
                "marketing.technicalBackbone.cards.fleet.description",
                "Predictive maintenance and real-time fuel optimization for unmatched operational efficiency.",
              )}
            </p>
          </article>

          {/* ================= CARD 3 ================= */}
          <article
            className="
              overflow-hidden
              rounded-[28px]
              bg-white
              dark:bg-gray-900
              border
              border-transparent
              dark:border-gray-800
              p-6
              shadow-[0_12px_30px_rgba(16,39,70,0.10)]
              dark:shadow-[0_12px_30px_rgba(0,0,0,0.4)]
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-[0_18px_40px_rgba(16,39,70,0.14)]
              sm:p-7
            "
          >
            <div className="overflow-hidden rounded-[20px]">
              <img
                src="/t (3).jpg"
                alt="Customs and compliance"
                width={400}
                height={210}
                loading="lazy"
                decoding="async"
                className="
                  aspect-[1.9/1]
                  w-full
                  object-cover
                  transition-transform
                  duration-500
                  hover:scale-105
                "
              />
            </div>

            <h3
              className="
                mt-10
                text-2xl
                font-bold
                tracking-[-0.025em]
                text-[#102746]
                dark:text-white
              "
            >
              {t(
                "marketing.technicalBackbone.cards.compliance.title",
                "Customs & Compliance",
              )}
            </h3>

            <p
              className="
                mt-5
                text-base
                leading-7
                text-slate-700
                dark:text-gray-300
              "
            >
              {t(
                "marketing.technicalBackbone.cards.compliance.description",
                "Seamless MENA-region border crossings and automated documentation for rapid clearance.",
              )}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
