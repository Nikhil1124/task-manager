// tailwind.config.js
import { defineConfig } from 'tailwindcss'

export default defineConfig({
  content: [
    './index.html',          // HTML entry
    './src/**/*.{js,jsx,ts,tsx,css}', // JS/TSX/CSS files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
})
