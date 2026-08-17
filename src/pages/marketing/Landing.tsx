import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import MarketingNav from "./components/MarketingNav";
import MarketingFooter from "./components/MarketingFooter";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import ProcessSection from "./components/ProcessSection";
import AppScreenshotsSlider from "./components/AppScreenshotsSlider";
import BusinessSolutionsSection from "./components/BusinessSolutionsSection";
import CoverageSection from "./components/CoverageSection";
import DriverSpotlightSection from "./components/DriverSpotlightSection";
import TestimonialsSection from "./components/TestimonialsSection";
import BlogSection from "./components/BlogSection";
import TechnicalBackboneSection from "./components/TechnicalBackboneSection";

export default function Landing() {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (!hash) return;

    const timer = setTimeout(() => {
      const element =
        document.getElementById(hash) ||
        (hash === "how-it-works" ? document.getElementById("process") : null) ||
        (hash === "truck-types" ? document.getElementById("how-it-works") || document.getElementById("process") : null) ||
        (hash === "app-download" ? document.getElementById("app-screens") : null);

      if (element) {
        const headerOffset = 90;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [location.hash]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-black text-gray-900 dark:text-white transition-colors duration-200">
      <MarketingNav />

      <main className="flex-1 mt-10">
        {/* ================= HERO SECTION ================= */}
        <HeroSection />

        {/* ================= ABOUT US / VISION / MISSION SECTION ================= */}
        <AboutSection />

        {/* ================= PROCESS SECTION ================= */}
        <ProcessSection />

        {/* ================= APP SCREENSHOTS MOCKUP SLIDER ================= */}
        <AppScreenshotsSlider />

        {/* ================= BUSINESS SOLUTIONS ================= */}
        <BusinessSolutionsSection />

        {/* ================= COVERAGE SECTION ================= */}
        <CoverageSection />

        {/* ================= DRIVER SPOTLIGHT ================= */}
        <DriverSpotlightSection />

        {/* ================= TESTIMONIALS / CLIENT REVIEWS SECTION ================= */}
        <TestimonialsSection />

        {/* ================= BLOG / KNOWLEDGE HUB SECTION ================= */}
        <BlogSection />

        {/* ================= TECHNICAL BACKBONE ================= */}
        <TechnicalBackboneSection />
      </main>

      <MarketingFooter />
    </div>
  );
}
