import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToSection } from "../../lib/scroll";
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
      scrollToSection(hash);
    }, 150);

    return () => clearTimeout(timer);
  }, [location.hash]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-black text-gray-900 dark:text-white transition-colors duration-200">
      <MarketingNav />

      <main className="flex-1 mt-10 section-contain">
        {/* ================= HERO SECTION ================= */}
        <div className="section-contain">
          <HeroSection />
        </div>

        {/* ================= ABOUT US / VISION / MISSION SECTION ================= */}
        <div className="section-contain">
          <AboutSection />
        </div>

        {/* ================= PROCESS SECTION ================= */}
        <div className="section-contain">
          <ProcessSection />
        </div>

        {/* ================= APP SCREENSHOTS MOCKUP SLIDER ================= */}
        <div className="section-contain">
          <AppScreenshotsSlider />
        </div>

        {/* ================= BUSINESS SOLUTIONS ================= */}
        <div className="section-contain">
          <BusinessSolutionsSection />
        </div>

        {/* ================= COVERAGE SECTION ================= */}
        <div className="section-contain">
          <CoverageSection />
        </div>

        {/* ================= DRIVER SPOTLIGHT ================= */}
        <div className="section-contain">
          <DriverSpotlightSection />
        </div>

        {/* ================= TESTIMONIALS / CLIENT REVIEWS SECTION ================= */}
        <div className="section-contain">
          <TestimonialsSection />
        </div>

        {/* ================= BLOG / KNOWLEDGE HUB SECTION ================= */}
        <div className="section-contain">
          <BlogSection />
        </div>

        {/* ================= TECHNICAL BACKBONE ================= */}
        <div className="section-contain">
          <TechnicalBackboneSection />
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
