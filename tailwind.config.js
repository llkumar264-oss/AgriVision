/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          50: '#f2f8f5',
          100: '#e1f0e8',
          200: '#c4e2d3',
          300: '#99ccb4',
          400: '#67af8f',
          500: '#439371',
          600: '#31765a',
          700: '#275e49',
          800: '#214b3c',
          900: '#1b4d3e',
          950: '#0c241d',
        },
        surface: {
          light: '#ffffff',
          dark: '#18181b',
          subtleLight: '#f4f4f5',
          subtleDark: '#27272a',
        },
        background: {
          light: '#fbfbfa',
          dark: '#0f0f11',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
