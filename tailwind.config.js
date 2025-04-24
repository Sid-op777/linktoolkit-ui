/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class', // or 'media'
    theme: {
      extend: {
        colors: {
          'link-blue': '#54A2FC',
        },
      },
    },
    plugins: [],
  }