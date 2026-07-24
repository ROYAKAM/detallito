/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        farm: {
          900: '#2d2a1e',
          800: '#3d3826',
          700: '#4e4633',
          600: '#5e5640',
          500: '#76694e',
        },
        sdvblue: {
          600: '#3a9fc7',
          500: '#59C9F1',
          400: '#7AD4F5',
          300: '#A3E2F8',
        },
        sdvbrown: {
          800: '#3d2008',
          700: '#6B3710',
          600: '#8B5E3C',
          500: '#A67C52',
        },
        sdvgold: {
          500: '#FFD921',
          400: '#FFE44D',
          300: '#FFED80',
        },
        sdvcream: {
          100: '#FFF8E7',
          200: '#F5E6C8',
        },
        sdvgreen: {
          500: '#4CAF50',
          600: '#388E3C',
          700: '#2E7D32',
        },
        sdvpurple: {
          500: '#9C27B0',
          400: '#BA68C8',
        },
      },
      minHeight: {
        dvh: '100dvh',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive'],
        body: ['"VT323"', 'monospace'],
        sans: ['"VT323"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
