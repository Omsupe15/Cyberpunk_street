'use client';
import { useCyberpunkStore } from '@/store/useCyberpunkStore';
import { LANDMARKS } from '@/lib/constants';

export function LandmarkCard() {
  const activeLandmark = useCyberpunkStore((s) => s.activeLandmark);

  if (activeLandmark === 'NONE') {
    return (
      <div className="text-center font-mono text-[11px] tracking-widest text-gray-500 transition-opacity duration-300">
        <span className="inline-block px-4 py-1.5 rounded-full bg-cyber-panel/50 border border-gray-800">
          TRANSIT CORRIDOR // COMMUTE IN PROGRESS
        </span>
      </div>
    );
  }

  const landmark = LANDMARKS[activeLandmark];

  return (
    <div className="relative mx-auto max-w-md w-full transition-all duration-500 transform animate-in fade-in slide-in-from-bottom-4">
      {/* Sci-fi Corner Brackets */}
      <div className="relative bg-cyber-panel border border-cyber-cyan/40 backdrop-blur-xl p-5 rounded-lg shadow-neon-cyan">
        {/* Top-Left Bracket */}
        <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cyber-cyan" />
        {/* Top-Right Bracket */}
        <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-cyber-cyan" />
        {/* Bottom-Left Bracket */}
        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-cyber-cyan" />
        {/* Bottom-Right Bracket */}
        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-cyber-cyan" />

        {/* Milestone Tag & Station Code */}
        <div className="flex justify-between items-center text-[10px] font-mono tracking-widest uppercase mb-1.5">
          <span
            className="px-2 py-0.5 rounded font-bold"
            style={{
              backgroundColor: `${landmark.accentColor}20`,
              color: landmark.accentColor,
              border: `1px solid ${landmark.accentColor}60`,
            }}
          >
            {landmark.id === 'CAFE' && 'STN 01 // RIGHT FLANK'}
            {landmark.id === 'STAR' && 'STN 02 // LEFT FLANK'}
            {landmark.id === 'PAWN' && 'STN 03 // LEFT FLANK'}
            {landmark.id === 'MOTEL' && 'STN 04 // RIGHT FLANK'}
          </span>
          <span className="text-gray-400">SECTOR CLEARANCE: APPROVED</span>
        </div>

        {/* Shop Name */}
        <h2
          className="text-2xl font-black font-orbitron tracking-wider uppercase mb-1"
          style={{
            color: '#FFFFFF',
            textShadow: `0 0 15px ${landmark.accentColor}80`,
          }}
        >
          {landmark.name}
        </h2>

        {/* Subtitle / Tagline */}
        <p
          className="text-xs font-mono tracking-wider font-semibold mb-2.5"
          style={{ color: landmark.accentColor }}
        >
          {landmark.tagline}
        </p>

        {/* Description */}
        <p className="text-xs font-mono text-gray-300 leading-relaxed border-t border-gray-800/80 pt-2.5">
          {landmark.description}
        </p>

        {/* Architectural Highlights Pill Tags */}
        <div className="mt-3.5 pt-2.5 border-t border-gray-800/80 flex flex-wrap gap-1.5 text-[9px] font-mono text-gray-400">
          {landmark.id === 'CAFE' && (
            <>
              <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">FUSELAGE DOCK</span>
              <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">PLASMA THRUSTERS</span>
              <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">HOLO-STEAM</span>
            </>
          )}
          {landmark.id === 'STAR' && (
            <>
              <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">SMART GLASS</span>
              <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">CONSTELLATION CEILING</span>
              <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">HOLO-MANNEQUINS</span>
            </>
          )}
          {landmark.id === 'PAWN' && (
            <>
              <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">SALVAGED CYBERWARE</span>
              <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">CRT PYRAMID</span>
              <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">HAZARD STROBE</span>
            </>
          )}
          {landmark.id === 'MOTEL' && (
            <>
              <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">HEX STASIS PODS</span>
              <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">12M VERTICAL NEON</span>
              <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">GLASS ELEVATOR</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

