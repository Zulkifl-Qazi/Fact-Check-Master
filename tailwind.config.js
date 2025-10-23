/** @type {import('tailwindcss').Config} */
export default {
  // THIS IS THE MOST IMPORTANT PART
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': '#1D4ED8',
        'secondary': '#3B82F6',
        'accent': {
          'light': '#EFF6FF',
          'dark': '#1F2937',
        },
        'text-main': '#111827',
        'text-muted': '#6B7280',
        'dark-bg': '#111827',
        'dark-text': '#F3F4F6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}