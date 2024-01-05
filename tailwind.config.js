const {nextui} = require("@nextui-org/react");
const { Bagel_Fat_One } = require("next/font/google");
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
      fontFamily: {
        silka: ['Silka', 'sans-serif'],
        bagel: ['Bagel Fat One', 'cursive'],
      },
      colors:{
        black: '#090C10',
      },
      boxShadow:{
        'dark-inset': 'inset 0px 0px 0px 2px rgb(48, 54, 61)'
      }
    }
  },
  darkMode: "class",
  plugins: [nextui({
    themes:{
      "dark": {
        extend:"dark",
        colors:{
          background: '#090C10',
          primary: '#98D0FF',
          fillPrimary: '#98D0FF'
        }
      },
      "light": {
        extend:"light",
        colors:{
          background: '#F7F2F2',
          primary: '#557CBE',
          fillPrimary: '#557CBE'
        }
      }
    }
  })],
}
