const { fontFamily: { sans } } = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...sans],
      },
      colors: {
        ebony: "#111827"
      }
    },
  },
  plugins: [require("@tailwindcss/forms")],
}
