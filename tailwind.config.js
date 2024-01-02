const {nextui} = require("@nextui-org/react");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend:{
      colors:{
        black: '#090C10'
      }
    }
  },
  darkMode: "class",
  plugins: [nextui({
    themes:{
      "dark": {
        extend:"dark",
        colors:{
          background: '#090C10'
        }
      },
      "light": {
        extend:"light",
        colors:{
          background: '#F7F2F2'
        }
      }
    }
  })],
}
