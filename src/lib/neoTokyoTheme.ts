/**
 * Neo-Tokyo & Shanghai Night Architectural Palette & Color Architecture
 * Curated color triads, dual-tone lighting temperatures (warm street vs. cool sky),
 * and authentic Japanese transit and architectural finishes.
 */

export const NEO_TOKYO_PALETTE = {
  // 1. Base Environment & Night Sky (Deep Prussian Indigo & Twilight Teal)
  sky: '#0e1424',
  fog: '#121a2c',
  ambientSky: '#222d42',
  moonlight: '#93c5fd',

  // 2. Tokyo Warm Incandescent (Street Level Glow & Izakaya Warmth)
  lanternAmber: '#f59e0b',
  lanternGold: '#fbbf24',
  warmTungsten: '#ffa726',
  warmWindowWash: '#ffe8cc',
  groundBounce: '#382a1a',

  // 3. Neon Accent Triad (Tokyo & Shanghai Signature Neon)
  shibuyaCyan: '#00e5ff',
  shibuyaCyanMuted: '#22d3ee',
  tokyoRose: '#ff2a6d',          // Akihabara ruby-rose (replaces raw magenta #ff0055)
  tokyoRoseGlow: '#fb7185',
  champagneGold: '#d4af37',      // Shanghai Pudong & Ginza luxury gold
  champagnePale: '#fde047',
  transitJade: '#05ffa1',        // Tokyo Metro / convenience store jade
  transitJadeMuted: '#10b981',
  roppongiViolet: '#7c3aed',     // Holographic deep purple
  roppongiVioletGlow: '#a78bfa',

  // 4. Architectural Materials (High Taste Matte Slate & Bronze)
  roadAsphalt: '#1a2030',
  sidewalkSlate: '#262f44',
  curbStone: '#22293a',
  tactilePaving: '#f59e0b',       // Japanese Tenji tactile blocks
  buildingFacade: '#1b2234',
  buildingCrown: '#28324a',
  claddingBronze: '#3a3228',
  shutterIron: '#42362b',
  structuralSteel: '#2a3348',
  windowUnlit: '#182030',
  glassTint: 'rgba(34, 211, 238, 0.16)',

  // 5. UI Glassmorphism & Panel Tokens
  panelBg: 'rgba(14, 20, 36, 0.85)',
  panelBorder: 'rgba(34, 211, 238, 0.35)',
  panelBorderHover: 'rgba(251, 191, 36, 0.60)',
  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
} as const;

export type NeoTokyoPalette = typeof NEO_TOKYO_PALETTE;

