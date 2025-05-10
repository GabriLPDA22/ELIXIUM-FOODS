// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Colores personalizados basados en tu app
        'primary': '#FF6B6B',
        'secondary': '#4ECDC4',
        'success': '#73D13D',
        'warning': '#FFC53D',
        'danger': '#FF4D4F',
        'info': '#1890FF',
      },
    },
  },
  plugins: [],
}
