/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        short: { raw: "(max-height: 693px)" },
        medium: { raw: "(min-height: 694px) and (max-height: 765px)" },
        tallish: { raw: "(min-height: 766px) and (max-height: 800px)" },
      },
    },
  },
  plugins: [],
};
