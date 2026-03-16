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
      colors: {
        oregon: {
          50: '#ffede9',
          100: '#ffd1c8',
          200: '#ffa48d',
          300: '#fe763b',
          400: '#d95600',
          500: '#a03300',
          600: '#7a2000',
          700: '#5f1600',
          800: '#3e0b00',
          900: '#1c0300',
        }
      }
    },
    plugins: [],
  }
}
