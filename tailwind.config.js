/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        'sf-pro': ['SF Pro Display', 'system-ui', '-apple-system', 'sans-serif'],
      },
      container: {
        padding: {
          DEFAULT: '20px',
          lg: '0.5rem',
          xl: '4rem',
          '2xl': '7rem',
        },
      },
      fontSize: {
      },
    },
  },
  plugins: [],
};
