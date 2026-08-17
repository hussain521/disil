import { useEffect, useState, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const calculateScrollProgress = useCallback(() => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    if (scrollTop > 250) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }

    if (windowHeight > 0) {
      const progress = Math.min(Math.max((scrollTop / windowHeight) * 100, 0), 100);
      setScrollProgress(progress);
    }
  }, []);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          calculateScrollProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    calculateScrollProgress();

    return () => window.removeEventListener('scroll', onScroll);
  }, [calculateScrollProgress]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ease-out transform ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 translate-y-6 scale-90 pointer-events-none'
      }`}
    >
      <div className="relative group">
        {/* Glow ring effect */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 opacity-30 blur-md transition-all duration-300 group-hover:opacity-75 group-hover:blur-lg dark:from-blue-500 dark:to-cyan-400" />

        {/* Scroll button */}
        <button
          type="button"
          onClick={scrollToTop}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label="Scroll to top"
          className="relative flex h-13 w-13 items-center justify-center rounded-full bg-white/90 p-2 text-slate-800 shadow-xl backdrop-blur-md border border-slate-200/80 transition-all duration-300 hover:scale-110 hover:bg-blue-600 hover:text-white active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-slate-900/90 dark:text-slate-100 dark:border-slate-800 dark:hover:bg-blue-500 dark:hover:text-white dark:focus:ring-offset-slate-950"
        >
          {/* Progress Circle SVG */}
          <svg className="absolute inset-0 h-full w-full -rotate-90 p-0.5" viewBox="0 0 52 52">
            <circle
              cx="26"
              cy="26"
              r={radius}
              className="stroke-slate-200/50 dark:stroke-slate-800/60"
              strokeWidth="2.5"
              fill="transparent"
            />
            <circle
              cx="26"
              cy="26"
              r={radius}
              className="stroke-blue-600 transition-all duration-150 ease-out dark:stroke-cyan-400 group-hover:stroke-white"
              strokeWidth="2.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Arrow Icon with Bounce Animation */}
          <ArrowUp
            className={`h-5 w-5 transition-transform duration-300 ease-out ${
              isHovered ? '-translate-y-0.5 scale-110' : ''
            }`}
          />
        </button>

        {/* Tooltip */}
        <span className="absolute bottom-full right-1/2 mb-2 translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-md transition-all duration-200 group-hover:opacity-100 group-hover:-translate-y-1 dark:bg-slate-100 dark:text-slate-900 pointer-events-none">
          أعلى الصفحة
        </span>
      </div>
    </div>
  );
}