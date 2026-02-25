/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./services/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Source Sans 3'", 'sans-serif'],
        serif: ["'Merriweather'", 'serif'],
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
          '50%': { transform: 'scale(1.3)', opacity: '0.3' },
        },
        'ping-slow': {
          '0%': { transform: 'scale(1)', opacity: '0.1' },
          '75%, 100%': { transform: 'scale(1.5)', opacity: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        breathe: 'breathe 5s infinite ease-in-out',
        'ping-slow': 'ping-slow 5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'fade-in': 'fade-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
