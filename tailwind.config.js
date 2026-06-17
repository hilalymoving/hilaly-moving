/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          bg: 'var(--color-bg)',
          card: 'var(--color-bg-card)',
          nav: 'var(--color-bg-nav)',
          section: 'var(--color-bg-section)',
          text: 'var(--color-text)',
          muted: 'var(--color-text-muted)',
          border: 'var(--color-border)',
          accent: 'var(--color-accent)',
          'accent-light': 'var(--color-accent-light)',
          'accent-text': 'var(--color-accent-text)',
          green: 'var(--color-green)',
        },
      },
      backgroundImage: {
        'hero-gradient': 'var(--hero-gradient)',
      },
      boxShadow: {
        'brand': 'var(--shadow-brand)',
        'brand-sm': 'var(--shadow-brand-sm)',
      },
      fontFamily: {
        cairo: ["'Cairo'", 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
