/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue"
  ],
  safelist: [
    'ml-20',
    'ml-70', 
    'lg:ml-20',
    'lg:ml-70',
    'w-20',
    'w-70'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: 'var(--primary-color)',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        }
      },
      spacing: {
        '70': '280px',
        '20': '80px'
      },
      borderRadius: {
        'lg-custom': '16px'
      }
    },
  },
  plugins: [],
}