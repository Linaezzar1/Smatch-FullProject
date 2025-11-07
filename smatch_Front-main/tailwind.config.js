/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}",],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        darkBg: '#1e1e32',
        darkCard: '#2a2a40',
        accentOrange: '#ff6f61',
        accentBlue: '#1e90ff',
        grayText: '#888',
        
        primary: "#1E3A8A",
        secondary: "#FBBF24",
        accent: "#F472B6",
        neutral: "#374151",
        "base-100": "#FFFFFF",
        info: "#3ABFF8",
        success: "#36D399",
        warning: "#FBBD23",
        error: "#F87272",
      },
    },
  },
  plugins: [],
}

