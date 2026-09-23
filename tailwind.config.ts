import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand — matches the IBS "Intelligent Business Solutions" mark:
        // deep ink navy + a cool steel-blue accent + brushed silver/platinum.
        ink: {
          DEFAULT: '#0B1B2B',
          50: '#F2F5F8',
          100: '#E1E8EF',
          200: '#C2CFDC',
          300: '#94A9BE',
          400: '#5E7A96',
          500: '#3C5670',
          600: '#294056',
          700: '#1B2E40',
          800: '#12212F',
          900: '#0B1B2B',
          950: '#060F19',
        },
        // Primary accent — steel/azure blue drawn from the logo's navy.
        steel: {
          DEFAULT: '#2F6FD0',
          50: '#EAF2FC',
          100: '#D2E4F9',
          200: '#A9C9F1',
          300: '#77A6E6',
          400: '#4A85DA',
          500: '#2F6FD0',
          600: '#245AAE',
          700: '#1C4483',
          800: '#16345F',
          900: '#0F213C',
        },
        // Brushed silver / platinum from the logo's metallic lettering.
        silver: {
          DEFAULT: '#AEB8C4',
          50: '#F7F8FA',
          100: '#EDEFF2',
          200: '#DCE0E6',
          300: '#C3CAD3',
          400: '#AEB8C4',
          500: '#93A0AF',
          600: '#75828F',
          700: '#5A6472',
          800: '#3F4753',
          900: '#2A303A',
        },
        // Back-compat alias: legacy `gold-*` classes now render as steel-blue,
        // keeping the whole UI on-brand without touching every component.
        gold: {
          DEFAULT: '#2F6FD0',
          50: '#EAF2FC',
          100: '#D2E4F9',
          200: '#A9C9F1',
          300: '#77A6E6',
          400: '#4A85DA',
          500: '#2F6FD0',
          600: '#245AAE',
          700: '#1C4483',
          800: '#16345F',
          900: '#0F213C',
        },
        sand: '#F4F7FA',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-arabic)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 2px 20px -8px rgba(11, 27, 43, 0.15)',
        card: '0 8px 40px -12px rgba(11, 27, 43, 0.18)',
        // Accent glow (kept under the legacy `gold` name used across the UI).
        gold: '0 12px 34px -12px rgba(47, 111, 208, 0.5)',
        steel: '0 12px 34px -12px rgba(47, 111, 208, 0.5)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      container: {
        center: true,
        padding: { DEFAULT: '1rem', lg: '2rem' },
        screens: { '2xl': '1200px' },
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fade-in 0.9s ease forwards',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
