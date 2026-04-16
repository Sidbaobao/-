import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#132238",
        mist: "#eff4f7",
        slateBlue: "#4c6fff",
        teal: "#0f8b8d",
        sand: "#f8f5ef",
        coral: "#d96c4a"
      },
      boxShadow: {
        soft: "0 16px 40px rgba(19, 34, 56, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
