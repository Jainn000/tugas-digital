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
        kinetik: {
          bg: "#171717",
          surface: "#242424",
          card: "#1F1F1F",
          border: "#383838",
          orange: "#FF6B35",
          "orange-dark": "#E5531E",
          gold: "#E9C47D",
          green: "#8CD6B0",
          emerald: "#23372D",
          body: "#BDBDBD",
          muted: "#8D8D8D",
        },
      },
      fontFamily: {
        poppins: ["Poppins", "system-ui", "-apple-system", "sans-serif"],
        inter: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
