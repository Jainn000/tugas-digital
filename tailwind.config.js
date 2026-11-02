/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,mdx}",
    "./components/**/*.{js,jsx,mdx}",
    "./app/**/*.{js,jsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brutal: {
          bg: "#FFFDF9",
          canvas: "#F4EFE6",
          black: "#121212",
          yellow: "#FFE600",
          orange: "#FF5C00",
          green: "#22C55E",
          lime: "#A3E635",
          cyan: "#38BDF8",
          purple: "#D946EF",
          pink: "#FF66C4",
          card: "#FFFFFF",
          muted: "#71717A",
          border: "#121212",
        },
      },
      boxShadow: {
        brutal: "4px 4px 0px 0px #121212",
        "brutal-sm": "2px 2px 0px 0px #121212",
        "brutal-lg": "6px 6px 0px 0px #121212",
        "brutal-xl": "8px 8px 0px 0px #121212",
        "brutal-pressed": "1px 1px 0px 0px #121212",
      },
      borderWidth: {
        '2': '2px',
        '3': '3px',
        '4': '4px',
      },
    },
  },
  plugins: [],
};
