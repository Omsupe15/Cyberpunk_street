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
          cyan: '#00F3FF',
          magenta: '#FF0055',
          amber: '#FFAA00',
          green: '#05FFA1',
          violet: '#8A2BE2',
          void: '#05050A',
          asphalt: '#111218',
          metal: '#262A36',
          panel: 'rgba(10, 14, 23, 0.75)',
        },
      },
      fontFamily: {
        orbitron: ['var(--font-orbitron)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 243, 255, 0.5), 0 0 30px rgba(0, 243, 255, 0.2)',
        'neon-magenta': '0 0 15px rgba(255, 0, 85, 0.5), 0 0 30px rgba(255, 0, 85, 0.2)',
      },
    },
  },
  plugins: [],
};

export default config;

