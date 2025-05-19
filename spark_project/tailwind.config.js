/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#D6086B", // Cherry
        aqua: "#A3F8FF",
        lime: "#E8FF34",
        mauve: "#FABAFF",
        bg: "#F7FAF9", // White (used as general background)
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem', // Default is 1rem, matching your stylishsite guide
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'hover': '0 10px 25px rgba(214, 8, 107, 0.2)', // Example hover shadow
      },
    },
  },
  plugins: [],
}; 