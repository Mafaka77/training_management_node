/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './node_modules/flowbite/**/*.{js,jsx,ts,tsx}',
  ],
  plugins: [require('flowbite/plugin')],
  theme:{
    extend: {
      fontFamily: {
        sans: ['SN Pro', 'sans-serif'],
      }
    }
  }
}

