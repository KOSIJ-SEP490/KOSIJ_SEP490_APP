/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./apps/**/*.{js,jsx,ts,tsx}', './shared/**/*.{js,jsx,ts,tsx}', './App.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blue: '#264ECA'
      }
    }
  },
  plugins: []
}
