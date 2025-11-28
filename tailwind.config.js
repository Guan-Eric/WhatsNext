/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#ffb400",
          dark: "#ffb400",
        },
        secondary: {
          DEFAULT: "#f5a623",
          dark: "#f5a623",
        },
        background: {
          DEFAULT: "#ffffff",
          dark: "#181818",
        },
        text: {
          DEFAULT: "#000000",
          dark: "#f8f9fa",
        },
        grey: {
          0: "#f8f9fa",
          1: "#e9ecef",
          2: "#dee2e6",
          3: "#ced4da",
          4: "#adb5bd",
          5: "#6c757d",
          "dark-0": "#1f1f1f",
          "dark-1": "#2b2b2b",
          "dark-2": "#3a3a3a",
          "dark-3": "#4f4f4f",
          "dark-4": "#6c757d",
          "dark-5": "#adb5bd",
        },
        outline: {
          DEFAULT: "#dee2e6",
          dark: "#333333",
        },
        search: {
          DEFAULT: "#f8f9fa",
          dark: "#262626",
        },
        success: "#28a745",
        error: "#dc3545",
        warning: "#ffc107",
        divider: {
          DEFAULT: "#e9ecef",
          dark: "#2d2d2d",
        },
      },
    },
  },
  plugins: [],
};
