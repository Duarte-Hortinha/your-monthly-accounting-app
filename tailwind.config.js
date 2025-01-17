/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cyber: {
          900: 'rgb(var(--cyber-900) / <alpha-value>)',
          800: 'rgb(var(--cyber-800) / <alpha-value>)',
          700: 'rgb(var(--cyber-700) / <alpha-value>)',
          600: 'rgb(var(--cyber-600) / <alpha-value>)',
          500: 'rgb(var(--cyber-500) / <alpha-value>)',
        },
        neon: {
          blue: 'rgb(var(--neon-blue) / <alpha-value>)',
          purple: 'rgb(var(--neon-purple) / <alpha-value>)',
          cyan: 'rgb(var(--neon-cyan) / <alpha-value>)',
        },
        'cyber-text': {
          primary: 'var(--text-primary)',
          secondary: 'rgb(var(--text-secondary) / <alpha-value>)',
          muted: 'var(--text-muted)',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'cyber-grid': 'linear-gradient(to right, rgba(0,243,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,243,255,0.1) 1px, transparent 1px)',
      },
      backgroundSize: {
        'cyber-grid': '50px 50px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};