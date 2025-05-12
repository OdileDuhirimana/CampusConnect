/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#dce8ff',
          200: '#b3cdff',
          300: '#86adff',
          400: '#5a8aff',
          500: '#2f6bff',
          600: '#2559db',
          700: '#1d47b1',
          800: '#183a8f',
          900: '#132e6d',
        },
        accent: {
          50: '#fff3ee',
          100: '#ffe3d7',
          200: '#ffc4ad',
          300: '#ffa180',
          400: '#ff855e',
          500: '#ff7a59',
          600: '#e55b3b',
          700: '#c64a2f',
          800: '#a73d28',
          900: '#843021',
        },
        ink: {
          900: '#101828',
          700: '#344054',
          600: '#667085',
          500: '#98a2b3',
        },
        bg: '#f6f8fb',
        surface: '#ffffff',
        border: '#e4e7ec',
        success: '#2ccb89',
        warning: '#f5b700',
        danger: '#e64553',
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 6px 20px rgba(16, 24, 40, 0.08)',
        soft: '0 2px 8px rgba(16, 24, 40, 0.06)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
}
