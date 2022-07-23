module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        inputBg: "#0c203a",
        "main-blue": "#0a1b30",
        "transparent-blue": "rgba(10, 27, 48, 0.6)",
        specialYellow: "#ffc635",
        filtersBg: "#e3e3e3",
        lighterBg: "e6e6e6",
        "text-gray": "#9b9b9b",
        darkIndigo: "#0c284a",
        "cool-blue": "#38b6cc",
      },
      borderWidth: {
        DEFAULT: "1.5px",
      },
      borderColor: {
        "text-gray": "#e6e6e6",
      },
      width: {
        700: "40rem",
        500: "26rem",
      },
    },
  },
  plugins: [],
};
