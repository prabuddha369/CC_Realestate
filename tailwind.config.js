/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'sm': '300px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
    },
    extend: {
      fontFamily: {
        chonburi: ['Chonburi', 'sans'],
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.bg-img': {
          backgroundImage: 'url("../public/bg.jpg")',
        },
        '.bg-img-mob': {
          backgroundImage: 'url("../public/bgMobile.jpg")',
          position: 'relative',
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};
