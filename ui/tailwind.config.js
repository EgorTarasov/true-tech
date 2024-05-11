/** @type {import("tailwindcss").Config} */
export default {
  content: ["./src/**/*.{html,tsx}"],
  theme: {
    screens: {
      sm: "640px",
      md: "1024px",
      content: "1420px"
    },
    extend: {
      colors: {
        primary: "rgba(var(--color-primary), <alpha-value>)",
        onPrimary: "rgba(var(--color-onPrimary), <alpha-value>)",
        bg: "#F7F7F7",
        red: "#E30614",
        grey: "#808080",
        black: "#191919",
        "blue-grey": "#ADB8C1",
        stroke: "#F2F3F7",
        grey23: "#6C757F",
        grey4: "#E3E5EB",
        bg2: "#F2F3F7",
        red2: "#FF0032",
        text: {
          primary: "#1D1D1D",
        },
        link: "#007cff"
      },
    }
  },
  plugins: [require("@tailwindcss/typography")]
};
