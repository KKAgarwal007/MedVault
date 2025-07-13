/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
   theme: {
    extend: {
      // ... existing code ...
      animation: {
        blob: 'moveBlobs 20s infinite alternate ease-in-out',
      },
      keyframes: {
        moveBlobs: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '100%': { transform: 'translate(20px, 30px) scale(1.1)' },
        },
      },
    },
  },
  plugins: [],
}

