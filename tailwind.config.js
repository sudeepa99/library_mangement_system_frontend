/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        textColour: "#FAF5E9",
        greenColour: "#009B4D",
        tangerineYellow: "#FFCC00",
      },
      fontFamily: {
        robotoSlab: ['"Roboto Slab"', "serif"],
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
