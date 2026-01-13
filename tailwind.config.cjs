/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,html}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdf6e3',
          100: '#f9ecd1',
          200: '#f1d6a2',
          300: '#e7bc70',
          400: '#dc9e46',
          500: '#c5a059',
          600: '#96702d',
        },
        spiritual: '#1e293b',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 600ms ease-out both',
        'pulse-slow': 'pulseSlow 6s ease-in-out infinite',
        'pulse-slower': 'pulseSlow 10s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
