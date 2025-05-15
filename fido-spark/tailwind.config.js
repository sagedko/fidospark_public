/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'cherry': '#D6086B',
        'aqua': '#A3F8FF',
        'lime': '#E8FF34',
        'mauve': '#FABAFF',
        'fido-white-old': '#F7FAF9',
        'fido-black-old': '#212726',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        'app-white': 'hsl(var(--app-white))',
        'app-black': 'hsl(var(--app-black))',
        'fido-cherry': 'hsl(var(--fido-cherry-hsl))',
        'fido-aqua': 'hsl(var(--fido-aqua-hsl))',
        'fido-lime': 'hsl(var(--fido-lime-hsl))',
        'fido-mauve': 'hsl(var(--fido-mauve-hsl))',
      },
      keyframes: {
        buttonBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'button-bounce': 'buttonBounce 0.4s ease-in-out',
      },
    },
  },
  plugins: [],
} 