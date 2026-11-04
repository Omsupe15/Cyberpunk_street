'use client';
import { useCyberpunkStore } from '@/store/useCyberpunkStore';

export default function HomePage() {
  const { scrollProgress, activeLandmark, scanlinesEnabled } = useCyberpunkStore();

  return (
    <main className="relative min-h-[500vh] bg-cyber-void">
      {/* Fixed Cyberpunk Viewport Overlay */}
      <div className="fixed inset-0 pointer-events-none flex flex-col justify-between p-6 z-10">
        {/* Header HUD Preview */}
        <div className="flex justify-between items-center text-xs font-mono tracking-widest text-cyber-cyan border-b border-cyber-cyan/30 pb-3">
          <span>SECTOR 07 // REPLICANT ALLEY</span>
          <span>SYS_STATUS: ONLINE</span>
          <span>PROGRESS: {(scrollProgress * 100).toFixed(1)}%</span>
        </div>

        {/* Center Milestone Banner */}
        <div className="text-center font-orbitron">
          <div className="text-xs tracking-widest text-cyber-magenta uppercase mb-1">
            Active Zone: {activeLandmark}
          </div>
          <h1 className="text-4xl font-black tracking-wider text-white drop-shadow-[0_0_15px_rgba(0,243,255,0.6)]">
            NEO-VELOCE DISTRICT
          </h1>
          <p className="text-xs font-mono text-gray-400 mt-2">
            Scroll down to navigate the street // Phase 1 Scaffold Active
          </p>
        </div>

        {/* Footer Navigation */}
        <div className="text-xs font-mono text-gray-400 border-t border-gray-800 pt-3 flex justify-between">
          <span>COORDINATES: 34.0522° N, 118.2437° W</span>
          <span className="text-cyber-amber animate-pulse">SCROLL TO COMMUTE ↓</span>
        </div>
      </div>

      {/* CRT Scanline Effect */}
      {scanlinesEnabled && (
        <div className="fixed inset-0 pointer-events-none scanlines z-30 opacity-70" />
      )}
    </main>
  );
}

