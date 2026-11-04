export const STREET_LENGTH = 160; // Meters along Z-axis (0 to -160)

export const LANDMARKS = {
  CAFE: {
    id: 'CAFE' as const,
    name: 'SPACESHIP CAFE',
    tagline: 'FREIGHTER DOCK & RECHARGE',
    side: 'RIGHT' as const,
    z: -32.0,
    range: [0.18, 0.32] as [number, number],
    accentColor: '#FFAA00',
    description: 'Docked light freighter converted to cantilevered rooftop street cafe. Famous for pressurized plasma brew and thruster patio warmth.',
  },
  STAR: {
    id: 'STAR' as const,
    name: 'ASTRA CLOTHING',
    tagline: 'COSMIC HAUTE COUTURE',
    side: 'LEFT' as const,
    z: -70.0,
    range: [0.48, 0.62] as [number, number],
    accentColor: '#8A2BE2',
    description: 'Boutique showroom featuring fiber-optic constellation light canopies and chromatic phase-shifting holographic streetwear.',
  },
  PAWN: {
    id: 'PAWN' as const,
    name: 'DEBRIS PAWN SHOP',
    tagline: 'BLACK MARKET SALVAGE',
    side: 'LEFT' as const,
    z: -110.0,
    range: [0.77, 0.88] as [number, number],
    accentColor: '#05FFA1',
    description: 'Subterranean cyberware depot trading salvaged droid chassis, refurbished optical arrays, and vintage phosphor CRT terminals.',
  },
  MOTEL: {
    id: 'MOTEL' as const,
    name: 'NOVA MOTEL',
    tagline: 'STASIS POD SUITES',
    side: 'RIGHT' as const,
    z: -152.0,
    range: [0.92, 1.00] as [number, number],
    accentColor: '#FF0055',
    description: 'High-density vertical sleep pod tower towering into the neon smog. Hourly cryogenic stasis pods with exterior glass elevator.',
  },
};

