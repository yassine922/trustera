/** @type {import('tailwindcss').Config} */
export default {
  content: ['./client/index.html', './client/src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: { 
        sans: ['Cairo', 'sans-serif'],
        cairo: ['Cairo', 'sans-serif'],
      },
      colors: {
        primary: { 
          DEFAULT: '#1a7c2e', 
          dark: '#145c22', 
          light: '#2ea84a', 
          bg: '#edf7f0',
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#145e29',
        },
        accent: { DEFAULT: '#ff6b00', 50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74', 400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c', 800: '#9a3412', 900: '#7c2d12' },
        danger: '#d32f2f',
        warning: '#f59e0b',
        info: '#0284c7',
      },
      spacing: {
        '4.5': '1.125rem',
        '18': '4.5rem',
      },
      zIndex: {
        900: '900',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0,0,0,0.08)',
        'lg': '0 8px 32px rgba(0,0,0,0.13)',
      },
      borderRadius: {
        'lg': '14px',
      },
    },
  },
  plugins: [],
};
