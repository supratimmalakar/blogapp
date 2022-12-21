/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        primaryDark: '#9381ff',
        primaryMedium: '#b8b8ff',
        primaryLight: '#F8F7FF',
        secondaryDark: '#FFD8BE',
        secondaryLight: '#FFEEDD',
        dpColor: 'rgba(0,0,0,0.2)',
        btn: '#8E64CE',
        btnHover: '#371D5E'
      }
    },
  },
  plugins: [],
}
