/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      boxShadow: {
        'form-shadow': '10px 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      backgroundColor: {
        'paid-d-bg': 'rgba(51, 214, 160, 0.1)',
        'pending-d-bg': 'rgba(255, 145, 0, 0.1)',
        'draft-d-bg': 'rgba(223, 227, 250, 0.1)',
        'totalPrice-bg': 'rgba(12, 14, 22, 0.7)',
        'normal-bg': 'rgba(209, 212, 218, 0.9)'
      },
      borderRadius: {
        'bd-r': '20px 20px 0 0',
        'bd-t': '0 0 20px 20px'
      },
      backgroundImage: {
        signup: "url('/src/assets/sign.jpg')"
      }
    },
  },
  plugins: [],
}