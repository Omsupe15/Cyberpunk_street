export const STREET_LENGTH = 160; // Meters along Z-axis (0 to -160)
export const ROAD_WIDTH = 14.0; // 14m wide 4-lane grand avenue
export const SIDEWALK_WIDTH = 4.5; // 4.5m wide pedestrian flagstone boulevard

export const LANDMARKS = {
  CAFE: {
    id: 'CAFE' as const,
    name: 'SPACESHIP CAFE & RECHARGE',
    tagline: 'FREIGHTER DOCK & RECHARGE // 宇宙船 カフェ',
    side: 'RIGHT' as const,
    x: 10.5,
    z: -32.0,
    range: [0.18, 0.32] as [number, number],
    accentColor: '#fbbf24', // Tokyo Lantern Gold
    description: 'Docked light freighter converted to cantilevered rooftop street cafe. Famous for pressurized plasma brew and thruster patio warmth.',
  },
  STAR: {
    id: 'STAR' as const,
    name: 'ASTRA LUXURY HAUTE COUTURE',
    tagline: 'COSMIC HAUTE COUTURE // 恒星クチュール',
    side: 'LEFT' as const,
    x: -10.5,
    z: -70.0,
    range: [0.48, 0.62] as [number, number],
    accentColor: '#d4af37', // Ginza Champagne Gold
    description: 'Boutique showroom featuring fiber-optic constellation light canopies and chromatic phase-shifting holographic streetwear.',
  },
  PAWN: {
    id: 'PAWN' as const,
    name: 'DEBRIS SALVAGE & PAWN',
    tagline: 'BLACK MARKET SALVAGE // 屑物市場',
    side: 'LEFT' as const,
    x: -10.5,
    z: -110.0,
    range: [0.77, 0.88] as [number, number],
    accentColor: '#05ffa1', // Tokyo Transit Jade
    description: 'Subterranean cyberware depot trading salvaged droid chassis, refurbished optical arrays, and vintage phosphor CRT terminals.',
  },
  MOTEL: {
    id: 'MOTEL' as const,
    name: 'NOVA STASIS MOTEL & SUITES',
    tagline: 'STASIS POD SUITES // 新星ホテル',
    side: 'RIGHT' as const,
    x: 10.5,
    z: -152.0,
    range: [0.92, 1.00] as [number, number],
    accentColor: '#ff2a6d', // Tokyo Rose / Kabukicho Crimson
    description: 'High-density vertical sleep pod tower towering into the neon smog. Hourly cryogenic stasis pods with exterior glass elevator.',
  },
};
