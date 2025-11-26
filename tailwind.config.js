/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: '#0ea5e9',
        danger: '#ef4444',
        warn: '#f59e0b'
      }
    }
  },
  plugins: []
};
