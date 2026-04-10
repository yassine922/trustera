/** @type {import('tailwindcss').Config} */
export default {
  content: ['./client/index.html', './client/src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Cairo', 'sans-serif'] },
      colors: {
        primary: { DEFAULT: '#1a7c2e', dark: '#145c22', light: '#2ea84a', bg: '#edf7f0' },
        accent: '#ff6b00',
      },
    },
  },
  plugins: [],
};
