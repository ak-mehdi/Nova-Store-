/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF8E6',
          100: '#FFEFC2',
          200: '#FFE499',
          300: '#FFD966',
          400: '#FECD3D',
          500: '#FEBD69',
          600: '#E5A84F',
          700: '#CC9339',
          800: '#B37E26',
          900: '#996916',
        },
        secondary: {
          50: '#E8EAED',
          100: '#C5CAD2',
          200: '#9FA7B4',
          300: '#788496',
          400: '#5B6A7F',
          500: '#3E5068',
          600: '#374860',
          700: '#2E3D55',
          800: '#26334A',
          900: '#232F3E',
        },
        accent: {
          DEFAULT: '#FEBD69',
          light: '#FFD699',
          dark: '#E5A84F',
        },
        dark: '#232F3E',
        light: '#F5F5F5',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 12px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.15)',
        'dropdown': '0 4px 24px rgba(0, 0, 0, 0.15)',
        'xl': '0 20px 40px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

