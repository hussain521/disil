/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Admin portal — sophisticated slate/obsidian dark + crisp arctic light with vibrant crimson/coral highlights
        admin: {
          bg: 'rgb(var(--admin-bg-rgb) / <alpha-value>)',
          card: 'rgb(var(--admin-card-rgb) / <alpha-value>)',
          'card-hover': 'rgb(var(--admin-card-hover-rgb) / <alpha-value>)',
          border: 'rgb(var(--admin-border-rgb) / <alpha-value>)',
          accent: '#F43F5E',
          'accent-light': '#FB7185',
          'accent-dark': '#E11D48',
          'accent-glow': 'rgba(244, 63, 94, 0.25)',
          text: 'rgb(var(--admin-text-rgb) / <alpha-value>)',
          subtext: 'rgb(var(--admin-subtext-rgb) / <alpha-value>)',
          muted: 'rgb(var(--admin-muted-rgb) / <alpha-value>)',
          surface: 'rgb(var(--admin-surface-rgb) / <alpha-value>)',
        },
        // Company/client + marketing portal — light theme
        brand: {
          primary: '#1E3A8A',
          primaryLight: '#3B82F6',
          primaryDark: '#0F172A',
          accent: '#F59E0B',
          accentLight: '#FBBF24',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#06B6D4',
          bg: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          text: '#0F172A',
          subtext: '#64748B',
        },
      },
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'subtle-dark': '0 0 0 0 transparent',
        'subtle-light': '0 0 0 0 transparent',
        'glow-accent': '0 0 20px -3px rgba(244, 63, 94, 0.35)',
        'glow-primary': '0 0 20px -3px rgba(59, 130, 246, 0.35)',
        'glow-success': '0 0 20px -3px rgba(16, 185, 129, 0.35)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      borderRadius: {
        xs: '6px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 2s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};
