import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          cyan: '#00e5ff',
          rose: '#ff2a6d',
          magenta: '#ff2a6d',
          amber: '#f59e0b',
          gold: '#d4af37',
          green: '#05ffa1',
          jade: '#05ffa1',
          violet: '#7c3aed',
          sky: '#0e1424',
          slate: '#1b2234',
          panel: 'rgba(14, 20, 36, 0.85)',
          void: '#0e1424',
          asphalt: '#1a2030',
          metal: '#2a3348',
        },
      },
      fontFamily: {
        orbitron: ['var(--font-orbitron)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 229, 255, 0.4), 0 0 30px rgba(0, 229, 255, 0.15)',
        'neon-magenta': '0 0 15px rgba(255, 42, 109, 0.4), 0 0 30px rgba(255, 42, 109, 0.15)',
        'neon-gold': '0 0 15px rgba(212, 175, 55, 0.4), 0 0 30px rgba(212, 175, 55, 0.15)',
      },
    },
  },
  plugins: [],
};

export default config;

