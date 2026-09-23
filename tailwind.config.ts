import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand — premium UAE consultancy: deep ink navy + refined gold
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
        gold: {
          DEFAULT: '#C9A227',
          50: '#FBF7EA',
          100: '#F6EECB',
          200: '#EEDB93',
          300: '#E4C65C',
          400: '#D6B23A',
          500: '#C9A227',
          600: '#A6841E',
          700: '#7F651A',
          800: '#5C4915',
          900: '#3D300F',
        },
        sand: '#F7F5F0',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-arabic)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 2px 20px -8px rgba(11, 27, 43, 0.15)',
        card: '0 8px 40px -12px rgba(11, 27, 43, 0.18)',
        gold: '0 10px 30px -10px rgba(201, 162, 39, 0.45)',
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
