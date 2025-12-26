/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom color scheme
        text: {
          primary: '#293241',
        },
        bg: {
          primary: '#98C1d9',
        },
        logo: {
          primary: '#E0FBFC',
        },
        primary: {
          50: '#E0FBFC',
          100: '#C8F0F2',
          200: '#B0E5E8',
          300: '#98C1d9',
          400: '#7BA8C4',
          500: '#5E8FAF',
          600: '#41769A',
          700: '#293241',
          800: '#1F2530',
          900: '#151A1F',
        },
        accent: {
          red: '#dc2626',
          orange: '#ea580c',
          gray: '#6b7280',
          blue: '#98C1d9',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}

