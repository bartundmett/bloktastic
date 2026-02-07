/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        joy: '#E8956C',
        intelligence: '#00B3B0',
        graphite: '#1B243F',
        sky: '#3B82F6',
        mint: '#10B981',
        paper: '#F0F7FF',
        borderline: '#E2E8F0'
      },
      fontFamily: {
        sans: ['Sora', 'Avenir Next', 'Nunito Sans', 'sans-serif'],
        display: ['Clash Display', 'Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace']
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -10px, 0)' }
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translate3d(0, 24px, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' }
        }
      },
      animation: {
        floaty: 'floaty 7s ease-in-out infinite',
        fadeUp: 'fadeUp 0.8s ease-out both'
      },
      boxShadow: {
        card: '0 16px 35px rgba(27, 36, 63, 0.09)',
        glow: '0 24px 40px rgba(0, 179, 176, 0.25)'
      }
    }
  },
  plugins: []
};
