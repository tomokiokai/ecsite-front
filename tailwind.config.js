/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        zoomInOut: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        slideUp: 'slideUp 1s forwards',
        zoomInOut: 'zoomInOut 2s infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      spacing: {
        '-12': '-3rem',
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      const components = {
        '.icon': {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          '&::before': {
            content: '""',
            display: 'block',
            width: '1em',
            height: '1em',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            marginBottom: '0.5em',
            transform: 'rotate(90deg)', 
          },
        },
        '.icon.twitter::before': {
          backgroundImage: 'url(/twitter.svg)',
        },
        '.icon.fb::before': {
          backgroundImage: 'url(/facebook.svg)',
        },
        '.writing-mode-vertical-rl span': {
          writingMode: 'vertical-rl',
        },
      };
      addComponents(components);
    },
  ],
};