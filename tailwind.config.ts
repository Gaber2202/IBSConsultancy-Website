import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // IBS brand: deep ink navy + steel accent + platinum
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
        // Legacy alias used across components
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
        mist: '#E8EEF5',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-arabic)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 24px -10px rgba(11, 27, 43, 0.14)',
        card: '0 16px 48px -20px rgba(11, 27, 43, 0.22)',
        gold: '0 14px 40px -14px rgba(47, 111, 208, 0.45)',
        steel: '0 14px 40px -14px rgba(47, 111, 208, 0.45)',
        glow: '0 0 0 1px rgba(47, 111, 208, 0.18), 0 20px 50px -24px rgba(47, 111, 208, 0.55)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      container: {
        center: true,
        padding: { DEFAULT: '1.25rem', lg: '2rem' },
        screens: { '2xl': '1180px' },
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'ken-burns': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.06)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fade-in 1s ease forwards',
        'ken-burns': 'ken-burns 18s ease-out forwards',
        shimmer: 'shimmer 8s ease infinite',
      },
    },
  },
  plugins: [],
};

export default config;
