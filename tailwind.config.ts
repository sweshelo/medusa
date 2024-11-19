import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      backgroundImage: {
        rainbow: 'linear-gradient(45deg, #fad, #ffa, #afa, #aaf, #caf)',
        'silver-gradient':
          'linear-gradient(to right, rgb(180, 180, 180), rgb(240, 240, 240), rgb(180, 180, 180))',
      },
      fontFamily: {
        mplus: ['"M PLUS 1p"', 'sans-serif'],
      },
      keyframes: {
        shine: {
          from: { backgroundPosition: '200% 0' },
          to: { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        shine: 'shine 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
