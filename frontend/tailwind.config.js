/**
 * Tailwind CSS configuration file for the Clarity frontend
 */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        background: '#0F0F12',
        surface: '#17171C',
        primary: '#5D5DFF',
        secondary: '#3C3C57',
        accent: '#AC6AFF',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
} 