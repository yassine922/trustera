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
          DEFAULT: '#0f3d2e', // أخضر زمردي غامق وفاخر
          dark: '#08261d', 
          light: '#1a634b', 
          accent: '#c5a059', // ذهبي مطفي للمسات الحصرية
          bg: '#fcfcfc',
        },
        accent: { DEFAULT: '#c5a059', 50: '#f9f6f0' },
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
        'premium': '0 20px 50px rgba(0,0,0,0.05)',
        'soft': '0 2px 15px rgba(0,0,0,0.02)',
        'glass': 'inset 0 0 0 1px rgba(255,255,255,0.1)',
      },
      borderRadius: {
        'premium': '24px',
      },
    },
  },
  plugins: [],
};
